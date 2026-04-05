# ANTIGRAVITY AGENT CONSTITUTION

## [cite_start]Lớp 1: Bộ Nhớ (Memory Layer) [cite: 8]
- [cite_start]**Quy tắc kiến trúc:** Ưu tiên tính mô-đun, tách biệt logic nghiệp vụ và giao diện. [cite: 9]
- [cite_start]**Quy ước đặt tên:** - Biến/Hàm: camelCase. [cite: 10]
  - [cite_start]Class/Component: PascalCase. [cite: 11]
  - [cite_start]File: kebab-case. [cite: 12]
- [cite_start]**Kỳ vọng kiểm thử:** Mọi chức năng mới phải có Unit Test đi kèm. [cite: 13] [cite_start]Tỷ lệ bao phủ > 80%. [cite: 14]
- [cite_start]**Sơ đồ Repo:** Luôn cập nhật file `STRUCTURE.md` khi có sự thay đổi về thư mục. [cite: 15]

## [cite_start]Lớp 2: Kiến Thức (Skills Layer) [cite: 16]
- [cite_start]**Cơ chế gọi:** Chỉ kích hoạt các Skill liên quan đến Task hiện tại (Context Fork). [cite: 17]
- [cite_start]**Cấu trúc Skill:** Phải bao gồm `SKILL.md`, tài liệu tham khảo, scripts hỗ trợ và templates. [cite: 18]

## [cite_start]Lớp 3: Kiểm Soát (Hooks Layer) [cite: 19]
- [cite_start]**Pre-Tool Use:** Kiểm tra an toàn lệnh shell, chặn `rm -rf` hoặc các lệnh xóa dữ liệu không xác nhận. [cite: 20]
- [cite_start]**Post-Tool Use:** Tự động chạy Linting sau khi ghi file. [cite: 21]
- [cite_start]**Stop Event:** Thông báo trạng thái qua Slack/Terminal khi tiến trình dừng hoặc lỗi. [cite: 22]

## [cite_start]Lớp 4: Phân Quyền (Subagents Layer) [cite: 23]
- **Nguyên tắc:** Không đệ quy vô hạn. [cite_start]Subagent không được phép tạo thêm Subagent khác. [cite: 24]
- [cite_start]**Vai trò:** [cite: 25]
  - [cite_start]`code-reviewer`: Kiểm tra chất lượng và bảo mật. [cite: 26]
  - [cite_start]`test-runner`: Thực thi và báo cáo kết quả test. [cite: 27]
  - [cite_start]`explorer`: Nghiên cứu thư viện và giải pháp mới. [cite: 28]

## [cite_start]Lớp 5: Phân Phối (Plugins Layer) [cite: 29]
- [cite_start]**Tái sử dụng:** Mọi Skill hoặc Agent thành công phải được đóng gói thành Plugin để chia sẻ cho Team. [cite: 30]