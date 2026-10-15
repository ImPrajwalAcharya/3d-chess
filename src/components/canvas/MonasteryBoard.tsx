"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Square } from "chess.js";
import { useChessStore } from "@/store/useChessStore";
import { squareToCoords } from "./StauntonPieces";

// Diyo (Butter Lamp) Component with organic flicker
const ButterLamp: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 8 + position[0] * 3;
    // Organic candle flicker
    const flicker = Math.sin(t) * 0.15 + Math.cos(t * 2.3) * 0.1 + 0.95;
    if (lightRef.current) {
      lightRef.current.intensity = 1.6 * flicker;
    }
    if (flameRef.current) {
      flameRef.current.scale.set(
        1 + Math.sin(t * 1.5) * 0.1,
        1 + Math.cos(t * 2.0) * 0.2,
        1 + Math.sin(t * 1.5) * 0.1
      );
    }
  });

  return (
    <group position={position}>
      {/* Brass Lamp Bowl */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.1, 0.16, 16]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.88}
          roughness={0.25}
        />
      </mesh>
      {/* Pedestal stem */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.08, 0.18, 0.04, 16]} />
        <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Oil surface */}
      <mesh position={[0, 0.14, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshStandardMaterial color="#B76E1A" roughness={0.1} />
      </mesh>
      {/* Wick */}
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
        <meshBasicMaterial color="#222" />
      </mesh>
      {/* Glowing Flame */}
      <mesh ref={flameRef} position={[0, 0.23, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#FF9D00" />
      </mesh>
      {/* Point Light Casting Warm Golden Amber Glow */}
      <pointLight
        ref={lightRef}
        position={[0, 0.32, 0]}
        color="#FFA33A"
        intensity={1.6}
        distance={6.5}
        decay={2}
        castShadow
        shadow-bias={-0.001}
      />
    </group>
  );
};

// Corner Brass Ornamental Bracket (Newa Architecture)
const CornerBracket: React.FC<{
  position: [number, number, number];
  rotation: [number, number, number];
}> = ({ position, rotation }) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.13, 0]} castShadow>
        <boxGeometry args={[0.5, 0.27, 0.5]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
      {/* Decorative brass stud */}
      <mesh position={[0.12, 0.28, 0.12]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#F5D77F" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Coordinate Letter on Border
const BorderLabel: React.FC<{
  text: string;
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ text, position, rotation = [0, 0, 0] }) => {
  const canvas = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = "#E6C79C";
      ctx.font = "bold 64px 'Cinzel', serif, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 64, 64);
    }
    return c;
  }, [text]);

  const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[0.45, 0.45]} />
      <meshBasicMaterial map={texture} transparent opacity={0.8} />
    </mesh>
  );
};

