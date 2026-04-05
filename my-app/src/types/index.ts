// Cơ sở Dữ liệu Kiểu (Type Definitions) cho toàn bộ ứng dụng

export interface ChatMessage {
  sender: "user" | "assistant";
  text: string;
}

export interface AssistantProfile {
  id: string;
  name: string;
  role: string;
  color: string;
  avatar: string;
}

export interface PositionProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export interface AgentProps extends PositionProps {
  name: string;
  role: string;
  isWorking: boolean;
  avatar: string;
  color: string;
}

export interface FurnitureProps extends PositionProps {
  partitionColor?: string;
}

export interface BaseDepartmentProps {
  startX: number;
  startZ: number;
  count: number;
  layoutCols: number;
  departmentName: string;
  rolePrefix: string;
  color: string;
  activeId: string;
  activeAgent: string | null;
}
