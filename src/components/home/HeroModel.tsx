"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, Sparkles, useGLTF } from "@react-three/drei";
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  AdditiveBlending,
  Box3,
  Color,
  DoubleSide,
  FrontSide,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  ShaderMaterial,
  Vector3,
  type Material,
  type MeshStandardMaterial,
} from "three";
import clsx from "clsx";
import type { HeroSlide } from "@/data/types";

/** Largest dimension of every model after normalising, in scene units. Models ship at wildly different scales. */
const MODEL_SIZE = 1.8;

type Pointer = RefObject<{ x: number; y: number }>;

/** Swallows load/WebGL errors so a broken model never takes the hero down with it. */
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * See-through, iridescent glass that keeps the model's own colours (the heart reference). The canvas is transparent,
 * so real transmission would have nothing to refract; plain transparency drawn from both sides shows the inner
 * structure instead, and the rim shell supplies the bright edges.
 */
function toGlass(src: MeshStandardMaterial) {
  return new MeshPhysicalMaterial({
    map: src.map,
    color: new Color("#efeaff"),
    emissiveMap: src.map,
    emissive: new Color("#ffffff"),
    emissiveIntensity: 0.35,
    normalMap: src.normalMap,
    normalScale: src.normalScale,
    roughness: 0.1,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    iridescence: 1,
    iridescenceIOR: 1.3,
    envMapIntensity: 1.6,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
    side: DoubleSide,
  });
}

/** Pale, pearly frosted glass with the model's surface detail but not its colours (the bone reference). */
function toFrosted(src: MeshStandardMaterial) {
  return new MeshPhysicalMaterial({
    color: new Color("#f5f7ff"),
    normalMap: src.normalMap,
    normalScale: src.normalScale,
    aoMap: src.aoMap,
    roughness: 0.28,
    metalness: 0,
    transmission: 0.45,
    thickness: 1,
    ior: 1.45,
    attenuationColor: new Color("#d1fae5"),
    attenuationDistance: 1.2,
    sheen: 1,
    sheenColor: new Color("#ccfbf1"),
    sheenRoughness: 0.4,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2,
    envMapIntensity: 1.3,
    transparent: src.transparent,
    opacity: src.opacity,
    depthWrite: !src.transparent,
    side: FrontSide,
  });
}

const FINISHES = {
  glass: { material: toGlass, rim: "#e0f2fe", sparkles: "#fbcfe8" },
  frosted: { material: toFrosted, rim: "#e0fff4", sparkles: "#ccfbf1" },
  natural: { material: null, rim: null, sparkles: "#ede9fe" },
} as const;

