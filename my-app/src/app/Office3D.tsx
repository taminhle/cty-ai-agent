"use client";
import React, { useRef, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Box, Plane, Environment, ContactShadows, useGLTF, useAnimations, Clone } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

// =========================================================
// 🛒 HƯỚNG DẪN TẢI VÀ SỬ DỤNG MÔ HÌNH 3D (.glb)
// Khi Sếp tải xong các file (vd: worker.glb), hãy đặt vào thư mục my-app/public/models/
// Sau đó, sếp chỉ cần:
// 1. Comment (ẩn) component `AgentCharacter` (Hologram) bên dưới.
// 2. Bỏ comment (hiển thị code) của component `AgentCharacterGLTF` ở ngay dưới nó.
// =========================================================

// --- Thành phần: Tên phòng ban ---
function RoomLabel({ name, position }: { name: string, position: [number, number, number] }) {
  return (
    <Html position={position} center zIndexRange={[100, 0]}>
      <div className="bg-white/90 backdrop-blur-md text-blue-900 border-b-2 border-orange-500 px-4 py-1.5 rounded shadow-xl text-[12px] font-black uppercase tracking-wider select-none whitespace-nowrap">
        {name}
      </div>
    </Html>
  );
}

// --- Thành phần: Bàn làm việc (Dành riêng cho văn phòng kín) ---
function ModernDesk({ position, rotation = 0, partitionColor = "#dce775" }: any) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Mặt bàn gỗ sang trọng */}
      <Box args={[3, 0.05, 1.5]} position={[0, 0.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#fafafa" roughness={0.1} metalness={0.1} />
      </Box>
      {/* Chân bàn */}
      <Box args={[0.05, 0.75, 1.4]} position={[-1.4, 0.375, 0]} castShadow receiveShadow><meshStandardMaterial color="#475569" /></Box>
      <Box args={[0.05, 0.75, 1.4]} position={[1.4, 0.375, 0]} castShadow receiveShadow><meshStandardMaterial color="#475569" /></Box>

      {/* Màn hình máy tính */}
      <group position={[0, 0.75 + 0.15, -0.4]} rotation={[0, 0, 0]}>
        <Box args={[0.3, 0.02, 0.3]} position={[0, -0.14, 0]} castShadow><meshStandardMaterial color="#222" /></Box>
        <Box args={[0.05, 0.3, 0.05]} position={[0, 0, -0.1]} castShadow><meshStandardMaterial color="#222" /></Box>
        <Box args={[1.2, 0.7, 0.05]} position={[0, 0.2, -0.05]} castShadow rotation={[-0.05, 0, 0]}>
          <meshStandardMaterial color="#111" roughness={0.1} />
        </Box>
      </group>
      {/* Bàn phím & Chuột */}
      <Box args={[0.8, 0.03, 0.25]} position={[-0.2, 0.78, 0.3]} castShadow><meshStandardMaterial color="#333" /></Box>
      <Box args={[0.1, 0.03, 0.15]} position={[0.4, 0.78, 0.3]} castShadow><meshStandardMaterial color="#333" /></Box>
    </group>
  );
}

// --- Thành phần: Ghế văn phòng ---
function OfficeChair({ position, rotation = 0 }: any) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <Box args={[0.6, 0.1, 0.6]} position={[0, 0.45, 0]} castShadow receiveShadow><meshStandardMaterial color="#1f2937" /></Box> 
      <Box args={[0.1, 0.45, 0.1]} position={[0, 0.225, 0]} castShadow><meshStandardMaterial color="#9ca3af" /></Box> 
      <Box args={[0.6, 0.6, 0.05]} position={[0, 0.8, 0.3]} castShadow receiveShadow rotation={[-0.1, 0, 0]}><meshStandardMaterial color="#1f2937" /></Box>
    </group>
  );
}

