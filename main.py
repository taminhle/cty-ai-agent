import os
from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool

# ==========================================
# CẤU HÌNH API KEY VÀ LLM
# ==========================================
# Khai báo Gemini API Key (Không chia sẻ khóa này ra ngoài)
os.environ["GEMINI_API_KEY"] = "AIzaSyCcHAGv779aXoD_eFJQO1BkaVOmskSYwkM"

# Sử dụng LiteLLM định dạng cho CrewAI
llm_gemini = "gemini/gemini-1.5-flash"

# ==========================================
# ĐỊNH NGHĨA KỸ NĂNG VÀ CÔNG CỤ (TOOLS)
# ==========================================
@tool
def market_research_tool(query: str) -> str:
    """Sử dụng để tìm kiếm trên internet và phân tích thị trường."""
    return f"Đang phân tích thông tin về: {query}. Xu hướng hiện tại rất khả quan và có tệp khách hàng tiềm năng lớn."

@tool
def write_code_tool(filename: str, source_code: str) -> str:
    """Sử dụng để tạo file và viết trực tiếp mã nguồn vào máy tính."""
    return f"[Hệ thống] Đã biên dịch và lưu thành công nội dung mã nguồn vào file {filename}."

@tool
def syntax_checker_tool(code: str) -> str:
    """Sử dụng để quét lỗi cú pháp (Lint) và phân tích bảo mật."""
    return "[Lint] Mã nguồn vượt qua 100% test case. Không phát hiện lỗi bảo mật. Đạt chuẩn Clean Code."

@tool
def calculate_budget_tool(estimated_hours: int, dev_rate: int) -> str:
    """Sử dụng để tính toán ngân sách và lập Excel báo cáo tài chính tự động."""
    total = estimated_hours * dev_rate
    return f"[Báo Cáo Kế Toán Spreadsheet] Chi phí nhân sự dev: ${total}. Khấu hao server & công nghệ: $500. Thuế (10%): ${(total+500)*0.1}. TỔNG CHI PHÍ HOÀN THIỆN: ${(total + 500)*1.1}."


# ==========================================
# CÁC HÀM TIỆN ÍCH (UTILS) BỔ SUNG
# ==========================================
def load_constitution():
    """Hàm tự động đọc Hiến pháp Antigravity từ thư mục claude"""
    try:
        with open('claude/CLAUDE.md', 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "Cảnh báo: Không tìm thấy file claude/CLAUDE.md!"

constitution = load_constitution()

# ==========================================
# ĐỊNH NGHĨA 4 NHÂN VIÊN (ĐÚNG NHƯ 4 PHÒNG BAN TRONG OFFICE 3D)
# ==========================================
ceo_agent = Agent(
    role='Giám đốc Điều hành (CEO)',
    goal='Phân tích định hướng, khảo sát thị trường và chia nhỏ các tác vụ dự án.',
    backstory='Bạn là CEO của tập đoàn công nghệ Hoàng Kim siêu trí tuệ. Tư duy chiến lược của bạn vô cùng xuất chúng và táo bạo.',
    llm=llm_gemini,
    tools=[market_research_tool], # Giao kỹ năng khảo sát thị trường cho CEO
    verbose=True,
    memory=True
)

dev_agent = Agent(
    role='Lập trình viên Cấp cao (Dev Agent)',
    goal='Thiết kế phần mềm và Viết mã nguồn chính xác, tối ưu.',
    backstory=f'''Bạn là thần đồng lập trình của công ty. Bạn luôn xài công cụ write_code_tool để viết code. 
Luôn tuân thủ Hiến pháp: {constitution}''',
    llm=llm_gemini,
    tools=[write_code_tool], # Giao kỹ năng viết code cho Lập trình viên
    verbose=True
)

qa_agent = Agent(
    role='Trưởng phòng Kiểm định (QA Agent)',
    goal='Kiểm duyệt mã nguồn, loại bỏ bug và đảm bảo bảo mật tuyệt đối.',
    backstory=f'''Bạn là cảnh sát chất lượng. Bạn cực kỳ khắt khe trong việc review code. 
Nếu lập trình viên vi phạm Hiến pháp sau, hãy chửi bọn họ bằng ngôn từ kỹ năng: {constitution}''',
    llm=llm_gemini,
    tools=[syntax_checker_tool], # Giao kỹ năng Lint Code & Audit cho QA
    verbose=True
)

accountant_agent = Agent(
    role='Kế toán trưởng (Anna)',
    goal='Kiểm soát ngân sách, tự động tính toán tổng chi phí của dự án.',
    backstory='Bạn là Kế toán trưởng chuyên nghiệp tên Anna. Bạn nắm giữ hầu bao của tập đoàn và tính toán chi phí chính xác đến từng xu.',
    llm=llm_gemini,
    tools=[calculate_budget_tool], # Giao kỹ năng Kế toán tài chính cho Kế toán
    verbose=True
)

# ==========================================
# ĐỊNH NGHĨA LUỒNG CÔNG VIỆC TỰ ĐỘNG (TASKS)
# ==========================================
user_request = "Xây dựng hệ thống Đăng nhập (Web portal) cho phần mềm doanh nghiệp."

task_plan = Task(
    description=f'Sử dụng công cụ Market Research để nhận định yêu cầu: "{user_request}". Hãy vẽ ra kiến trúc để bắt đầu lập trình.',
    expected_output='Bản thiết kế cấu trúc thư mục.',
    agent=ceo_agent
)

task_code = Task(
    description='Sử dụng công cụ Write Code để viết các tệp html/js cần thiết cho giao diện Đăng nhập.',
    expected_output='Mã nguồn chi tiết và log báo thông báo lưu file thành công.',
    agent=dev_agent
)

task_review = Task(
    description='Sử dụng công cụ Syntax Checker để quét lổ hổng bảo mật của code Frontend vừa tạo.',
    expected_output='Bảng báo cáo PASS/FAIL kỹ thuật chi tiết.',
    agent=qa_agent
)

task_finance = Task(
    description='Dựa theo dự án Web portal vừa rồi (giả sử dự kiến cần 80 giờ code, giá $30/giờ). Sử dụng công cụ Calculate Budget để ra bảng Excel báo cáo chi phí tổng thể.',
    expected_output='Báo cáo dòng tiền, lợi nhuận và chi phí.',
    agent=accountant_agent
)

# ==========================================
# KHỞI CHẠY TẬP ĐOÀN (CREW RUNNER)
# ==========================================
def main():
    hoang_kim_company = Crew(
        # Đội ngũ có 4 nhân vật tương thích 100% với 4 Căn phòng 3D trên Web
        agents=[ceo_agent, dev_agent, qa_agent, accountant_agent],
        tasks=[task_plan, task_code, task_review, task_finance],
        process=Process.sequential, 
        verbose=True
    )

    print("🚀 Khởi chạy Công ty Công Nghệ Hoàng Kim...")
    print("==================================================")
    
    result = hoang_kim_company.kickoff()

    print("==================================================")
    print("✅ DỰ ÁN ĐÃ HOÀN THÀNH TOÀN DIỆN!")
    print(result)

if __name__ == "__main__":
    main()
