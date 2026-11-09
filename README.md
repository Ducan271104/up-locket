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

## Triển khai

### Backend trên Render
1. Tạo Web Service từ repository `Ducan271104/up-locket`.
2. Chọn Blueprint nếu Render nhận diện `render.yaml`, hoặc cấu hình thủ công: Root Directory `server`, Build Command `npm install`, Start Command `npm start`.
3. Đặt `CLIENT_ORIGIN` thành chính xác domain Vercel của frontend.
4. Giữ `PROVIDER_API_ENABLED=false` trong lúc kiểm thử giao diện.

### Frontend trên Vercel
1. Import repository này vào Vercel.
2. Giữ Root Directory ở thư mục gốc repository.
3. Vercel dùng `vercel.json` để build thư mục `client/dist`.
4. Sau khi backend Render hoạt động, thêm Environment Variable `VITE_API_BASE` bằng URL Render (ví dụ `https://ten-dich-vu.onrender.com`), rồi redeploy.

## Cấu hình API nhà cung cấp

Chỉ cấu hình ở backend (Render Environment Variables hoặc `server/.env` khi chạy local):

- `UPLOCKET_API_BASE=https://uplocket.io.vn`
- `UPLOCKET_API_KEY=` token mới đã được nhà cung cấp cấp lại
- `PROVIDER_API_ENABLED=true` chỉ sau khi xác minh tài liệu chính thức và quyền sử dụng
- `CLIENT_ORIGIN=` domain frontend được phép gọi backend

Không gửi token vào trình duyệt, không đặt trong biến `VITE_*`, không commit file `.env`.

Các route đọc dữ liệu được backend proxy gồm packages, credits, activations và lookup. Các thao tác tạo/gia hạn/bật-tắt activation vẫn bị khóa cho tới khi tài liệu API và quyền sử dụng được xác minh. Chưa có tích hợp thanh toán thật.

## Bảo mật

Token từng xuất hiện trong cuộc trò chuyện cần được thu hồi/đổi mới trước khi bật tích hợp. Không sử dụng lại token đã lộ.
