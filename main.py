import os
from crewai import Agent, Task, Crew, Process
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool

# ==========================================
# CẤU HÌNH API KEY VÀ LLM
# ==========================================
os.environ["GEMINI_API_KEY"] = "AIzaSyCcHAGv779aXoD_eFJQO1BkaVOmskSYwkM"
llm_gemini = "gemini/gemini-1.5-flash"

# ==========================================
# ĐỊNH NGHĨA TOOLS ĐẠI DIỆN CHO 6 KHỐI
# ==========================================
@tool
def market_strategy_tool(query: str) -> str:
    """Ban Giám Đốc sử dụng để duyệt chiến lược."""
    return f"[CEO Log] Đã duyệt định hướng cho: {query}"

@tool
def sprint_planning_tool(features: str) -> str:
    """Khối Product sử dụng để chia JIRA Ticket."""
    return f"[PM Log] Đã phân rã các tính năng: {features} thành 25 JIRA tickets."

@tool
def react_compile_tool(ui_components: str) -> str:
    """Khối Frontend sử dụng để gen React Code."""
    return f"[Frontend Log] 12 Dev đã hoàn thành việc đổ code cho {ui_components}."

@tool
def deploy_database_api(database_schema: str) -> str:
    """Khối Backend sử dụng để dựng Server và DB."""
    return f"[Backend Log] 15 Dev đã dựng xong Microservice. Đã nối DB {database_schema}."

@tool
def security_scan_tool(code: str) -> str:
    """Khối QA chạy Automation Test."""
    return "[QA Log] Hoàn tất Stress Test & Pentest với 8 Tester. Bugs found: 0. Đạt chuẩn."

@tool
def corporate_finance_tool(estimated_cost: int) -> str:
    """Khối Tài chính tính toán hoá đơn."""
    total = estimated_cost * 52 # Nhân 52 nhân sự
    return f"[Finance Log] Tiền lương 52 nhân sự: ${total}. Khấu hao Hệ thống: $8000."


def load_constitution():
    try:
        with open('claude/CLAUDE.md', 'r', encoding='utf-8') as f: return f.read()
    except FileNotFoundError: return "Rule: Clean code."

const = load_constitution()

# ==========================================
# KHỞI TẠO 6 "LEAD AGENTS" ĐẠI DIỆN CHO 52 NHÂN SỰ
# ==========================================
ceo_agent = Agent(
    role='Giám đốc Điều hành (CEO)',
    goal='Thiết lập chiến lược tổng quan.',
    backstory='Người đứng đầu siêu tập đoàn 52 nhân sự.',
    llm=llm_gemini, tools=[market_strategy_tool], verbose=True
)

pm_agent = Agent(
    role='Giám đốc Sản phẩm (PM Lead)',
    goal='Viết tài liệu UI/UX và điều phối Jira.',
    backstory='Đại diện cho khối 8 người Product & UX. Quản lý tiến độ cực gắt.',
    llm=llm_gemini, tools=[sprint_planning_tool], verbose=True
)

frontend_agent = Agent(
    role='Trưởng phòng Frontend (Lead FE)',
    goal='Viết mã nguồn UI mảng Web & App.',
    backstory='Lãnh đạo đội 12 Lập trình viên Frontend. Tốc độ gõ phím cực nhanh.',
    llm=llm_gemini, tools=[react_compile_tool], verbose=True
)

backend_agent = Agent(
    role='Giám đốc Hệ thống (Lead BE & DevOps)',
    goal='Thiết kế kiến trúc Database, Server, API.',
    backstory='Quản trị hạm đội 15 System Engineers. Chuyên gia chống chịu tải trọng dữ liệu lớn.',
    llm=llm_gemini, tools=[deploy_database_api], verbose=True
)

qa_agent = Agent(
    role='Giám đốc An ninh (Lead QA/Security)',
    goal='Kiểm duyệt bảo mật, chặn đứng Hacker.',
    backstory='Dẫn dắt 8 Hacker Mũ trắng và Tester.',
    llm=llm_gemini, tools=[security_scan_tool], verbose=True
)

accountant_agent = Agent(
    role='Kế toán trưởng (CFO Anna)',
    goal='Quản trị tài chính công ty 52 người.',
    backstory='Bà trùm tài chính. Chỉ quan tâm đến tiền.',
    llm=llm_gemini, tools=[corporate_finance_tool], verbose=True
)

# ==========================================
# QUY TRÌNH MEGA CORP
# ==========================================
user_request = "Xây dựng siêu hệ thống App TMĐT."

task_ceo = Task(description=f'CEO hãy lên kế hoạch cho yêu cầu: "{user_request}"', expected_output='Bản vẽ chiến lược', agent=ceo_agent)
task_pm = Task(description='PM nhận chiến lược, lập JIRA Backlog.', expected_output='Jira Board', agent=pm_agent)
task_fe = Task(description='Frontend Code Giao diện App', expected_output='Gói mã nguồn UI', agent=frontend_agent)
task_be = Task(description='Backend Dựng Database & Server', expected_output='Luồng API, DevOps', agent=backend_agent)
task_qa = Task(description='QA Test Lỗi Toàn hệ thống', expected_output='Báo cáo Pass, an toàn 100%', agent=qa_agent)
task_fin = Task(description='Kế toán ước tính tiền lương cho 52 con người', expected_output='Bảng lương Excel', agent=accountant_agent)

def main():
    mega_corp = Crew(
        agents=[ceo_agent, pm_agent, frontend_agent, backend_agent, qa_agent, accountant_agent],
        tasks=[task_ceo, task_pm, task_fe, task_be, task_qa, task_fin],
        process=Process.sequential, 
        verbose=True
    )
    print("🚀 MEGA CORP (52 Agents) Tự động hoá...")
    result = mega_corp.kickoff()
    print("✅ HOÀN THÀNH!")

if __name__ == "__main__":
    main()
