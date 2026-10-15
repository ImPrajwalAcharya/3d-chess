"use client";

import React, { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PieceSymbol, Color, Square } from "chess.js";
import { useChessStore } from "@/store/useChessStore";
import {
  createStupaKingDomeGeometry,
  createStupaSpireGeometry,
  createPagodaBaseGeometry,
  createPagodaRoofGeometry,
  createShikharBishopGeometry,
  createPavilionBaseGeometry,
  createMiniChaityaPawnGeometry,
} from "./nepaliTempleGeometries";

// Map algebraic square ("e4") to 3D coordinates (x, z)
export function squareToCoords(square: Square): [number, number] {
  const file = square.charCodeAt(0) - 97; // a=0, h=7 -> -3.5 to +3.5
  const rank = parseInt(square[1], 10); // 1 to 8 -> +3.5 to -3.5
  const x = file - 3.5;
  const z = 3.5 - (rank - 1);
  return [x, z];
}

// -------------------------------------------------------------
// Pre-instantiated Shared Geometries
// (Avoids React Hook violations on pawn promotion and saves GPU memory)
// -------------------------------------------------------------
const STUPA_KING_DOME_GEO = createStupaKingDomeGeometry();
const STUPA_SPIRE_GEO = createStupaSpireGeometry();
const PAGODA_BASE_GEO = createPagodaBaseGeometry();
const PAGODA_ROOF_T1_GEO = createPagodaRoofGeometry(0.38, 0.16);
const PAGODA_ROOF_T2_GEO = createPagodaRoofGeometry(0.31, 0.15);
const PAGODA_ROOF_T3_GEO = createPagodaRoofGeometry(0.24, 0.14);
const SHIKHAR_BISHOP_GEO = createShikharBishopGeometry();
const PAVILION_BASE_GEO = createPavilionBaseGeometry();
const PAVILION_ROOF_GEO = createPagodaRoofGeometry(0.36, 0.18);
const MINI_CHAITYA_PAWN_GEO = createMiniChaityaPawnGeometry();

// Pre-instantiated Shared Materials
const WHITE_TEMPLE_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#E8DEC8", // Creamy Boxwood Ivory
  roughness: 0.30,
  metalness: 0.05,
});

const BLACK_TEMPLE_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#1B1D20", // Deep Obsidian / Blackened Bronze
  roughness: 0.20,
  metalness: 0.42,
});

const GOLD_GAJUR_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#F2C744", // Sacred 24K Temple Gold
  metalness: 0.90,
  roughness: 0.16,
});

const WHITE_TRIM_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#9B2226", // Sacred Tibetan Maroon
  roughness: 0.32,
  metalness: 0.12,
});

const BLACK_TRIM_MATERIAL = new THREE.MeshStandardMaterial({
  color: "#E5A93B", // Rich Gold Accent for Black
  roughness: 0.32,
  metalness: 0.75,
});

interface PieceMaterials {
  body: THREE.MeshStandardMaterial;
  gajur: THREE.MeshStandardMaterial;
  trim: THREE.MeshStandardMaterial;
}

// -------------------------------------------------------------
// Individual Piece Subcomponents (Isolates JSX and prevents hook bugs)
// -------------------------------------------------------------
const KingModel: React.FC<{ materials: PieceMaterials }> = ({ materials }) => (
  <group>
    {/* Hemispherical Stupa Dome (Anda) */}
    <mesh geometry={STUPA_KING_DOME_GEO} material={materials.body} castShadow receiveShadow />

    {/* Square Harmika with Wisdom Eyes */}
    <mesh position={[0, 0.54, 0]} material={materials.gajur} castShadow>
      <boxGeometry args={[0.26, 0.16, 0.26]} />
    </mesh>

    {/* 13 Spire Rings, Chhatra & Golden Gajur */}
    <mesh position={[0, 0.62, 0]} geometry={STUPA_SPIRE_GEO} material={materials.gajur} castShadow />
  </group>
);