/** Additive Fresnel shell: a soft glow along the silhouette, like the edge light in the references. */
function rimMaterial(color: string) {
  return new ShaderMaterial({
    uniforms: { uColor: { value: new Color(color) }, uPower: { value: 2 }, uIntensity: { value: 1.4 } },
    vertexShader: /* glsl */ `
      uniform float uPower;
      varying float vRim;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 n = normalize(normalMatrix * normal);
        vRim = pow(1.0 - abs(dot(n, normalize(-mv.xyz))), uPower);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      varying float vRim;
      void main() { gl_FragColor = vec4(uColor * vRim * uIntensity, 1.0); }`,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
}

/** Glossy disc the model hovers over, with a lit edge. */
function Pedestal() {
  return (
    <group position={[0, -MODEL_SIZE / 2 - 0.12, 0]}>
      <mesh>
        <cylinderGeometry args={[0.55, 0.6, 0.09, 96]} />
        <meshPhysicalMaterial color="#f5f3ff" roughness={0.15} clearcoat={1} transmission={0.25} thickness={0.5} envMapIntensity={1.4} />
      </mesh>
      <mesh position={[0, 0.046, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.55, 0.005, 8, 160]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Model({ src, finish, still, pointer, onReady }: { src: string; finish: HeroSlide["finish"]; still: boolean; pointer: Pointer; onReady: () => void }) {
  const { scene } = useGLTF(src);
  const ref = useRef<Group>(null);

  // Centre and scale the model into a fixed box, swap in the finish's materials and add the rim-light shell.
  const { object, created } = useMemo(() => {
    const model = scene.clone(true);
    const created = new Map<Material, Material>();
    const { material, rim } = FINISHES[finish ?? "natural"];
    const meshes: Mesh[] = [];
    model.traverse((o) => {
      if ((o as Mesh).isMesh) meshes.push(o as Mesh);
    });
    const rimMat = rim ? rimMaterial(rim) : null;
    if (rimMat) created.set(rimMat, rimMat);
    for (const mesh of meshes) {
      if (material) {
        const from = mesh.material as MeshStandardMaterial;
        if (!created.has(from)) created.set(from, material(from));
        mesh.material = created.get(from)!;
      }
      if (rimMat) mesh.add(new Mesh(mesh.geometry, rimMat));
    }
    const box = new Box3().setFromObject(model);
    const size = box.getSize(new Vector3());
    const scale = MODEL_SIZE / Math.max(size.x, size.y, size.z);
    const object = new Group();
    object.add(model);
    object.scale.setScalar(scale);
    object.position.copy(box.getCenter(new Vector3())).multiplyScalar(-scale);
    return { object, created };
  }, [scene, finish]);

  useEffect(() => () => created.forEach((m) => m.dispose()), [created]);
  useEffect(onReady, [onReady]);

  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    g.scale.setScalar(MathUtils.damp(g.scale.x, 1, 4, dt)); // grow in on mount
    if (!still) g.rotation.y += dt * 0.3;
    g.rotation.x = MathUtils.damp(g.rotation.x, pointer.current.y * 0.25, 3, dt);
    g.rotation.z = MathUtils.damp(g.rotation.z, -pointer.current.x * 0.12, 3, dt);
  });

  return (
    <group ref={ref} scale={0.85}>
      <primitive object={object} />
    </group>
  );
}

/**
 * One WebGL canvas for the whole hero; it swaps models as slides change instead of creating a context per slide.
 * Renders only while on screen and fades in once the first model has loaded.
 */
export default function HeroModel({ slide, models, still }: { slide?: HeroSlide; models: string[]; still: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  // Keep the last model mounted while the canvas fades out on a slide without one.
  const [shown, setShown] = useState(slide?.model ? slide : undefined);
  if (slide?.model && slide !== shown) setShown(slide);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Fetch the other slides' models once the first is on screen, so switching slides doesn't pop in.
  useEffect(() => {
    if (ready) models.forEach((m) => useGLTF.preload(m));
  }, [ready, models]);

  const onReady = useMemo(() => () => setReady(true), []);

  return (
    <div ref={wrap} aria-hidden className={clsx("absolute inset-0 transition-opacity duration-700", ready && slide?.model ? "opacity-100" : "opacity-0")}>
      <Boundary>
        <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0.3, 4.5], fov: 35 }} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[3, 4, 5]} intensity={2} />
          <pointLight position={[-3, -1, 2]} intensity={20} color="#a78bfa" />
          {/* Lighting baked from simple light panels: no HDR download, tinted to the brand purple. */}
          <Environment resolution={256}>
            <Lightformer form="ring" intensity={3} color="#c4b5fd" position={[0, 2, -4]} scale={4} />
            <Lightformer intensity={2} color="#ffffff" position={[3, 1, 3]} scale={[4, 2, 1]} />
            <Lightformer intensity={1.5} color="#8b5cf6" position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
          </Environment>
          <Boundary>
            <Suspense fallback={null}>
              {shown?.model && (
                <group key={shown.model}>
                  <Float enabled={!still} speed={1.5} rotationIntensity={0.3} floatIntensity={0.6} floatingRange={[-0.05, 0.08]}>
                    <Model src={shown.model} finish={shown.finish} still={still} pointer={pointer} onReady={onReady} />
                  </Float>
                  {shown.pedestal && <Pedestal />}
                  <Sparkles count={45} scale={[3.2, 3, 2]} size={2.5} speed={still ? 0 : 0.35} opacity={0.7} color={FINISHES[shown.finish ?? "natural"].sparkles} />
                </group>
              )}
            </Suspense>
          </Boundary>
        </Canvas>
      </Boundary>
    </div>
  );
}
