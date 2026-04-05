import os
from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI

# ==========================================
# CẤU HÌNH API KEY VÀ LLM
# ==========================================
# Khai báo Gemini API Key
os.environ["GEMINI_API_KEY"] = "AIzaSyCcHAGv779aXoD_eFJQO1BkaVOmskSYwkM"

# Dùng chuẩn mô hình litellm cho CrewAI (thay vì dùng ChatGoogleGenerativeAI bị lỗi Pydantic)
llm_gemini = "gemini/gemini-1.5-flash"


# ==========================================
# CÁC HÀM TIỆN ÍCH (UTILS)
# ==========================================
def load_constitution():
    """Hàm tự động đọc Hiến pháp Antigravity từ thư mục claude"""
    try:
        with open('claude/CLAUDE.md', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Cảnh báo: Không tìm thấy file claude/CLAUDE.md!"

# Nạp hiến pháp vào bộ nhớ hệ thống
constitution = load_constitution()
print("⚙️ Đang nạp Hiến pháp Antigravity...")

# ==========================================
# ĐỊNH NGHĨA CÁC NHÂN VIÊN & PHÒNG BAN (AGENTS)
# ==========================================
ceo_agent = Agent(
    role='Giám đốc Điều hành (CEO)',
    goal='Phân tích yêu cầu dự án lớn, chia nhỏ thành các tác vụ lập trình cụ thể.',
    backstory='Bạn là CEO của Antigravity. Bạn có tư duy logic sắc bén, luôn chia công việc rõ ràng cho cấp dưới.',
    llm=llm_gemini,
    verbose=True,
    memory=True
)

dev_agent = Agent(
    role='Lập trình viên Cấp cao (Worker)',
    goal='Viết mã nguồn chính xác, tối ưu và tuân thủ nguyên tắc thiết kế.',
    backstory=f'''Bạn là lập trình viên chính của công ty. 
BẠN BẮT BUỘC PHẢI TUÂN THỦ BỘ LUẬT SAU ĐÂY KHI VIẾT CODE:
{constitution}''',
    llm=llm_gemini,
    verbose=True
)

qa_agent = Agent(
    role='Trưởng phòng Quản lý Chất lượng (Code Reviewer)',
    goal='Kiểm duyệt mã nguồn, đảm bảo đúng chuẩn naming convention và bảo mật.',
    backstory=f'''Bạn là cảnh sát chất lượng của công ty.
Hãy từ chối mã nguồn nếu lập trình viên vi phạm các quy định trong bộ luật này:
{constitution}''',
    llm=llm_gemini,
    verbose=True
)

# ==========================================
# ĐỊNH NGHĨA CÔNG VIỆC TỰ ĐỘNG (TASKS)
# ==========================================
# Yêu cầu đầu vào từ người dùng (Có thể thay đổi linh hoạt)
user_request = "Xây dựng màn hình đăng nhập cho phần mềm thủ tục hành chính phường Thủ Đức."

task_plan = Task(
    description=f'Phân tích yêu cầu: "{user_request}". Hãy lập danh sách các file cần thiết (HTML, CSS, JS hoặc React) và kiến trúc tổng thể.',
    expected_output='Bản nháp kiến trúc hệ thống và danh sách file cần tạo.',
    agent=ceo_agent
)

task_code = Task(
    description='Dựa trên bản thiết kế của CEO, hãy viết code chi tiết cho từng file. Nhớ tuân thủ quy tắc đặt tên (camelCase, PascalCase).',
    expected_output='Mã nguồn hoàn chỉnh của màn hình đăng nhập.',
    agent=dev_agent
)

task_review = Task(
    description='Đọc mã nguồn do lập trình viên vừa viết. Kiểm tra xem nó có tuân thủ cấu trúc mô-đun và quy tắc trong hiến pháp không.',
    expected_output='Báo cáo duyệt code: [PASS/FAIL]. Nếu Fail, chỉ ra lỗi vi phạm hiến pháp.',
    agent=qa_agent
)

# ==========================================
# KHỞI CHẠY TẬP ĐOÀN (CREW RUNNER)
# ==========================================
def main():
    antigravity_company = Crew(
        agents=[ceo_agent, dev_agent, qa_agent],
        tasks=[task_plan, task_code, task_review],
        process=Process.sequential, # Nhân viên làm việc nối tiếp nhau (CEO -> Dev -> QA)
        verbose=True
    )

    print("🚀 Khởi chạy Công ty AI Antigravity...")
    print("==================================================")

    # Lệnh kích hoạt toàn bộ hệ thống
    result = antigravity_company.kickoff()

    print("==================================================")
    print("✅ DỰ ÁN ĐÃ HOÀN THÀNH. KẾT QUẢ CUỐI CÙNG:")
    print(result)

if __name__ == "__main__":
    main()
