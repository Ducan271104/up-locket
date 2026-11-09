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

## Lưu ý

- Đây là bản demo giao diện; tra cứu, Credits và đơn hàng dùng dữ liệu minh họa.
- Chưa có thanh toán thật hoặc kích hoạt dịch vụ thật.
- API nhà cung cấp tắt mặc định; backend trả 503 cho các route provider.
- Không đưa API token vào frontend hoặc commit file .env.
- Chỉ tích hợp API khi đã xác minh tài liệu chính thức và quyền sử dụng/phân phối.
