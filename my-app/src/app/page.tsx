"use client";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Components
import AIFlow from "@/components/AIFlow";
import CodeEditor from "@/components/CodeEditor";
import Terminal from "@/components/Terminal";

// Kết nối tới Python Server
const socket = io("http://localhost:5000");

export default function GodEyeIDE() {
  const [logs, setLogs] = useState<string[]>([]);
  const [request, setRequest] = useState("");

  useEffect(() => {
    socket.on("ai_log", (msg: { data: string }) => {
      setLogs((prev) => [...prev, msg.data]);
    });
    return () => { socket.off("ai_log"); };
  }, []);

  const handleStart = () => {
    if (!request) return;
    setLogs(["🚀 Đang đánh thức hệ thống Antigravity..."]);
    socket.emit("start_project", { request });
    setRequest("");
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      {/* CỘT TRÁI: Sơ đồ tổ chức AI */}
      <div className="w-1/3 border-r border-gray-700 flex flex-col">
        <div className="p-4 bg-gray-800 font-bold border-b border-gray-700">Tổ chức Agent (React Flow)</div>
        <div className="flex-1 bg-gray-900">
          <AIFlow />
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