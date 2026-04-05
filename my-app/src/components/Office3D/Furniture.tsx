import React from "react";
import { Box } from "@react-three/drei";
import { FurnitureProps } from "../../types";

export const ModernDesk = React.memo(({ position, rotation, partitionColor }: FurnitureProps) => {
  return (
    <group position={position} rotation={rotation}>
      <Box args={[1.6, 0.05, 0.8]} position={[0, 0.75, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#f8fafc" roughness={0.1} />
      </Box>
      <Box args={[0.05, 0.75, 0.6]} position={[-0.7, 0.375, 0]} castShadow><meshStandardMaterial color="#94a3b8" /></Box>
      <Box args={[0.05, 0.75, 0.6]} position={[0.7, 0.375, 0]} castShadow><meshStandardMaterial color="#94a3b8" /></Box>
      <Box args={[1.5, 0.4, 0.05]} position={[0, 0.95, -0.38]}>
        <meshStandardMaterial color={partitionColor || "#cbd5e1"} roughness={0.4} />
      </Box>
      <Box args={[0.6, 0.35, 0.02]} position={[0, 0.95, -0.1]} rotation={[-0.1, 0, 0]} castShadow>
        <meshStandardMaterial color="#1e293b" />
      </Box>
      <Box args={[0.1, 0.1, 0.1]} position={[0, 0.8, -0.15]}><meshStandardMaterial color="#cbd5e1" /></Box>
    </group>
  );
});

export const OfficeChair = React.memo(({ position, rotation }: FurnitureProps) => {
  return (
    <group position={position} rotation={rotation}>
      <Box args={[0.5, 0.1, 0.5]} position={[0, 0.45, 0]} castShadow><meshStandardMaterial color="#334155" /></Box>
      <Box args={[0.45, 0.6, 0.05]} position={[0, 0.75, 0.22]} castShadow><meshStandardMaterial color="#1e293b" /></Box>
      <Box args={[0.05, 0.4, 0.05]} position={[0, 0.2, 0]} castShadow><meshStandardMaterial color="#94a3b8" /></Box>
      <Box args={[0.4, 0.05, 0.05]} position={[0, 0.025, 0]}><meshStandardMaterial color="#475569" /></Box>
      <Box args={[0.05, 0.05, 0.4]} position={[0, 0.025, 0]}><meshStandardMaterial color="#475569" /></Box>
    </group>
  );
});
