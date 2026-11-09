import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "20kb" }));

const BASE_URL = (process.env.UPLOCKET_API_BASE || "https://uplocket.io.vn").replace(/\/$/, "");
const enabled = process.env.PROVIDER_API_ENABLED === "true";
const token = process.env.UPLOCKET_API_KEY;

app.get("/api/health", (_req, res) => res.json({
  ok: true,
  app: "Trisko Locket",
  providerIntegration: enabled && token ? "configured" : "demo"
}));

function requireProvider(_req, res, next) {
  if (!enabled || !token) {
    return res.status(503).json({
      success: false,
      mode: "demo",
      error: "API nhà cung cấp chưa được cấu hình. Hãy thêm token mới vào biến môi trường phía máy chủ."
    });
  }
  next();
}

async function providerRequest(path, options = {}) {
  const response = await fetch(BASE_URL + path, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`
    },
    signal: AbortSignal.timeout(15000)
  });
  const raw = await response.text();
  let data;
  try { data = raw ? JSON.parse(raw) : {}; }
  catch { data = { message: "Nhà cung cấp trả về dữ liệu không phải JSON." }; }
  return { status: response.status, data };
}

function sendProviderResult(res, result) {
  return res.status(result.status).json(result.data);
}

app.get("/api/packages", requireProvider, async (_req, res) => {
  try { sendProviderResult(res, await providerRequest("/api/v1/packages")); }
  catch { res.status(502).json({ success: false, error: "Không kết nối được nhà cung cấp." }); }
});

app.get("/api/credits", requireProvider, async (_req, res) => {
  try { sendProviderResult(res, await providerRequest("/api/v1/credits")); }
  catch { res.status(502).json({ success: false, error: "Không kết nối được nhà cung cấp." }); }
});

app.get("/api/activations", requireProvider, async (req, res) => {
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
  try { sendProviderResult(res, await providerRequest(`/api/v1/dns/activations?limit=${limit}`)); }
  catch { res.status(502).json({ success: false, error: "Không kết nối được nhà cung cấp." }); }
});

app.get("/api/dns/lookup", requireProvider, async (req, res) => {
  const username = String(req.query.username || "").trim().replace(/^@/, "");
  if (!username || username.length > 80) return res.status(400).json({ success: false, error: "Vui lòng nhập username hợp lệ." });
  try {
    sendProviderResult(res, await providerRequest("/api/v1/dns/lookup?username=" + encodeURIComponent(username)));
  } catch { res.status(502).json({ success: false, error: "Không kết nối được nhà cung cấp." }); }
});

app.post("/api/dns/lookup", requireProvider, async (req, res) => {
  const username = String(req.body?.username || "").trim().replace(/^@/, "");
  if (!username || username.length > 80) return res.status(400).json({ success: false, error: "Vui lòng nhập username hợp lệ." });
  try {
    sendProviderResult(res, await providerRequest("/api/v1/dns/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    }));
  } catch { res.status(502).json({ success: false, error: "Không kết nối được nhà cung cấp." }); }
});

app.post("/api/locket/lookup", requireProvider, async (req, res) => {
  const username = String(req.body?.username || "").trim().replace(/^@/, "");
  if (!username || username.length > 80) return res.status(400).json({ success: false, error: "Vui lòng nhập username hợp lệ." });
  try {
    sendProviderResult(res, await providerRequest("/api/locket/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username })
    }));
  } catch { res.status(502).json({ success: false, error: "Không kết nối được nhà cung cấp." }); }
});

// Các thao tác tạo/gia hạn/bật-tắt activation được để riêng, chưa mở
// cho đến khi xác minh tài liệu, quyền sử dụng và luồng xác nhận của nhà cung cấp.
app.post("/api/dns/export", (_req, res) => res.status(501).json({
  success: false, error: "Chưa bật thao tác tạo activation. Cần xác minh tài liệu nhà cung cấp trước."
}));
app.post("/api/activations/:id/renew", (_req, res) => res.status(501).json({
  success: false, error: "Chưa bật gia hạn activation."
}));
app.post("/api/activations/:id/toggle", (_req, res) => res.status(501).json({
  success: false, error: "Chưa bật thay đổi trạng thái activation."
}));

app.get("/", (_req, res) => res.json({ name: "Trisko Locket API", status: "running" }));
const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log("Trisko API listening on " + port));
