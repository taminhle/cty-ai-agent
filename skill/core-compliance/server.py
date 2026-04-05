from flask import Flask
from flask_socketio import SocketIO
from flask_cors import CORS
import sys
import threading
from main import antigravity_company # Import hệ thống CrewAI từ file main.py cũ

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# --- Lớp chặn Log để gửi qua WebSocket ---
class PrintLogger:
    def write(self, msg):
        if msg.strip():
            # Gửi từng dòng suy nghĩ của AI lên Frontend
            socketio.emit('ai_log', {'data': msg})
        sys.__stdout__.write(msg)
    def flush(self):
        sys.__stdout__.flush()

sys.stdout = PrintLogger()

@socketio.on('start_project')
def handle_start_project(data):
    project_req = data.get('request', 'Dự án mặc định')
    socketio.emit('ai_log', {'data': f'🚀 Bắt đầu dự án: {project_req}'})
    
    # Chạy CrewAI trong một luồng (thread) riêng để không làm đứng Server
    def run_ai():
        # Ở đây bạn có thể cấu hình để CrewAI nhận project_req
        antigravity_company.kickoff()
        socketio.emit('ai_log', {'data': '✅ DỰ ÁN ĐÃ HOÀN THÀNH!'})
        
    threading.Thread(target=run_ai).start()

if __name__ == '__main__':
    print("Khởi động God-Eye Backend ở cổng 5000...")
    socketio.run(app, port=5000, debug=True, allow_unsafe_werkzeug=True)