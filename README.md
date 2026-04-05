# 🏢 AI Mega Corporation (52 Agents 3D Simulation)

> Đưa Trí tuệ Nhân tạo lên tầm cao mới với quy mô Tập đoàn! Dự án mô phỏng toàn diện vòng đời phát triển phần mềm bằng trí tuệ nhân tạo (CrewAI backend) và hiện thực hoá không gian Văn phòng Tương lai qua công nghệ WebGL (React Three Fiber).

## 🚀 Tính năng Cốt Lõi

- **Xử lý Đa luồng (Backend):** Sử dụng hệ thống đa đặc vụ (Multi-agent) qua **CrewAI** và **Gemini 1.5 Flash**. Để giải quyết bài toán sập Rate-limit API do gọi 52 Agent cùng lúc, hệ thống sử dụng cấu trúc **"6 Lead Agents"** (CEO, PM, Frontend, Backend, QA, Kế toán) đại diện cho 6 khối nghiệp vụ giải quyết tuần tự (Sequential Process).
- **Mô phỏng Văn phòng 3D (Frontend):** Thay đổi hoàn toàn không gian văn phòng thành lưới **Cyberpunk Đích thực**. Render đồng thời **52 Nhân sự 3D lơ lửng** thông qua cấu trúc phân luồng (DeskCluster Wrapper). 
- **Đồng bộ Thời gian thực (Websocket):** Sử dụng `Flask-SocketIO` đọc luồng log (STDOUT) từ mô hình Python, truyền tải xuống `Next.js` và lọc Regex để kích hoạt nhấp nháy phát sáng (Emissive Neon Glow) đối với từng phòng ban đang thực thi công việc.

## 🛠️ Công Nghệ Sử Dụng

### 1. Frontend (Next.js & 3D WebGL)
- **Framework:** Next.js 14+ (App Router), React 18, Tailwind CSS v4.0.
- **3D Engine:** `three`, `@react-three/fiber`, `@react-three/drei`.
- **Logic:** Tối ưu hiệu năng 3D bằng Cây Hình Học Cơ Bản (Primitive BoxGeometry, Cylinder) để render cùng lúc 52 Nhân sự và Hàng chục chậu cây, Cột trụ bê tông lưới Cyberpunk thay vì tốn RAM tải Model GLTF nặng nề. Mọi hiệu ứng Animation được đưa vào vi xử lý `useFrame` trực tiếp qua bộ máy Three.js.

### 2. Backend (Trí tuệ Nhân tạo - Server)
- **Framework:** Flask, Flask-SocketIO.
- **AI Core:** `crewAI`, `langchain-google-genai`.
- **Mô hình (Model):** Google Gemini 1.5 Flash (Xử lý Context tệp cực lớn cực nhanh).

## 🧩 Quy trình Khai sinh Mã nguồn (Evolution History)
1. Ban đầu xây dựng cấu trúc **1 CEO - 3 Nhân viên** trong 4 phòng kính chật hẹp, sử dụng mô hình Hologram 2D tĩnh.
2. Cố gắng Render mô hình nhân vật 3D 100% bằng cách chèn file `.glb` nhưng gặp lỗi tràn bộ nhớ trên Browser do thư viện `SkeletonUtils` xung đột khi nhân bản quá nhiều Bone.
3. Đập đi xây lại: Gỡ bỏ mô hình mạng ngoại lai để chống Crash (Block Hydration). Xây dựng một **Không gian làm việc mở (Open Workspace)** mô phỏng 52 nhân sự với công nghệ "Lightweight Hologram" từ khối nón, tối ưu hóa triệt để tài nguyên GPU của máy khách.

## 💡 Hướng Dẫn Sử Dụng
1. Khởi động AI Server trên Terminal 1:
   ```bash
   python server.py
   ```
2. Khởi động Web 3D trên Terminal 2:
   ```bash
   cd my-app
   npm run dev
   ```
3. Truy cập `http://localhost:3000`, gõ chữ yêu cầu từ Box Chat Trợ lý ảo để chứng kiến Tập đoàn 52 siêu AI bừng sáng.
