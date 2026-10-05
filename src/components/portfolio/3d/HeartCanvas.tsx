"use client";

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function getEcgY(phase: number): number {
  const p = ((phase % 1) + 1) % 1;
  if (p >= 0.12 && p < 0.22) {
    const norm = (p - 0.12) / 0.1;
    return Math.sin(norm * Math.PI) * 0.38;
  } else if (p >= 0.28 && p < 0.32) {
    const norm = (p - 0.28) / 0.04;
    return -Math.sin(norm * Math.PI) * 0.28;
  } else if (p >= 0.32 && p < 0.40) {
    const norm = (p - 0.32) / 0.08;
    return Math.sin(norm * Math.PI) * 1.95;
  } else if (p >= 0.40 && p < 0.44) {
    const norm = (p - 0.40) / 0.04;
    return -Math.sin(norm * Math.PI) * 0.52;
  } else if (p >= 0.52 && p < 0.70) {
    const norm = (p - 0.52) / 0.18;
    return Math.sin(norm * Math.PI) * 0.58;
  }
  return 0;
}

function SingleThemeSignalLine() {
  const lineRef = useRef<THREE.Line>(null!);
  const pulseRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  const pointsCount = 420;
  const xSpan = 9.2;

  const geometry = useMemo(() => {
    const pos = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);
    const cStart = new THREE.Color('#9333ea');
    const cMid = new THREE.Color('#7c3aed');
    const cPeak = new THREE.Color('#4f46e5');

    for (let i = 0; i < pointsCount; i++) {
      const xNorm = i / (pointsCount - 1);
      const x = (xNorm - 0.5) * xSpan;
      pos[i * 3] = x;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
      const color = new THREE.Color();
      if (xNorm < 0.5) color.lerpColors(cStart, cMid, xNorm * 2);
      else color.lerpColors(cMid, cPeak, (xNorm - 0.5) * 2);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geom;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const frequency = 0.85;

    if (lineRef.current) {
      const posArray = lineRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < pointsCount; i++) {
        const xNorm = i / pointsCount;
        const phase = xNorm * 2.8 - time * frequency;
        posArray[i * 3 + 1] = getEcgY(phase);
      }
      lineRef.current.geometry.attributes.position.needsUpdate = true;
    }

    const travelProgress = (time * frequency * 0.35) % 1;
    const pulseX = (travelProgress - 0.5) * xSpan;
    const pulsePhase = travelProgress * 2.8 - time * frequency;
    const pulseY = getEcgY(pulsePhase);

    if (pulseRef.current) {
      pulseRef.current.position.set(pulseX, pulseY, 0.05);
      pulseRef.current.scale.setScalar(Math.abs(pulseY) > 0.8 ? 1.7 : 1.0);
    }

    if (groupRef.current) {
      const { x, y } = state.pointer;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, x * 0.2, 0.05);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -y * 0.15, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      {/* @ts-expect-error react-three-fiber JSX line element */}
      <line ref={lineRef} geometry={geometry}>
        <lineBasicMaterial vertexColors transparent opacity={0.95} linewidth={3} />
      </line>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={2.5} roughness={0.1} />
      </mesh>
    </group>
  );
}

export function HeartCanvas() {
  return (
    <div
      className="glass-panel"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '420px',
        position: 'relative',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%)',
        border: '1px solid rgba(226,232,240,0.9)',
        boxShadow: '0 10px 30px rgba(99,102,241,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Canvas camera={{ position: [0, 0, 5.8], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={2.0} />
        <directionalLight position={[0, 5, 5]} intensity={2.5} color="#ffffff" />
        <pointLight position={[0, 0, 4]} intensity={2.0} color="#7c3aed" />
        <SingleThemeSignalLine />
      </Canvas>
    </div>
  );
}
