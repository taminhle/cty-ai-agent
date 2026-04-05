"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Box, Plane, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// --- Thành phần: Tên phòng ban ---
function RoomLabel({ name, position }: { name: string, position: [number, number, number] }) {
  return (
    <Html position={position} center zIndexRange={[100, 0]}>
      <div className="bg-white/80 backdrop-blur-md text-gray-800 border-b-2 border-green-500 px-4 py-1.5 rounded shadow-sm text-[11px] font-bold uppercase tracking-wider select-none whitespace-nowrap">
        {name}
      </div>
    </Html>
  );
}

// --- Thành phần: Bàn làm việc Open-plan kiểu hiện đại ---
function ModernDesk({ position, rotation = 0, partitionColor = "#dce775" }: any) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Mặt bàn gỗ ép sáng mịn */}
      <Box args={[3, 0.05, 1.5]} position={[0, 0.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f5f5f5" roughness={0.2} metalness={0.1} />
      </Box>
      
      {/* Vách ngăn kính mờ xanh lá (như trong ảnh mẫu) */}
      <Box args={[3, 0.4, 0.05]} position={[0, 0.95, -0.75]} castShadow receiveShadow>
        <meshPhysicalMaterial color={partitionColor} transparent opacity={0.7} transmission={0.5} roughness={0.2} />
      </Box>
      <Box args={[0.05, 0.4, 1.5]} position={[-1.5, 0.95, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color={partitionColor} transparent opacity={0.7} transmission={0.5} roughness={0.2} />
      </Box>
      
      {/* Chân bàn khung thép trắng */}
      <Box args={[0.05, 0.75, 1.4]} position={[-1.4, 0.375, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#eeeeee" metalness={0.5} roughness={0.5} />
      </Box>
      <Box args={[0.05, 0.75, 1.4]} position={[1.4, 0.375, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#eeeeee" metalness={0.5} roughness={0.5} />
      </Box>

      {/* Màn hình máy tính */}
      <group position={[0, 0.75 + 0.15, -0.4]} rotation={[0, 0, 0]}>
        <Box args={[0.3, 0.02, 0.3]} position={[0, -0.14, 0]} castShadow><meshStandardMaterial color="#222" /></Box> {/* Đế */}
        <Box args={[0.05, 0.3, 0.05]} position={[0, 0, -0.1]} castShadow><meshStandardMaterial color="#222" /></Box> {/* Trục */}
        <Box args={[1.2, 0.7, 0.05]} position={[0, 0.2, -0.05]} castShadow rotation={[-0.05, 0, 0]}>
          <meshStandardMaterial color="#111" roughness={0.1} /> {/* Màn hình */}
        </Box>
      </group>
      
      {/* Bàn phím & Chuột */}
      <Box args={[1.0, 0.02, 0.3]} position={[0, 0.77, 0.3]} castShadow receiveShadow>
         <meshStandardMaterial color="#e0e0e0" /> {/* Giấy tờ tài liệu */}
      </Box>
      <Box args={[0.8, 0.03, 0.25]} position={[-0.2, 0.78, 0.3]} castShadow>
         <meshStandardMaterial color="#333" /> {/* Keyboard */}
      </Box>
      <Box args={[0.1, 0.03, 0.15]} position={[0.4, 0.78, 0.3]} castShadow>
         <meshStandardMaterial color="#333" /> {/* Mouse */}
      </Box>
    </group>
  );
}

// --- Thành phần: Ghế văn phòng xoay ---
function OfficeChair({ position, rotation = 0 }: any) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Đệm ngồi */}
      <Box args={[0.6, 0.1, 0.6]} position={[0, 0.45, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#374151" roughness={0.8} />
      </Box> 
      {/* Trục ghế */}
      <Box args={[0.1, 0.45, 0.1]} position={[0, 0.225, 0]} castShadow>
        <meshStandardMaterial color="#9ca3af" metalness={0.8} />
      </Box> 
      {/* Tựa lưng */}
      <Box args={[0.6, 0.6, 0.05]} position={[0, 0.8, 0.3]} castShadow receiveShadow rotation={[-0.1, 0, 0]}>
        <meshStandardMaterial color="#374151" roughness={0.8} />
      </Box>
      {/* Chân hình sao */}
      <Box args={[0.7, 0.05, 0.1]} position={[0, 0.025, 0]} castShadow><meshStandardMaterial color="#9ca3af" /></Box>
      <Box args={[0.1, 0.05, 0.7]} position={[0, 0.025, 0]} castShadow><meshStandardMaterial color="#9ca3af" /></Box>
    </group>
  );
}

// --- Nhân sự AI Hologram ---
function AgentCharacter({ position, color, name, role, isWorking, avatar }: any) {
  const projectorRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (projectorRef.current) {
      const material = projectorRef.current.material as THREE.MeshStandardMaterial;
      if (isWorking) {
        material.emissiveIntensity = 0.5 + Math.abs(Math.sin(state.clock.elapsedTime * 6)) * 0.5;
      } else {
        material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, 0, 0.1);
      }
    }
  });

  return (
    <group position={position}>
      {/* Đĩa phân bổ vị trí nhân viên (vị trí chiếc ghế) */}
      <mesh ref={projectorRef} position={[0, 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.02, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0} roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* Màn sáng đứng bao bọc nhân viên khi vào trạng thái làm việc */}
      {isWorking && (
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 1.4, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
      )}

      {/* Thẻ UI Nhân Viên */}
      <Html position={[0, 1.35, 0]} center zIndexRange={[100, 0]}>
        <div className={`flex flex-col items-center transition-all duration-300 ${isWorking ? 'animate-bounce' : ''}`}>
           {/* Ảnh đại diện */}
           <div className={`relative rounded-full p-0.5 ${isWorking ? 'bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.7)]' : 'bg-gray-300'} transition-all duration-300`}>
             <img src={avatar} className="w-12 h-12 rounded-full border-2 border-white object-cover" alt={name} />
             {isWorking && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>}
           </div>
           {/* Badge Thông tin */}
           <div className="mt-2 bg-white/95 backdrop-blur shadow text-gray-800 px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap border border-gray-200 flex flex-col items-center">
             <span className="text-gray-900">{name}</span>
             <span className="text-[8px] text-blue-600 font-extrabold uppercase mt-0.5 tracking-widest">{role}</span>
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
    <Canvas shadows camera={{ position: [5, 6, 8], fov: 40 }}>
      {/* Màu nền trời sáng chân thực */}
      <color attach="background" args={["#dbeafe"]} /> 
      
      {/* Môi trường ánh sáng HDR giả lập thành phố buổi sáng */}
      <Environment preset="city" />
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[-10, 10, -5]} 
        castShadow 
        intensity={2.5} 
        color="#fffcee"
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
        shadow-bias={-0.0001}
      />

      <OrbitControls makeDefault minDistance={3} maxDistance={20} maxPolarAngle={Math.PI / 2 - 0.05} />

      {/* Sàn gỗ sáng sủa */}
      <Plane rotation={[-Math.PI / 2, 0, 0]} args={[50, 50]} receiveShadow>
        <meshStandardMaterial color="#d6d3d1" roughness={0.8} />
      </Plane>
      {/* Phủ bóng tiếp xúc thực tế mờ ảo */}
      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={15} blur={2.5} far={4} />

      {/* --- CỤM BÀN LÀM VIỆC OPEN PLAN (NHƯ ẢNH MẪU) --- */}
      <group position={[0, 0, 0]}>
        
        {/* Lập trình viên */}
        <ModernDesk position={[-1.5, 0, 1.5]} rotation={0} partitionColor="#bedb39" />
        <OfficeChair position={[-1.5, 0, 2.5]} rotation={0} />
        <AgentCharacter position={[-1.5, 0, 2.5]} color="#10b981" name="Dev Agent" role="Code & Lập trình" isWorking={activeAgent === "2"} avatar="/sophia.png" />

        {/* Kiểm định viên QA */}
        <ModernDesk position={[1.5, 0, 1.5]} rotation={0} partitionColor="#bedb39" />
        <OfficeChair position={[1.5, 0, 2.5]} rotation={0} />
        <AgentCharacter position={[1.5, 0, 2.5]} color="#f59e0b" name="QA Agent" role="Kiểm định lỗi" isWorking={activeAgent === "3"} avatar="/max.png" />

        {/* Kế toán (Ngồi đối diện QA) */}
        <ModernDesk position={[1.5, 0, 0]} rotation={Math.PI} partitionColor="#bedb39" />
        <OfficeChair position={[1.5, 0, -1.0]} rotation={Math.PI} />
        <AgentCharacter position={[1.5, 0, -1.0]} color="#ec4899" name="Anna" role="Kế toán & Chi phí" isWorking={activeAgent === "4"} avatar="/anna.png" />

        {/* CEO (Giám đốc có thể đứng phía sau sát tường kính quan sát - giống như người đàn ông đứng trong ảnh) */}
        <AgentCharacter position={[-1.5, 0, -1.0]} color="#3b82f6" name="Đại Hoàng" role="CEO & Điều hành" isWorking={activeAgent === "1"} avatar="/max.png" />

      </group>

      {/* --- CỬA KÍNH LỚN VIEW THÀNH PHỐ Ở PHÍA SAU --- */}
      <group position={[0, 2, -4]}>
        {/* Khung cửa sổ */}
        <Box args={[16, 6, 0.2]} position={[0, 1, 0]} castShadow receiveShadow>
           <meshStandardMaterial color="#f8fafc" />
        </Box>
        {/* Kính cường lực */}
        <Box args={[15, 5, 0.3]} position={[0, 1, 0]} receiveShadow>
           <meshPhysicalMaterial color="#bae6fd" transparent opacity={0.3} transmission={0.9} roughness={0} />
        </Box>
        {/* Khung viền đứng dọc cửa kính */}
        <Box args={[0.2, 5, 0.35]} position={[-3, 1, 0]} castShadow><meshStandardMaterial color="#475569"/></Box>
        <Box args={[0.2, 5, 0.35]} position={[3, 1, 0]} castShadow><meshStandardMaterial color="#475569"/></Box>
      </group>

      {/* Bảng báo tên phòng chung */}
      <RoomLabel name="Innovation Center (Khu Vực Làm Việc Chung)" position={[0, 4.5, -3.5]} />

    </Canvas>
  );
}
