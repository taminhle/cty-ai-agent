import React from "react";
import { Html, Box, Plane } from "@react-three/drei";
import { BaseDepartmentProps } from "../../types";
import { ModernDesk, OfficeChair } from "./Furniture";
import { AgentCharacter } from "./AgentCharacter";

const DeskCluster = React.memo(({ startX, startZ, count, layoutCols, departmentName, rolePrefix, color, activeId, activeAgent }: BaseDepartmentProps) => {
  const avatars = ['/anna.png', '/sophia.png', '/max.png'];
  const isWorking = activeAgent === activeId;
  const desks = [];

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / layoutCols);
    const col = i % layoutCols;
    
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
});

export const DepartmentRoom = React.memo((props: BaseDepartmentProps) => {
  const { startX, startZ, count, layoutCols, departmentName, color, activeId, activeAgent } = props;
  
  const roomWidth = layoutCols * 2.2 + 2;
  const roomDepth = Math.ceil(count/layoutCols) * 3.0 + 2;
  
  const centerX = startX + (layoutCols*2.2)/2 - 1.1;
  const centerZ = startZ + (Math.ceil(count/layoutCols)*3.0)/2 - 1.0;

  const isWorking = activeAgent === activeId;

  return (
    <group>
      <Plane args={[roomWidth, roomDepth]} position={[centerX, 0.01, centerZ]} rotation={[-Math.PI/2, 0, 0]}>
        <meshStandardMaterial color={isWorking ? color : "#ffffff"} transparent opacity={isWorking ? 0.2 : 0.8} />
      </Plane>
      
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

      <Html position={[centerX, 3.5, centerZ]} center zIndexRange={[100, 0]}>
        <div style={{borderColor: color}} className={`transition-all duration-700 px-6 py-2 bg-white/95 backdrop-blur-md rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] border-t-4 text-center pointer-events-none ${isWorking ? 'scale-125' : 'scale-100 opacity-90'}`}>
          <h3 style={{color: color}} className="text-sm font-black uppercase tracking-widest">{departmentName}</h3>
          <p className="text-gray-500 text-[11px] font-medium">{count} Chuyên viên</p>
        </div>
      </Html>

      <DeskCluster {...props} />
    </group>
  );
});