// =======================================================================================
// 👉 NHÂN SỰ MODEL 3D CHUẨN (ĐÃ TẢI FILE `.glb` CÓ XƯƠNG - SKINNED MESH)
// =======================================================================================
function AgentCharacterGLTF({ position, name, role, isWorking, avatar }: any) {
  // Nạp 1 bản 3D duy nhất vào bộ nhớ cache
  const { scene, animations } = useGLTF('/models/worker.glb');
  
  // NHÂN BẢN AN TOÀN (Clone) CÓ GIỮ NGUYÊN CẤU TRÚC XƯƠNG BẰNG SkeletonUtils
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  // Gắn Hoạt ảnh vào chính bản sao (clone) này!
  const { actions } = useAnimations(animations, clone);

  // Điều khiển các Hoạt ảnh tương ứng của Robot
  useEffect(() => {
    // RobotExpressive animations: 'Dance', 'Death', 'Idle', 'Jump', 'No', 'Punch', 'Running', 'Sitting', 'Standing', 'ThumbsUp', 'Walking', 'WalkJump', 'Yes'
    if (actions) {
      if (isWorking) {
        if (actions['Idle']) actions['Idle'].stop();
        if (actions['ThumbsUp']) actions['ThumbsUp'].play();
        else if (actions['Dance']) actions['Dance'].play();
      } else {
        if (actions['ThumbsUp']) actions['ThumbsUp'].stop();
        if (actions['Dance']) actions['Dance'].stop();
        if (actions['Idle']) actions['Idle'].play();
      }
    }
  }, [isWorking, actions]);

  return (
    <group position={position}>
      <primitive object={clone} castShadow scale={0.3} position={[0, -0.05, 0]} rotation={[0, Math.PI, 0]} />
      <Html position={[0, 1.8, 0]} center zIndexRange={[100, 0]}>
        <div className={`flex flex-col items-center transition-all duration-300 ${isWorking ? 'animate-bounce' : ''}`}>
           <div className={`relative rounded-full p-0.5 ${isWorking ? 'bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.7)]' : 'bg-gray-300'}`}>
             <img src={avatar} className="w-12 h-12 rounded-full border-2 border-white object-cover" alt={name} />
           </div>
           <div className="mt-2 bg-white/95 backdrop-blur shadow text-gray-800 px-3 py-1 rounded-full text-[10px] font-bold border border-gray-200 flex flex-col items-center whitespace-nowrap">
             <span className="text-gray-900">{name}</span>
             <span className="text-[8px] text-blue-600 font-extrabold uppercase mt-0.5 tracking-widest">{role}</span>
           </div>
        </div>
      </Html>
    </group>
  );
}

// =======================================================================================
// 👉 ĐÂY LÀ NHÂN SỰ DÙNG HÌNH 2D HOLOGRAM (Dùng Tạm Khi Chưa Có File 3D)
// =======================================================================================
function AgentCharacter({ position, color, name, role, isWorking, avatar }: any) {
  const projectorRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (projectorRef.current) {
      const material = projectorRef.current.material as THREE.MeshStandardMaterial;
      if (isWorking) material.emissiveIntensity = 0.5 + Math.abs(Math.sin(state.clock.elapsedTime * 6)) * 0.5;
      else material.emissiveIntensity = THREE.MathUtils.lerp(material.emissiveIntensity, 0, 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh ref={projectorRef} position={[0, 0.01, 0]} receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.02, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0} roughness={0.3} metalness={0.8} />
      </mesh>
      {isWorking && (
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 1.4, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.15} />
        </mesh>
      )}
      <Html position={[0, 1.35, 0]} center zIndexRange={[100, 0]}>
        <div className={`flex flex-col items-center transition-all duration-300 ${isWorking ? 'animate-bounce' : ''}`}>
           <div className={`relative rounded-full p-0.5 ${isWorking ? 'bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.7)]' : 'bg-gray-300'}`}>
             <img src={avatar} className="w-12 h-12 rounded-full border-2 border-white object-cover" alt={name} />
           </div>
           <div className="mt-2 bg-white/95 backdrop-blur shadow text-gray-800 px-3 py-1 rounded-full text-[10px] font-bold border border-gray-200 flex flex-col items-center whitespace-nowrap">
             <span className="text-gray-900">{name}</span>
             <span className="text-[8px] text-blue-600 font-extrabold uppercase mt-0.5 tracking-widest">{role}</span>
           </div>
        </div>
      </Html>
    </group>
  );
}

// Đã gỡ comment và di chuyển AgentCharacterGLTF lên trên.

