"use client";

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Sparkles,
  Environment,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { MonasteryBoard } from "./MonasteryBoard";
import { NepaliPiecesRenderer } from "./NepaliTemplePieces";
import { useChessStore } from "@/store/useChessStore";

// Camera Rig with glitch-free smooth preset transitions
const CameraRig: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraPreset = useChessStore((s) => s.cameraPreset);
  const cameraLocked = useChessStore((s) => s.cameraLocked);
  const playerColor = useChessStore((s) => s.playerColor);

  const getTargetPos = (): THREE.Vector3 => {
    const effectiveColor = playerColor;

    switch (cameraPreset) {
      case "topdown":
        return effectiveColor === "w"
          ? new THREE.Vector3(0, 14.5, 0.01)
          : new THREE.Vector3(0, 14.5, -0.01);
      case "cinematic":
        return new THREE.Vector3(8.5, 6.5, 7.5);
      case "opponent":
        return effectiveColor === "w"
          ? new THREE.Vector3(0, 8.5, -9.5)
          : new THREE.Vector3(0, 8.5, 9.5);
      case "player":
      default:
        return effectiveColor === "w"
          ? new THREE.Vector3(0, 8.5, 9.5)
          : new THREE.Vector3(0, 8.5, -9.5);
    }
  };

  const targetVec = useRef(getTargetPos());
  const isTransitioning = useRef(false);
  const prevTrigger = useRef({
    preset: cameraPreset,
    color: playerColor,
  });

  useEffect(() => {
    const presetChanged = prevTrigger.current.preset !== cameraPreset;
    const colorChanged = prevTrigger.current.color !== playerColor;

    prevTrigger.current = {
      preset: cameraPreset,
      color: playerColor,
    };

    // Only transition if user explicitly changes camera preset or switches chosen player color
    if (presetChanged || colorChanged) {
      targetVec.current = getTargetPos();
      isTransitioning.current = true;
    }
  }, [cameraPreset, playerColor]);

  useFrame((state, delta) => {
    if (!controlsRef.current) return;

    if (cameraPreset === "cinematic") {
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = 0.8;
      controlsRef.current.update();
    } else {
      controlsRef.current.autoRotate = false;
      if (isTransitioning.current) {
        // Spherical arc interpolation around board to prevent cutting through the center
        const curDir = state.camera.position.clone().normalize();
        const targetDir = targetVec.current.clone().normalize();
        const curLen = state.camera.position.length();
        const targetLen = targetVec.current.length();

        // If opposing sides (White <-> Black), curve via +X around the monastery perimeter
        if (curDir.dot(targetDir) < -0.92) {
          curDir.x += 0.28;
          curDir.normalize();
        }

        curDir.lerp(targetDir, Math.min(1, delta * 4)).normalize();
        const newLen = THREE.MathUtils.lerp(curLen, targetLen, Math.min(1, delta * 4));
        state.camera.position.copy(curDir.multiplyScalar(newLen));
        state.camera.lookAt(0, 0, 0);

        controlsRef.current.target.set(0, 0, 0);
        if (state.camera.position.distanceTo(targetVec.current) < 0.06) {
          state.camera.position.copy(targetVec.current);
          isTransitioning.current = false;
        }
      }
      if (!cameraLocked || isTransitioning.current) {
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enabled={!cameraLocked}
      enableRotate={!cameraLocked}
      enablePan={!cameraLocked}
      enableZoom={!cameraLocked}
      enableDamping={!cameraLocked}
      dampingFactor={0.06}
      minDistance={4.5}
      maxDistance={22}
      maxPolarAngle={Math.PI / 2 - 0.05}
      target={[0, 0, 0]}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
      }}
      onStart={() => {
        isTransitioning.current = false;
      }}
    />
  );
};

export const ChessScene: React.FC = () => {
  const cameraLocked = useChessStore((s) => s.cameraLocked);
  const viewMode = useChessStore((s) => s.viewMode);

  return (
    <div
      className={`relative w-full h-full select-none ${
        cameraLocked ? "cursor-default" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      <Canvas
        shadows
        frameloop={viewMode === "3d" ? "always" : "never"}
        camera={{ position: [0, 8.5, 9.5], fov: 42, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full"
      >
        {/* Soft Monastery Ambient Light */}
        <ambientLight intensity={0.65} color="#FCE4C8" />

        {/* Golden Hour Himalayan Courtyard Rim & Key Lighting */}
        <directionalLight
          position={[6, 12, 8]}
          intensity={1.15}
          color="#FFE9CA"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
          shadow-camera-near={0.5}
          shadow-camera-far={30}
          shadow-camera-left={-7}
          shadow-camera-right={7}
          shadow-camera-top={7}
          shadow-camera-bottom={-7}
        />

        {/* Fill light from opposite monastery courtyard angle */}
        <directionalLight position={[-8, 6, -6]} intensity={0.65} color="#C49B71" />

        {/* Crisp Rim Light behind Black side to outline silhouettes and prevent blending */}
        <directionalLight position={[0, 9, -10]} intensity={0.85} color="#DFE7F2" />

        {/* Monastery Incense Particles & Golden Dust Motes */}
        <Sparkles
          count={55}
          scale={14}
          size={3.2}
          speed={0.35}
          opacity={0.35}
          color="#F5D77F"
        />

        {/* Camera and Navigation Controller */}
        <CameraRig />

        {/* 3D Monastery Plinth & Chessboard */}
        <MonasteryBoard />

        {/* 3D Nepali Temple Chess Pieces */}
        <NepaliPiecesRenderer />

        {/* Realistic Contact Shadow beneath pieces and altar */}
        <ContactShadows
          position={[0, -0.41, 0]}
          opacity={0.65}
          scale={16}
          blur={1.8}
          far={10}
          color="#0d0806"
        />

        {/* Warm Environment Reflection */}
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};
