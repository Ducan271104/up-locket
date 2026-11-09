# Trisko Locket

Website React + Vite, backend Express, responsive cho iPhone và desktop.

## Chạy local

Yêu cầu Node.js 20+.

```bash
npm install
cp server/.env.example server/.env
npm run dev
```

Frontend: http://localhost:5173  
Backend health: http://localhost:3001/api/health

## Cấu hình API nhà cung cấp

Chỉ cấu hình ở backend (Vercel Environment Variables hoặc `server/.env` khi chạy local):

- `UPLOCKET_API_BASE=https://uplocket.io.vn`
- `UPLOCKET_API_KEY=` token mới đã được nhà cung cấp cấp lại
- `PROVIDER_API_ENABLED=true`
- `CLIENT_ORIGIN=` domain frontend được phép gọi backend

Không gửi token vào trình duyệt, không đặt trong biến `VITE_*`, không commit file `.env`.

Các route đọc dữ liệu được backend proxy gồm packages, credits, activations và lookup. Các thao tác tạo/gia hạn/bật-tắt activation vẫn bị khóa cho tới khi tài liệu API và quyền sử dụng được xác minh. Chưa có tích hợp thanh toán thật.

## Bảo mật

Token từng xuất hiện trong cuộc trò chuyện cần được thu hồi/đổi mới trước khi bật tích hợp. Không sử dụng lại token đã lộ.
