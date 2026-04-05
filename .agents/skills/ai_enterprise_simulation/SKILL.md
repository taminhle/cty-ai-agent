---
name: "Xây dựng Văn phòng AI 3D Tập đoàn (AI Enterprise Simulation 3D)"
description: "Kỹ năng (Skill) tạo lập cấu trúc hệ thống AI quy mô lớn gồm 52 đặc vụ ảo với Frontend React Three Fiber và Backend CrewAI xử lý đồng bộ sự kiện qua Websocket."
---

# Kỹ Năng: Xây Dựng Bản Sao Tập Đoàn Công Nghệ 3D 🏢

Kỹ năng này cung cấp bộ khung (Blueprint) và chiến lược để mô phỏng một công ty công nghệ phức tạp. Khi một dự án cần yếu tố trực quan (Visual) và Tự động hoá cao cường (Auto-Agents) kết hợp lại, hãy áp dụng bản mẫu kỹ năng này.

## 1. Triết lý Thiết kế (Design Principles)

- **Tránh Quá tải LLM (API Limit):** Nếu công ty cần 50 người, ĐỪNG chạy 50 Agent trong API (Rate limit + Tiền sẽ bốc hơi). Hãy chỉ khởi tạo `6 Lead Agents` và ngầm hiểu rằng họ đang "Đại diện" cho hàng chục người bên dưới.
- **Tối ưu Web 3D (Anti-Crash):** Tránh kéo File Mô hình GLTF có xương khớp (`SkinnedMesh`) và Cây Khí quyển HDRI bên ngoài (`<Environment>`) vì chúng thường bị lỗi mạng cục bộ hoặc thất thoát bộ nhớ. Bắt buộc dùng `primitive meshes` (Box, Sphere, Cylinder) kết hợp Shader dạ quang (Emissive).

## 2. Kiến trúc 3 Cột Trụ

### Cột Trụ A: Hệ sinh thái React Three Fiber (Frontend)
Khi áp dụng, hãy xây dựng một hàm `DepartmentRoom` giống thế này thay vì tách riêng lẻ từng phòng (vì hàng tấn Component sẽ lag DOM):
```tsx
// Hàm sinh ra Cụm Văn phòng Tốc độ cao
function DepartmentRoom({ startX, startZ, count, layoutCols, activeAgent, departmentName }) {
    // 1. Dùng mảng (Array) để map hàng ghế ngồi
    // 2. Chỉ phòng to (Scale) nhân vật lên KHI VÀ CHỈ KHI activeAgent == ID Của Phòng
    // 3. Phủ một Lớp Box Glass (Transparent, Transmission) bao ngoài các hàng bàn.
}
```

### Cột Trụ B: Bắt luồng theo Thời Gian Thực (Socket.IO)
Trong `page.tsx` (Hoặc Controller của UI), không được Polling REST API (sẽ lag Server). Bắt luồng Log Output của Python qua WebSocket:
```javascript
socket.on("ai_log", (msg) => {
    // Parser Dựa vào Ngôn ngữ tự nhiên. 
    // Mẹo: So khớp chuỗi Log output ("frontend", "kế toán") để bật Regex ánh sáng.
    if(msg.data.includes('frontend')) setActiveRoom('frontend'); 
});
```

### Cột Trụ C: Hierarchy Backend CrewAI (Python)
Luôn định cấu trúc đa tầng. Khi làm App Bán hàng, thay vì 1 AI, hãy thiết lập:
```python
ceo = Agent(role="CEO", goal="Định hướng", tools=[...])
tech_lead = Agent(role="Tech Lead", goal="Viết mã", tools=[...])
qa = Agent(role="QA Lead", goal="Audit Lỗi", tools=[...])
crew = Crew(agents=[ceo, tech_lead, qa], process=Process.sequential)
```

## 3. Quy trình thực thi chung (Standard Operation Procedure)
1. Set up môi trường `Python = 3.12+` và `Node.js = 20+`.
2. Tạo Cấu trúc: Thư mục gốc chứa Backend (`server.py`), thư mục nội bộ `my-app` chứa Frontend `Next.js`.
3. Áp dụng bảng màu Sci-Fi Đen Dạ Quang (Background `#020617`, Bóng neon Cyan, Magenta) cho hiệu ứng Cyberpunk tối đa hoá sự "Thông Minh" (Intelligence) của giao diện. Mảng xanh (Cây, Tường Gạch) tạo mảng cân bằng.

Kỹ năng này là chìa khoá để sao chép Mô hình Khởi nghiệp Tự hành (Autonomous Agent Startup) tới bất kỳ dự án Web nào!