const QueenModel: React.FC<{ materials: PieceMaterials }> = ({ materials }) => (
  <group>
    {/* Stepped Pagoda Plinth & Sanctum */}
    <mesh geometry={PAGODA_BASE_GEO} material={materials.body} castShadow receiveShadow />

    {/* Tier 1 Pagoda Roof */}
    <mesh position={[0, 0.35, 0]} geometry={PAGODA_ROOF_T1_GEO} material={materials.trim} castShadow />

    {/* Mid Sanctum Chamber */}
    <mesh position={[0, 0.56, 0]} material={materials.body} castShadow>
      <boxGeometry args={[0.28, 0.18, 0.28]} />
    </mesh>

    {/* Tier 2 Pagoda Roof */}
    <mesh position={[0, 0.65, 0]} geometry={PAGODA_ROOF_T2_GEO} material={materials.trim} castShadow />

    {/* Upper Chamber */}
    <mesh position={[0, 0.83, 0]} material={materials.body} castShadow>
      <boxGeometry args={[0.2, 0.14, 0.2]} />
    </mesh>

    {/* Tier 3 Pagoda Roof */}
    <mesh position={[0, 0.92, 0]} geometry={PAGODA_ROOF_T3_GEO} material={materials.trim} castShadow />

    {/* Triple Golden Pinnacle (Tri-Gajur) */}
    <group position={[0, 1.08, 0]}>
      <mesh position={[0, 0.12, 0]} material={materials.gajur} castShadow>
        <cylinderGeometry args={[0.015, 0.05, 0.24, 16]} />
      </mesh>
      <mesh position={[0, 0.25, 0]} material={materials.gajur}>
        <sphereGeometry args={[0.035, 12, 12]} />
      </mesh>
      <mesh position={[-0.08, 0.08, 0]} material={materials.gajur}>
        <cylinderGeometry args={[0.01, 0.03, 0.16, 12]} />
      </mesh>
      <mesh position={[0.08, 0.08, 0]} material={materials.gajur}>
        <cylinderGeometry args={[0.01, 0.03, 0.16, 12]} />
      </mesh>
    </group>
  </group>
);

const BishopModel: React.FC<{ materials: PieceMaterials }> = ({ materials }) => (
  <group>
    {/* Fluted Shikhar Stone Tower */}
    <mesh geometry={SHIKHAR_BISHOP_GEO} material={materials.body} castShadow receiveShadow />

    {/* 4 Cardinal Torana Niche Shrines */}
    {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
      <mesh
        key={i}
        position={[Math.sin(angle) * 0.23, 0.45, Math.cos(angle) * 0.23]}
        rotation={[0, angle, 0]}
        material={materials.gajur}
        castShadow
      >
        <boxGeometry args={[0.1, 0.16, 0.04]} />
      </mesh>
    ))}

    {/* Top Golden Kalasha Finial */}
    <mesh position={[0, 1.28, 0]} material={materials.gajur}>
      <sphereGeometry args={[0.04, 12, 12]} />
    </mesh>
  </group>
);

const KnightModel: React.FC<{ materials: PieceMaterials }> = ({ materials }) => (
  <group>
    {/* Carved Temple Plinth */}
    <mesh position={[0, 0.08, 0]} material={materials.body} castShadow>
      <boxGeometry args={[0.54, 0.16, 0.54]} />
    </mesh>
    <mesh position={[0, 0.17, 0]} material={materials.trim}>
      <boxGeometry args={[0.46, 0.04, 0.46]} />
    </mesh>

    {/* Guardian Steed Body: Powerful Arched Chest & Neck */}
    <mesh position={[0, 0.45, 0.04]} rotation={[-0.25, 0, 0]} material={materials.body} castShadow>
      <cylinderGeometry args={[0.16, 0.22, 0.55, 16]} />
    </mesh>

    {/* Newa Flame Mane Scrolls */}
    <mesh position={[0, 0.52, -0.12]} rotation={[-0.3, 0, 0]} material={materials.gajur} castShadow>
      <boxGeometry args={[0.08, 0.42, 0.12]} />
    </mesh>

    {/* Ceremonial Temple Bell (Ghanti) */}
    <mesh position={[0, 0.35, 0.16]} material={materials.gajur} castShadow>
      <sphereGeometry args={[0.07, 12, 12]} />
    </mesh>

    {/* Head */}
    <mesh position={[0, 0.68, 0.14]} rotation={[0.3, 0, 0]} material={materials.body} castShadow>
      <boxGeometry args={[0.24, 0.24, 0.32]} />
    </mesh>

    {/* Snout */}
    <mesh position={[0, 0.62, 0.28]} rotation={[0.45, 0, 0]} material={materials.body} castShadow>
      <boxGeometry args={[0.2, 0.16, 0.18]} />
    </mesh>

    {/* Forehead Jewel */}
    <mesh position={[0, 0.78, 0.24]} material={materials.gajur}>
      <sphereGeometry args={[0.04, 8, 8]} />
    </mesh>

    {/* Guardian Ears */}
    <mesh position={[-0.1, 0.86, 0.06]} rotation={[0.2, -0.2, 0]} material={materials.gajur}>
      <coneGeometry args={[0.045, 0.14, 8]} />
    </mesh>
    <mesh position={[0.1, 0.86, 0.06]} rotation={[0.2, 0.2, 0]} material={materials.gajur}>
      <coneGeometry args={[0.045, 0.14, 8]} />
    </mesh>
  </group>
);

