"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Box, Plane, Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";

// --- Thành phần: Cây xanh trang trí ---
function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Cylinder args={[0.15, 0.15, 1.2]} position={[0, 0.6, 0]} castShadow>
        <meshStandardMaterial color="#5d4037" />
      </Cylinder>
      <Sphere args={[0.7]} position={[0, 1.6, 0]} castShadow>
        <meshStandardMaterial color="#2e7d32" roughness={0.8} />
      </Sphere>
    </group>
  );
}

// --- Thành phần: Bàn làm việc ---
function Desk({ position, rotation = 0 }: { position: [number, number, number], rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Mặt bàn */}
      <Box args={[2.5, 0.1, 1.2]} position={[0, 0.8, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#eceff1" metalness={0.2} roughness={0.5} />
      </Box>
      {/* Vách ngăn */}
      <Box args={[2.5, 0.6, 0.05]} position={[0, 1.1, -0.6]} castShadow receiveShadow>
        <meshStandardMaterial color="#2196f3" transparent opacity={0.8} />
      </Box>
      {/* Chân bàn */}
      <Box args={[0.1, 0.8, 0.1]} position={[-1.1, 0.4, 0.5]} castShadow />
      <Box args={[0.1, 0.8, 0.1]} position={[1.1, 0.4, 0.5]} castShadow />
      <Box args={[0.1, 0.8, 0.1]} position={[-1.1, 0.4, -0.5]} castShadow />
      <Box args={[0.1, 0.8, 0.1]} position={[1.1, 0.4, -0.5]} castShadow />
    </group>
  );
}

// --- Thành phần: Tên phòng (Label) ---
function RoomLabel({ name, position }: { name: string, position: [number, number, number] }) {
  return (
    <Html position={position} center zIndexRange={[100, 0]}>
      <div className="bg-white/80 backdrop-blur-md text-blue-800 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider select-none shadow-sm whitespace-nowrap">
        {name}
      </div>
    </Html>
  );
}

// --- Nhân viên AI (Hologram Người Thật) ---
function AgentCharacter({ position, color, name, role, isWorking, avatar }: any) {
  const projectorRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (projectorRef.current) {
      if (isWorking) {
        // Đĩa chiếu phát sáng nhấp nháy khi làm việc
        const material = projectorRef.current.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.5 + Math.abs(Math.sin(state.clock.elapsedTime * 5)) * 0.5;
      } else {
        const material = projectorRef.current.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, 0, 0.1);
      }
    }
  });

  return (
    <group position={position}>
      {/* Đĩa chiếu Hologram dưới mặt sàn */}
      <mesh ref={projectorRef} position={[0, 0.05, 0]} receiveShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0} roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Cột sáng Hologram mờ */}
      {isWorking && (
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 1.5, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
      )}

      {/* Giao diện UI Thẻ nhân viên (Luôn xoay theo camera) */}
      <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]}>
        <div className={`flex flex-col items-center transition-all duration-300 ${isWorking ? 'animate-bounce' : ''}`}>
           {/* Ảnh đại diện người thật */}
           <div className={`relative rounded-full p-0.5 ${isWorking ? 'bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.6)]' : 'bg-gray-300'} transition-all duration-300`}>
             <img src={avatar} className="w-10 h-10 rounded-full border-2 border-white object-cover" alt={name} />
             {isWorking && (
               <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
             )}
           </div>
           
           {/* Thẻ tên siêu gọn lấp ló */}
           <div className="mt-1.5 bg-white/95 backdrop-blur shadow text-gray-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap border border-gray-100 flex flex-col items-center">
             <span>{name}</span>
             <span className="text-[8px] text-blue-600 font-extrabold uppercase tracking-tighter mt-0.5">{role}</span>
           </div>
        </div>
      </Html>
    </group>
  );
}

interface Office3DProps {
  activeAgent: string | null;
}

export default function Office3D({ activeAgent }: Office3DProps) {
  return (
    <Canvas shadows camera={{ position: [0, 15, 20], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 20, 5]} 
        castShadow 
        intensity={1.5} 
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
        shadow-camera-far={50} 
        shadow-camera-left={-20} 
        shadow-camera-right={20} 
        shadow-camera-top={20} 
        shadow-camera-bottom={-20} 
      />
      
      <OrbitControls makeDefault minDistance={10} maxDistance={40} maxPolarAngle={Math.PI / 2 - 0.05} />

      {/* Sàn văn phòng trải thảm (Nhám) */}
      <Plane rotation={[-Math.PI / 2, 0, 0]} args={[50, 50]} receiveShadow>
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </Plane>
      {/* Lưới Grid phong cách Blueprint */}
      <gridHelper args={[50, 50, "#334155", "#0f172a"]} position={[0, 0.01, 0]} />

      {/* --- PHÒNG GIÁM ĐỐC (Phía sau) --- */}
      <RoomLabel name="Phòng Giám Đốc" position={[0, 6, -10]} />
      <Box args={[14, 4, 0.2]} position={[0, 2, -12]} receiveShadow castShadow>
        <meshStandardMaterial color="#475569" transparent opacity={0.6} />
      </Box>
      <Desk position={[0, 0, -9]} />
      <AgentCharacter position={[0, 0, -9.8]} color="#3b82f6" name="Đại Hoàng" role="CEO" isWorking={activeAgent === "1"} avatar="/max.png" />
      <Tree position={[-5, 0, -10]} />
      <Tree position={[5, 0, -10]} />

      {/* --- PHÒNG KẾ TOÁN (Bên trái) --- */}
      <RoomLabel name="Phòng Tài Chính" position={[-10, 5, 0]} />
      <Desk position={[-10, 0, 0]} rotation={Math.PI / 2} />
      <AgentCharacter position={[-10.8, 0, 0]} color="#ec4899" name="Anna / Sophia" role="Kế toán & Thư ký" isWorking={activeAgent === "4"} avatar="/anna.png" />
      <Tree position={[-11, 0, 4]} />

      {/* --- TRUNG TÂM CÔNG NGHỆ (Bên phải) --- */}
      <RoomLabel name="Trung tâm R&D Công nghệ" position={[8, 5, 0]} />
      <Desk position={[6, 0, 0]} />
      <Desk position={[10, 0, 0]} />
      <AgentCharacter position={[6, 0, 0.8]} color="#10b981" name="Dev_Agent" role="Lập trình viên" isWorking={activeAgent === "2"} avatar="/sophia.png" />
      <AgentCharacter position={[10, 0, 0.8]} color="#f59e0b" name="QA_Agent" role="Kiểm định viên" isWorking={activeAgent === "3"} avatar="/max.png" />
      <Tree position={[12, 0, -2]} />
      <Tree position={[4, 0, -2]} />

      {/* Tường ngăn phân chia các phòng */}
      <Box args={[0.2, 2, 10]} position={[-5, 1, -5]} castShadow>
        <meshStandardMaterial color="#334155" />
      </Box>
      <Box args={[0.2, 2, 10]} position={[5, 1, -5]} castShadow>
        <meshStandardMaterial color="#334155" />
      </Box>

    </Canvas>
  );
}
