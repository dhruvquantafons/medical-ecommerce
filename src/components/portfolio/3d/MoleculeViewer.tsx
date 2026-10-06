"use client";

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

interface MoleculeViewerProps {
  formula: string;
  primaryColor?: string;
}

function MolecularNodes({ color = '#8b5cf6' }: { color?: string }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  const nodes: { pos: [number, number, number]; color: string; size: number }[] = [
    { pos: [0, 1, 0],     color: '#ef4444', size: 0.35 },
    { pos: [-0.8, 0.5, 0], color: '#3b82f6', size: 0.32 },
    { pos: [0.8, 0.5, 0],  color: '#64748b', size: 0.28 },
    { pos: [-0.8, -0.5, 0],color: '#64748b', size: 0.28 },
    { pos: [0.8, -0.5, 0], color: '#64748b', size: 0.28 },
    { pos: [0, -1, 0],     color: '#e2e8f0', size: 0.22 },
    { pos: [0, 0, 0.6],    color: color,     size: 0.4  },
  ];

  const bonds = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[6,0],[6,1],[6,2]];

  return (
    <group ref={groupRef}>
      {bonds.map(([si, ei], i) => {
        const start = new THREE.Vector3(...nodes[si].pos);
        const end   = new THREE.Vector3(...nodes[ei].pos);
        const mid   = start.clone().add(end).multiplyScalar(0.5);
        const len   = start.distanceTo(end);
        return (
          <mesh key={`bond-${i}`} position={mid}>
            <cylinderGeometry args={[0.04, 0.04, len, 12]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.3} metalness={0.5} />
          </mesh>
        );
      })}
      {nodes.map((node, i) => (
        <mesh key={`node-${i}`} position={node.pos}>
          <sphereGeometry args={[node.size, 32, 32]} />
          <meshPhysicalMaterial
            color={node.color}
            roughness={0.2}
            metalness={0.2}
            clearcoat={0.8}
            emissive={node.color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export function MoleculeViewer({ primaryColor = '#8b5cf6' }: MoleculeViewerProps) {
  return (
    <div style={{ width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={1.0} />
        <directionalLight position={[3, 5, 4]} intensity={1.8} />
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5}>
            <MolecularNodes color={primaryColor} />
          </Float>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
