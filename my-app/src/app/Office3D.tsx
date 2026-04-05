"use client";
import React, { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Box, Plane, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

// =========================================================
// KIẾN TRÚC MẢNG XANH VÀ CỘT TRỤ (SÁNG SỦA HIỆN ĐẠI)
// =========================================================
function IndoorPlant({ position }: any) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.3, 0.8, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} /> {/* Chậu trắng sứ */}
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      <mesh position={[0, 2, 0]} castShadow>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="#22c55e" roughness={0.8} />
      </mesh>
    </group>
  );
}

function ArchitectPillar({ position }: any) {
  return (
    <group position={position}>
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 10, 32]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} /> {/* Trụ bê tông tròn trắng sữa */}
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[1.4, 1.4, 0.4, 32]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
    </group>
  );
}

function PlanterBox({ position, rotation }: any) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[6, 0.8, 1]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} /> {/* Bồn cây trắng viền gỗ */}
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[5.8, 0.1, 0.8]} />
        <meshStandardMaterial color="#3f2e22" roughness={0.9} /> {/* Đất */}
      </mesh>
      {[-2, -1, 0, 1, 2].map((x, i) => (
        <mesh key={i} position={[x, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#16a34a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function ReceptionWall() {
  return (
    <group position={[0, 0, -32]}>
      <mesh position={[0, 5, 0]} receiveShadow>
        <boxGeometry args={[40, 10, 1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
      </mesh>
      <Html position={[0, 6, 0.51]} center zIndexRange={[100, 0]} transform>
         <div className="bg-transparent text-center scale-[2]">
            <h1 className="text-5xl font-black text-gray-800 tracking-[0.2em] drop-shadow-md">
              HOANG KIM <span className="text-blue-600">CORP</span>
            </h1>
            <p className="text-gray-500 text-sm tracking-[0.5em] mt-3 uppercase font-semibold">
              The AI Tech Giant
            </p>
         </div>
      </Html>
    </group>
  );
}

// =========================================================
// VẬT DỤNG VĂN PHÒNG CHUẨN
// =========================================================
function ModernDesk({ position, rotation, partitionColor }: any) {
  return (
    <group position={position} rotation={rotation}>
      <Box args={[1.6, 0.05, 0.8]} position={[0, 0.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f8fafc" roughness={0.1} /> {/* Mặt bàn trắng nhám */}
      </Box>
      <Box args={[0.05, 0.75, 0.6]} position={[-0.7, 0.375, 0]} castShadow><meshStandardMaterial color="#94a3b8" /></Box>
      <Box args={[0.05, 0.75, 0.6]} position={[0.7, 0.375, 0]} castShadow><meshStandardMaterial color="#94a3b8" /></Box>
      {/* Vách ngăn thấp */}
      <Box args={[1.5, 0.4, 0.05]} position={[0, 0.95, -0.38]}>
        <meshStandardMaterial color={partitionColor} roughness={0.4} />
      </Box>
      {/* Màn hình */}
      <Box args={[0.6, 0.35, 0.02]} position={[0, 0.95, -0.1]} rotation={[-0.1, 0, 0]} castShadow>
        <meshStandardMaterial color="#1e293b" />
      </Box>
      <Box args={[0.1, 0.1, 0.1]} position={[0, 0.8, -0.15]}><meshStandardMaterial color="#cbd5e1" /></Box>
    </group>
  );
}

function OfficeChair({ position, rotation }: any) {
  return (
    <group position={position} rotation={rotation}>
      <Box args={[0.5, 0.1, 0.5]} position={[0, 0.45, 0]} castShadow><meshStandardMaterial color="#334155" /></Box>
      <Box args={[0.45, 0.6, 0.05]} position={[0, 0.75, 0.22]} castShadow><meshStandardMaterial color="#1e293b" /></Box>
      <Box args={[0.05, 0.4, 0.05]} position={[0, 0.2, 0]} castShadow><meshStandardMaterial color="#94a3b8" /></Box>
      <Box args={[0.4, 0.05, 0.05]} position={[0, 0.025, 0]}><meshStandardMaterial color="#475569" /></Box>
      <Box args={[0.05, 0.05, 0.4]} position={[0, 0.025, 0]}><meshStandardMaterial color="#475569" /></Box>
    </group>
  );
}

function AgentCharacter({ position, name, role, isWorking, avatar, color }: any) {
  const groupRef = useRef<THREE.Group>(null!);
  const leftArmGroupRef = useRef<THREE.Group>(null!);
  const rightArmGroupRef = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Mesh>(null!);

  // Phân bổ màu sắc ngẫu nhiên nhưng cố định cho từng nhân viên (để trông giống công ty thật đang mặc đồ tự do)
  const randomSeed = name.charCodeAt(name.length - 1) + name.length;
  const shirtColors = ["#1e3a8a", "#047857", "#92400e", "#b91c1c", "#475569", "#7c3aed"];
  const shirtColor = shirtColors[randomSeed % shirtColors.length];
  const pantsColor = randomSeed % 2 === 0 ? "#1e40af" : "#27272a"; // Quần jean hoặc quần âu đen
  const skinColor = "#fcd34d";

  useFrame((state) => {
    if (!groupRef.current || !leftArmGroupRef.current || !rightArmGroupRef.current || !headRef.current) return;
    const t = state.clock.elapsedTime;
    const offset = position[0] + position[2]; // Lệch pha hoạt ảnh cho từng người

    if (isWorking) {
      // Trạng thái Bận rộn: Gõ phím liên tục, nảy lên trên ghế
      leftArmGroupRef.current.rotation.x = Math.sin(t * 20 + offset) * 0.4 - 0.5;
      rightArmGroupRef.current.rotation.x = Math.sin(t * 20 + offset + Math.PI) * 0.4 - 0.5;
      
      headRef.current.rotation.x = Math.sin(t * 4 + offset) * 0.1;
      
      groupRef.current.position.y = 0.45 + Math.sin(t * 10 + offset) * 0.05;
      groupRef.current.position.z = Math.sin(t * 5 + offset) * 0.02; // Chồm tới chồm lui xíu
    } else {
      // Trạng thái Nghỉ: Thở nhẹ nhàng, đưa tay về phía trước bàn
      groupRef.current.position.y = 0.4 + Math.sin(t * 2 + offset) * 0.02;
      groupRef.current.position.z = 0;
      
      leftArmGroupRef.current.rotation.x = -0.3; // Đặt tay lên bàn thư giãn
      rightArmGroupRef.current.rotation.x = -0.3;
      
      headRef.current.rotation.x = Math.sin(t + offset) * 0.05;
    }
  });

  return (
    <group position={position}>
      {/* 3D HUMANOID FIGURE */}
      <group ref={groupRef} position={[0, 0.4, 0]}>
        
        {/* Torso (Thân) */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.25, 0.35, 0.15]} />
          {/* Khi isWorking = true -> Đột biến sáng rực lên theo màu phòng ban! */}
          <meshStandardMaterial 
            color={isWorking ? color : shirtColor} 
            emissive={isWorking ? color : "#000000"} 
            emissiveIntensity={isWorking ? 0.6 : 0} 
          />
        </mesh>
        
        {/* Head (Đầu) */}
        <mesh ref={headRef} position={[0, 0.45, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.4} />
          {/* Mắt (Trang trí thêm cho sinh động) */}
          <mesh position={[-0.04, 0.02, -0.11]}><boxGeometry args={[0.02, 0.02, 0.02]} /><meshBasicMaterial color="#000" /></mesh>
          <mesh position={[0.04, 0.02, -0.11]}><boxGeometry args={[0.02, 0.02, 0.02]} /><meshBasicMaterial color="#000" /></mesh>
        </mesh>

        {/* Left Arm (Cánh tay trái - Pivot tại vai) */}
        <group ref={leftArmGroupRef} position={[-0.18, 0.35, 0]}>
          <mesh position={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[0.07, 0.3, 0.07]} />
            <meshStandardMaterial color={isWorking ? color : shirtColor} emissive={isWorking ? color : "#000000"} emissiveIntensity={isWorking ? 0.6 : 0}/>
          </mesh>
        </group>

        {/* Right Arm (Cánh tay phải - Pivot tại vai) */}
        <group ref={rightArmGroupRef} position={[0.18, 0.35, 0]}>
          <mesh position={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[0.07, 0.3, 0.07]} />
            <meshStandardMaterial color={isWorking ? color : shirtColor} emissive={isWorking ? color : "#000000"} emissiveIntensity={isWorking ? 0.6 : 0}/>
          </mesh>
        </group>

        {/* Left Leg (Chân trái - Tư thế đang ngồi ghế) */}
        <group position={[-0.08, 0.0, 0]}>
          {/* Đùi (Bends backward relative to character facing, `-Z` is front of char) */}
          <mesh position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <boxGeometry args={[0.09, 0.35, 0.09]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          {/* Cẳng chân đi xuống */}
          <mesh position={[0, -0.15, -0.3]} castShadow>
            <boxGeometry args={[0.09, 0.35, 0.09]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
        </group>

        {/* Right Leg (Chân phải - Tư thế đang ngồi ghế) */}
        <group position={[0.08, 0.0, 0]}>
           {/* Đùi */}
           <mesh position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <boxGeometry args={[0.09, 0.35, 0.09]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          {/* Cẳng chân đi xuống */}
          <mesh position={[0, -0.15, -0.3]} castShadow>
            <boxGeometry args={[0.09, 0.35, 0.09]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
        </group>

      </group>

      {/* HTML Nhãn Tên */}
      <Html position={[0, isWorking ? 2.5 : 1.2, 0]} center zIndexRange={[100, 0]}>
        {/* Tối ưu UI: CHỈ hiện Bảng Nhãn Tên To khi isWorking = true. Nếu false, chỉ hiện Avatar nhỏ xíu để đỡ vướng màn hình */}
        <div className={`transition-all duration-500 ease-in-out ${isWorking ? 'scale-125 opacity-100 flex flex-col items-center animate-bounce' : 'scale-50 opacity-0 hidden'}`}>
           <div className={`relative rounded-full p-0.5 bg-white shadow-[0_0_20px_rgba(0,0,0,0.2)]`}>
             <img src={avatar} className="w-12 h-12 border-2 rounded-full border-white object-cover" alt={name} />
           </div>
           <div className="mt-2 bg-white/95 backdrop-blur shadow-xl px-3 py-1.5 rounded-full border border-gray-200 flex flex-col items-center whitespace-nowrap min-w-[120px]">
             <span className="text-gray-900 text-[11px] font-bold">{name}</span>
             <span style={{color: color}} className="text-[9px] font-black uppercase mt-0.5 tracking-wider">{role}</span>
           </div>
        </div>

        {/* Trạng thái tắt làm việc: Chấm Avatar bé xíu */}
        <div className={`transition-all duration-500 ease-in-out ${!isWorking ? 'opacity-60 hover:opacity-100 cursor-pointer' : 'opacity-0 hidden'}`}>
          <img src={avatar} className="w-6 h-6 rounded-full border-2 border-white/50 object-cover grayscale brightness-125" alt="Inactive" />
        </div>
      </Html>
    </group>
  );
}

function DeskCluster({ startX, startZ, count, layoutCols, departmentName, rolePrefix, color, activeId, activeAgent }: any) {
  const avatars = ['/anna.png', '/sophia.png', '/max.png'];
  const isWorking = activeAgent === activeId;
  const desks = [];

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / layoutCols);
    const col = i % layoutCols;
    
    // Nới rộng khoảng cách giữa các bàn ra để không bị ngộp thở
    const x = startX + col * 2.2;
    const z = startZ + row * 3.0;

    const rotationY = row % 2 === 0 ? 0 : Math.PI;
    const adjustedZ = row % 2 === 0 ? z : z + 1.2;

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

function DepartmentRoom({ startX, startZ, count, layoutCols, departmentName, rolePrefix, color, activeId, activeAgent }: any) {
  // Diện tích mảng khối lớn hơn nhiều
  const roomWidth = layoutCols * 2.2 + 2;
  const roomDepth = Math.ceil(count/layoutCols) * 3.0 + 2;
  
  const centerX = startX + (layoutCols*2.2)/2 - 1.1;
  const centerZ = startZ + (Math.ceil(count/layoutCols)*3.0)/2 - 1.0;

  const isWorking = activeAgent === activeId;

  return (
    <group>
      {/* Thảm sàn riêng của từng phòng chứa */}
      <Plane args={[roomWidth, roomDepth]} position={[centerX, 0.01, centerZ]} rotation={[-Math.PI/2, 0, 0]}>
        <meshStandardMaterial color={isWorking ? color : "#ffffff"} transparent opacity={isWorking ? 0.2 : 0.8} />
      </Plane>
      
      {/* Vách ngăn VĂN PHÒNG (Nửa gỗ trắng nửa kính) xung quanh */}
      <Box args={[roomWidth, 0.8, 0.2]} position={[centerX, 0.4, centerZ + roomDepth/2]}>
        <meshStandardMaterial color="#f8fafc" />
      </Box>
      <Box args={[roomWidth, 1.2, 0.1]} position={[centerX, 1.4, centerZ + roomDepth/2]}>
        <meshPhysicalMaterial transmission={0.9} roughness={0.1} transparent opacity={0.3} color="#ffffff" />
      </Box>

      <Box args={[roomWidth, 0.8, 0.2]} position={[centerX, 0.4, centerZ - roomDepth/2]}>
        <meshStandardMaterial color="#f8fafc" />
      </Box>
      <Box args={[roomWidth, 1.2, 0.1]} position={[centerX, 1.4, centerZ - roomDepth/2]}>
        <meshPhysicalMaterial transmission={0.9} roughness={0.1} transparent opacity={0.3} color="#ffffff" />
      </Box>

      <Box args={[0.2, 0.8, roomDepth]} position={[centerX - roomWidth/2, 0.4, centerZ]}>
        <meshStandardMaterial color="#f8fafc" />
      </Box>
      <Box args={[0.1, 1.2, roomDepth]} position={[centerX - roomWidth/2, 1.4, centerZ]}>
        <meshPhysicalMaterial transmission={0.9} roughness={0.1} transparent opacity={0.3} color="#ffffff" />
      </Box>

      <Box args={[0.2, 0.8, roomDepth]} position={[centerX + roomWidth/2, 0.4, centerZ]}>
        <meshStandardMaterial color="#f8fafc" />
      </Box>
      <Box args={[0.1, 1.2, roomDepth]} position={[centerX + roomWidth/2, 1.4, centerZ]}>
        <meshPhysicalMaterial transmission={0.9} roughness={0.1} transparent opacity={0.3} color="#ffffff" />
      </Box>

      {/* Bảng Tên Phòng Ban (Thiết kế thanh lịch) */}
      <Html position={[centerX, 3.5, centerZ]} center zIndexRange={[100, 0]}>
        <div style={{borderColor: color}} className={`transition-all duration-700 px-6 py-2 bg-white/95 backdrop-blur-md rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] border-t-4 text-center pointer-events-none ${isWorking ? 'scale-125' : 'scale-100 opacity-90'}`}>
          <h3 style={{color: color}} className="text-sm font-black uppercase tracking-widest">{departmentName}</h3>
          <p className="text-gray-500 text-[11px] font-medium">{count} Chuyên viên</p>
        </div>
      </Html>

      <DeskCluster 
        startX={startX} startZ={startZ} count={count} layoutCols={layoutCols} 
        departmentName={departmentName} rolePrefix={rolePrefix} color={color} 
        activeId={activeId} activeAgent={activeAgent} 
      />
    </group>
  );
}

// =========================================================
// MAIN ENVIRONMENT: TOÀ NHÀ CÔNG SỞ TRẮNG SÁNG & RỘNG LỚN
// =========================================================
interface Office3DProps {
  activeAgent: string | null;
}

export default function Office3D({ activeAgent }: Office3DProps) {
  return (
    <Canvas shadows camera={{ position: [0, 40, 50], fov: 45 }}>
      {/* Bầu trời buổi sáng mát mẻ */}
      <color attach="background" args={["#e0f2fe"]} /> 
      <fog attach="fog" args={["#e0f2fe", 60, 150]} />

      <Suspense fallback={<Html center><div className="px-6 py-3 bg-white rounded-xl shadow-2xl font-bold text-blue-600 border border-blue-100">Loading Silicon Valley Campus...</div></Html>}>
        
        <ambientLight intensity={1.2} />
        <hemisphereLight intensity={0.6} color="#ffffff" groundColor="#f8fafc" />
        <directionalLight 
          position={[30, 50, -20]} 
          castShadow 
          intensity={1.5}
          color="#ffffff"
          shadow-mapSize={[4096, 4096]}
          shadow-camera-left={-40}
          shadow-camera-right={40}
          shadow-camera-top={40}
          shadow-camera-bottom={-40}
        />

        <OrbitControls 
          enableDamping 
          minPolarAngle={Math.PI / 6} 
          maxPolarAngle={Math.PI / 2 - 0.05}
          maxDistance={90}
          target={[0, 0, 0]}
        />

        {/* Lát sàn Gỗ vân sáng Khổng lổ cho toàn cty */}
        <Plane args={[120, 100]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
          <meshStandardMaterial color="#fffbeb" roughness={0.7} metalness={0.1} /> 
        </Plane>
        
        {/* Lưới phân định sàn tinh tế thay vì TRON màu tối */}
        <gridHelper args={[120, 60, "#d6d3d1", "#f5f5f4"]} position={[0, 0, 0]} />

        <ContactShadows position={[0, 0, 0]} opacity={0.2} scale={80} blur={2.5} far={10} />

        {/* ======================================================
            TƯỜNG KÍNH BAO NGOÀI TOÀ NHÀ (OUTER GLASS BUILDING)
        ====================================================== */}
        {/* Front & Back */}
        <Box args={[116, 12, 0.4]} position={[0, 6, -48]}><meshPhysicalMaterial transmission={0.9} opacity={0.2} transparent color="#e0f2fe" roughness={0.1}/></Box>
        <Box args={[116, 12, 0.4]} position={[0, 6, 48]}><meshPhysicalMaterial transmission={0.9} opacity={0.2} transparent color="#e0f2fe" roughness={0.1}/></Box>
        {/* Left & Right */}
        <Box args={[0.4, 12, 96]} position={[-58, 6, 0]}><meshPhysicalMaterial transmission={0.9} opacity={0.2} transparent color="#e0f2fe" roughness={0.1}/></Box>
        <Box args={[0.4, 12, 96]} position={[58, 6, 0]}><meshPhysicalMaterial transmission={0.9} opacity={0.2} transparent color="#e0f2fe" roughness={0.1}/></Box>

        {/* ======================================================
            TƯỜNG KIẾN TRÚC VÀ CỘT TRỤ BÊN TRONG
        ====================================================== */}
        <ReceptionWall />
        
        {/* Hàng Cột Khổng Lồ Giữa Khuôn Viên */}
        <ArchitectPillar position={[-20, 0, -15]} />
        <ArchitectPillar position={[20, 0, -15]} />
        <ArchitectPillar position={[-20, 0, 15]} />
        <ArchitectPillar position={[20, 0, 15]} />

        {/* ======================================================
            MẢNG XANH - ĐƯỢC PHÂN BỔ TRẢI RỘNG KHẮP NƠI
        ====================================================== */}
        <IndoorPlant position={[-30, 0, -25]} />
        <IndoorPlant position={[30, 0, -25]} />
        <IndoorPlant position={[-30, 0, 25]} />
        <IndoorPlant position={[30, 0, 25]} />
        <IndoorPlant position={[-10, 0, -5]} />
        <IndoorPlant position={[10, 0, -5]} />

        <PlanterBox position={[-15, 0, 0]} rotation={[0, 0, 0]} />
        <PlanterBox position={[15, 0, 0]} rotation={[0, 0, 0]} />
        <PlanterBox position={[0, 0, 10]} rotation={[0, Math.PI/2, 0]} />

        {/* =====================================================
            6 KHỐI PHÒNG BAN ĐƯỢC GIÃN CÁCH TUYỆT ĐỐI (TRÁNH NGỘP)
        ===================================================== */}
        
        {/* 1. Ban Giám Đốc */}
        <DepartmentRoom 
          startX={-4} startZ={-25} count={4} layoutCols={4} 
          departmentName="C-Level Board" rolePrefix="Chief" color="#2563eb" activeId="ceo" activeAgent={activeAgent} 
        />

        {/* 2. Khối Product & Design */}
        <DepartmentRoom 
          startX={-35} startZ={-15} count={8} layoutCols={4} 
          departmentName="Product & UX/UI" rolePrefix="PM/Designer" color="#7c3aed" activeId="pm" activeAgent={activeAgent} 
        />

        {/* 3. Khối Frontend */}
        <DepartmentRoom 
          startX={-5} startZ={-15} count={12} layoutCols={6} 
          departmentName="Frontend Web/App" rolePrefix="FE Dev" color="#db2777" activeId="frontend" activeAgent={activeAgent} 
        />

        {/* 4. Khối Backend & Systems */}
        <DepartmentRoom 
          startX={25} startZ={-15} count={15} layoutCols={5} 
          departmentName="Backend & DevOps" rolePrefix="System Eng" color="#059669" activeId="backend" activeAgent={activeAgent} 
        />

        {/* 5. Khối QA & Security */}
        <DepartmentRoom 
          startX={-20} startZ={10} count={8} layoutCols={4} 
          departmentName="QA & Security" rolePrefix="Pentester/QA" color="#d97706" activeId="qa" activeAgent={activeAgent} 
        />

        {/* 6. Khối Business Ops */}
        <DepartmentRoom 
          startX={10} startZ={10} count={5} layoutCols={5} 
          departmentName="Finance & HR" rolePrefix="Specialist" color="#0284c7" activeId="accountant" activeAgent={activeAgent} 
        />

      </Suspense>
    </Canvas>
  );
}
