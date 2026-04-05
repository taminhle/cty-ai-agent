"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface VirtualAssistant3DProps {
  isSpeaking: boolean;
  color: string;
}

function AssistantModel({ isSpeaking, color }: VirtualAssistant3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current || !leftArmRef.current || !rightArmRef.current || !headRef.current) return;
    
    // Nhịp thở mặc định (Float up and down gently)
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05 - 1;

    if (isSpeaking) {
      // Cử chỉ khi nói chuyện: Vẫy tay và gật đầu
      leftArmRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 10) * 0.5 + 2.5;
      rightArmRef.current.rotation.z = -Math.sin(state.clock.elapsedTime * 10) * 0.5 - 2.5;
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 8) * 0.2;
    } else {
      // Trở về tư thế nghỉ ngơi từ từ
      leftArmRef.current.rotation.z = THREE.MathUtils.lerp(leftArmRef.current.rotation.z, 0.5, 0.1);
      rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, -0.5, 0.1);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      {/* Đầu (Head) */}
      <mesh ref={headRef} position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
        {/* Mắt trái */}
        <mesh position={[-0.2, 0.1, 0.5]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="white" />
          <mesh position={[0, 0, 0.08]}><sphereGeometry args={[0.04]}/><meshBasicMaterial color="black"/></mesh>
        </mesh>
        {/* Mắt phải */}
        <mesh position={[0.2, 0.1, 0.5]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="white" />
          <mesh position={[0, 0, 0.08]}><sphereGeometry args={[0.04]}/><meshBasicMaterial color="black"/></mesh>
        </mesh>
      </mesh>

      {/* Thân mình (Body) */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.6, 1.5, 32]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>

      {/* Tay Trái (Left Arm) */}
      <mesh ref={leftArmRef} position={[-0.8, 1, 0]}>
        {/* Dịch chuyển điểm xoay lên đầu cánh tay */}
        <cylinderGeometry args={[0.15, 0.15, 1, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Tay Phải (Right Arm) */}
      <mesh ref={rightArmRef} position={[0.8, 1, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export default function VirtualAssistant3D({ isSpeaking, color }: VirtualAssistant3DProps) {
  return (
    <div className="w-full h-full absolute inset-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 5, 2]} intensity={1.5} />
        <AssistantModel isSpeaking={isSpeaking} color={color} />
      </Canvas>
    </div>
  );
}
