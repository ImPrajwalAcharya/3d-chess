"use client";

import React, { useState } from "react";
import { useChessStore } from "@/store/useChessStore";
import { Copy, Check, Flag, Handshake, BarChart2, Undo2 } from "lucide-react";
import { getEvaluationBar } from "@/lib/aiEngine";

export const MoveHistoryPanel: React.FC = () => {
  const moveHistory = useChessStore((s) => s.moveHistory);
  const chess = useChessStore((s) => s.chess);
  const gameMode = useChessStore((s) => s.gameMode);
  const evaluationScore = useChessStore((s) => s.evaluationScore);
  const showEvalBar = useChessStore((s) => s.showEvalBar);
  const setShowEvalBar = useChessStore((s) => s.setShowEvalBar);
  const resignGame = useChessStore((s) => s.resignGame);
  const offerDraw = useChessStore((s) => s.offerDraw);
  const undoMove = useChessStore((s) => s.undoMove);
  const isAIThinking = useChessStore((s) => s.isAIThinking);
  const isGameOver = useChessStore((s) => s.isGameOver);

  const [copiedFEN, setCopiedFEN] = useState(false);
  const [copiedPGN, setCopiedPGN] = useState(false);
  const [confirmingResign, setConfirmingResign] = useState(false);

  // Group moves into pairs: [ { moveNum: 1, white: 'e4', black: 'e5' } ]
  const movePairs: Array<{ moveNum: number; white?: string; black?: string }> = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    movePairs.push({
      moveNum: Math.floor(i / 2) + 1,
      white: moveHistory[i]?.san,
      black: moveHistory[i + 1]?.san,
    });
  }

  const handleCopyFEN = () => {
    navigator.clipboard.writeText(chess.fen());
    setCopiedFEN(true);
    setTimeout(() => setCopiedFEN(false), 2000);
  };

  const handleCopyPGN = () => {
    navigator.clipboard.writeText(chess.pgn());
    setCopiedPGN(true);
    setTimeout(() => setCopiedPGN(false), 2000);
  };

  const { whitePercent, label } = getEvaluationBar(evaluationScore);

  return (
    <div className="flex flex-col h-full bg-[#140D09] border border-[#2A1B13] rounded-lg shadow-lg overflow-hidden select-none">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[#2A1B13] bg-[#18100A]">
        <div className="flex items-center gap-2">
          <span className="text-[#C5A059] text-xs font-serif">☸</span>
          <h3 className="font-serif font-bold text-[#E8DEC8] text-xs tracking-wider uppercase">
            Chronicle of Moves
          </h3>
        </div>

        {/* Toggle Eval Bar button */}
        <button
          onClick={() => setShowEvalBar(!showEvalBar)}
          title="Toggle Evaluation Bar"
          className={`p-1 rounded border transition-colors ${
            showEvalBar
              ? "bg-[#251810] border-[#523727] text-[#C5A059]"
              : "bg-[#18110D] border-[#2A1B13] text-[#7A6756] hover:text-[#D8C4AA]"
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Evaluation Bar (if enabled) */}
      {showEvalBar && (
        <div className="px-3.5 py-2 border-b border-[#22150E] bg-[#120B07]">
          <div className="flex items-center justify-between text-[10px] font-mono text-[#7A6756] mb-1">
            <span>Evaluation</span>
            <span className="font-bold text-[#E8DEC8]">{label}</span>
          </div>
          <div className="relative w-full h-1.5 rounded-full overflow-hidden bg-[#1D140F] border border-[#2C1C14]">
            <div
              className="h-full bg-[#D8C4AA] transition-all duration-500"
              style={{ width: `${whitePercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Scrollable Move List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 font-mono text-xs">
        {movePairs.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-[#7A6756] italic text-center font-serif text-xs">
            Begin the match. Moves will appear here in algebraic notation.
          </div>
        ) : (
          movePairs.map((pair) => (
            <div
              key={pair.moveNum}
              className="flex items-center py-1 px-2 rounded hover:bg-[#1A110B] text-[#C2B29D] transition-colors"
            >
              <span className="w-8 text-[#7A6756] font-medium">{pair.moveNum}.</span>
              <span className="w-20 font-medium text-[#E8DEC8]">{pair.white}</span>
              <span className="w-20 font-normal text-[#B09F8C]">{pair.black || ""}</span>
            </div>
          ))
        )}
      </div>

      {/* Action Buttons: FEN, PGN, Draw, Resign */}
      <div className="p-2.5 border-t border-[#2A1B13] bg-[#18100A] flex flex-col gap-2">
        {/* Copy Tools */}
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={handleCopyFEN}
            className="flex items-center justify-center gap-1.5 py-1 px-2 rounded bg-[#1A110B] hover:bg-[#22160F] text-[#8C7662] hover:text-[#D8C4AA] border border-[#2A1B13] text-xs transition-colors"
          >
            {copiedFEN ? <Check className="w-3.5 h-3.5 text-[#86C29C]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedFEN ? "Copied" : "Copy FEN"}</span>
          </button>
          <button
            onClick={handleCopyPGN}
            className="flex items-center justify-center gap-1.5 py-1 px-2 rounded bg-[#1A110B] hover:bg-[#22160F] text-[#8C7662] hover:text-[#D8C4AA] border border-[#2A1B13] text-xs transition-colors"
          >
            {copiedPGN ? <Check className="w-3.5 h-3.5 text-[#86C29C]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedPGN ? "Copied" : "Copy PGN"}</span>
          </button>
        </div>

        {/* Undo, Resign & Offer Draw */}
        {!isGameOver && (
          <div className="flex flex-col gap-1.5">
            {gameMode !== "p2p" && (
              <button
                onClick={undoMove}
                disabled={moveHistory.length === 0 || isAIThinking}
                className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded bg-[#22160F] hover:bg-[#2C1C14] disabled:opacity-30 disabled:cursor-not-allowed text-[#D8C4AA] border border-[#3E281C] text-xs font-serif font-medium shadow-sm transition-colors"
              >
                <Undo2 className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Undo Move</span>
              </button>
            )}
            {confirmingResign ? (
              <div className="flex items-center gap-1.5 p-1 rounded bg-[#251010] border border-[#5A2020]">
                <button
                  type="button"
                  onClick={() => {
                    resignGame();
                    setConfirmingResign(false);
                  }}
                  className="flex-1 py-1 px-2 rounded bg-[#8A2222] hover:bg-[#9E2828] text-white font-serif font-bold text-xs transition-colors shadow-sm"
                >
                  Confirm Resign?
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingResign(false)}
                  className="py-1 px-2.5 rounded bg-[#1A110B] hover:bg-[#241710] text-[#A69078] hover:text-[#D8C4AA] text-xs font-serif transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={offerDraw}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-[#1A110B] hover:bg-[#22160F] text-[#A69078] hover:text-[#D8C4AA] border border-[#2A1B13] text-xs transition-colors"
                >
                  <Handshake className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Offer Draw</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingResign(true)}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-[#1E1010] hover:bg-[#291414] text-[#C27474] hover:text-[#E89898] border border-[#381B1B] text-xs transition-colors cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5 text-[#B85757]" />
                  <span>Resign</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
