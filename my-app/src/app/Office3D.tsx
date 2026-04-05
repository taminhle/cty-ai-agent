"use client";
import React, { useRef, Suspense } from "react";
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
      <Box args={[0.5, 0.1, 0.5]} position={[0, 0.45, 0]} castShadow><meshStandardMaterial color="#1e293b" /></Box>
      <Box args={[0.45, 0.5, 0.05]} position={[0, 0.75, 0.22]} castShadow><meshStandardMaterial color="#334155" /></Box>
      <Box args={[0.05, 0.4, 0.05]} position={[0, 0.2, 0]} castShadow><meshStandardMaterial color="#94a3b8" /></Box>
      <Box args={[0.4, 0.05, 0.05]} position={[0, 0.025, 0]}><meshStandardMaterial color="#1e293b" /></Box>
      <Box args={[0.05, 0.05, 0.4]} position={[0, 0.025, 0]}><meshStandardMaterial color="#1e293b" /></Box>
    </group>
  );
}

// =======================================================================================
// 👉 HOLOGRAM NHÂN BẢN HÀNG LOẠT (Tối ưu nhưng luôn hiện rõ)
// =======================================================================================
function AgentCharacter({ position, name, role, isWorking, avatar, color }: any) {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (meshRef.current) {
      if (isWorking) {
        meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 8) * 0.1;
        meshRef.current.rotation.y += 0.05;
      } else {
        meshRef.current.position.y = 0.4 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.02;
        meshRef.current.rotation.y += 0.01;
      }
    }
  });

  return (
    <group position={position}>
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

      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.02, 32]} />
        <meshBasicMaterial color={isWorking ? "#4ade80" : color} transparent opacity={isWorking ? 0.8 : 0.3} />
      </mesh>

      <Html position={[0, isWorking ? 1.8 : 1.2, 0]} center zIndexRange={[100, 0]}>
        <div className={`transition-all duration-500 ease-in-out ${isWorking ? 'scale-125 opacity-100 flex flex-col items-center animate-bounce' : 'scale-100 opacity-80 flex flex-col items-center hover:opacity-100'}`}>
           <div className={`relative rounded-full p-0.5 ${isWorking ? 'bg-green-400 shadow-[0_0_30px_rgba(74,222,128,1)]' : 'bg-slate-400'}`}>
             <img src={avatar} className={`${isWorking ? 'w-16 h-16 border-4' : 'w-10 h-10 border-2'} rounded-full border-white object-cover transition-all`} alt={name} />
           </div>
           
           <div className={`mt-2 bg-white/95 backdrop-blur shadow-xl px-2 py-1 rounded border border-gray-200 flex flex-col items-center whitespace-nowrap ${isWorking ? 'min-w-[120px]' : 'scale-75'}`}>
             <span className="text-gray-900 text-[10px] font-bold">{name}</span>
             {isWorking && <span style={{color: color}} className="text-[9px] font-black uppercase mt-0.5 tracking-wider">{role}</span>}
           </div>
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

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / layoutCols);
    const col = i % layoutCols;
    const x = startX + col * 1.8;
    const z = startZ + row * 2.5;

    const rotationY = row % 2 === 0 ? 0 : Math.PI;
    const adjustedZ = row % 2 === 0 ? z : z + 1;

    desks.push(
      <group key={`${activeId}-${i}`} position={[x, 0, adjustedZ]}>
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

  return <group>{desks}</group>;
}

