"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Grid } from "@react-three/drei";
import * as THREE from "three";

interface AgentCapsuleProps {
  id: string;
  position: [number, number, number];
  color: string;
  label: string;
  isActive: boolean;
}

function AgentCapsule({ position, color, label, isActive }: AgentCapsuleProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Nảy lên xuống nếu đang active
    if (isActive) {
      meshRef.current.position.y = position[1] + Math.abs(Math.sin(state.clock.elapsedTime * 8)) * 0.5;
      // Nhấp nháy nhẹ
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissive.setHex(isActive ? 0x444444 : 0x000000);
    } else {
      // Trở lại vị trí cũ trơn tru bằng lerp
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1], 0.1);
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissive.setHex(0x000000);
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* Khối con nhộng */}
      <mesh ref={meshRef} position={[0, position[1], 0]} castShadow>
        <capsuleGeometry args আমেরিক{[0.5, 1, 4, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Biển tên lơ lửng */}
      <Text
        position={[0, position[1] + 1.2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

interface AIFlowProps {
  activeAgent: string | null;
}

export default function AIFlow({ activeAgent }: AIFlowProps) {
  return (
    <div className="flex-1 w-full h-full">
      <Canvas shadows camera={{ position: [0, 4, 8], fov: 45 }}>
        {/* Ánh sáng */}
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        
        {/* Lưới sàn nhà văn phòng */}
        <Grid 
          infiniteGrid 
          fadeDistance={20} 
          sectionColor="#555" 
          cellColor="#333" 
          position={[0, 0, 0]} 
        />

        {/* Các nhân sự (Agents) */}
        <AgentCapsule 
          id="1" 
          position={[-3, 1, -2]} 
          color="#2563eb" 
          label="👨‍💼 CEO Agent" 
          isActive={activeAgent === "1"} 
        />
        <AgentCapsule 
          id="2" 
          position={[0, 1, 0]} 
          color="#10b981" 
          label="💻 Dev Agent" 
          isActive={activeAgent === "2"} 
        />
        <AgentCapsule 
          id="3" 
          position={[3, 1, -2]} 
          color="#f59e0b" 
          label="🕵️‍♂️ QA Agent" 
          isActive={activeAgent === "3"} 
        />

        {/* Điều khiển Camera */}
        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2 - 0.1} />
      </Canvas>
    </div>
  );
}
