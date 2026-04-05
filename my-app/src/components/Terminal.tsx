"use client";
import React from "react";

interface TerminalProps {
  logs: string[];
  request: string;
  setRequest: (req: string) => void;
  onStart: () => void;
}

export default function Terminal({ logs, request, setRequest, onStart }: TerminalProps) {
  return (
    <>
      {/* Khung chứa Log */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-sm text-green-400 whitespace-pre-wrap">
        {logs.map((log, i) => (
          <div key={i} className="mb-2 leading-relaxed">{log}</div>
        ))}
      </div>

      {/* Khung Nhập Lệnh */}
      <div className="p-4 border-t border-gray-700 bg-gray-800 flex">
        <input
          type="text"
          className="flex-1 bg-gray-900 text-white p-2 rounded outline-none border border-gray-600 focus:border-blue-500"
          placeholder="Ví dụ: Thiết kế form đăng nhập cho phường..."
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onStart()}
        />
        <button
          onClick={onStart}
          className="ml-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-bold transition-colors"
        >
          Chạy
        </button>
      </div>
    </>
  );
}