const RookModel: React.FC<{ materials: PieceMaterials }> = ({ materials }) => (
  <group>
    {/* Heavy Timber Plinth */}
    <mesh geometry={PAVILION_BASE_GEO} material={materials.body} castShadow receiveShadow />

    {/* 4 Carved Corner Pillars */}
    {[
      [-0.18, -0.18],
      [0.18, -0.18],
      [-0.18, 0.18],
      [0.18, 0.18],
    ].map(([px, pz], idx) => (
      <group key={idx} position={[px, 0.6, pz]}>
        <mesh position={[0, 0.15, 0]} material={materials.trim} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 0.3, 12]} />
        </mesh>
        <mesh position={[0, 0.3, 0]} material={materials.gajur}>
          <boxGeometry args={[0.09, 0.04, 0.09]} />
        </mesh>
      </group>
    ))}

    {/* Inner Sanctum Shrine */}
    <mesh position={[0, 0.75, 0]} material={materials.gajur} castShadow>
      <cylinderGeometry args={[0.09, 0.11, 0.28, 16]} />
    </mesh>

    {/* Broad Overhanging Pagoda Pavilion Roof */}
    <mesh position={[0, 0.9, 0]} geometry={PAVILION_ROOF_GEO} material={materials.body} castShadow />

    {/* Central Golden Gajur */}
    <mesh position={[0, 1.1, 0]} material={materials.gajur} castShadow>
      <cylinderGeometry args={[0.015, 0.04, 0.16, 12]} />
    </mesh>
    <mesh position={[0, 1.19, 0]} material={materials.gajur}>
      <sphereGeometry args={[0.03, 8, 8]} />
    </mesh>
  </group>
);

const PawnModel: React.FC<{ materials: PieceMaterials }> = ({ materials }) => (
  <group>
    {/* Stepped Lotus Base, Hemispherical Dome & Spire */}
    <mesh geometry={MINI_CHAITYA_PAWN_GEO} material={materials.body} castShadow receiveShadow />

    {/* Mini Gold Garland Band */}
    <mesh position={[0, 0.15, 0]} material={materials.gajur}>
      <cylinderGeometry args={[0.22, 0.22, 0.02, 24]} />
    </mesh>

    {/* Apex Sacred Jewel Pinnacle (Ratna/Mani) */}
    <mesh position={[0, 0.76, 0]} material={materials.gajur}>
      <sphereGeometry args={[0.04, 12, 12]} />
    </mesh>
  </group>
);

interface PieceProps {
  id: string;
  type: PieceSymbol;
  color: Color;
  square: Square;
  isCaptured: boolean;
  isKingInCheck?: boolean;
}

