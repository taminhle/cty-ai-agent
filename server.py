from flask import Flask
from flask_socketio import SocketIO, emit
from urllib.parse import unquote
import threading
import time
from crewai import Agent, Task, Crew, Process
import os

app = Flask(__name__)
# Allow CORS request for localhost:3000 where Next.js runs
socketio = SocketIO(app, cors_allowed_origins="*")

# ======= Cấu hình CrewAI =======
os.environ["GEMINI_API_KEY"] = "AIzaSyCcHAGv779aXoD_eFJQO1BkaVOmskSYwkM"
llm_gemini = "gemini/gemini-1.5-flash"

def my_log_callback(msg):
    # Hàm này dùng để bắt log từ CrewAI (nếu có thể)
    pass

def run_antigravity_crew(request_text):
    socketio.emit('ai_log', {'data': f"🧠 Bắt đầu phân tích yêu cầu: {request_text}"})
    
    # 1. Khởi tạo CEO
    socketio.emit('ai_log', {'data': "👨‍💼 CEO Agent đang lập kế hoạch..."})
    ceo_agent = Agent(
        role='Giám đốc Điều hành (CEO)',
        goal='Phân tích yêu cầu dự án lớn, chia nhỏ thành các tác vụ lập trình cụ thể.',
        backstory='Bạn là CEO của Antigravity. Bạn có tư duy logic sắc bén, luôn chia công việc rõ ràng cho cấp dưới.',
        llm=llm_gemini,
        verbose=True
    )
    
    # 2. Khởi tạo Lập trình viên
    socketio.emit('ai_log', {'data': "💻 Dev Agent đang chuẩn bị viết code..."})
    dev_agent = Agent(
        role='Lập trình viên Cấp cao (Worker)',
        goal='Viết mã nguồn chính xác, tối ưu và tuân thủ nguyên tắc thiết kế.',
        backstory='Bạn là lập trình viên chính của công ty. Phải tuân thủ Hiến pháp công ty.',
        llm=llm_gemini,
        verbose=True
    )
    
    # 3. Khởi tạo QA
    socketio.emit('ai_log', {'data': "🕵️‍♂️ QA Agent đã vào vị trí kiểm tra code..."})
    qa_agent = Agent(
        role='Trưởng phòng Quản lý Chất lượng (Code Reviewer)',
        goal='Kiểm duyệt mã nguồn, đảm bảo đúng chuẩn naming convention và bảo mật.',
        backstory='Bạn là cảnh sát chất lượng của công ty. Từ chối nếu code không đạt.',
        llm=llm_gemini,
        verbose=True
    )
    
    task_plan = Task(
        description=f'Phân tích yêu cầu này từ khách hàng: "{request_text}".',
        expected_output='Bản nháp kiến trúc hệ thống và danh sách file cần tạo.',
        agent=ceo_agent
    )
    
    task_code = Task(
        description='Dựa trên bản thiết kế của CEO, hãy viết code chi tiết.',
        expected_output='Mã nguồn hoàn chỉnh.',
        agent=dev_agent
    )
    
    task_review = Task(
        description='Đọc mã nguồn do lập trình viên vừa viết. Đánh giá Pass/Fail.',
        expected_output='Báo cáo duyệt code.',
        agent=qa_agent
    )
    
    antigravity_company = Crew(
        agents=[ceo_agent, dev_agent, qa_agent],
        tasks=[task_plan, task_code, task_review],
        process=Process.sequential,
        verbose=True
    )
    
    time.sleep(1) # Tạo độ trễ giả lập
    socketio.emit('ai_log', {'data': "🚀 KÍCH HOẠT HỆ THỐNG XỬ LÝ (CREW KICKOFF)..."})
    
    # Chạy CrewAI (Tốn chút thời gian làm việc thật qua AI)
    try:
        result = antigravity_company.kickoff()
        socketio.emit('ai_log', {'data': "✅ DỰ ÁN HOÀN THÀNH!"})
        socketio.emit('ai_log', {'data': f"Mã Nguồn / Phân Tích: \n{result}"})
    except Exception as e:
        socketio.emit('ai_log', {'data': f"❌ Lỗi xảy ra: {str(e)}"})

@socketio.on('connect')
def test_connect():
    print("Client đã kết nối (Frontend Giao diện GodEyeIDE)")
    emit('ai_log', {'data': '✅ Đã kết nối thành công tới Backend Server!'})

@socketio.on('start_project')
def handle_start_project(message):
    req = message.get('request', 'Không có yêu cầu')
    emit('ai_log', {'data': f"📥 Đã nhận yêu cầu: {req}"})
    
    # Chạy hệ thống AI trong luồng (thread) chạy nền để không block server
    threading.Thread(target=run_antigravity_crew, args=(req,)).start()

if __name__ == '__main__':
    print("🚀 Đang khởi động Antigravity Server tại cổng 5000...")
    socketio.run(app, debug=True, port=5000)
