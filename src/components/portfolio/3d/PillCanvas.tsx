"use client";

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, Environment } from '@react-three/drei';
import * as THREE from 'three';
import type { ThemeMode } from '../types/pharmacy';

interface PillCanvasProps {
  theme: ThemeMode;
  particleCount?: number;
}

function SplitPillCapsule({ theme }: { theme: ThemeMode }) {
  const pillGroupRef = useRef<THREE.Group>(null!);

  const capColor = useMemo(() => {
    if (theme === 'emerald') return '#059669';
    if (theme === 'beige') return '#d97706';
    return '#7c3aed';
  }, [theme]);

  const glowColor = useMemo(() => {
    if (theme === 'emerald') return '#34d399';
    if (theme === 'beige') return '#fbbf24';
    return '#c084fc';
  }, [theme]);

  useFrame((state) => {
    if (!pillGroupRef.current) return;
    const { x, y } = state.pointer;
    pillGroupRef.current.rotation.y = THREE.MathUtils.lerp(pillGroupRef.current.rotation.y, 0.45 + x * 0.5 + state.clock.elapsedTime * 0.2, 0.05);
    pillGroupRef.current.rotation.x = THREE.MathUtils.lerp(pillGroupRef.current.rotation.x, 0.35 - y * 0.4 + Math.sin(state.clock.elapsedTime * 0.4) * 0.1, 0.05);
    pillGroupRef.current.rotation.z = THREE.MathUtils.lerp(pillGroupRef.current.rotation.z, -0.35 + Math.sin(state.clock.elapsedTime * 0.3) * 0.08, 0.05);
  });

  return (
    <group ref={pillGroupRef} position={[0, 0.1, 0]} scale={1.2}>
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 1.0, 32]} />
        <meshPhysicalMaterial color={capColor} roughness={0.1} metalness={0.15} clearcoat={1.0} clearcoatRoughness={0.05} reflectivity={0.9} />
      </mesh>
      <mesh position={[0, 1.25, 0]}>
        <sphereGeometry args={[0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color={capColor} roughness={0.1} metalness={0.15} clearcoat={1.0} clearcoatRoughness={0.05} reflectivity={0.9} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.66, 0.66, 0.42, 32]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={3.0} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.65, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[0.7, 0.7, 1.0, 32]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.05} clearcoat={1.0} clearcoatRoughness={0.02} />
      </mesh>
      <mesh position={[0, -1.15, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.7, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.05} metalness={0.05} clearcoat={1.0} clearcoatRoughness={0.02} />
      </mesh>
    </group>
  );
}

function SaltParticleEmitter({ theme, particleCount = 180, isEmitting }: { theme: ThemeMode; particleCount?: number; isEmitting: boolean }) {
  const whitePointsRef = useRef<THREE.Points>(null!);
  const purplePointsRef = useRef<THREE.Points>(null!);
  const half = Math.floor(particleCount / 2);

  const whiteData = useRef<{ pos: Float32Array; vel: Float32Array }>({ pos: new Float32Array(0), vel: new Float32Array(0) });
  const purpleData = useRef<{ pos: Float32Array; vel: Float32Array }>({ pos: new Float32Array(0), vel: new Float32Array(0) });

  const circleTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useMemo(() => {
    const wPos = new Float32Array(half * 3);
    const wVel = new Float32Array(half * 3);
    const pPos = new Float32Array(half * 3);
    const pVel = new Float32Array(half * 3);

    const init = (pos: Float32Array, vel: Float32Array, i: number) => {
      const idx = i * 3;
      pos[idx] = (Math.random() - 0.5) * 0.3;
      pos[idx + 1] = 0.1 + (Math.random() - 0.5) * 0.2;
      pos[idx + 2] = (Math.random() - 0.5) * 0.3;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.008 + Math.random() * 0.018;
      vel[idx] = Math.cos(angle) * speed;
      vel[idx + 1] = 0.01 + Math.random() * 0.025;
      vel[idx + 2] = Math.sin(angle) * speed;
    };

    for (let i = 0; i < half; i++) { init(wPos, wVel, i); wPos[i * 3 + 1] += Math.random() * 3.0; }
    for (let i = 0; i < half; i++) { init(pPos, pVel, i); pPos[i * 3 + 1] += Math.random() * 3.0; }
    whiteData.current = { pos: wPos, vel: wVel };
    purpleData.current = { pos: pPos, vel: pVel };
  }, [half]);

  useFrame(() => {
    if (!isEmitting) return;
    const reset = (pos: Float32Array, vel: Float32Array, i: number) => {
      const idx = i * 3;
      pos[idx] = (Math.random() - 0.5) * 0.3;
      pos[idx + 1] = 0.1;
      pos[idx + 2] = (Math.random() - 0.5) * 0.3;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.008 + Math.random() * 0.018;
      vel[idx] = Math.cos(angle) * speed;
      vel[idx + 1] = 0.01 + Math.random() * 0.025;
      vel[idx + 2] = Math.sin(angle) * speed;
    };
    [{ ref: whitePointsRef, data: whiteData }, { ref: purplePointsRef, data: purpleData }].forEach(({ ref, data }) => {
      if (!ref.current) return;
      const { pos, vel } = data.current;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        pos[idx] += vel[idx]; pos[idx + 1] += vel[idx + 1]; pos[idx + 2] += vel[idx + 2];
        vel[idx + 1] -= 0.0001;
        if (pos[idx + 1] > 3.5 || Math.sqrt(pos[idx] ** 2 + pos[idx + 2] ** 2) > 2.2) reset(pos, vel, i);
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    });
  });

  const particleColor = theme === 'emerald' ? '#6ee7b7' : theme === 'beige' ? '#fde047' : '#c084fc';

  if (!isEmitting) return null;
  return (
    <>
      <points ref={whitePointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[whiteData.current.pos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} map={circleTexture} alphaTest={0.05} sizeAttenuation />
      </points>
      <points ref={purplePointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[purpleData.current.pos, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.1} color={particleColor} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} map={circleTexture} alphaTest={0.05} sizeAttenuation />
      </points>
    </>
  );
}

export function PillCanvas({ theme, particleCount = 200 }: PillCanvasProps) {
  const [isEmitting, setIsEmitting] = useState(false);

  useEffect(() => {
    const handleClick = () => setIsEmitting(true);
    window.addEventListener('click', handleClick, { once: true });
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const sparkleColor = theme === 'emerald' ? '#a7f3d0' : theme === 'beige' ? '#fde047' : '#e9d5ff';
  const pointColor  = theme === 'emerald' ? '#34d399' : theme === 'beige' ? '#f59e0b' : '#a855f7';

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'visible' }}>
      <Canvas camera={{ position: [0, 0, 7.0], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[6, 9, 6]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-6, -4, -6]} intensity={1.0} color="#c084fc" />
        <pointLight position={[0, 0, 3]} intensity={3.0} color={pointColor} />
        <Environment preset="city" />
        <Float speed={2.0} rotationIntensity={0.3} floatIntensity={0.1}>
          <SplitPillCapsule theme={theme} />
          <SaltParticleEmitter theme={theme} particleCount={particleCount} isEmitting={isEmitting} />
        </Float>
        <Sparkles count={80} scale={6.5} size={2.8} speed={0.4} opacity={0.65} color={sparkleColor} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.4} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}