// -------------------------------------------------------------
// Procedural Nepali Temple Piece Mesh Component
// -------------------------------------------------------------
export const NepaliTemplePieceMesh: React.FC<PieceProps> = ({
  type,
  color,
  square,
  isCaptured,
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

  // Target coordinates for active square
  const [targetX, targetZ] = useMemo(() => squareToCoords(square), [square]);

  // Current physical 3D position
  const currentPos = useRef(new THREE.Vector3(targetX, 0, targetZ));
  const isMoving = useRef(false);
  const startCoords = useRef<[number, number]>([targetX, targetZ]);
  const moveProgress = useRef(1);

  // Synchronous state tracking for instant animation start on square change
  const [prevSquare, setPrevSquare] = useState(square);
  if (prevSquare !== square) {
    setPrevSquare(square);
    startCoords.current = [currentPos.current.x, currentPos.current.z];
    isMoving.current = true;
    moveProgress.current = 0;
  }

  const isWhite = color === "w";
  const isSelected = selectedSquare === square;

  // Material set for this piece color
  const materials: PieceMaterials = useMemo(
    () => ({
      body: isWhite ? WHITE_TEMPLE_MATERIAL : BLACK_TEMPLE_MATERIAL,
      gajur: GOLD_GAJUR_MATERIAL,
      trim: isWhite ? WHITE_TRIM_MATERIAL : BLACK_TRIM_MATERIAL,
    }),
    [isWhite]
  );

  // Can the user select this piece directly?
  const canSelectThisPiece =
    !isGameOver &&
    !isAIThinking &&
    (gameMode === "pass_and_play" || turn === playerColor) &&
    turn === color;

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (isCaptured) {
      // Shrink and sink below board upon capture
      groupRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), delta * 8);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, -1, delta * 6);
      return;
    }

    // Always restore scale towards 1 if active on board (essential for UNDO!)
    groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 12);

    // Parabolic movement interpolation
    if (isMoving.current) {
      moveProgress.current += delta * 3.2; // ~0.3s smooth travel
      if (moveProgress.current >= 1) {
        moveProgress.current = 1;
        isMoving.current = false;
        currentPos.current.set(targetX, 0, targetZ);
      } else {
        const p = moveProgress.current;
        // Parabolic arc (hop over other pieces)
        const hopY = Math.sin(p * Math.PI) * 0.95;
        const curX = THREE.MathUtils.lerp(startCoords.current[0], targetX, p);
        const curZ = THREE.MathUtils.lerp(startCoords.current[1], targetZ, p);

        currentPos.current.set(curX, hopY, curZ);
      }
    } else {
      // Hover elevation
      const targetHoverY = isSelected ? 0.35 : hovered && canSelectThisPiece ? 0.16 : 0;
      currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, targetHoverY, delta * 12);
      currentPos.current.x = targetX;
      currentPos.current.z = targetZ;
    }

    groupRef.current.position.copy(currentPos.current);

    // Subtle breathing float if selected
    if (isSelected) {
      groupRef.current.position.y += Math.sin(Date.now() * 0.006) * 0.04;
    }
  });

  // Face rotation: White faces +z (0), Black faces -z (Math.PI)
  const pieceRotationY = isWhite ? 0 : Math.PI;

  return (
    <group
      ref={groupRef}
      rotation={[0, pieceRotationY, 0]}
      onClick={(e: any) => {
        // Only trigger on primary left click (button 0)
        if (e.button !== 0 && e.nativeEvent?.button !== 0) return;
        e.stopPropagation();
        selectSquare(square);
      }}
      onContextMenu={(e: any) => {
        e.stopPropagation();
        if (e.nativeEvent?.preventDefault) {
          e.nativeEvent.preventDefault();
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (canSelectThisPiece || selectedSquare) {
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
      <mesh position={[0, 0.005, 0]} material={materials.trim}>
        <cylinderGeometry args={[0.34, 0.34, 0.015, 32]} />
      </mesh>

      {/* Luminous Gold/Bronze Base Ring */}
      <mesh position={[0, 0.035, 0]} material={materials.gajur} castShadow>
        <cylinderGeometry args={[0.39, 0.41, 0.04, 32]} />
      </mesh>

      {/* Piece Type Model - Cleanly switches on promotion without hook violations */}
      {type === "k" && <KingModel materials={materials} />}
      {type === "q" && <QueenModel materials={materials} />}
      {type === "b" && <BishopModel materials={materials} />}
      {type === "n" && <KnightModel materials={materials} />}
      {type === "r" && <RookModel materials={materials} />}
      {type === "p" && <PawnModel materials={materials} />}

      {/* King In Check Crimson Aura Ring */}
      {isKingInCheck && (
        <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.38, 0.54, 32]} />
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

// -------------------------------------------------------------
// Persistent Piece Manager & Scene Renderer
// -------------------------------------------------------------
export const NepaliPiecesRenderer: React.FC = () => {
  const chess = useChessStore((s) => s.chess);
  const fen = useChessStore((s) => s.fen);
  const isCheck = useChessStore((s) => s.isCheck);
  const moveHistory = useChessStore((s) => s.moveHistory);

  // Maintain stable list of 32 pieces across moves
  const piecesStateRef = useRef<Map<string, { type: PieceSymbol; color: Color; square: Square; isCaptured: boolean }>>(new Map());

  // Initialize or synchronize pieces from current FEN
  const piecesList = useMemo(() => {
    const board = chess.board();
    const map = piecesStateRef.current;

    // Reset cleanly if new game / pristine starting board
    if (moveHistory.length === 0 || map.size === 0) {
      map.clear();
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const piece = board[r][c];
          if (piece) {
            const sq = `${String.fromCharCode(97 + c)}${8 - r}` as Square;
            const id = `${piece.color}_${piece.type}_${sq}`;
            map.set(id, {
              type: piece.type,
              color: piece.color,
              square: sq,
              isCaptured: false,
            });
          }
        }
      }
    } else {
      // Synchronize with active board
      const activeBoardSquares = new Map<Square, { type: PieceSymbol; color: Color }>();
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const p = board[r][c];
          if (p) {
            const sq = `${String.fromCharCode(97 + c)}${8 - r}` as Square;
            activeBoardSquares.set(sq, { type: p.type, color: p.color });
          }
        }
      }

      const unmatchedActiveSquares = new Map(activeBoardSquares);

      // Pass 1: Keep pieces that haven't moved
      map.forEach((piece) => {
        if (!piece.isCaptured) {
          const currentAtSquare = unmatchedActiveSquares.get(piece.square);
          if (currentAtSquare && currentAtSquare.type === piece.type && currentAtSquare.color === piece.color) {
            unmatchedActiveSquares.delete(piece.square);
          }
        }
      });

      // Pass 2: Assign uncaptured pieces that moved to new unmatched squares
      // (includes pawn promotion and undo of promotion)
      map.forEach((piece, id) => {
        if (!piece.isCaptured) {
          const currentAtSquare = activeBoardSquares.get(piece.square);
          const stillThere = currentAtSquare && currentAtSquare.type === piece.type && currentAtSquare.color === piece.color;

          if (!stillThere) {
            // Find an unmatched square that has this piece's color and matching type (or pawn promotion/undo)
            let foundSquare: Square | null = null;
            unmatchedActiveSquares.forEach((p, sq) => {
              if (
                !foundSquare &&
                p.color === piece.color &&
                (p.type === piece.type || piece.type === "p" || id.includes("_p_"))
              ) {
                foundSquare = sq;
              }
            });

            if (foundSquare) {
              const matched = unmatchedActiveSquares.get(foundSquare)!;
              piece.square = foundSquare;
              piece.type = matched.type; // handles pawn promotion & undo to pawn!
              unmatchedActiveSquares.delete(foundSquare);
            } else {
              // Captured!
              piece.isCaptured = true;
            }
          }
        }
      });

      // Pass 3: Revive captured pieces for remaining unmatched squares (crucial for UNDO!)
      if (unmatchedActiveSquares.size > 0) {
        unmatchedActiveSquares.forEach((p, sq) => {
          let revived = false;
          map.forEach((piece, id) => {
            if (
              !revived &&
              piece.isCaptured &&
              piece.color === p.color &&
              (piece.type === p.type || piece.type === "p" || id.includes("_p_"))
            ) {
              piece.isCaptured = false;
              piece.square = sq;
              piece.type = p.type;
              revived = true;
              unmatchedActiveSquares.delete(sq);
            }
          });
        });
      }

      // Pass 4: Final verification - if piece's current square is not on board, it is captured
      map.forEach((piece) => {
        if (!piece.isCaptured) {
          const p = activeBoardSquares.get(piece.square);
          if (!p || p.color !== piece.color || p.type !== piece.type) {
            piece.isCaptured = true;
          }
        }
      });
    }

    // Convert map to array for rendering
    const list: Array<{
      id: string;
      square: Square;
      type: PieceSymbol;
      color: Color;
      isCaptured: boolean;
      isKingInCheck: boolean;
    }> = [];

    map.forEach((p, id) => {
      const isCheckKing =
        isCheck && p.type === "k" && p.color === chess.turn() && !p.isCaptured;

      list.push({
        id,
        square: p.square,
        type: p.type,
        color: p.color,
        isCaptured: p.isCaptured,
        isKingInCheck: isCheckKing,
      });
    });

    return list;
  }, [fen, chess, isCheck, moveHistory]);

  return (
    <group>
      {piecesList.map((p) => (
        <NepaliTemplePieceMesh
          key={p.id}
          id={p.id}
          square={p.square}
          type={p.type}
          color={p.color}
          isCaptured={p.isCaptured}
          isKingInCheck={p.isKingInCheck}
        />
      ))}
    </group>
  );
};
