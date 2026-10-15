"use client";

import React, { useState } from "react";
import { useChessStore, TIME_CONTROLS } from "@/store/useChessStore";
import { GameMode, AIDifficulty, PlayerColor } from "@/types/chess";
import {
  Brain,
  Users,
  Swords,
  Timer,
  ChevronRight,
} from "lucide-react";

interface LobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMultiplayer: () => void;
}

export const LobbyModal: React.FC<LobbyModalProps> = ({
  isOpen,
  onClose,
  onOpenMultiplayer,
}) => {
  const initGame = useChessStore((s) => s.initGame);
  const currentMode = useChessStore((s) => s.gameMode);
  const currentDiff = useChessStore((s) => s.aiDifficulty);
  const currentColor = useChessStore((s) => s.playerColor);

  const [mode, setMode] = useState<GameMode>(currentMode);
  const [difficulty, setDifficulty] = useState<AIDifficulty>(currentDiff);
  const [color, setColor] = useState<PlayerColor | "random">(currentColor);
  const [timeControlKey, setTimeControlKey] = useState<string>("rapid10");

  if (!isOpen) return null;

  const handleStartGame = () => {
    if (mode === "p2p") {
      onClose();
      onOpenMultiplayer();
      return;
    }

    const selectedTC = TIME_CONTROLS[timeControlKey] || TIME_CONTROLS.rapid10;
    initGame({
      mode,
      color,
      difficulty,
      timeControl: selectedTC,
    });
    onClose();
  };

  const difficultyLevels: Array<{
    id: AIDifficulty;
    title: string;
    nepaliTitle: string;
    elo: string;
    desc: string;
  }> = [
    {
      id: "novice",
      title: "Novice",
      nepaliTitle: "Samanera (Apprentice)",
      elo: "~800 ELO",
      desc: "Gentle beginner play with occasional blunders.",
    },
    {
      id: "adept",
      title: "Adept",
      nepaliTitle: "Bhikkhu (Monk)",
      elo: "~1300 ELO",
      desc: "Harmonious positional play & steady openings.",
    },
    {
      id: "master",
      title: "Master",
      nepaliTitle: "Lama (Scholar)",
      elo: "~1800 ELO",
      desc: "Tactical depth, king safety, and endgame precision.",
    },
    {
      id: "grandmaster",
      title: "Grandmaster",
      nepaliTitle: "Vajra (Awakened)",
      elo: "~2400+ ELO",
      desc: "Ruthless tactical depth and master endgame play.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto select-none">
      <div className="relative w-full max-w-xl my-8 p-6 md:p-7 rounded-xl bg-[#160E0A] border border-[#3E281C] shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7A6756] hover:text-[#D8C4AA] transition-colors text-lg font-bold"
        >
          ✕
        </button>

        {/* Monastery Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-[#C5A059] font-serif tracking-widest text-xs uppercase mb-1">
            <span>☸</span>
            <span>Himalayan Monastery Sanctuary</span>
            <span>☸</span>
          </div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#E8DEC8] tracking-wide">
            Configure Match
          </h2>
        </div>

        {/* 1. Mode Selector */}
        <div className="mb-5">
          <label className="block text-[11px] font-serif font-bold text-[#A69078] uppercase tracking-wider mb-2">
            Discipline Mode
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: "ai", label: "Vs. AI", icon: <Brain className="w-4 h-4" /> },
              { id: "p2p", label: "Online P2P", icon: <Users className="w-4 h-4" /> },
              { id: "pass_and_play", label: "Pass & Play", icon: <Swords className="w-4 h-4" /> },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as GameMode)}
                className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-colors ${
                  mode === m.id
                    ? "bg-[#281A12] border-[#8C6D46] text-[#E8DEC8] shadow-sm font-semibold"
                    : "bg-[#120B07] border-[#2A1B13] text-[#7A6756] hover:border-[#3E281C] hover:text-[#C2B29D]"
                }`}
              >
                <div className={`mb-1.5 ${mode === m.id ? "text-[#C5A059]" : "text-[#7A6756]"}`}>
                  {m.icon}
                </div>
                <span className="text-xs font-serif">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. AI Difficulty Levels (Only in AI Mode) */}
        {mode === "ai" && (
          <div className="mb-5">
            <label className="block text-[11px] font-serif font-bold text-[#A69078] uppercase tracking-wider mb-2">
              Monastery Difficulty
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {difficultyLevels.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setDifficulty(lvl.id)}
                  className={`p-2.5 rounded-lg text-left border transition-colors ${
                    difficulty === lvl.id
                      ? "bg-[#281A12] border-[#8C6D46] text-[#E8DEC8] shadow-sm"
                      : "bg-[#120B07] border-[#2A1B13] text-[#7A6756] hover:border-[#3E281C] hover:text-[#C2B29D]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`font-serif font-bold text-xs ${difficulty === lvl.id ? "text-[#E8DEC8]" : "text-[#A69078]"}`}>
                      {lvl.nepaliTitle}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1C120C] border border-[#2E1E15] text-[#C5A059]">
                      {lvl.elo}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7A6756] leading-tight">
                    {lvl.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Choose Side / Color */}
        {mode !== "pass_and_play" && (
          <div className="mb-5">
            <label className="block text-[11px] font-serif font-bold text-[#A69078] uppercase tracking-wider mb-2">
              Choose Side
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: "w", label: "White (Ivory)", symbol: "♔" },
                { id: "random", label: "Random", symbol: "☯" },
                { id: "b", label: "Black (Obsidian)", symbol: "♚" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id as any)}
                  className={`flex items-center justify-center gap-2 p-2 rounded-lg border text-xs font-serif font-medium transition-colors ${
                    color === c.id
                      ? "bg-[#281A12] border-[#8C6D46] text-[#E8DEC8] shadow-sm font-semibold"
                      : "bg-[#120B07] border-[#2A1B13] text-[#7A6756] hover:border-[#3E281C] hover:text-[#C2B29D]"
                  }`}
                >
                  <span className="text-base">{c.symbol}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Time Control */}
        <div className="mb-6">
          <label className="block text-[11px] font-serif font-bold text-[#A69078] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Timer className="w-3.5 h-3.5 text-[#C5A059]" />
            Time Control
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {Object.entries(TIME_CONTROLS).map(([key, tc]) => (
              <button
                key={key}
                onClick={() => setTimeControlKey(key)}
                className={`py-1.5 px-2 rounded-lg border text-center transition-colors ${
                  timeControlKey === key
                    ? "bg-[#281A12] border-[#8C6D46] text-[#E8DEC8] font-bold shadow-sm"
                    : "bg-[#120B07] border-[#2A1B13] text-[#7A6756] hover:border-[#3E281C] hover:text-[#C2B29D]"
                }`}
              >
                {tc.name}
              </button>
            ))}
          </div>
        </div>

        {/* Start Game Action */}
        <button
          onClick={handleStartGame}
          className="w-full py-2.5 px-6 rounded-lg bg-[#967347] hover:bg-[#A88252] active:bg-[#85633A] text-[#140D09] font-serif font-bold text-xs tracking-wider uppercase border border-[#B38E5B] shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <span>{mode === "p2p" ? "Configure P2P Room" : "Enter the Sanctuary"}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
