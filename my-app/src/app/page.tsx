"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useAIWorkflow } from "../hooks/useAIWorkflow";

const Office3D = dynamic(() => import("./Office3D"), { ssr: false });

const assistants = [
  { id: 'anna', name: 'Anna', role: 'Thư ký AI', color: '#ec4899', avatar: '/anna.png' },
  { id: 'max', name: 'Max', role: 'Phân tích viên', color: '#3b82f6', avatar: '/max.png' },
  { id: 'sophia', name: 'Sophia', role: 'Cố vấn Trưởng', color: '#f59e0b', avatar: '/sophia.png' }
];

export default function VirtualCompanyPortal() {
  const {
    activeView, setActiveView,
    greeting, chatHistory, isSpeaking,
    activeAgent, currentProject, projectStatus, progress,
    handleUserRequest
  } = useAIWorkflow();

  const [userInput, setUserInput] = useState("");
  const [currentAssistant, setCurrentAssistant] = useState(assistants[0]);

  const handleSendMessage = () => {
    handleUserRequest(userInput);
    setUserInput("");
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900 font-sans overflow-hidden">
      
      {/* KHU VỰC TRÁI: Nội dung chính của trang web */}
      <div className="flex-1 flex flex-col relative">
        {/* Menu Điều hướng */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center z-10">
          <h1 className="text-2xl font-extrabold text-blue-700 uppercase">Công Ty Tin Học và Sáng Tạo Hoàng Kim</h1>
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
              <h2 className="text-4xl font-bold text-gray-800 mb-4">{greeting} Sếp!</h2>
              <p className="text-lg text-gray-600 max-w-2xl text-center">
                Chào mừng trở lại Tòa nhà Điều hành AI. Chúng tôi tự động hóa hoàn toàn quy trình phát triển phần mềm, từ phân tích nghiệp vụ, lập trình, kiểm định đến hạch toán chi phí.
              </p>
            </div>
          )}

          {/* Màn 2: Không gian 3D */}
          {activeView === "3d-office" && (
            <div className="w-full h-full bg-gray-900 relative">
              <Office3D activeAgent={activeAgent} />
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur text-white p-3 rounded-lg text-sm pointer-events-none shadow-2xl border border-gray-700">
                <p className="font-bold text-yellow-400 mb-1">Siêu Tập Đoàn 52 Nhân Sự (Mega Corp)</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-300">
                  <span>🤵 C-Level: 4 VIPs</span>
                  <span>🎨 Product/UX: 8</span>
                  <span>⚛️ Frontend: 12</span>
                  <span>⚙️ Backend/Ops: 15</span>
                  <span>🛡️ Security/QA: 8</span>
                  <span>💼 Finance/HR: 5</span>
                </div>
              </div>
            </div>
          )}

          {/* Màn 3: Bảng Báo cáo */}
          {activeView === "reports" && (
            <div className="p-10">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Báo cáo Dự án Trực tuyến</h2>
              {!currentProject ? (
                <div className="text-center mt-20 text-gray-400">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-lg">Hiện tại chưa có dự án nào được yêu cầu thi công.</p>
                  <p>Vui lòng yêu cầu Thư ký {currentAssistant.name} qua ô chat để bắt đầu nhé Sếp!</p>
                </div>
              ) : (
                <div className="bg-white p-6 rounded shadow-lg border-l-4 border-pink-500">
                  <h3 className="font-bold text-lg">Dự án: {currentProject}</h3>
                  <p className="text-gray-600 mt-2">
                    Trạng thái: <span className="font-semibold text-blue-600">{projectStatus}</span>
                  </p>
                  
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 rounded">
                    <p className="font-bold text-pink-600">Báo cáo từ Kế toán trưởng:</p>
                    <ul className="list-disc ml-5 mt-2 text-sm text-gray-700 leading-relaxed">
                      <li>Chi phí hạ tầng tạm tính: {progress > 0 ? "150.000 VNĐ" : "0 VNĐ"}</li>
                      <li>Token AI dự đoán: ~{Math.floor(progress * 50)} tokens</li>
                      <li>Bộ vi xử lý: Hệ thống AI Hoàng Kim siêu cấp.</li>
                      <li>Tình trạng dòng tiền: Ổn định.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* KHU VỰC PHẢI: Trợ lý Ảo (Virtual Assistant) */}
      <div className="w-96 bg-white border-l border-gray-200 shadow-2xl flex flex-col z-20">
        
        {/* Khung hiển thị Nhân vật Cô gái (3D Assistant Model) */}
        <div className="h-64 bg-linear-to-b from-blue-100 to-blue-50 relative overflow-hidden flex flex-col justify-end items-center border-b border-gray-200">
           
           {/* Khu vực Chọn Trợ lý (Thay thế ảnh UI) */}
           <div className="absolute top-3 left-0 w-full flex justify-center gap-3 z-10 px-2">
              {assistants.map(a => (
                <img 
                  key={a.id} 
                  src={a.avatar} 
                  onClick={() => setCurrentAssistant(a)} 
                  className={`w-14 h-14 rounded-full border-2 object-cover cursor-pointer transition-all duration-300 shadow-md ${currentAssistant.id === a.id ? 'border-white scale-110 shadow-xl ring-2 ring-blue-400' : 'border-gray-200 opacity-80 hover:opacity-100'}`} 
                  alt={a.name}
                  title={`Cử trợ lý ${a.name}`}
                />
              ))}
           </div>

           {/* Ảnh chụp người thật thay thế cho 3D Avatar */}
           <img 
             src={currentAssistant.avatar}
             alt={currentAssistant.name}
             className="w-full h-full object-cover absolute top-0 left-0 z-0"
           />
           {/* Chồng một lớp gradient mỏng để phần chọn trợ lý và chữ bên dưới hiện rõ trên hình */}
           <div className="absolute inset-0 bg-linear-to-t from-white via-transparent to-black/30 z-0"></div>

           {/* Bảng tên */}
           <div className="absolute bottom-3 z-10 bg-white/90 px-5 py-1.5 rounded-full shadow-md text-center backdrop-blur-sm pointer-events-none">
             <div className="font-bold text-blue-900">{currentAssistant.name} - {currentAssistant.role}</div>
             <div className="flex items-center gap-2 justify-center mt-0.5">
                <div className={`w-2.5 h-2.5 ${isSpeaking ? 'bg-orange-500 animate-pulse' : 'bg-green-500'} rounded-full`}></div>
                <span className="text-[11px] font-bold text-gray-500 uppercase">{isSpeaking ? 'Đang Phản hồi...' : 'Trực tuyến'}</span>
             </div>
           </div>
        </div>

        {/* Khung Chat */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-gray-50">
          {chatHistory.map((chat, idx) => (
            <div key={idx} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-xl max-w-[85%] shadow-sm text-sm ${chat.sender === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'}`}>
                {chat.text}
              </div>
            </div>
          ))}
        </div>

        {/* Ô nhập lệnh */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex bg-gray-50 rounded-xl border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-2 ring-blue-100">
            <input
              type="text"
              className="flex-1 bg-transparent p-3 outline-none text-sm"
              placeholder={`Giao việc cho ${currentAssistant.name}...`}
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