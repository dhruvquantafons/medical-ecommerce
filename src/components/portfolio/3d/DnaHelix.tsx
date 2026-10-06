"use client";

import { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const BASE_PAIRS    = 24;
const HELIX_RADIUS  = 1.05;
const HELIX_PITCH   = 0.38;
const SPHERE_R      = 0.16;
const RUNG_R        = 0.04;
const COLOR_PURPLE   = '#7c3aed';
const COLOR_LAVENDER = '#ede9fe';

// ---------------------------------------------------------------------------
// Geometry / material helpers
// ---------------------------------------------------------------------------
function makeHaloTexture(
  size: number,
  stops: [number, string][],
): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  stops.forEach(([pos, col]) => g.addColorStop(pos, col));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

// ---------------------------------------------------------------------------
// Shared assets
// ---------------------------------------------------------------------------
function useSharedAssets() {
  return useMemo(() => {
    // ---- helix geometry ----
    const sphereGeo = new THREE.SphereGeometry(SPHERE_R, 20, 14);
    const rungGeo   = new THREE.CylinderGeometry(RUNG_R, RUNG_R, 1, 8);

    const purpleMat = new THREE.MeshPhysicalMaterial({
      color: COLOR_PURPLE, emissive: COLOR_PURPLE, emissiveIntensity: 0.4,
      roughness: 0.08, metalness: 0.2, clearcoat: 1.0, clearcoatRoughness: 0.04,
    });
    const lavenderMat = new THREE.MeshPhysicalMaterial({
      color: COLOR_LAVENDER, emissive: '#a78bfa', emissiveIntensity: 0.15,
      roughness: 0.04, metalness: 0.08, clearcoat: 1.0, clearcoatRoughness: 0.02,
    });
    const rungMat = new THREE.MeshStandardMaterial({
      color: '#a78bfa', emissive: '#7c3aed', emissiveIntensity: 0.3,
      roughness: 0.25, metalness: 0.3, transparent: true, opacity: 0.75,
    });

    // ---- ghost helix ----
    const ghostPurpleMat = new THREE.MeshPhysicalMaterial({
      color: '#a855f7', emissive: '#7c3aed', emissiveIntensity: 0.6,
      roughness: 0.1, metalness: 0.1, clearcoat: 0.8, transparent: true, opacity: 0.28,
    });
    const ghostWhiteMat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff', emissive: '#ede9fe', emissiveIntensity: 0.5,
      roughness: 0.05, metalness: 0.05, clearcoat: 0.9, transparent: true, opacity: 0.22,
    });
    const ghostRungMat = new THREE.MeshStandardMaterial({
      color: '#ddd6fe', emissive: '#a78bfa', emissiveIntensity: 0.8,
      transparent: true, opacity: 0.18, roughness: 0.3,
    });

    // ---- halos ----
    const haloTex = makeHaloTexture(256, [
      [0,    'rgba(124,58,237,0.6)'],
      [0.35, 'rgba(168,85,247,0.3)'],
      [0.7,  'rgba(237,233,254,0.1)'],
      [1,    'rgba(168,85,247,0)'],
    ]);
    const haloMat = new THREE.MeshBasicMaterial({
      map: haloTex, transparent: true, opacity: 0.65,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const haloGeo = new THREE.PlaneGeometry(9, 9);

    const whiteHaloTex = makeHaloTexture(128, [
      [0,   'rgba(255,255,255,0.55)'],
      [0.4, 'rgba(237,233,254,0.22)'],
      [1,   'rgba(237,233,254,0)'],
    ]);
    const whiteHaloMat = new THREE.MeshBasicMaterial({
      map: whiteHaloTex, transparent: true, opacity: 0.42,
      side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const whiteHaloGeo = new THREE.PlaneGeometry(5.5, 5.5);

    // ---- orbit rings ----
    const ORBIT = 200;
    const buildOrbit = (count: number, rBase: number, rSpread: number, ySpread: number) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const r = rBase + (Math.random() - 0.5) * rSpread;
        pos[i * 3]     = Math.cos(a) * r;
        pos[i * 3 + 1] = (Math.random() - 0.5) * ySpread;
        pos[i * 3 + 2] = Math.sin(a) * r;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      return g;
    };
    const orbitGeo  = buildOrbit(ORBIT, 2.8, 0.8, 4.0);
    const orbitMat  = new THREE.PointsMaterial({
      color: '#c4b5fd', size: 0.06, transparent: true, opacity: 0.8,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    const wOrbitGeo = buildOrbit(ORBIT, 2.2, 0.6, 3.0);
    const wOrbitMat = new THREE.PointsMaterial({
      color: '#f3f4f6', size: 0.045, transparent: true, opacity: 0.65,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });

    // ---- nebula cloud — dense static point cloud, morphed in useFrame ----
    const NEB = 350;
    const nebPos = new Float32Array(NEB * 3);
    for (let i = 0; i < NEB; i++) {
      // random sphere shell
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 2.5 + Math.random() * 2.2;
      nebPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      nebPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.6; // flatten Y
      nebPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const nebGeo = new THREE.BufferGeometry();
    nebGeo.setAttribute('position', new THREE.BufferAttribute(nebPos.slice(), 3));
    // store original for morphing
    const nebOrigin = nebPos.slice();
    const nebPurpleMat = new THREE.PointsMaterial({
      color: '#9333ea', size: 0.08, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    const nebWhiteMat = new THREE.PointsMaterial({
      color: '#f5f3ff', size: 0.065, transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
    });
    // white nebula — slightly smaller radius
    const nebWPos = new Float32Array(NEB * 3);
    for (let i = 0; i < NEB; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 1.8 + Math.random() * 1.8;
      nebWPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      nebWPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
      nebWPos[i * 3 + 2] = r * Math.cos(phi);
    }
    const nebWGeo = new THREE.BufferGeometry();
    nebWGeo.setAttribute('position', new THREE.BufferAttribute(nebWPos.slice(), 3));
    const nebWOrigin = nebWPos.slice();

    // ---- light beam planes ----
    const beamGeo = new THREE.PlaneGeometry(0.18, 7);
    const beamMat = new THREE.MeshBasicMaterial({
      color: '#a855f7', transparent: true, opacity: 0.0,
      side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const beamWhiteMat = new THREE.MeshBasicMaterial({
      color: '#ffffff', transparent: true, opacity: 0.0,
      side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
    });

    // ---- pulse ring ----
    const ringGeo = new THREE.RingGeometry(0.1, 0.18, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#c084fc', transparent: true, opacity: 0.0,
      side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const ringWhiteMat = new THREE.MeshBasicMaterial({
      color: '#ffffff', transparent: true, opacity: 0.0,
      side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
    });

    // ---- shooting star ----
    const starGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.8, 0, 0),
    ]);
    const starMat = new THREE.LineBasicMaterial({
      color: '#f0abfc', transparent: true, opacity: 0.0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    return {
      sphereGeo, rungGeo, purpleMat, lavenderMat, rungMat,
      ghostPurpleMat, ghostWhiteMat, ghostRungMat,
      haloMat, haloGeo, whiteHaloMat, whiteHaloGeo,
      orbitGeo, orbitMat, wOrbitGeo, wOrbitMat,
      nebGeo, nebOrigin, nebPurpleMat,
      nebWGeo, nebWOrigin, nebWhiteMat,
      beamGeo, beamMat, beamWhiteMat,
      ringGeo, ringMat, ringWhiteMat,
      starGeo, starMat,
    };
  }, []);
}

// ---------------------------------------------------------------------------
// Helix positions
// ---------------------------------------------------------------------------
function useHelixData() {
  return useMemo(() => {
    const build = (xOff: number, phase: number) => {
      const strandA: THREE.Vector3[] = [];
      const strandB: THREE.Vector3[] = [];
      const yOff = -(BASE_PAIRS * HELIX_PITCH) / 2;
      for (let i = 0; i < BASE_PAIRS; i++) {
        const t = (i / (BASE_PAIRS - 1)) * Math.PI * 4 + phase;
        const y = i * HELIX_PITCH + yOff;
        strandA.push(new THREE.Vector3(Math.cos(t) * HELIX_RADIUS + xOff, y, Math.sin(t) * HELIX_RADIUS));
        strandB.push(new THREE.Vector3(Math.cos(t + Math.PI) * HELIX_RADIUS + xOff, y, Math.sin(t + Math.PI) * HELIX_RADIUS));
      }
      const rungTransforms: { pos: THREE.Vector3; quat: THREE.Quaternion; len: number }[] = [];
      for (let i = 0; i < BASE_PAIRS; i++) {
        const a = strandA[i], b = strandB[i];
        const mid = a.clone().add(b).multiplyScalar(0.5);
        const dir = b.clone().sub(a).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        rungTransforms.push({ pos: mid, quat, len: a.distanceTo(b) });
      }
      return { strandA, strandB, rungTransforms };
    };
    const main  = build(0, 0);
    const ghost = build(-0.4, Math.PI * 0.6);
    const arcData: { start: THREE.Vector3; end: THREE.Vector3; mid: THREE.Vector3 }[] = [];
    const step = Math.floor(BASE_PAIRS / 8);
    for (let k = 0; k < 8; k++) {
      const i = k * step;
      const start = main.strandA[i].clone();
      const end   = ghost.strandB[i].clone();
      const mid   = start.clone().add(end).multiplyScalar(0.5);
      mid.z += 0.6;
      arcData.push({ start, end, mid });
    }
    return { main, ghost, arcData };
  }, []);
}

// ---------------------------------------------------------------------------
// Nebula — two billowing point clouds that slowly morph
// ---------------------------------------------------------------------------
function Nebula({ paused }: { paused: boolean }) {
  const purpleRef = useRef<THREE.Points>(null!);
  const whiteRef  = useRef<THREE.Points>(null!);
  const { nebGeo, nebOrigin, nebPurpleMat, nebWGeo, nebWOrigin, nebWhiteMat } = useSharedAssets();

  useFrame((state) => {
    if (paused) return;
    const t = state.clock.elapsedTime;
    // morph positions with per-particle sine offset
    const pPos = nebGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < pPos.length / 3; i++) {
      const ox = nebOrigin[i * 3], oy = nebOrigin[i * 3 + 1], oz = nebOrigin[i * 3 + 2];
      const n = Math.sin(t * 0.4 + ox * 1.3 + oz * 0.9) * 0.18;
      pPos[i * 3]     = ox + n * Math.cos(t * 0.25 + i * 0.07);
      pPos[i * 3 + 1] = oy + n * 0.5;
      pPos[i * 3 + 2] = oz + n * Math.sin(t * 0.25 + i * 0.07);
    }
    nebGeo.attributes.position.needsUpdate = true;

    const wPos = nebWGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < wPos.length / 3; i++) {
      const ox = nebWOrigin[i * 3], oy = nebWOrigin[i * 3 + 1], oz = nebWOrigin[i * 3 + 2];
      const n = Math.sin(t * 0.35 + ox * 1.1 + oz * 1.2) * 0.14;
      wPos[i * 3]     = ox + n * Math.cos(t * 0.2 + i * 0.09);
      wPos[i * 3 + 1] = oy + n * 0.5;
      wPos[i * 3 + 2] = oz + n * Math.sin(t * 0.2 + i * 0.09);
    }
    nebWGeo.attributes.position.needsUpdate = true;

    // slowly rotate the whole nebula
    if (purpleRef.current) purpleRef.current.rotation.y = t * 0.07;
    if (whiteRef.current)  whiteRef.current.rotation.y  = -t * 0.05;

    // pulse overall opacity
    nebPurpleMat.opacity = 0.35 + 0.25 * Math.abs(Math.sin(t * 0.3));
    nebWhiteMat.opacity  = 0.25 + 0.18 * Math.abs(Math.sin(t * 0.38 + 1));
  });

  return (
    <>
      <points ref={purpleRef}>
        <primitive object={nebGeo} />
        <primitive object={nebPurpleMat} />
      </points>
      <points ref={whiteRef}>
        <primitive object={nebWGeo} />
        <primitive object={nebWhiteMat} />
      </points>
    </>
  );
}

// ---------------------------------------------------------------------------
// Light beams — four planes sweeping like searchlights
// ---------------------------------------------------------------------------
function LightBeams({ paused }: { paused: boolean }) {
  const refs  = [useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!),
                 useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!)];
  const { beamGeo, beamMat, beamWhiteMat } = useSharedAssets();

  const mats = useMemo(() => [
    beamMat.clone(), beamWhiteMat.clone(), beamMat.clone(), beamWhiteMat.clone(),
  ], [beamMat, beamWhiteMat]);

  useFrame((state) => {
    if (paused) return;
    const t = state.clock.elapsedTime;
    refs.forEach((r, i) => {
      if (!r.current) return;
      const phase = (i / 4) * Math.PI * 2;
      r.current.rotation.z = t * (i % 2 === 0 ? 0.28 : -0.22) + phase;
      // beams flare up and die in a cycle
      const cycle = Math.abs(Math.sin(t * 0.6 + phase));
      mats[i].opacity = cycle * 0.22;
    });
  });

  return (
    <>
      {refs.map((r, i) => (
        <mesh key={i} ref={r} position={[0, 0, -2.5]}>
          <primitive object={beamGeo} />
          <primitive object={mats[i]} />
        </mesh>
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Pulse rings — rings expand outward from origin and fade (sonar effect)
// ---------------------------------------------------------------------------
const RING_COUNT = 5;
function PulseRings({ paused }: { paused: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const ringRefs = [
    useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!),
    useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!),
  ];
  const mats = useMemo(() =>
    Array.from({ length: RING_COUNT }, (_, i) =>
      new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? '#c084fc' : '#ffffff',
        transparent: true, opacity: 0.0,
        side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
      }),
    ),
  []);
  const phases = useMemo(() =>
    Array.from({ length: RING_COUNT }, (_, i) => (i / RING_COUNT) * Math.PI * 2),
  []);

  useFrame((state) => {
    if (paused) return;
    const t = state.clock.elapsedTime;
    ringRefs.forEach((ref, i) => {
      if (!ref.current) return;
      const cycle = ((t * 0.5 + phases[i] / (Math.PI * 2)) % 1);
      ref.current.scale.setScalar(0.4 + cycle * 4.5);
      mats[i].opacity = (1 - cycle) * 0.55;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -1.8]} rotation={[Math.PI / 2, 0, 0]}>
      {ringRefs.map((ref, i) => (
        <mesh key={i} ref={ref}>
          <ringGeometry args={[0.9, 1.0, 48]} />
          <primitive object={mats[i]} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Shooting stars — occasional bright streaks
// ---------------------------------------------------------------------------
const STAR_COUNT = 6;
function ShootingStars({ paused }: { paused: boolean }) {
  const starRefs = [
    useRef<THREE.Line>(null!), useRef<THREE.Line>(null!), useRef<THREE.Line>(null!),
    useRef<THREE.Line>(null!), useRef<THREE.Line>(null!), useRef<THREE.Line>(null!),
  ];
  const { mats, geos, dirs } = useMemo(() => {
    const mats = Array.from({ length: STAR_COUNT }, (_, i) =>
      new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? '#e9d5ff' : '#ffffff',
        transparent: true, opacity: 0.0,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }),
    );
    const geos = Array.from({ length: STAR_COUNT }, () =>
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0.9 + Math.random() * 0.6, 0, 0),
      ]),
    );
    const dirs = Array.from({ length: STAR_COUNT }, () => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
    }));
    return { mats, geos, dirs };
  }, []);

  const nextFireRef = useRef(
    Array.from({ length: STAR_COUNT }, () => Math.random() * 6),
  );
  const posRef = useRef(
    Array.from({ length: STAR_COUNT }, () => new THREE.Vector3()),
  );

  useFrame((state) => {
    if (paused) return;
    const t = state.clock.elapsedTime;
    starRefs.forEach((ref, i) => {
      const line = ref.current;
      if (!line) return;
      if (t > nextFireRef.current[i]) {
        const progress = t - nextFireRef.current[i];
        if (progress < 0.35) {
          if (progress < 0.02) {
            posRef.current[i].set(
              (Math.random() - 0.5) * 5,
              (Math.random() - 0.5) * 4,
              -1 - Math.random() * 1.5,
            );
          }
          line.position.copy(posRef.current[i]);
          line.rotation.z = Math.atan2(dirs[i].y, dirs[i].x);
          mats[i].opacity = (1 - progress / 0.35) * 0.85;
        } else {
          mats[i].opacity = 0;
          nextFireRef.current[i] = t + 2.5 + Math.random() * 4;
        }
      }
    });
  });

  return (
    <>
      {starRefs.map((ref, i) => (
        <primitive key={i} ref={ref} object={new THREE.Line(geos[i], mats[i])} />
      ))}
    </>
  );
}

// ---------------------------------------------------------------------------
// Background: halos + dual orbit rings
// ---------------------------------------------------------------------------
function Background({ paused }: { paused: boolean }) {
  const orbitRef  = useRef<THREE.Points>(null!);
  const wOrbitRef = useRef<THREE.Points>(null!);
  const haloRef   = useRef<THREE.Mesh>(null!);
  const wHaloRef  = useRef<THREE.Mesh>(null!);
  const { haloMat, haloGeo, whiteHaloMat, whiteHaloGeo,
          orbitGeo, orbitMat, wOrbitGeo, wOrbitMat } = useSharedAssets();

  useFrame((state) => {
    if (paused) return;
    const t = state.clock.elapsedTime;
    if (orbitRef.current)  orbitRef.current.rotation.y  =  t * 0.18;
    if (wOrbitRef.current) wOrbitRef.current.rotation.y = -t * 0.13;
    if (haloRef.current) {
      haloRef.current.rotation.z = t * 0.05;
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.5 + 0.22 * Math.abs(Math.sin(t * 0.38));
    }
    if (wHaloRef.current) {
      wHaloRef.current.rotation.z = -t * 0.07;
      (wHaloRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.32 + 0.16 * Math.abs(Math.sin(t * 0.52 + 1));
    }
  });

  return (
    <>
      <mesh ref={haloRef} position={[0, 0, -2.2]}>
        <primitive object={haloGeo} />
        <primitive object={haloMat} />
      </mesh>
      <mesh ref={wHaloRef} position={[0.9, 0.5, -2.0]}>
        <primitive object={whiteHaloGeo} />
        <primitive object={whiteHaloMat} />
      </mesh>
      <points ref={orbitRef}>
        <primitive object={orbitGeo} />
        <primitive object={orbitMat} />
      </points>
      <points ref={wOrbitRef}>
        <primitive object={wOrbitGeo} />
        <primitive object={wOrbitMat} />
      </points>
    </>
  );
}

// ---------------------------------------------------------------------------
// Connection arcs
// ---------------------------------------------------------------------------
function ConnectionArcs({ arcData, paused }: {
  arcData: { start: THREE.Vector3; end: THREE.Vector3; mid: THREE.Vector3 }[];
  paused: boolean;
}) {
  const lines = useMemo(() =>
    arcData.map(({ start, end, mid }, i) => {
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(20));
      const mat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? '#e879f9' : '#f3f4f6',
        transparent: true, opacity: 0.28,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      return { geo, mat };
    }),
  [arcData]);

  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (paused || !groupRef.current) return;
    const opacity = 0.15 + 0.45 * Math.abs(Math.sin(state.clock.elapsedTime * 0.9));
    lines.forEach(({ mat }) => { mat.opacity = opacity; });
  });

  return (
    <group ref={groupRef}>
      {lines.map(({ geo, mat }, i) => (
        <primitive key={i} object={new THREE.Line(geo, mat)} />
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Ghost helix
// ---------------------------------------------------------------------------
function GhostHelix({ strandA, strandB, rungTransforms, paused }: {
  strandA: THREE.Vector3[];
  strandB: THREE.Vector3[];
  rungTransforms: { pos: THREE.Vector3; quat: THREE.Quaternion; len: number }[];
  paused: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const instARef = useRef<THREE.InstancedMesh>(null!);
  const instBRef = useRef<THREE.InstancedMesh>(null!);
  const rungRef  = useRef<THREE.InstancedMesh>(null!);
  const { sphereGeo, rungGeo, ghostPurpleMat, ghostWhiteMat, ghostRungMat } = useSharedAssets();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    strandA.forEach((pos, i) => {
      dummy.position.copy(pos); dummy.scale.setScalar(1); dummy.updateMatrix();
      instARef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (instARef.current) instARef.current.instanceMatrix.needsUpdate = true;
    strandB.forEach((pos, i) => {
      dummy.position.copy(pos); dummy.scale.setScalar(1); dummy.updateMatrix();
      instBRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (instBRef.current) instBRef.current.instanceMatrix.needsUpdate = true;
    rungTransforms.forEach(({ pos, quat, len }, i) => {
      dummy.position.copy(pos); dummy.quaternion.copy(quat);
      dummy.scale.set(1, len, 1); dummy.updateMatrix();
      rungRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (rungRef.current) rungRef.current.instanceMatrix.needsUpdate = true;
  }, [strandA, strandB, rungTransforms, dummy]);

  useFrame((state) => {
    if (paused || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = -t * 0.28;
    groupRef.current.rotation.x = Math.sin(t * 0.38) * 0.1;
    groupRef.current.position.z = -1.2 + Math.sin(t * 0.22) * 0.3;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={instARef} args={[sphereGeo, ghostPurpleMat, BASE_PAIRS]} />
      <instancedMesh ref={instBRef} args={[sphereGeo, ghostWhiteMat,  BASE_PAIRS]} />
      <instancedMesh ref={rungRef}  args={[rungGeo,   ghostRungMat,   BASE_PAIRS]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Main helix
// ---------------------------------------------------------------------------
function HelixScene({ paused }: { paused: boolean }) {
  const groupRef = useRef<THREE.Group>(null!);
  const instARef = useRef<THREE.InstancedMesh>(null!);
  const instBRef = useRef<THREE.InstancedMesh>(null!);
  const rungRefs = useRef<THREE.InstancedMesh>(null!);
  const { sphereGeo, rungGeo, purpleMat, lavenderMat, rungMat } = useSharedAssets();
  const { main, ghost, arcData } = useHelixData();
  const { strandA, strandB, rungTransforms } = main;
  const slowMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches, [],
  );
  const dummy   = useMemo(() => new THREE.Object3D(), []);
  const zapRef  = useRef<{ frames: number } | null>(null);
  const nextZap = useRef(0);

  useEffect(() => {
    strandA.forEach((pos, i) => {
      dummy.position.copy(pos); dummy.scale.setScalar(1); dummy.updateMatrix();
      instARef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (instARef.current) instARef.current.instanceMatrix.needsUpdate = true;
    strandB.forEach((pos, i) => {
      dummy.position.copy(pos); dummy.scale.setScalar(1); dummy.updateMatrix();
      instBRef.current?.setMatrixAt(i, dummy.matrix);
    });
    if (instBRef.current) instBRef.current.instanceMatrix.needsUpdate = true;
    rungTransforms.forEach(({ pos, quat, len }, i) => {
      dummy.position.copy(pos); dummy.quaternion.copy(quat);
      dummy.scale.set(1, len, 1); dummy.updateMatrix();
      rungRefs.current?.setMatrixAt(i, dummy.matrix);
    });
    if (rungRefs.current) rungRefs.current.instanceMatrix.needsUpdate = true;
  }, [strandA, strandB, rungTransforms, dummy]);

  useFrame((state) => {
    if (paused || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    const spd = slowMotion ? 0.15 : 0.4;
    const jitter = 0.008 * Math.sin(t * 31.4) * Math.sin(t * 17.3);
    groupRef.current.rotation.y = t * spd + jitter;
    groupRef.current.rotation.x = Math.sin(t * 0.45) * 0.12;
    groupRef.current.rotation.z = Math.sin(t * 0.3) * 0.06;
    const sc = (t % 3.0) / 3.0;
    groupRef.current.scale.y = sc < 0.15 ? 1 + 0.12 * Math.sin((sc / 0.15) * Math.PI) : 1;

    if (instARef.current) {
      for (let i = 0; i < BASE_PAIRS; i++) {
        const w = 1 + 0.22 * Math.sin(t * 2.5 - i * 0.55);
        dummy.position.copy(strandA[i]); dummy.scale.setScalar(w); dummy.updateMatrix();
        instARef.current.setMatrixAt(i, dummy.matrix);
      }
      instARef.current.instanceMatrix.needsUpdate = true;
    }
    if (instBRef.current) {
      for (let i = 0; i < BASE_PAIRS; i++) {
        const w = 1 + 0.14 * Math.sin(t * 2.0 + i * 0.55);
        dummy.position.copy(strandB[i]); dummy.scale.setScalar(w); dummy.updateMatrix();
        instBRef.current.setMatrixAt(i, dummy.matrix);
      }
      instBRef.current.instanceMatrix.needsUpdate = true;
    }
    purpleMat.emissiveIntensity = 0.3 + 0.35 * Math.abs(Math.sin(t * 1.2));
    rungMat.opacity = 0.55 + 0.3 * Math.abs(Math.sin(t * 0.8));
    if (t > nextZap.current) {
      zapRef.current = { frames: 4 };
      nextZap.current = t + 1.8 + Math.random() * 2.5;
    }
    if (zapRef.current) {
      rungMat.emissiveIntensity = zapRef.current.frames > 2 ? 3.5 : 1.5;
      zapRef.current.frames--;
      if (zapRef.current.frames <= 0) { rungMat.emissiveIntensity = 0.3; zapRef.current = null; }
    }
  });

  return (
    <>
      <GhostHelix strandA={ghost.strandA} strandB={ghost.strandB}
        rungTransforms={ghost.rungTransforms} paused={paused} />
      <ConnectionArcs arcData={arcData} paused={paused} />
      <group ref={groupRef}>
        <instancedMesh ref={instARef} args={[sphereGeo, purpleMat,   BASE_PAIRS]} />
        <instancedMesh ref={instBRef} args={[sphereGeo, lavenderMat, BASE_PAIRS]} />
        <instancedMesh ref={rungRefs} args={[rungGeo,   rungMat,     BASE_PAIRS]} />
      </group>
    </>
  );
}

// ---------------------------------------------------------------------------
// Camera auto-fit
// ---------------------------------------------------------------------------
function AutoCamera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const dist = size.width < 420 ? 8.5 : 7.0;
    (camera as THREE.PerspectiveCamera).position.set(0, 0, dist);
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  }, [camera, size.width]);
  return null;
}

// ---------------------------------------------------------------------------
// Public export
// ---------------------------------------------------------------------------
export function DnaHelix() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pausedRef    = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      ([entry]) => { pausedRef.current = !entry.isIntersecting; },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const getPaused = useCallback(() => pausedRef.current, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 7.0], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <AutoCamera />

        <ambientLight intensity={1.4} />
        <directionalLight position={[6, 9, 6]}   intensity={2.0} color="#ffffff" />
        <directionalLight position={[-6, -4, -6]} intensity={1.0} color="#c084fc" />
        <pointLight position={[0,  0,  3]}  intensity={2.8} color="#a855f7" />
        <pointLight position={[0,  0, -3]}  intensity={1.2} color="#ede9fe" />
        <pointLight position={[-2, 2,  1]}  intensity={1.5} color="#7c3aed" />
        <Environment preset="city" />

        {/* ── background layers ── */}
        <Background paused={false} />
        <Nebula     paused={false} />
        <LightBeams paused={false} />
        <PulseRings paused={false} />
        <ShootingStars paused={false} />

        {/* ── sparkle layers ── */}
        <Sparkles count={60}  scale={4.5} size={2.0} speed={0.55} opacity={0.70} color="#c4b5fd" />
        <Sparkles count={45}  scale={8.5} size={4.0} speed={0.14} opacity={0.28} color="#f5f3ff" />
        <Sparkles count={35}  scale={6.5} size={3.0} speed={0.28} opacity={0.45} color="#a855f7" />
        <Sparkles count={25}  scale={3.5} size={1.5} speed={0.80} opacity={0.55} color="#ffffff" />

        {/* ── helix ── */}
        <Float speed={1.8} rotationIntensity={0.12} floatIntensity={0.18}>
          <HelixScene paused={getPaused()} />
        </Float>
      </Canvas>
    </div>
  );
}
