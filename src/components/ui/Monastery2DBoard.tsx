"use client";

import React, { useMemo } from "react";
import { useChessStore } from "@/store/useChessStore";
import { Square } from "chess.js";
import { ChessComPiece } from "./ChessComPieces";

export const Monastery2DBoard: React.FC = () => {
  const chess = useChessStore((s) => s.chess);
  const selectSquare = useChessStore((s) => s.selectSquare);
  const selectedSquare = useChessStore((s) => s.selectedSquare);
  const validMoves = useChessStore((s) => s.validMoves);
  const lastMove = useChessStore((s) => s.lastMove);
  const playerColor = useChessStore((s) => s.playerColor);
  const isCheck = useChessStore((s) => s.isCheck);
  const turn = chess.turn();

  // Perspective orientation: Never flip on turn moves, strictly follow playerColor
  const isFlipped = playerColor === "b";

  // Precompute legal move destinations for instant lookup
  const moveMap = useMemo(() => {
    const map = new Map<Square, { isCapture: boolean }>();
    validMoves.forEach((m) => {
      map.set(m.to, { isCapture: !!m.captured });
    });
    return map;
  }, [validMoves]);

  // Files and ranks based on board orientation
  const files = useMemo(
    () => (isFlipped ? ["h", "g", "f", "e", "d", "c", "b", "a"] : ["a", "b", "c", "d", "e", "f", "g", "h"]),
    [isFlipped]
  );
  const ranks = useMemo(
    () => (isFlipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1]),
    [isFlipped]
  );

  return (
    <div className="flex items-center justify-center w-full h-full p-2 md:p-6 select-none">
      {/* Exact Chess.com Style Board Container */}
      <div className="relative w-full max-w-[min(82vh,660px)] aspect-square rounded-lg shadow-2xl overflow-hidden border-2 border-stone-800 bg-[#312E2B]">
        {/* 8x8 Board Grid */}
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
          {ranks.map((rank, rIdx) =>
            files.map((file, fIdx) => {
              const square = `${file}${rank}` as Square;
              const isLight = (rIdx + fIdx) % 2 === 0;
              const piece = chess.get(square);
              const isSelected = selectedSquare === square;
              const moveInfo = moveMap.get(square);
              const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
              const isKingCheck = isCheck && piece && piece.type === "k" && piece.color === turn;

              // Chess.com Square Colors:
              // Light: #EBECD0, Dark: #739552
              // Selected / Last Move highlight: #BBCA43 (60% on last move, 80% on selected)
              let squareBg = isLight ? "bg-[#EBECD0]" : "bg-[#739552]";

              return (
                <button
                  key={square}
                  type="button"
                  onClick={() => selectSquare(square)}
                  className={`relative flex items-center justify-center w-full h-full p-0 border-0 focus:outline-none transition-none cursor-pointer ${squareBg}`}
                >
                  {/* Last Move Highlight (Chess.com yellow-green tint) */}
                  {isLastMove && !isSelected && (
                    <div className="absolute inset-0 bg-[#BACA44] opacity-50 pointer-events-none" />
                  )}

                  {/* Selected Square Highlight (Chess.com vibrant yellow-green) */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-[#BACA44] opacity-80 pointer-events-none" />
                  )}

                  {/* King in Check Red Glow */}
                  {isKingCheck && (
                    <div className="absolute inset-0 bg-red-600/60 rounded-full animate-pulse pointer-events-none" />
                  )}

                  {/* Chess.com Coordinate Labels */}
                  {/* Rank on left edge */}
                  {fIdx === 0 && (
                    <span
                      className={`absolute top-0.5 left-1 text-[11px] font-bold font-sans pointer-events-none ${
                        isLight ? "text-[#739552]" : "text-[#EBECD0]"
                      }`}
                    >
                      {rank}
                    </span>
                  )}
                  {/* File on bottom edge */}
                  {rIdx === 7 && (
                    <span
                      className={`absolute bottom-0.5 right-1 text-[11px] font-bold font-sans uppercase pointer-events-none ${
                        isLight ? "text-[#739552]" : "text-[#EBECD0]"
                      }`}
                    >
                      {file}
                    </span>
                  )}

                  {/* Exact Chess.com Vector Piece */}
                  {piece && (
                    <div
                      className={`relative z-10 w-[88%] h-[88%] flex items-center justify-center transition-transform ${
                        isSelected ? "scale-105" : "hover:scale-[1.02]"
                      }`}
                    >
                      <ChessComPiece type={piece.type} color={piece.color} />
                    </div>
                  )}

                  {/* Chess.com Legal Move Destination: Translucent Gray Dot */}
                  {moveInfo && !moveInfo.isCapture && (
                    <div className="absolute z-20 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black/20 pointer-events-none" />
                  )}

                  {/* Chess.com Legal Capture Destination: Hollow Circular Corner Ring */}
                  {moveInfo && moveInfo.isCapture && (
                    <div className="absolute z-20 inset-0 rounded-full border-4 sm:border-[6px] border-black/20 pointer-events-none" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
