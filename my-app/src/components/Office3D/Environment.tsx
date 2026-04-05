import React from "react";
import { Html } from "@react-three/drei";

export const IndoorPlant = React.memo(({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.3, 0.8, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
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
});

export const ArchitectPillar = React.memo(({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      <mesh position={[0, 5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 10, 32]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[1.4, 1.4, 0.4, 32]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
    </group>
  );
});

export const PlanterBox = React.memo(({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[6, 0.8, 1]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[5.8, 0.1, 0.8]} />
        <meshStandardMaterial color="#3f2e22" roughness={0.9} />
      </mesh>
      {[-2, -1, 0, 1, 2].map((x, i) => (
        <mesh key={i} position={[x, 1.2, 0]} castShadow>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#16a34a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
});

export const ReceptionWall = React.memo(() => {
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
});
