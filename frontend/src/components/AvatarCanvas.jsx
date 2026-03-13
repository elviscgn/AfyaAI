import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Model } from "./Model";

function Loader() {
  return null;
}

export default function AvatarCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 14], fov: 30 }}
      style={{ width: "100%", height: "100%", display: "block" }}
      gl={{ alpha: true, toneMapping: 0 }} // transparent background
    >
      {/* Lighting (keep as before) */}
      <ambientLight intensity={0.5} color="#fff" />
      <directionalLight
        position={[2, 5, 4]}
        intensity={1.8}
        color="#f1e2ce"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
      />
      <directionalLight
        position={[-3, 2, 2]}
        intensity={0.6}
        color="#ffaa66"
      />
      <directionalLight
        position={[0, 3, -5]}
        intensity={0.4}
        color="#ff9966"
      />

      <Environment preset="sunset" environmentIntensity={0.5} />

      <Suspense fallback={<Loader />}>
        <Model position={[0, -4.2, 3.5]} scale={3} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
        target={[0, -1, 3.5]}
      />
    </Canvas>
  );
}