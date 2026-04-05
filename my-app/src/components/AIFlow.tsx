"use client";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  { id: "1", position: { x: 250, y: 20 }, data: { label: "👨‍💼 CEO Agent" }, style: { background: '#2563eb', color: 'white', fontWeight: 'bold' } },
  { id: "2", position: { x: 100, y: 120 }, data: { label: "💻 Lập trình viên AI" }, style: { border: '2px solid #10b981' } },
  { id: "3", position: { x: 400, y: 120 }, data: { label: "🕵️‍♂️ QA Agent" }, style: { border: '2px solid #f59e0b' } },
];
const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true }
];

export default function AIFlow() {
  return (
    <div className="flex-1 w-full h-full">
      <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
        <Background color="#444" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