// =========================================================
// KHU VỰC PHÒNG BAN KÍNH TÁCH BIỆT (DEPARTMENT ROOM)
// =========================================================
function DepartmentRoom({ startX, startZ, count, layoutCols, departmentName, rolePrefix, color, activeId, activeAgent }: any) {
  const roomWidth = layoutCols * 1.8 + 1;
  const roomDepth = Math.ceil(count/layoutCols) * 2.5 + 1;
  const centerX = startX + roomWidth/2 - 0.5 - 0.9;
  const centerZ = startZ + roomDepth/2 - 0.5;

  return (
    <group>
      {/* Nền phòng ban */}
      <Plane args={[roomWidth, roomDepth]} position={[centerX, 0.01, centerZ]} rotation={[-Math.PI/2, 0, 0]}>
        <meshStandardMaterial color={color} transparent opacity={0.05} />
      </Plane>
      
      {/* Vách kính bao quanh (4 vách) */}
      <Box args={[roomWidth, 1.5, 0.1]} position={[centerX, 0.75, centerZ + roomDepth/2]}>
        <meshPhysicalMaterial transmission={0.9} roughness={0.1} transparent opacity={0.2} color={color} />
      </Box>
      <Box args={[roomWidth, 1.5, 0.1]} position={[centerX, 0.75, centerZ - roomDepth/2]}>
        <meshPhysicalMaterial transmission={0.9} roughness={0.1} transparent opacity={0.2} color={color} />
      </Box>
      <Box args={[0.1, 1.5, roomDepth]} position={[centerX - roomWidth/2, 0.75, centerZ]}>
        <meshPhysicalMaterial transmission={0.9} roughness={0.1} transparent opacity={0.2} color={color} />
      </Box>
      <Box args={[0.1, 1.5, roomDepth]} position={[centerX + roomWidth/2, 0.75, centerZ]}>
        <meshPhysicalMaterial transmission={0.9} roughness={0.1} transparent opacity={0.2} color={color} />
      </Box>

      {/* Biển tên Phòng Ban siêu to lơ lửng */}
      <Html position={[centerX, 3, centerZ]} center zIndexRange={[100, 0]}>
        <div style={{borderColor: color}} className="px-4 py-2 bg-white/90 backdrop-blur rounded shadow-lg border-2 text-center pointer-events-none">
          <h3 style={{color: color}} className="text-sm font-black uppercase tracking-widest">{departmentName}</h3>
          <p className="text-gray-500 text-[10px] font-bold">{count} Nhân sự</p>
        </div>
      </Html>

      {/* Cụm bàn làm việc bên trong */}
      <DeskCluster 
        startX={startX} startZ={startZ} count={count} layoutCols={layoutCols} 
        departmentName={departmentName} rolePrefix={rolePrefix} color={color} 
        activeId={activeId} activeAgent={activeAgent} 
      />
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
      <color attach="background" args={["#e2e8f0"]} /> 

      <Suspense fallback={<Html center><div className="px-6 py-3 bg-white rounded-xl shadow-2xl font-bold text-blue-600 border border-blue-100">Loading Mega Corporation (52 Agents)...</div></Html>}>
        
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

        <Plane args={[50, 50]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
          <meshStandardMaterial color="#f1f5f9" roughness={0.8} />
        </Plane>
        <ContactShadows position={[0, 0, 0]} opacity={0.3} scale={40} blur={2} far={10} />

        {/* 1. Ban Giám Đốc (4 Người) */}
        <DepartmentRoom 
          startX={-3} startZ={-15} count={4} layoutCols={4} 
          departmentName="C-Level Board" rolePrefix="Chief" color="#3b82f6" activeId="ceo" activeAgent={activeAgent} 
        />

        {/* 2. Khối Product & Design (8 Người) */}
        <DepartmentRoom 
          startX={-12} startZ={-8} count={8} layoutCols={4} 
          departmentName="Product & UX/UI" rolePrefix="PM/Designer" color="#8b5cf6" activeId="pm" activeAgent={activeAgent} 
        />

        {/* 3. Khối Frontend (12 Người) */}
        <DepartmentRoom 
          startX={-3} startZ={-8} count={12} layoutCols={6} 
          departmentName="Frontend Web/App" rolePrefix="FE Dev" color="#ec4899" activeId="frontend" activeAgent={activeAgent} 
        />

        {/* 4. Khối Backend & Systems (15 Người) */}
        <DepartmentRoom 
          startX={9} startZ={-8} count={15} layoutCols={5} 
          departmentName="Backend & DevOps" rolePrefix="System Eng" color="#10b981" activeId="backend" activeAgent={activeAgent} 
        />

        {/* 5. Khối QA & Security (8 Người) */}
        <DepartmentRoom 
          startX={0} startZ={2} count={8} layoutCols={4} 
          departmentName="QA & Security" rolePrefix="Pentester/QA" color="#f59e0b" activeId="qa" activeAgent={activeAgent} 
        />

        {/* 6. Khối Business Ops (5 Người) */}
        <DepartmentRoom 
          startX={-8} startZ={2} count={5} layoutCols={5} 
          departmentName="Finance & HR" rolePrefix="Specialist" color="#0ea5e9" activeId="accountant" activeAgent={activeAgent} 
        />

      </Suspense>
    </Canvas>
  );
}
