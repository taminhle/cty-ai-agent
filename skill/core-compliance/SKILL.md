# Skill: Core Compliance (Ràng buộc nguyên tắc)
# Mục đích: Đảm bảo mọi Agent tuân thủ các quy định tại Lớp 1 và Lớp 3.

## Quy trình Ràng buộc:
1. TRƯỚC KHI CODE: Đọc file `.claude/CLAUDE.md`. [cite_start]Xác nhận đã hiểu quy ước đặt tên (camelCase, PascalCase, kebab-case)[cite: 10, 11, 12].
2. [cite_start]TRONG KHI CODE: Tách biệt rõ ràng logic nghiệp vụ (Backend API/Service) khỏi giao diện người dùng (UI Components)[cite: 9].
3. SAU KHI CODE: 
   - [cite_start]Tự động viết Unit test đảm bảo coverage > 80%[cite: 14].
   - [cite_start]Cập nhật sơ đồ thư mục vào file `STRUCTURE.md`[cite: 15].
   - [cite_start]Không thực thi bất kỳ lệnh shell nào chứa `rm -rf`[cite: 20].

[cite_start]Nếu phát hiện vi phạm, Agent `code-reviewer` [cite: 26] có quyền từ chối (reject) kết quả và yêu cầu Worker Agent viết lại.