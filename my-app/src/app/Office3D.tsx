"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Plane, ContactShadows } from "@react-three/drei";
import { Box } from "@react-three/drei";
import { IndoorPlant, ArchitectPillar, PlanterBox, ReceptionWall } from "../components/Office3D/Environment";
import { DepartmentRoom } from "../components/Office3D/DepartmentRoom";

interface Office3DProps {
  activeAgent: string | null;
}

export default function Office3D({ activeAgent }: Office3DProps) {
  return (
    <Canvas shadows camera={{ position: [0, 40, 50], fov: 45 }}>
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
            6 KHỐI PHÒNG BAN ĐƯỢC GIÃN CÁCH TUYỆT ĐỐI
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