export const MonasteryBoard: React.FC = () => {
  const selectSquare = useChessStore((s) => s.selectSquare);
  const selectedSquare = useChessStore((s) => s.selectedSquare);
  const validMoves = useChessStore((s) => s.validMoves);
  const lastMove = useChessStore((s) => s.lastMove);
  const showCoordinates = useChessStore((s) => s.showCoordinates);

  // Precompute legal move destinations for fast lookup
  const moveMap = useMemo(() => {
    const map = new Map<Square, { isCapture: boolean }>();
    validMoves.forEach((m) => {
      map.set(m.to, { isCapture: !!m.captured });
    });
    return map;
  }, [validMoves]);

  // Materials
  const lightSquareMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#E5C89E", // Warm Aged Sandalwood / Teak
        roughness: 0.35,
        metalness: 0.05,
      }),
    []
  );

  const darkSquareMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#422817", // Dark Himalayan Rosewood / Slate
        roughness: 0.45,
        metalness: 0.08,
      }),
    []
  );

  const walnutPlinthMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#351B0E", // Deep Himalayan Walnut
        roughness: 0.65,
        metalness: 0.1,
      }),
    []
  );

  const lowerStonePlinthMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1F1510", // Ancient Temple Stone Plinth
        roughness: 0.85,
        metalness: 0.05,
      }),
    []
  );

  const crimsonInlayMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8B1E24", // Royal Newa Crimson Lacquer
        roughness: 0.3,
        metalness: 0.2,
      }),
    []
  );

  // Build 64 squares
  const squares = useMemo(() => {
    const list: Array<{
      square: Square;
      x: number;
      z: number;
      isLight: boolean;
    }> = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const fileChar = String.fromCharCode(97 + c);
        const rankNum = 8 - r;
        const square = `${fileChar}${rankNum}` as Square;
        const [x, z] = squareToCoords(square);
        const isLight = (r + c) % 2 === 0;

        list.push({ square, x, z, isLight });
      }
    }
    return list;
  }, []);

  return (
    <group>
      {/* ================= TIERED NEWA TEMPLE PLINTH BASE ================= */}

      {/* Tier 1 (Lowest Temple Stone Plinth) */}
      <mesh position={[0, -0.4, 0]} receiveShadow material={lowerStonePlinthMat}>
        <boxGeometry args={[11.6, 0.4, 11.6]} />
      </mesh>

      {/* Tier 2 (Carved Walnut Monastery Altar Base) */}
      <mesh position={[0, -0.15, 0]} receiveShadow material={walnutPlinthMat}>
        <boxGeometry args={[10.2, 0.25, 10.2]} />
      </mesh>

      {/* Crimson Lacquer Inlay Trim Band */}
      <mesh position={[0, -0.015, 0]} material={crimsonInlayMat}>
        <boxGeometry args={[9.4, 0.04, 9.4]} />
      </mesh>

      {/* Tier 3 (Immediate Walnut Chess Border) */}
      <mesh position={[0, -0.01, 0]} receiveShadow material={walnutPlinthMat}>
        <boxGeometry args={[9.1, 0.05, 9.1]} />
      </mesh>

      {/* 4 Brass Ornamental Corner Brackets */}
      <CornerBracket position={[-4.5, -0.13, -4.5]} rotation={[0, 0, 0]} />
      <CornerBracket position={[4.5, -0.13, -4.5]} rotation={[0, -Math.PI / 2, 0]} />
      <CornerBracket position={[4.5, -0.13, 4.5]} rotation={[0, Math.PI, 0]} />
      <CornerBracket position={[-4.5, -0.13, 4.5]} rotation={[0, Math.PI / 2, 0]} />

      {/* 4 Sacred Diyo Butter Lamps with flickering light */}
      <ButterLamp position={[-4.6, 0, -4.6]} />
      <ButterLamp position={[4.6, 0, -4.6]} />
      <ButterLamp position={[4.6, 0, 4.6]} />
      <ButterLamp position={[-4.6, 0, 4.6]} />

      {/* ================= PLAYING SQUARES (8x8) ================= */}
      {squares.map(({ square, x, z, isLight }) => {
        const isSelected = selectedSquare === square;
        const moveInfo = moveMap.get(square);
        const isLastMove =
          lastMove && (lastMove.from === square || lastMove.to === square);

        return (
          <group key={square} position={[x, 0, z]}>
            {/* The Square Tile */}
            <mesh
              position={[0, 0.01, 0]}
              receiveShadow
              material={isLight ? lightSquareMat : darkSquareMat}
            >
              <boxGeometry args={[0.98, 0.02, 0.98]} />
            </mesh>

            {/* Selected Square Saffron Gold Highlight */}
            {isSelected && (
              <mesh position={[0, 0.022, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.96, 0.96]} />
                <meshBasicMaterial
                  color="#E67E22"
                  transparent
                  opacity={0.45}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Last Move Square Soft Amber Highlight */}
            {isLastMove && !isSelected && (
              <mesh position={[0, 0.021, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.96, 0.96]} />
                <meshBasicMaterial
                  color="#F59E0B"
                  transparent
                  opacity={0.25}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Legal Move Destination Indicator: Glowing Jade/Gold Ring */}
            {moveInfo && !moveInfo.isCapture && (
              <mesh
                position={[0, 0.025, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <ringGeometry args={[0.14, 0.22, 24]} />
                <meshBasicMaterial
                  color="#10B981"
                  transparent
                  opacity={0.85}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Legal Capture Destination Indicator: Glowing Crimson Ring */}
            {moveInfo && moveInfo.isCapture && (
              <mesh
                position={[0, 0.025, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
              >
                <ringGeometry args={[0.34, 0.44, 24]} />
                <meshBasicMaterial
                  color="#EF4444"
                  transparent
                  opacity={0.88}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}

            {/* Top Transparent Hit Plane: Single source of truth for left-click square selection */}
            <mesh
              position={[0, 0.035, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              onClick={(e) => {
                if (e.button !== 0 && e.nativeEvent?.button !== 0) return;
                e.stopPropagation();
                selectSquare(square);
              }}
              onContextMenu={(e) => {
                e.stopPropagation();
                if (e.nativeEvent?.preventDefault) {
                  e.nativeEvent.preventDefault();
                }
              }}
              onPointerOver={(e) => {
                if (moveInfo || selectedSquare) {
                  e.stopPropagation();
                  document.body.style.cursor = "pointer";
                }
              }}
              onPointerOut={() => {
                document.body.style.cursor = "auto";
              }}
            >
              <planeGeometry args={[0.98, 0.98]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          </group>
        );
      })}

      {/* ================= ALGEBRAIC COORDINATES (a-h, 1-8) ================= */}
      {showCoordinates && (
        <group>
          {/* File Labels (a to h) on South & North borders */}
          {["a", "b", "c", "d", "e", "f", "g", "h"].map((file, i) => {
            const x = i - 3.5;
            return (
              <React.Fragment key={`file-${file}`}>
                {/* South (White side) */}
                <BorderLabel
                  text={file}
                  position={[x, 0.02, 4.25]}
                  rotation={[-Math.PI / 2, 0, 0]}
                />
                {/* North (Black side) */}
                <BorderLabel
                  text={file}
                  position={[x, 0.02, -4.25]}
                  rotation={[-Math.PI / 2, 0, Math.PI]}
                />
              </React.Fragment>
            );
          })}

          {/* Rank Labels (1 to 8) on East & West borders */}
          {["1", "2", "3", "4", "5", "6", "7", "8"].map((rank, i) => {
            const z = 3.5 - i;
            return (
              <React.Fragment key={`rank-${rank}`}>
                {/* West */}
                <BorderLabel
                  text={rank}
                  position={[-4.25, 0.02, z]}
                  rotation={[-Math.PI / 2, 0, Math.PI / 2]}
                />
                {/* East */}
                <BorderLabel
                  text={rank}
                  position={[4.25, 0.02, z]}
                  rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
                />
              </React.Fragment>
            );
          })}
        </group>
      )}
    </group>
  );
};
