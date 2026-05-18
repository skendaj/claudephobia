"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import type { Group } from "three";

const globalPointer = { x: 0, y: 0 };
let listenerAttached = false;
let gyroAttached = false;

function attachGyroListener() {
  if (gyroAttached) return;
  gyroAttached = true;
  window.addEventListener(
    "deviceorientation",
    (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0;   // left/right tilt
      const beta  = e.beta  ?? 90;  // front/back; ~90 when phone upright
      globalPointer.x = Math.max(-1, Math.min(1, gamma / 45));
      globalPointer.y = Math.max(-1, Math.min(1, (beta - 90) / 45));
    },
    { passive: true },
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DOE = typeof DeviceOrientationEvent !== "undefined"
  ? (DeviceOrientationEvent as any)
  : null;

async function requestGyroPermission() {
  if (!DOE) return;
  if (typeof DOE.requestPermission === "function") {
    try {
      const state = await DOE.requestPermission();
      if (state === "granted") attachGyroListener();
    } catch {
      // called outside a gesture — caller must retry from a real tap
    }
  } else {
    attachGyroListener();
  }
}

const isMobileBrowser =
  typeof window !== "undefined" &&
  "ontouchstart" in window &&
  typeof DeviceOrientationEvent !== "undefined";

function useInputPointer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!isMobileBrowser) {
      if (listenerAttached) return;
      listenerAttached = true;
      const onMove = (e: PointerEvent) => {
        globalPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        globalPointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => {
        window.removeEventListener("pointermove", onMove);
        listenerAttached = false;
      };
    }

    // Try immediately — succeeds silently if user already granted before
    requestGyroPermission();
  }, []);
}

function MenuBarChip() {
  const ref = useRef<Group>(null);
  useInputPointer();
  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const targetY = globalPointer.x * 0.55 + Math.sin(t * 0.4) * 0.04;
    const targetX = -globalPointer.y * 0.4 + Math.sin(t * 0.3) * 0.03;
    const lerp = 1 - Math.exp(-delta * 6);
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * lerp;
    ref.current.rotation.x += (targetX - ref.current.rotation.x) * lerp;
  });

  return (
    <group ref={ref}>
      <RoundedBox args={[3.6, 1.1, 0.42]} radius={0.22} smoothness={6}>
        <meshStandardMaterial
          color="#1f1e1d"
          roughness={0.4}
          metalness={0.35}
        />
      </RoundedBox>
      {/* clay session bar */}
      <mesh position={[-0.6, 0.18, 0.22]}>
        <boxGeometry args={[1.4, 0.16, 0.05]} />
        <meshStandardMaterial
          color="#D97757"
          emissive="#D97757"
          emissiveIntensity={0.35}
        />
      </mesh>
      {/* warm gold weekly bar */}
      <mesh position={[-0.7, -0.12, 0.22]}>
        <boxGeometry args={[1.2, 0.16, 0.05]} />
        <meshStandardMaterial
          color="#E8B89A"
          emissive="#E8B89A"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* status dot */}
      <mesh position={[1.35, 0.04, 0.24]}>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshStandardMaterial
          color="#C15F3C"
          emissive="#C15F3C"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 4.2], fov: 30 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ height: "100%", width: "100%" }}
      // iOS 13+: requestPermission MUST be called synchronously inside a
      // trusted user-gesture handler. React's onClick on Canvas is the most
      // reliable trigger — it fires before any async work.
      onClick={isMobileBrowser ? () => requestGyroPermission() : undefined}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <directionalLight
          position={[-4, -2, 3]}
          intensity={0.7}
          color="#D97757"
        />
        <directionalLight position={[0, -3, 2]} intensity={0.3} color="#E8B89A" />
        <Float floatIntensity={0.6} rotationIntensity={0.25} speed={1.2}>
          <MenuBarChip />
        </Float>
      </Suspense>
    </Canvas>
  );
}
