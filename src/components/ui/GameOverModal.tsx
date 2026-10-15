"use client";

import React, { useEffect } from "react";
import { useChessStore } from "@/store/useChessStore";
import confetti from "canvas-confetti";
import { Trophy, RotateCcw, PlusCircle } from "lucide-react";

export const GameOverModal: React.FC = () => {
  const isGameOver = useChessStore((s) => s.isGameOver);
  const gameResult = useChessStore((s) => s.gameResult);
  const gameMode = useChessStore((s) => s.gameMode);
  const initGame = useChessStore((s) => s.initGame);
  const moveHistory = useChessStore((s) => s.moveHistory);
  const requestRematch = useChessStore((s) => s.requestRematch);
  const acceptRematch = useChessStore((s) => s.acceptRematch);
  const incomingRematchOffer = useChessStore((s) => s.incomingRematchOffer);

  const [dismissed, setDismissed] = React.useState(false);

  // Reset dismissed state whenever a new game finishes
  React.useEffect(() => {
    if (isGameOver) {
      setDismissed(false);
    }
  }, [isGameOver, gameResult]);

  useEffect(() => {
    if (isGameOver && gameResult?.includes("Wins") && !dismissed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#C5A059", "#967347", "#8B1E24", "#D8C4AA"],
      });
    }
  }, [isGameOver, gameResult, dismissed]);

  if (!isGameOver) return null;

  if (dismissed) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setDismissed(false)}
          className="flex items-center gap-2 py-1.5 px-4 rounded-full bg-[#1A110B] hover:bg-[#251810] border border-[#6B4E31] text-[#E8DEC8] text-xs font-serif shadow-2xl transition-all"
        >
          <Trophy className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Match Concluded ({gameResult}) — View Results</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="relative w-full max-w-md p-6 md:p-8 rounded-xl bg-[#160E0A] border border-[#3E281C] shadow-2xl text-center">
        {/* Dismiss / Close button to view final board */}
        <button
          onClick={() => setDismissed(true)}
          title="Dismiss to inspect board"
          className="absolute top-4 right-4 text-[#7A6756] hover:text-[#D8C4AA] text-lg font-bold transition-colors"
        >
          ✕
        </button>

        {/* Ceremonial Emblem */}
        <div className="flex justify-center mb-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#20140D] border border-[#442C1E] text-[#C5A059] shadow-sm">
            <Trophy className="w-6 h-6 text-[#C5A059]" />
          </div>
        </div>

        {/* Sacred Header */}
        <div className="text-[#C5A059] font-serif tracking-widest text-[11px] uppercase mb-1">
          ☸ Himalayan Chronicle ☸
        </div>
        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#E8DEC8] tracking-wide mb-3">
          Match Concluded
        </h2>

        {/* Termination Reason */}
        <div className="text-sm font-serif font-semibold text-[#E8DEC8] mb-5 px-4 py-2 rounded-lg bg-[#1E140E] border border-[#3E281C]">
          {gameResult || "Game Over"}
        </div>

        {/* Match Statistics */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 text-xs text-[#A69078]">
          <div className="p-2.5 rounded-lg bg-[#120B07] border border-[#2A1B13]">
            <span className="block text-[#7A6756] text-[10px] uppercase font-mono mb-0.5">
              Total Moves
            </span>
            <span className="text-sm font-bold text-[#E8DEC8]">
              {Math.ceil(moveHistory.length / 2)}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#120B07] border border-[#2A1B13]">
            <span className="block text-[#7A6756] text-[10px] uppercase font-mono mb-0.5">
              Discipline
            </span>
            <span className="text-sm font-bold text-[#E8DEC8] capitalize">
              {gameMode.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Incoming Rematch banner for P2P */}
        {gameMode === "p2p" && incomingRematchOffer && (
          <div className="mb-4 p-2.5 rounded-lg bg-[#20140D] border border-[#6B4E31] text-[#E8DEC8] text-xs font-serif flex items-center justify-between">
            <span>Opponent offers a rematch</span>
            <button
              onClick={acceptRematch}
              className="px-3 py-1 bg-[#967347] hover:bg-[#A88252] text-[#140D09] font-bold rounded text-xs transition-colors"
            >
              Accept
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {gameMode === "p2p" ? (
            <button
              onClick={requestRematch}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#967347] hover:bg-[#A88252] text-[#140D09] font-serif font-bold text-xs uppercase tracking-wider border border-[#B38E5B] shadow-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Offer Rematch</span>
            </button>
          ) : (
            <button
              onClick={() => initGame()}
              className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#967347] hover:bg-[#A88252] text-[#140D09] font-serif font-bold text-xs uppercase tracking-wider border border-[#B38E5B] shadow-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Again</span>
            </button>
          )}

          <button
            onClick={() => {
              initGame();
            }}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-[#1E140E] hover:bg-[#281A12] text-[#CDB99E] border border-[#3E281C] text-xs font-serif transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Configure New Match</span>
          </button>
        </div>
      </div>
    </div>
  );
};
