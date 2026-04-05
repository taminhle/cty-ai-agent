"use client";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Components
import Office3D from "./Office3D";
import CodeEditor from "@/components/CodeEditor";
import Terminal from "@/components/Terminal";

// Kết nối tới Python Server
const socket = io("https://cty-ai-agent.onrender.com");

export default function GodEyeIDE() {
  const [logs, setLogs] = useState<string[]>([]);
  const [request, setRequest] = useState("");
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  useEffect(() => {
    socket.on("ai_log", (msg: { data: string }) => {
      setLogs((prev) => [...prev, msg.data]);
      
      // Chuyển đổi Agent đang thao tác dựa trên log nhận được
      const logText = msg.data.toLowerCase();
      if (logText.includes("ceo") || logText.includes("kế hoạch")) setActiveAgent("1");
      else if (logText.includes("lập trình") || logText.includes("dev") || logText.includes("viết code")) setActiveAgent("2");
      else if (logText.includes("qa") || logText.includes("kiểm tra") || logText.includes("duyệt")) setActiveAgent("3");
      else if (logText.includes("hoàn thành")) setActiveAgent(null);
    });
    return () => { socket.off("ai_log"); };
  }, []);

  const handleStart = () => {
    if (!request) return;
    setLogs(["🚀 Đang đánh thức hệ thống Antigravity..."]);
    setActiveAgent("1"); // Bắt đầu bằng CEO
    socket.emit("start_project", { request });
    setRequest("");
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      {/* CỘT TRÁI: Kiến trúc Văn phòng 3D */}
      <div className="w-1/3 border-r border-gray-700 flex flex-col">
        <div className="p-4 bg-gray-800 font-bold border-b border-gray-700">Văn phòng 3D (Three.js)</div>
        <div className="flex-1 bg-gray-900">
          <Office3D activeAgent={activeAgent} />
        </div>
      </div>

      {/* CỘT GIỮA: Màn hình Code */}
      <div className="w-1/3 border-r border-gray-700 flex flex-col">
        <div className="p-4 bg-gray-800 font-bold border-b border-gray-700">Sản phẩm (Monaco Editor)</div>
        <CodeEditor />
      </div>

      {/* CỘT PHẢI: Terminal Giám sát & Giao việc */}
      <div className="w-1/3 flex flex-col bg-black">
        <div className="p-4 bg-gray-800 font-bold border-b border-gray-700">Terminal Giám Sát</div>
        <Terminal 
          logs={logs} 
          request={request} 
          setRequest={setRequest} 
          onStart={handleStart} 
        />
      </div>
    </div>
  );
}