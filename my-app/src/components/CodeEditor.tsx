"use client";
import Editor from "@monaco-editor/react";

export default function CodeEditor() {
  return (
    <div className="flex-1 w-full h-full">
      <Editor
        height="100%"
        theme="vs-dark"
        defaultLanguage="javascript"
        defaultValue="// Code do các Agent sinh ra sẽ được tự động hiển thị tại đây..."
        options={{ minimap: { enabled: false }, fontSize: 14 }}
      />
    </div>
  );
}
