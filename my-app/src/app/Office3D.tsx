"use client";
import React, { useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Box, Plane, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// =========================================================
// VẬT DỤNG VĂN PHÒNG CHUẨN
// =========================================================
function ModernDesk({ position, rotation, partitionColor }: any) {
  return (
    <group position={position} rotation={rotation}>
      {/* Mặt bàn nổi */}
      <Box args={[1.6, 0.05, 0.8]} position={[0, 0.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </Box>
      {/* Chân bàn */}
      <Box args={[0.05, 0.75, 0.6]} position={[-0.7, 0.375, 0]} castShadow><meshStandardMaterial color="#334155" /></Box>
      <Box args={[0.05, 0.75, 0.6]} position={[0.7, 0.375, 0]} castShadow><meshStandardMaterial color="#334155" /></Box>
      {/* Vách ngăn Mini (Privacy Screen) gắn liền với bàn */}
      <Box args={[1.5, 0.4, 0.02]} position={[0, 0.95, -0.38]}>
        <meshStandardMaterial color={partitionColor} transparent opacity={0.8} />
      </Box>
      {/* Màn hình Máy tính mỏng */}
      <Box args={[0.6, 0.35, 0.02]} position={[0, 0.95, -0.1]} rotation={[-0.1, 0, 0]} castShadow>
        <meshStandardMaterial color="#0f172a" />
      </Box>
      {/* Chân màn hình */}
      <Box args={[0.1, 0.1, 0.1]} position={[0, 0.8, -0.15]}><meshStandardMaterial color="#94a3b8" /></Box>
    </group>
  );
}

function OfficeChair({ position, rotation }: any) {
  return (
    <group position={position} rotation={rotation}>
      {/* Đệm ngồi */}
      <Box args={[0.5, 0.1, 0.5]} position={[0, 0.45, 0]} castShadow><meshStandardMaterial color="#1e293b" /></Box>
      {/* Lưng tựa */}
      <Box args={[0.45, 0.5, 0.05]} position={[0, 0.75, 0.22]} castShadow><meshStandardMaterial color="#334155" /></Box>
      {/* Chân ghế */}
      <Box args={[0.05, 0.4, 0.05]} position={[0, 0.2, 0]} castShadow><meshStandardMaterial color="#94a3b8" /></Box>
      <Box args={[0.4, 0.05, 0.05]} position={[0, 0.025, 0]}><meshStandardMaterial color="#1e293b" /></Box>
      <Box args={[0.05, 0.05, 0.4]} position={[0, 0.025, 0]}><meshStandardMaterial color="#1e293b" /></Box>
    </group>
  );
}

// =======================================================================================
// 👉 HOLOGRAM NHÂN BẢN HÀNG LOẠT (Tối ưu DOM)
// =======================================================================================
function AgentCharacter({ position, name, role, isWorking, avatar, color }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      if (isWorking) {
        // Nếu đang làm việc: Nhảy lên xuống phấn khích + Xoay nhanh
        meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 8) * 0.1;
        meshRef.current.rotation.y += 0.05;
      } else {
        // Trạng thái nghỉ: Nảy nhè nhẹ lơ lửng, quay từ từ
        meshRef.current.position.y = 0.4 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.02;
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  return (
    <group position={position}>
      {/* Cơ thể Hologram (Hình nón ngược) */}
      <mesh ref={meshRef} position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.05, 0.8, 16]} />
        <meshPhysicalMaterial 
          color={isWorking ? "#4ade80" : color} 
          transparent opacity={isWorking ? 0.9 : 0.6} 
          emissive={isWorking ? "#22c55e" : "#000000"} 
          emissiveIntensity={isWorking ? 1 : 0} 
          roughness={0.2} metalness={0.8} 
        />
      </mesh>

      {/* Đĩa Phát Sáng Dưới Chân */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.02, 32]} />
        <meshBasicMaterial color={isWorking ? "#4ade80" : color} transparent opacity={isWorking ? 0.8 : 0.3} />
      </mesh>

      {/* Nhãn Tên & Ảnh (Tối ưu: Chỉ Phóng to khi bị kích hoạt để tránh kẹt màn hình 52 cái nhãn) */}
      <Html position={[0, isWorking ? 1.8 : 1.2, 0]} center zIndexRange={[100, 0]}>
        <div className={`transition-all duration-500 ease-in-out ${isWorking ? 'scale-100 opacity-100 flex flex-col items-center animate-bounce' : 'scale-75 opacity-40 flex flex-col items-center hover:opacity-100'}`}>
           <div className={`relative rounded-full p-0.5 ${isWorking ? 'bg-green-400 shadow-[0_0_30px_rgba(74,222,128,1)]' : 'bg-slate-400'}`}>
             <img src={avatar} className={`${isWorking ? 'w-16 h-16 border-4' : 'w-6 h-6 border'} rounded-full border-white object-cover transition-all`} alt={name} />
           </div>
           
           {isWorking && (
             <div className="mt-2 bg-white/95 backdrop-blur shadow-xl px-3 py-1.5 rounded-full border border-gray-200 flex flex-col items-center whitespace-nowrap min-w-[120px]">
               <span className="text-gray-900 text-xs font-bold">{name}</span>
               <span style={{color: color}} className="text-[9px] font-black uppercase mt-0.5 tracking-wider">{role}</span>
             </div>
           )}
        </div>
      </Html>
    </group>
  );
}

