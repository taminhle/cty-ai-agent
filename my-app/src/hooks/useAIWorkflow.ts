import { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import { ChatMessage } from "../types";

const BACKEND_URL = "https://cty-ai-agent.onrender.com";
// Singleton socket instance to avoid multiple connections across renders
const socket = io(BACKEND_URL);

export function useAIWorkflow() {
  const [activeView, setActiveView] = useState("home");
  const [greeting, setGreeting] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const [currentProject, setCurrentProject] = useState<string | null>(null);
  const [projectStatus, setProjectStatus] = useState<string>("Chưa bắt đầu");
  const [progress, setProgress] = useState<number>(0);

  // Khởi tạo lời chào
  useEffect(() => {
    const hour = new Date().getHours();
    let initialGreeting = "";
    if (hour < 12) initialGreeting = "Chào buổi sáng";
    else if (hour < 18) initialGreeting = "Chào buổi chiều";
    else initialGreeting = "Chào buổi tối";
    
    setGreeting(initialGreeting);
    setChatHistory([{
      sender: "assistant", 
      text: `${initialGreeting} Sếp! Hôm nay Sếp muốn xem báo cáo tiến độ hay giao việc mới cho các phòng ban?`
    }]);
  }, []);

  // Lắng nghe luồng AI log từ Backend (Websocket)
  useEffect(() => {
    const handleLog = (msg: { data: string }) => {
      setChatHistory(prev => [...prev, { sender: "assistant", text: "📢 Báo cáo: " + msg.data }]);
      
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2000);
      
      const logText = msg.data.toLowerCase();
      
      // Parser Workflow Logic
      if (logText.includes("ceo") || logText.includes("cấp cao") || logText.includes("giám đốc")) {
        setActiveAgent("ceo");
        setProjectStatus("Ban Giám Đốc đang chốt chiến lược dự án");
        setProgress(10);
      }
      else if (logText.includes("pm") || logText.includes("sản phẩm") || logText.includes("thiết kế") || logText.includes("ui/ux")) {
        setActiveAgent("pm");
        setProjectStatus("Khối Product đang Thiết kế & Lên tài liệu");
        setProgress(30);
      }
      else if (logText.includes("frontend") || logText.includes("giao diện")) {
        setActiveAgent("frontend");
        setProjectStatus("Khối Frontend (12 Dev) đang Code React/Web");
        setProgress(50);
      }
      else if (logText.includes("backend") || logText.includes("database") || logText.includes("server")) {
        setActiveAgent("backend");
        setProjectStatus("Khối Backend (15 Dev) đang đẩy API & Database");
        setProgress(70);
      }
      else if (logText.includes("qa") || logText.includes("kiểm định") || logText.includes("lỗi") || logText.includes("bảo mật")) {
        setActiveAgent("qa");
        setProjectStatus("Khối QA (8 Tester) đang chạy Stress Test & Soi bug");
        setProgress(85);
      }
      else if (logText.includes("kế toán") || logText.includes("chi phí") || logText.includes("anna")) {
        setActiveAgent("accountant");
        setProjectStatus("Kế toán tính doanh thu & xuất Excel");
        setProgress(95);
      }
      else if (logText.includes("hoàn thành") || logText.includes("thành công toàn diện")) {
        setActiveAgent(null);
        setProjectStatus("Dự án Đóng gói Hoàn Tất 100%");
        setProgress(100);
      }
    };

    socket.on("ai_log", handleLog);
    return () => { socket.off("ai_log", handleLog); };
  }, []);

  // Xử lý gửi tin nhắn điều hướng và giao việc
  const handleUserRequest = useCallback((userInput: string) => {
    if (!userInput) return;
    
    setChatHistory(prev => [...prev, { sender: "user", text: userInput }]);
    setIsSpeaking(true);
    
    const inputLower = userInput.toLowerCase();
    
    setTimeout(() => {
      setIsSpeaking(false);
      if (inputLower.includes("tiến độ") || inputLower.includes("báo cáo")) {
        setActiveView("reports");
        setChatHistory(prev => [...prev, { sender: "assistant", text: "Dạ, em đã mở bảng báo cáo tiến độ dự án trên màn hình chính cho Sếp xem rồi ạ." }]);
      } 
      else if (inputLower.includes("công ty") || inputLower.includes("làm việc") || inputLower.includes("3d")) {
        setActiveView("3d-office");
        setChatHistory(prev => [...prev, { sender: "assistant", text: "Dạ, em đưa Sếp đi tham quan văn phòng 3D. Các phòng ban (Code, QA, Kế toán) đang túc trực ạ!" }]);
      }
      else {
        // Khởi chạy quy trình AI chuẩn
        socket.emit("start_project", { request: userInput });
        setCurrentProject(userInput);
        setProjectStatus("Khởi tạo chiến dịch...");
        setProgress(10);
        setActiveView("3d-office"); 
        setActiveAgent("ceo"); 
        setChatHistory(prev => [...prev, { sender: "assistant", text: "Đã rõ thưa Sếp! Dự án đang được triển khai. Sếp hãy sang ô Báo Cáo để xem tiến độ thực tế nhé." }]);
      }
    }, 1500);
  }, []);

  return {
    activeView, setActiveView,
    greeting, chatHistory, isSpeaking,
    activeAgent, currentProject, projectStatus, progress,
    handleUserRequest
  };
}