// --- Thành phần: KHÔNG GIAN PHÒNG LÀM VIỆC RIÊNG BẰNG KÍNH (Private Office) ---
function PrivateOfficeRoom({ position, roomName, color, deskRotation = 0, agentProps }: any) {
  return (
    <group position={position}>
      {/* Sàn phòng lót thảm cao cấp */}
      <Plane rotation={[-Math.PI / 2, 0, 0]} args={[6, 6]} receiveShadow position={[0, 0.02, 0]}>
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </Plane>
      
      {/* Vách kính cường lực mờ xung quanh (Cách âm & Độc lập) */}
      {/* Vách ngăn bên Trái */}
      <Box args={[0.1, 3.5, 6]} position={[-3, 1.75, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.4} transmission={0.9} roughness={0.1} />
      </Box>
      {/* Vách ngăn bên Phải */}
      <Box args={[0.1, 3.5, 6]} position={[3, 1.75, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#e0f2fe" transparent opacity={0.4} transmission={0.9} roughness={0.1} />
      </Box>
      {/* Vách ngăn Phía sau kính đục */}
      <Box args={[6, 3.5, 0.1]} position={[0, 1.75, -3]} castShadow receiveShadow>
        <meshPhysicalMaterial color="#bae6fd" transparent opacity={0.8} transmission={0.5} roughness={0.4} />
      </Box>
      {/* Viền cột nhôm vách kính */}
      <Box args={[0.2, 3.5, 0.2]} position={[-3, 1.75, -3]} castShadow><meshStandardMaterial color="#475569" /></Box>
      <Box args={[0.2, 3.5, 0.2]} position={[3, 1.75, -3]} castShadow><meshStandardMaterial color="#475569" /></Box>
      <Box args={[0.2, 3.5, 0.2]} position={[-3, 1.75, 3]} castShadow><meshStandardMaterial color="#475569" /></Box>
      <Box args={[0.2, 3.5, 0.2]} position={[3, 1.75, 3]} castShadow><meshStandardMaterial color="#475569" /></Box>

      {/* Tên phòng treo lơ lửng ngay cửa kính */}
      <RoomLabel name={roomName} position={[0, 4, 3]} />

      {/* Đồ đạc trong phòng riêng */}
      {/* Quay bàn vào sát vách kính hậu (z=-1) */}
      <ModernDesk position={[0, 0, -1]} rotation={deskRotation} partitionColor={color} />
      <OfficeChair position={[0, 0, 0]} rotation={deskRotation} />

      {/* Bật Dàn Robot 3D với SkinnedMesh! */}
      <AgentCharacterGLTF position={[0, 0, 0]} {...agentProps} />
    </group>
  );
}

interface Office3DProps {
  activeAgent: string | null;
}

export default function Office3D({ activeAgent }: Office3DProps) {
  return (
    <Canvas shadows camera={{ position: [0, 10, 18], fov: 45 }}>
      <color attach="background" args={["#f1f5f9"]} /> 
      <Suspense fallback={<Html center><div className="px-4 py-2 bg-white rounded-lg shadow font-bold text-blue-600">Loading 3D Models...</div></Html>}>
        {/* Ánh sáng và môi trường */}
        <Environment preset="apartment" />
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 15, -10]} 
        castShadow 
        intensity={2.0} 
        color="#ffffff"
        shadow-mapSize-width={2048} 
        shadow-mapSize-height={2048} 
        shadow-bias={-0.0001}
      />

      <OrbitControls makeDefault minDistance={5} maxDistance={25} maxPolarAngle={Math.PI / 2 - 0.05} />

      {/* Sàn hành lang chung */}
      <Plane rotation={[-Math.PI / 2, 0, 0]} args={[50, 50]} receiveShadow>
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </Plane>
      <ContactShadows position={[0, 0.01, 0]} opacity={0.6} scale={20} blur={2.5} far={4} />

      {/* --- CẤU TRÚC 4 PHÒNG RIÊNG BIỆT (PRIVATE OFFICES) --- */}
      
      {/* 1. Phòng Giám Đốc (Góc trên Màn hình) */}
      <PrivateOfficeRoom 
        position={[-3.2, 0, -3.2]} 
        roomName="Phòng Giám Đốc (CEO)" 
        color="#3b82f6" 
        agentProps={{ color: "#3b82f6", name: "Đại Hoàng", role: "CEO", isWorking: activeAgent === "1", avatar: "/max.png" }}
      />

      {/* 2. Phòng Kế Toán (Góc trên Phải) */}
      <PrivateOfficeRoom 
        position={[3.2, 0, -3.2]} 
        roomName="Phòng Kế Toán trưởng" 
        color="#ec4899" 
        agentProps={{ color: "#ec4899", name: "Anna", role: "Tài chính", isWorking: activeAgent === "4", avatar: "/anna.png" }}
      />

      {/* 3. Phòng Lập Trình (Góc dưới Trái) */}
      <PrivateOfficeRoom 
        position={[-3.2, 0, 3.2]} 
        roomName="Phòng Code" 
        color="#10b981" 
        agentProps={{ color: "#10b981", name: "Dev Agent", role: "Lập trình viên", isWorking: activeAgent === "2", avatar: "/sophia.png" }}
      />

      {/* 4. Phòng QA (Góc dưới Phải) */}
      <PrivateOfficeRoom 
        position={[3.2, 0, 3.2]} 
        roomName="Phòng Kiểm Định" 
        color="#f59e0b" 
        agentProps={{ color: "#f59e0b", name: "QA Agent", role: "Kiểm tra chất lượng", isWorking: activeAgent === "3", avatar: "/max.png" }}
      />
      </Suspense>
    </Canvas>
  );
}