// =========================================================
// TỔ HỢP CỤM BÀN LÀM VIỆC (OPEN SPACE DESKS)
// =========================================================
function DeskCluster({ startX, startZ, count, layoutCols, departmentName, rolePrefix, color, activeId, activeAgent }: any) {
  const avatars = ['/anna.png', '/sophia.png', '/max.png'];
  const isWorking = activeAgent === activeId;
  const desks = [];

  // Thuật toán trải lưới bàn
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / layoutCols);
    const col = i % layoutCols;
    
    // khoảng cách 1.8 units / bàn theo X, 2.5 theo Z
    const x = startX + col * 1.8;
    const z = startZ + row * 2.5;

    // Mặt bàn quay đối diện nhau nếu làm nhiều dãy
    const rotationY = row % 2 === 0 ? 0 : Math.PI;
    // Để 2 hàng đấu lưng/ngồi nhìn nhau
    const adjustedZ = row % 2 === 0 ? z : z + 1;

    desks.push(
      <group key={`${activeId}-${i}`} position={[x, 0, adjustedZ]}>
        {/* Render bàn, ghế với hướng đã xoay */}
        <ModernDesk position={[0, 0, -0.6]} rotation={[0, rotationY, 0]} partitionColor={color} />
        <OfficeChair position={[0, 0, 0]} rotation={[0, rotationY, 0]} />
        <AgentCharacter 
          position={[0, 0, 0]} 
          name={`${rolePrefix} 0${i+1}`} 
          role={departmentName} 
          isWorking={isWorking} 
          avatar={avatars[i % avatars.length]} 
          color={color} 
        />
      </group>
    );
  }

  return (
    <group>
      {/* Vòng sáng viền Khu vực nếu đội này đang chạy task */}
      {isWorking && (
        <Plane args={[layoutCols * 1.8 + 2, Math.ceil(count/layoutCols) * 2.5 + 2]} position={[startX + (layoutCols*1.8)/2 - 0.9, 0.02, startZ + (Math.ceil(count/layoutCols)*2.5)/2 - 0.5]} rotation={[-Math.PI/2, 0, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.1} />
        </Plane>
      )}
      {desks}
    </group>
  );
}


// =========================================================
// MAIN ENVIRONMENT: KHU VỰC ĐẠI CÔNG SỞ 52 NHÂN SỰ
// =========================================================
interface Office3DProps {
  activeAgent: string | null;
}

