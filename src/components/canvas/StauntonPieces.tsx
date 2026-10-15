"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PieceSymbol, Color, Square } from "chess.js";
import {
  createPawnGeometry,
  createRookGeometry,
  createBishopGeometry,
  createQueenGeometry,
  createKingGeometry,
  createKnightBaseGeometry,
} from "./stauntonGeometries";
import { useChessStore } from "@/store/useChessStore";

// Convert algebraic square ("e4") to 3D world coordinates (x, z)
export function squareToCoords(square: Square): [number, number] {
  const file = square.charCodeAt(0) - 97; // a=0, h=7 -> -3.5 to +3.5
  const rank = parseInt(square[1], 10); // 1 to 8 -> +3.5 to -3.5
  const x = file - 3.5;
  const z = 3.5 - (rank - 1);
  return [x, z];
}

interface PieceProps {
  type: PieceSymbol;
  color: Color;
  square: Square;
  isKingInCheck?: boolean;
}

// Procedural Piece Component
export const ChessPieceMesh: React.FC<PieceProps> = ({
  type,
  color,
  square,
  isKingInCheck,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const selectSquare = useChessStore((s) => s.selectSquare);
  const selectedSquare = useChessStore((s) => s.selectedSquare);
  const turn = useChessStore((s) => s.chess.turn());
  const gameMode = useChessStore((s) => s.gameMode);
  const playerColor = useChessStore((s) => s.playerColor);
  const isAIThinking = useChessStore((s) => s.isAIThinking);
  const isGameOver = useChessStore((s) => s.isGameOver);

  const [hovered, setHovered] = useState(false);

  // Target coordinates
  const [targetX, targetZ] = useMemo(() => squareToCoords(square), [square]);

  // Current visual position refs for parabolic lerping
  const currentPos = useRef(new THREE.Vector3(targetX, 0, targetZ));
  const isMoving = useRef(false);
  const moveProgress = useRef(1);
  const prevCoords = useRef<[number, number]>([targetX, targetZ]);

  // Check if position changed
  if (prevCoords.current[0] !== targetX || prevCoords.current[1] !== targetZ) {
    isMoving.current = true;
    moveProgress.current = 0;
    prevCoords.current = [targetX, targetZ];
  }

  // Geometries memoized per piece type
  const baseLatheGeo = useMemo(() => {
    switch (type) {
      case "p":
        return createPawnGeometry();
      case "r":
        return createRookGeometry();
      case "n":
        return createKnightBaseGeometry();
      case "b":
        return createBishopGeometry();
      case "q":
        return createQueenGeometry();
      case "k":
        return createKingGeometry();
      default:
        return createPawnGeometry();
    }
  }, [type]);

  // Materials
  const isWhite = color === "w";
  const isSelected = selectedSquare === square;

  const pieceMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isWhite ? "#F6F2EA" : "#201B18",
      roughness: isWhite ? 0.22 : 0.28,
      metalness: isWhite ? 0.04 : 0.26,
    });
  }, [isWhite]);

  const feltMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isWhite ? "#8B1E24" : "#D4AF37", // Crimson for white, Saffron Gold for black
      roughness: 0.9,
    });
  }, [isWhite]);

  const goldAccentMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#D4AF37",
      metalness: 0.85,
      roughness: 0.2,
    });
  }, []);

  const canInteract =
    !isGameOver &&
    !isAIThinking &&
    (gameMode === "pass_and_play" || turn === playerColor) &&
    turn === color;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Movement animation interpolation
    if (isMoving.current) {
      moveProgress.current += delta * 3.5; // Smooth 0.28s jump
      if (moveProgress.current >= 1) {
        moveProgress.current = 1;
        isMoving.current = false;
        currentPos.current.set(targetX, 0, targetZ);
      } else {
        const p = moveProgress.current;
        const startX = currentPos.current.x;
        const startZ = currentPos.current.z;
        const arcY = Math.sin(p * Math.PI) * 0.75; // Parabolic hop

        currentPos.current.x = THREE.MathUtils.lerp(startX, targetX, 0.25);
        currentPos.current.z = THREE.MathUtils.lerp(startZ, targetZ, 0.25);
        currentPos.current.y = arcY;
      }
    } else {
      // Hover elevation
      const targetHoverY = isSelected ? 0.35 : hovered && canInteract ? 0.15 : 0;
      currentPos.current.y = THREE.MathUtils.lerp(
        currentPos.current.y,
        targetHoverY,
        delta * 12
      );
      currentPos.current.x = targetX;
      currentPos.current.z = targetZ;
    }

    groupRef.current.position.copy(currentPos.current);

    // Subtle gentle float if selected
    if (isSelected) {
      groupRef.current.position.y += Math.sin(Date.now() * 0.005) * 0.03;
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectSquare(square);
  };

  // Face rotation: White faces +z (or 0), Black faces -z (Math.PI)
  const pieceRotationY = isWhite ? 0 : Math.PI;

  return (
    <group
      ref={groupRef}
      rotation={[0, pieceRotationY, 0]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (canInteract) {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Felt base pad underneath */}
      <mesh position={[0, 0.005, 0]} material={feltMaterial}>
        <cylinderGeometry args={[0.34, 0.34, 0.015, 32]} />
      </mesh>

      {/* Main Body Lathe */}
      <mesh
        geometry={baseLatheGeo}
        material={pieceMaterial}
        castShadow
        receiveShadow
      />

      {/* Knight Specific Sculpted Head & Features */}
      {type === "n" && (
        <group position={[0, 0.28, 0]}>
          {/* Arched Neck */}
          <mesh
            position={[0, 0.22, 0.02]}
            rotation={[-0.2, 0, 0]}
            material={pieceMaterial}
            castShadow
          >
            <cylinderGeometry args={[0.13, 0.17, 0.38, 16]} />
          </mesh>

          {/* Horse Head / Muzzle */}
          <mesh
            position={[0, 0.42, 0.12]}
            rotation={[0.35, 0, 0]}
            material={pieceMaterial}
            castShadow
          >
            <boxGeometry args={[0.22, 0.24, 0.34]} />
          </mesh>

          {/* Tapered Snout */}
          <mesh
            position={[0, 0.35, 0.26]}
            rotation={[0.5, 0, 0]}
            material={pieceMaterial}
            castShadow
          >
            <boxGeometry args={[0.18, 0.16, 0.2]} />
          </mesh>

          {/* Ears */}
          <mesh
            position={[-0.08, 0.58, 0.04]}
            rotation={[0.2, -0.2, 0]}
            material={pieceMaterial}
          >
            <coneGeometry args={[0.04, 0.12, 8]} />
          </mesh>
          <mesh
            position={[0.08, 0.58, 0.04]}
            rotation={[0.2, 0.2, 0]}
            material={pieceMaterial}
          >
            <coneGeometry args={[0.04, 0.12, 8]} />
          </mesh>

          {/* Mane ridges */}
          <mesh
            position={[0, 0.36, -0.1]}
            rotation={[-0.2, 0, 0]}
            material={pieceMaterial}
          >
            <boxGeometry args={[0.06, 0.35, 0.08]} />
          </mesh>
        </group>
      )}

      {/* Rook Crenelations / Battlements */}
      {type === "r" && (
        <group position={[0, 0.94, 0]}>
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.24, 0.05, Math.sin(angle) * 0.24]}
              material={pieceMaterial}
              castShadow
            >
              <boxGeometry args={[0.08, 0.1, 0.08]} />
            </mesh>
          ))}
        </group>
      )}

      {/* King Staunton Cross Finial */}
      {type === "k" && (
        <group position={[0, 1.5, 0]}>
          {/* Vertical stem */}
          <mesh position={[0, 0.12, 0]} material={goldAccentMaterial} castShadow>
            <boxGeometry args={[0.045, 0.24, 0.045]} />
          </mesh>
          {/* Horizontal crossbar */}
          <mesh position={[0, 0.16, 0]} material={goldAccentMaterial} castShadow>
            <boxGeometry args={[0.16, 0.045, 0.045]} />
          </mesh>
          {/* Apex bead */}
          <mesh position={[0, 0.25, 0]} material={goldAccentMaterial}>
            <sphereGeometry args={[0.035, 12, 12]} />
          </mesh>
        </group>
      )}

      {/* Queen Coronet Pearls */}
      {type === "q" && (
        <group position={[0, 1.34, 0]}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((idx) => {
            const angle = (idx / 8) * Math.PI * 2;
            return (
              <mesh
                key={idx}
                position={[Math.cos(angle) * 0.28, 0.04, Math.sin(angle) * 0.28]}
                material={goldAccentMaterial}
              >
                <sphereGeometry args={[0.025, 8, 8]} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* King In Check Pulsing Aura Ring */}
      {isKingInCheck && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.38, 0.52, 32]} />
          <meshBasicMaterial
            color="#FF1A1A"
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

// Render all active pieces from chess state
export const StauntonPiecesRenderer: React.FC = () => {
  const chess = useChessStore((s) => s.chess);
  const isCheck = useChessStore((s) => s.isCheck);
  const board = chess.board();

  const piecesList = useMemo(() => {
    const list: Array<{
      key: string;
      square: Square;
      type: PieceSymbol;
      color: Color;
      isKingInCheck: boolean;
    }> = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece) {
          const square = `${String.fromCharCode(97 + c)}${8 - r}` as Square;
          const isCheckKing =
            isCheck && piece.type === "k" && piece.color === chess.turn();
          list.push({
            key: `${square}-${piece.color}-${piece.type}`,
            square,
            type: piece.type,
            color: piece.color,
            isKingInCheck: isCheckKing,
          });
        }
      }
    }
    return list;
  }, [board, isCheck, chess]);

  return (
    <group>
      {piecesList.map((p) => (
        <ChessPieceMesh
          key={p.key}
          square={p.square}
          type={p.type}
          color={p.color}
          isKingInCheck={p.isKingInCheck}
        />
      ))}
    </group>
  );
};
