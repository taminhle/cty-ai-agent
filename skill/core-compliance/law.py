# Ví dụ Backend khởi tạo nhân viên bằng CrewAI (Python)

def load_constitution():
    # IDE tự động đọc file hiến pháp
    with open('.claude/CLAUDE.md', 'r', encoding='utf-8') as file:
        return file.read()

constitution_text = load_constitution()

# Khởi tạo Lập trình viên AI (Dev_Agent)
dev_agent = Agent(
    role='Lập trình viên Cấp cao (Worker)',
    goal='Viết mã nguồn chức năng theo đúng thiết kế, ưu tiên tính mô-đun[cite: 9].',
    backstory='Bạn là lập trình viên mẫn cán của Công ty AI Antigravity.',
    system_prompt_override=f"""
    Tuân thủ tuyệt đối các quy tắc trong .claude/CLAUDE.md. Không được thay đổi kiến trúc này trừ khi có yêu cầu trực tiếp từ tôi. [cite: 41]
    
    DƯỚI ĐÂY LÀ HIẾN PHÁP BẠN PHẢI TUÂN THEO:
    {constitution_text}
    """
)

# Khởi tạo Người kiểm duyệt (Code_Reviewer_Agent) [cite: 26]
qa_agent = Agent(
    role='Trưởng phòng Quản lý Chất lượng (code-reviewer) [cite: 26]',
    goal='Kiểm tra chất lượng và bảo mật[cite: 26]. Đảm bảo mọi file mới đều tuân thủ đặt tên và có test coverage > 80%[cite: 10, 11, 12, 14].',
    backstory='Bạn là người giữ cửa. Không dòng code nào được lưu nếu vi phạm nguyên tắc Antigravity.',
    # QA Agent cũng phải đọc hiến pháp để biết luật mà bắt lỗi
    system_prompt_override=f"""
    Bạn là người thực thi luật pháp. Dựa vào bộ luật dưới đây, hãy kiểm tra code của Lập trình viên:
    {constitution_text}
    """
)