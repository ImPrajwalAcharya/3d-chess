"use client";

import React, { useEffect } from "react";
import { PieceSymbol } from "chess.js";
import { useChessStore } from "@/store/useChessStore";
import { ChessComPiece } from "./ChessComPieces";

export const PromotionModal: React.FC = () => {
  const pendingPromotion = useChessStore((s) => s.pendingPromotion);
  const promotePawn = useChessStore((s) => s.promotePawn);
  const cancelPromotion = useChessStore((s) => s.cancelPromotion);
  const chess = useChessStore((s) => s.chess);

  // Keyboard shortcut listener (Escape to cancel, Q/R/B/N to select)
  useEffect(() => {
    if (!pendingPromotion) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelPromotion();
      } else if (e.key.toLowerCase() === "q") {
        promotePawn("q");
      } else if (e.key.toLowerCase() === "r") {
        promotePawn("r");
      } else if (e.key.toLowerCase() === "b") {
        promotePawn("b");
      } else if (e.key.toLowerCase() === "n") {
        promotePawn("n");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pendingPromotion, cancelPromotion, promotePawn]);

  if (!pendingPromotion) return null;

  // Determine the color of the pawn being promoted
  const pawnOnSquare = chess.get(pendingPromotion.from);
  const promotingColor = pawnOnSquare?.color || chess.turn();

  const choices: Array<{ type: PieceSymbol; label: string; nepaliLabel: string; hotkey: string }> = [
    { type: "q", label: "Queen", nepaliLabel: "Rani / Taleju", hotkey: "Q" },
    { type: "r", label: "Rook", nepaliLabel: "Hatti / Chariot", hotkey: "R" },
    { type: "b", label: "Bishop", nepaliLabel: "Uth / Camel", hotkey: "B" },
    { type: "n", label: "Knight", nepaliLabel: "Ghoda / Steed", hotkey: "N" },
  ];

  return (
    <div
      onClick={cancelPromotion}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm select-none p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm p-6 rounded-xl bg-[#160E0A] border border-[#3E281C] shadow-2xl text-center"
      >
        {/* Sacred Decorative Header */}
        <div className="flex items-center justify-center gap-2 mb-1 text-[#C5A059] font-serif tracking-widest text-[11px] uppercase">
          <span>☸</span>
          <span>Pawn Promotion</span>
          <span>☸</span>
        </div>
        <h2 className="text-lg font-serif font-bold text-[#E8DEC8] mb-1">
          Promote Your Pawn
        </h2>
        <p className="text-xs text-[#8C7662] mb-4">
          Select a royal piece or press hotkey
        </p>

        {/* Choice Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {choices.map((c) => (
            <button
              key={c.type}
              type="button"
              onClick={() => promotePawn(c.type)}
              className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#120B07] border border-[#2A1B13] hover:border-[#8C6D46] hover:bg-[#1E140E] transition-all group cursor-pointer"
            >
              <div className="w-14 h-14 flex items-center justify-center mb-1 drop-shadow group-hover:scale-105 transition-transform">
                <ChessComPiece type={c.type} color={promotingColor} />
              </div>
              <span className="text-[#E8DEC8] font-serif font-bold text-xs tracking-wide">
                {c.label}
              </span>
              <span className="text-[#8C7662] text-[10px] font-serif mb-1">
                {c.nepaliLabel}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1C120C] border border-[#2E1E15] text-[#C5A059]">
                [{c.hotkey}]
              </span>
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={cancelPromotion}
          className="w-full py-1.5 px-3 rounded bg-[#1A110B] hover:bg-[#22160F] text-[#8C7662] hover:text-[#D8C4AA] text-xs font-serif border border-[#2A1B13] transition-colors"
        >
          Cancel Move (Esc)
        </button>
      </div>
    </div>
  );
};
