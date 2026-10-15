"use client";

import React, { useEffect } from "react";
import { PlayerColor, PieceSymbol } from "@/types/chess";
import { useChessStore } from "@/store/useChessStore";
import { Wifi, Brain, User, Hourglass } from "lucide-react";

interface PlayerCardProps {
  color: PlayerColor;
  position: "top" | "bottom";
}

// Convert piece symbols to miniature unicode icons
const PIECE_GLYPHS: Record<PieceSymbol, string> = {
  p: "♟",
  n: "♞",
  b: "♝",
  r: "♜",
  q: "♛",
  k: "♚",
};

export const PlayerCard: React.FC<PlayerCardProps> = ({ color, position }) => {
  const chess = useChessStore((s) => s.chess);
  const turn = chess.turn();
  const gameMode = useChessStore((s) => s.gameMode);
  const aiDifficulty = useChessStore((s) => s.aiDifficulty);
  const playerColor = useChessStore((s) => s.playerColor);
  const isAIThinking = useChessStore((s) => s.isAIThinking);
  const whiteTimeMs = useChessStore((s) => s.whiteTimeMs);
  const blackTimeMs = useChessStore((s) => s.blackTimeMs);
  const timeControl = useChessStore((s) => s.timeControl);
  const capturedPieces = useChessStore((s) => s.capturedPieces);
  const materialAdvantage = useChessStore((s) => s.materialAdvantage);
  const pingMs = useChessStore((s) => s.pingMs);
  const peerStatus = useChessStore((s) => s.peerStatus);
  const tickClock = useChessStore((s) => s.tickClock);

  // Interval timer loop for clocks
  useEffect(() => {
    const timer = setInterval(() => {
      tickClock();
    }, 100);
    return () => clearInterval(timer);
  }, [tickClock]);

  const isWhite = color === "w";
  const isActive = turn === color;
  const timeMs = isWhite ? whiteTimeMs : blackTimeMs;
  const isLowTime = timeMs < 30000 && timeControl.initialSeconds > 0;

  // Format clock time
  const formatTime = (ms: number): string => {
    if (timeControl.initialSeconds === 0) return "∞";
    const totalSecs = Math.max(0, Math.ceil(ms / 1000));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Determine Title & Avatar
  const isLocalPlayer = gameMode === "pass_and_play" || color === playerColor;
  
  const isAI = gameMode === "ai" && color !== playerColor;

  let title = isWhite ? "White" : "Black";
  let subTitle = "";

  if (gameMode === "ai") {
    if (isAI) {
      const diffNames = {
        novice: "Samanera (Apprentice)",
        adept: "Bhikkhu (Monk)",
        master: "Lama (Scholar)",
        grandmaster: "Vajra (Grandmaster)",
      };
      title = diffNames[aiDifficulty] || "Monastery AI";
      subTitle = "Autonomous Engine";
    } else {
      title = "You (Seeker)";
      subTitle = isWhite ? "White Pieces" : "Black Pieces";
    }
  } else if (gameMode === "p2p") {
    title = isLocalPlayer ? "You (Local)" : "Guest (Remote)";
    subTitle = isWhite ? "White Pieces" : "Black Pieces";
  } else {
    title = isWhite ? "Player 1 (White)" : "Player 2 (Black)";
    subTitle = "Local Pass & Play";
  }

  // Captured pieces by this player
  // (i.e. White captured Black pieces, Black captured White pieces)
  const capturedList = isWhite ? capturedPieces.b : capturedPieces.w;
  const advantage = isWhite ? materialAdvantage.white : materialAdvantage.black;

  return (
    <div
      className={`relative flex items-center justify-between gap-3 px-3.5 py-2 rounded-lg transition-colors border select-none ${
        isActive
          ? "bg-[#1E140E] border-[#6B4E31] shadow-md"
          : "bg-[#140D09] border-[#2A1B13] opacity-85"
      }`}
    >
      {/* Player Identity Info */}
      <div className="flex items-center gap-2.5">
        {/* Avatar */}
        <div
          className={`relative flex items-center justify-center w-8 h-8 rounded border transition-colors ${
            isWhite ? "border-[#4A3222] bg-[#241710]" : "border-[#332016] bg-[#18100A]"
          }`}
        >
          {isAI ? (
            <Brain className="w-4 h-4 text-[#C5A059]" />
          ) : (
            <User className={`w-4 h-4 ${isWhite ? "text-[#E8DEC8]" : "text-[#A89078]"}`} />
          )}

          {/* Active indicator dot (Subtle solid brass dot) */}
          {isActive && (
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C5A059]" />
          )}
        </div>

        {/* Name & Subtitle */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-serif font-bold text-xs text-[#E8DEC8] tracking-wide">
              {title}
            </span>

            {/* P2P Ping Badge */}
            {gameMode === "p2p" && !isLocalPlayer && peerStatus === "connected" && (
              <div className="flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-[#161F18] text-[#86C29C] border border-[#2A4433]">
                <Wifi className="w-2.5 h-2.5" />
                <span>{pingMs}ms</span>
              </div>
            )}

            {/* AI Thinking Pill */}
            {isAI && isActive && isAIThinking && (
              <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded bg-[#2A1D13] text-[#C5A059] border border-[#4D3523]">
                <Hourglass className="w-2.5 h-2.5 animate-spin" />
                Thinking...
              </span>
            )}
          </div>

          {/* Captured pieces tray + advantage */}
          <div className="flex items-center gap-1 mt-0.5 min-h-[14px]">
            <div className="flex items-center text-[11px] tracking-tighter text-[#C5A059]">
              {capturedList.map((piece, idx) => (
                <span key={idx} className="leading-none">
                  {PIECE_GLYPHS[piece]}
                </span>
              ))}
            </div>

            {advantage > 0 && (
              <span className="text-[9px] font-mono font-semibold px-1 rounded bg-[#261810] text-[#C5A059] border border-[#3E281C]">
                +{advantage}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chess Clock */}
      <div
        className={`flex items-center justify-center min-w-[64px] px-2 py-1 rounded font-mono font-bold text-sm tracking-wider border transition-colors ${
          isLowTime
            ? "bg-[#240D0D] border-[#6B2020] text-[#E08A8A]"
            : isActive
            ? "bg-[#18110D] border-[#5A3F27] text-[#F3E7D3]"
            : "bg-[#110B07] border-[#2A1B13] text-[#8C7662]"
        }`}
      >
        {formatTime(timeMs)}
      </div>
    </div>
  );
};
