import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { AgentProps } from "../../types";

export const AgentCharacter = React.memo(({ position, name, role, isWorking, avatar, color }: AgentProps) => {
  const groupRef = useRef<THREE.Group>(null!);
  const leftArmGroupRef = useRef<THREE.Group>(null!);
  const rightArmGroupRef = useRef<THREE.Group>(null!);
  const headRef = useRef<THREE.Mesh>(null!);

  const randomSeed = name.charCodeAt(name.length - 1) + name.length;
  const shirtColors = ["#1e3a8a", "#047857", "#92400e", "#b91c1c", "#475569", "#7c3aed"];
  const shirtColor = shirtColors[randomSeed % shirtColors.length];
  const pantsColor = randomSeed % 2 === 0 ? "#1e40af" : "#27272a"; 
  const skinColor = "#fcd34d";

  useFrame((state) => {
    if (!groupRef.current || !leftArmGroupRef.current || !rightArmGroupRef.current || !headRef.current) return;
    const t = state.clock.elapsedTime;
    const offset = position[0] + position[2]; 

    if (isWorking) {
      leftArmGroupRef.current.rotation.x = Math.sin(t * 20 + offset) * 0.4 - 0.5;
      rightArmGroupRef.current.rotation.x = Math.sin(t * 20 + offset + Math.PI) * 0.4 - 0.5;
      headRef.current.rotation.x = Math.sin(t * 4 + offset) * 0.1;
      groupRef.current.position.y = 0.45 + Math.sin(t * 10 + offset) * 0.05;
      groupRef.current.position.z = Math.sin(t * 5 + offset) * 0.02; 
    } else {
      groupRef.current.position.y = 0.4 + Math.sin(t * 2 + offset) * 0.02;
      groupRef.current.position.z = 0;
      leftArmGroupRef.current.rotation.x = -0.3; 
      rightArmGroupRef.current.rotation.x = -0.3;
      headRef.current.rotation.x = Math.sin(t + offset) * 0.05;
    }
  });

  return (
    <group position={position}>
      <group ref={groupRef} position={[0, 0.4, 0]}>
        
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[0.25, 0.35, 0.15]} />
          <meshStandardMaterial 
            color={isWorking ? color : shirtColor} 
            emissive={isWorking ? color : "#000000"} 
            emissiveIntensity={isWorking ? 0.6 : 0} 
          />
        </mesh>
        
        <mesh ref={headRef} position={[0, 0.45, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.4} />
          <mesh position={[-0.04, 0.02, -0.11]}><boxGeometry args={[0.02, 0.02, 0.02]} /><meshBasicMaterial color="#000" /></mesh>
          <mesh position={[0.04, 0.02, -0.11]}><boxGeometry args={[0.02, 0.02, 0.02]} /><meshBasicMaterial color="#000" /></mesh>
        </mesh>

        <group ref={leftArmGroupRef} position={[-0.18, 0.35, 0]}>
          <mesh position={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[0.07, 0.3, 0.07]} />
            <meshStandardMaterial color={isWorking ? color : shirtColor} emissive={isWorking ? color : "#000000"} emissiveIntensity={isWorking ? 0.6 : 0}/>
          </mesh>
        </group>

        <group ref={rightArmGroupRef} position={[0.18, 0.35, 0]}>
          <mesh position={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[0.07, 0.3, 0.07]} />
            <meshStandardMaterial color={isWorking ? color : shirtColor} emissive={isWorking ? color : "#000000"} emissiveIntensity={isWorking ? 0.6 : 0}/>
          </mesh>
        </group>

        <group position={[-0.08, 0.0, 0]}>
          <mesh position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <boxGeometry args={[0.09, 0.35, 0.09]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0, -0.15, -0.3]} castShadow>
            <boxGeometry args={[0.09, 0.35, 0.09]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
        </group>

        <group position={[0.08, 0.0, 0]}>
           <mesh position={[0, 0, -0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <boxGeometry args={[0.09, 0.35, 0.09]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
          <mesh position={[0, -0.15, -0.3]} castShadow>
            <boxGeometry args={[0.09, 0.35, 0.09]} />
            <meshStandardMaterial color={pantsColor} />
          </mesh>
        </group>
      </group>

      <Html position={[0, isWorking ? 2.5 : 1.2, 0]} center zIndexRange={[100, 0]}>
        <div className={`transition-all duration-500 ease-in-out ${isWorking ? 'scale-125 opacity-100 flex flex-col items-center animate-bounce' : 'scale-50 opacity-0 hidden'}`}>
           <div className={`relative rounded-full p-0.5 bg-white shadow-[0_0_20px_rgba(0,0,0,0.2)]`}>
             <img src={avatar} className="w-12 h-12 border-2 rounded-full border-white object-cover" alt={name} />
           </div>
           <div className="mt-2 bg-white/95 backdrop-blur shadow-xl px-3 py-1.5 rounded-full border border-gray-200 flex flex-col items-center whitespace-nowrap min-w-[120px]">
             <span className="text-gray-900 text-[11px] font-bold">{name}</span>
             <span style={{color: color}} className="text-[9px] font-black uppercase mt-0.5 tracking-wider">{role}</span>
           </div>
        </div>

        <div className={`transition-all duration-500 ease-in-out ${!isWorking ? 'opacity-60 hover:opacity-100 cursor-pointer' : 'opacity-0 hidden'}`}>
          <img src={avatar} className="w-6 h-6 rounded-full border-2 border-white/50 object-cover grayscale brightness-125" alt="Inactive" />
        </div>
      </Html>
    </group>
  );
});
