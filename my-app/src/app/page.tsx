"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import io from "socket.io-client";

// Nạp không gian 3D
const Office3D = dynamic(() => import("./Office3D"), { ssr: false });
// Dùng URL Render thực tế
const BACKEND_URL = "https://cty-ai-agent.onrender.com"; 
const socket = io(BACKEND_URL);

export default function VirtualCompanyPortal() {
  // Quản lý Màn hình đang hiển thị ('home' | '3d-office' | 'reports')
  const [activeView, setActiveView] = useState("home");
  
  // Trợ lý ảo & Chat
  const [greeting, setGreeting] = useState("");
  const [chatHistory, setChatHistory] = useState<{sender: string, text: string}[]>([]);
  const [userInput, setUserInput] = useState("");
  
  // Active Agent dùng cho môi trường 3D thay vì boolean ẩn hiện chung chung
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  // Tính toán lời chào theo thời gian thực
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Chào buổi sáng");
    else if (hour < 18) setGreeting("Chào buổi chiều");
    else setGreeting("Chào buổi tối");

    setChatHistory([{
      sender: "assistant", 
      text: `${hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối"} Sếp! Hôm nay Sếp muốn xem báo cáo tiến độ hay giao việc mới cho các phòng ban?`
    }]);

    // Lắng nghe log từ backend để Trợ lý cập nhật công việc trực tiếp
    socket.on("ai_log", (msg: { data: string }) => {
      setChatHistory(prev => [...prev, { sender: "assistant", text: "📢 Báo cáo: " + msg.data }]);
      
      // Đồng bộ Agent trong phòng 3D
      const logText = msg.data.toLowerCase();
      if (logText.includes("ceo") || logText.includes("kế hoạch")) setActiveAgent("1");
      else if (logText.includes("lập trình") || logText.includes("dev") || logText.includes("viết code")) setActiveAgent("2");
      else if (logText.includes("qa") || logText.includes("kiểm tra") || logText.includes("duyệt")) setActiveAgent("3");
      else if (logText.includes("kế toán") || logText.includes("tài chính") || logText.includes("tiền")) setActiveAgent("4");
      else if (logText.includes("hoàn thành")) setActiveAgent(null);
    });

    return () => { socket.off("ai_log"); };
  }, []);

  // Xử lý khi Sếp nhắn tin cho Trợ lý
  const handleSendMessage = () => {
    if (!userInput) return;
    
    // Lưu tin nhắn của sếp
    const newHistory = [...chatHistory, { sender: "user", text: userInput }];
    setChatHistory(newHistory);
    
    // Logic Trợ lý phản hồi thông minh
    const inputLower = userInput.toLowerCase();
    
    setTimeout(() => {
      if (inputLower.includes("tiến độ") || inputLower.includes("báo cáo")) {
        setActiveView("reports");
        setChatHistory(prev => [...prev, { sender: "assistant", text: "Dạ, em đã mở bảng báo cáo tiến độ dự án trên màn hình chính cho Sếp xem rồi ạ." }]);
      } 
      else if (inputLower.includes("công ty") || inputLower.includes("làm việc") || inputLower.includes("3d")) {
        setActiveView("3d-office");
        setChatHistory(prev => [...prev, { sender: "assistant", text: "Dạ, em đưa Sếp đi tham quan văn phòng 3D. Các phòng ban (Code, QA, Kế toán) đang túc trực ạ!" }]);
      }
      else {
        // Giao việc thẳng cho Backend Python
        socket.emit("start_project", { request: userInput });
        setActiveView("3d-office"); // Tự động mở map 3D khi có dự án mới
        setActiveAgent("1"); // Khởi động CEO đầu tiên
        setChatHistory(prev => [...prev, { sender: "assistant", text: "Đã rõ thưa Sếp! Em đã chuyển lệnh xuống cho anh em ở các phòng ban đi vào xử lý ngay lập tức." }]);
      }
    }, 800);

    setUserInput("");
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900 font-sans overflow-hidden">
      
      {/* KHU VỰC TRÁI: Nội dung chính của trang web */}
      <div className="flex-1 flex flex-col relative">
        {/* Menu Điều hướng */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
          <h1 className="text-2xl font-extrabold text-blue-700">TẬP ĐOÀN ANTIGRAVITY</h1>
          <nav className="flex gap-4">
            <button onClick={() => setActiveView("home")} className={`font-bold ${activeView === 'home' ? 'text-blue-600' : 'text-gray-500'}`}>Giới thiệu</button>
            <button onClick={() => setActiveView("3d-office")} className={`font-bold ${activeView === '3d-office' ? 'text-blue-600' : 'text-gray-500'}`}>Văn phòng 3D</button>
            <button onClick={() => setActiveView("reports")} className={`font-bold ${activeView === 'reports' ? 'text-blue-600' : 'text-gray-500'}`}>Báo cáo Dự án</button>
          </nav>
        </header>

        {/* Nội dung Màn hình thay đổi dựa theo activeView */}
        <main className="flex-1 overflow-auto bg-gray-50">
          
          {/* Màn 1: Giới thiệu */}
          {activeView === "home" && (
            <div className="p-10 flex flex-col items-center justify-center min-h-full">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Chào mừng đến với Tương lai của AI</h2>
              <p className="text-lg text-gray-600 max-w-2xl text-center">
                Chúng tôi tự động hóa hoàn toàn quy trình phát triển phần mềm, từ phân tích nghiệp vụ, lập trình, kiểm định đến hạch toán chi phí.
              </p>
            </div>
          )}

          {/* Màn 2: Không gian 3D */}
          {activeView === "3d-office" && (
            <div className="w-full h-full bg-gray-900 relative">
              <Office3D activeAgent={activeAgent} />
              <div className="absolute top-4 left-4 bg-black/50 text-white p-2 rounded text-sm pointer-events-none">
                Đang trực tuyến: CEO, Lập trình viên, Kiểm định, Kế toán
              </div>
            </div>
          )}

          {/* Màn 3: Bảng Báo cáo */}
          {activeView === "reports" && (
            <div className="p-10">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Tiến độ & Chi phí Dự án</h2>
              <div className="bg-white p-6 rounded shadow-lg border-l-4 border-pink-500">
                <h3 className="font-bold text-lg">Dự án: Cổng thông tin Hành chính Phường</h3>
                <p className="text-gray-600 mt-2">Trạng thái: Đang code (60%)</p>
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <p className="font-bold text-pink-600">Báo cáo từ Kế toán trưởng:</p>
                  <ul className="list-disc ml-5 mt-2">
                    <li>Chi phí Server dự kiến: 500.000 VNĐ/tháng</li>
                    <li>Token AI đã sử dụng: ~2.000 tokens (0.01$)</li>
                    <li>Dự kiến hoàn thành: Hôm nay.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* KHU VỰC PHẢI: Trợ lý Ảo (Virtual Assistant) */}
      <div className="w-96 bg-white border-l border-gray-200 shadow-2xl flex flex-col z-20">
        
        {/* Khung hiển thị Nhân vật Cô gái (Placeholder) */}
        <div className="h-64 bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center border-b border-gray-200 relative">
           {/* Tạm thời dùng Emoji làm Avatar. Sau này chèn file 3D cô gái vào đây */}
           <div className="text-8xl animate-bounce">👩💼</div>
           <div className="mt-4 font-bold text-blue-800 text-lg">Anna - Thư ký AI</div>
           <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-gray-500">Đang túc trực...</span>
           </div>
        </div>

        {/* Khung Chat */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50">
          {chatHistory.map((chat, idx) => (
            <div key={idx} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-xl max-w-[80%] shadow-sm ${chat.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                {chat.text}
              </div>
            </div>
          ))}
        </div>

        {/* Ô nhập lệnh */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex bg-gray-100 rounded-full border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-2 ring-blue-200">
            <input
              type="text"
              className="flex-1 bg-transparent p-3 outline-none"
              placeholder="Hỏi tiến độ, giao việc..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage} className="bg-blue-600 text-white px-5 font-bold hover:bg-blue-700 transition-colors">
              Gửi
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}