export default function Office3D({ activeAgent }: Office3DProps) {
  return (
    <Canvas shadows camera={{ position: [0, 20, 25], fov: 40 }}>
      {/* Nền xám nhạt */}
      <color attach="background" args={["#e2e8f0"]} /> 

      <Suspense fallback={<Html center><div className="px-6 py-3 bg-white rounded-xl shadow-2xl font-bold text-blue-600 border border-blue-100">Loading Mega Corporation (52 Agents)...</div></Html>}>
        
        {/* Ánh sáng Tự nhiên ngập tràn không gian mở */}
        <ambientLight intensity={0.7} />
        <hemisphereLight intensity={0.5} color="#ffffff" groundColor="#cbd5e1" />
        <directionalLight 
          position={[20, 30, -10]} 
          castShadow 
          intensity={1.2}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        <OrbitControls 
          enableDamping 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2 - 0.05}
          maxDistance={50}
          target={[0, 0, 0]}
        />

        {/* Sàn Nền Tập đoàn Siêu Rộng */}
        <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
          <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
        </Plane>

        <ContactShadows position={[0, 0, 0]} opacity={0.3} scale={40} blur={2} far={10} />

        {/* =====================================================
            QUY HOẠCH 52 BÀN LÀM VIỆC - 6 PHÒNG BAN
            ===================================================== */}
        
        {/* 1. Ban Giám Đốc (4 Người) - Ở tít trên cùng, ngồi quay xuống cty */}
        {/* VIP Room Platform Box (Tạo bục riêng) */}
        <Box args={[12, 0.2, 4]} position={[0, 0.1, -12]} receiveShadow><meshStandardMaterial color="#cbd5e1" /></Box>
        <DeskCluster 
          startX={-3} startZ={-12} count={4} layoutCols={4} 
          departmentName="C-Level Board" rolePrefix="Chief" color="#3b82f6" activeId="ceo" activeAgent={activeAgent} 
        />
        {/* Mặt kính chắn phòng Boss */}
        <Box args={[12, 3, 0.1]} position={[0, 1.5, -10]}>
          <meshPhysicalMaterial transmission={0.9} roughness={0.1} transparent opacity={0.3} color="#ffffff" />
        </Box>

        {/* 2. Khối Product & Design (8 Người) - Bên Trái */}
        <DeskCluster 
          startX={-10} startZ={-6} count={8} layoutCols={4} 
          departmentName="Product & UX/UI" rolePrefix="PM/Designer" color="#8b5cf6" activeId="pm" activeAgent={activeAgent} 
        />

        {/* 3. Khối Frontend (12 Người) - Trung tâm */}
        <DeskCluster 
          startX={-2} startZ={-6} count={12} layoutCols={6} 
          departmentName="Frontend Web/App" rolePrefix="FE Dev" color="#ec4899" activeId="frontend" activeAgent={activeAgent} 
        />

        {/* 4. Khối Backend & Systems (15 Người) - Bên Phải */}
        <DeskCluster 
          startX={-8} startZ={0} count={15} layoutCols={5} 
          departmentName="Backend & DevOps" rolePrefix="System Eng" color="#10b981" activeId="backend" activeAgent={activeAgent} 
        />

        {/* 5. Khối Automation QA & Security (8 Người) - Dưới cùng bên trái */}
        <DeskCluster 
          startX={2} startZ={2} count={8} layoutCols={4} 
          departmentName="QA & Security" rolePrefix="Pentester/QA" color="#f59e0b" activeId="qa" activeAgent={activeAgent} 
        />

        {/* 6. Khối Business Ops (5 Người) - Kế toán & HR -  Dưới góc */}
        <DeskCluster 
          startX={-4} startZ={6} count={5} layoutCols={5} 
          departmentName="Finance & HR" rolePrefix="Specialist" color="#0ea5e9" activeId="accountant" activeAgent={activeAgent} 
        />

      </Suspense>
    </Canvas>
  );
}
