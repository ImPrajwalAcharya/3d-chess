"use client";

import React, { useState } from "react";
import { useChessStore } from "@/store/useChessStore";
import { CameraPreset } from "@/types/chess";
import {
  Volume2,
  VolumeX,
  Hash,
  PlusCircle,
  Smile,
  Undo2,
  Lock,
  Unlock,
  Flag,
} from "lucide-react";

interface TopBarProps {
  onOpenLobby: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenLobby }) => {
  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const toggleSound = useChessStore((s) => s.toggleSound);
  const cameraPreset = useChessStore((s) => s.cameraPreset);
  const setCameraPreset = useChessStore((s) => s.setCameraPreset);
  const cameraLocked = useChessStore((s) => s.cameraLocked);
  const toggleCameraLock = useChessStore((s) => s.toggleCameraLock);
  const viewMode = useChessStore((s) => s.viewMode);
  const setViewMode = useChessStore((s) => s.setViewMode);
  const showCoordinates = useChessStore((s) => s.showCoordinates);
  const setShowCoordinates = useChessStore((s) => s.setShowCoordinates);
  const gameMode = useChessStore((s) => s.gameMode);
  const moveHistory = useChessStore((s) => s.moveHistory);
  const undoMove = useChessStore((s) => s.undoMove);
  const resignGame = useChessStore((s) => s.resignGame);
  const isGameOver = useChessStore((s) => s.isGameOver);
  const isAIThinking = useChessStore((s) => s.isAIThinking);
  const sendChatEmoji = useChessStore((s) => s.sendChatEmoji);
  const chatEmojis = useChessStore((s) => s.chatEmojis);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [confirmingResign, setConfirmingResign] = useState(false);

  const cameraOptions: Array<{ id: CameraPreset; label: string }> = [
    { id: "player", label: "Perspective" },
    { id: "cinematic", label: "Cinematic Orbit" },
  ];

  const emojis = ["Namaste 🙏", "Good Move! 👏", "Well Played ⚔️", "Thinking... 🧘", "Blunder! 😅", "Check! ⚡"];

  return (
    <>
      <header className="relative flex items-center justify-between px-4 py-2.5 bg-[#140D09] border-b border-[#2A1B13] z-30 select-none">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded bg-[#20140D] border border-[#3E281C] text-[#C5A059] font-serif text-base font-bold shadow-sm">
            ☸
          </div>
          <div>
            <h1 className="font-serif font-bold text-[#E8DEC8] text-sm tracking-wider leading-none">
              VAJRA CHESS
            </h1>
            <span className="text-[10px] text-[#8C7662] uppercase font-mono tracking-widest">
              Himalayan Monastery Heritage
            </span>
          </div>
        </div>

        {/* Controls & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Undo Move Button (Available in Vs AI and Local play) */}
          {gameMode !== "p2p" && (
            <button
              onClick={undoMove}
              disabled={moveHistory.length === 0 || isAIThinking || isGameOver}
              title="Undo Move"
              className="flex items-center gap-1.5 py-1.5 px-3 rounded bg-[#1C120C] hover:bg-[#261810] disabled:opacity-30 disabled:cursor-not-allowed border border-[#332016] text-[#D8C4AA] text-xs font-serif transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Undo</span>
            </button>
          )}

          {/* Quick Resign Button (Active match) */}
          {!isGameOver && moveHistory.length > 0 && (
            confirmingResign ? (
              <div className="flex items-center gap-1 p-0.5 rounded bg-[#201010] border border-[#521C1C]">
                <button
                  onClick={() => {
                    resignGame();
                    setConfirmingResign(false);
                  }}
                  className="py-1 px-2 rounded bg-[#8A2222] hover:bg-[#A32A2A] text-white font-serif font-bold text-xs transition-colors"
                >
                  Confirm?
                </button>
                <button
                  onClick={() => setConfirmingResign(false)}
                  className="px-1 text-xs text-[#8C7662] hover:text-[#D8C4AA]"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmingResign(true)}
                title="Resign Match"
                className="flex items-center gap-1 py-1.5 px-2.5 rounded bg-[#1C120C] hover:bg-[#251515] border border-[#3A2222] text-[#C27474] hover:text-[#E89898] text-xs font-serif transition-colors"
              >
                <Flag className="w-3.5 h-3.5 text-[#B85757]" />
                <span className="hidden sm:inline">Resign</span>
              </button>
            )
          )}

          {/* Quick Chat Emoji button (in P2P) */}
          {gameMode === "p2p" && (
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                title="Send Greeting / Emote"
                className="p-1.5 rounded bg-[#1C120C] border border-[#332016] hover:border-[#6B4732] text-[#C5A059] text-xs transition-colors"
              >
                <Smile className="w-4 h-4" />
              </button>

              {showEmojiPicker && (
                <div className="absolute right-0 top-10 w-44 p-1.5 rounded-lg bg-[#18110D] border border-[#3A261C] shadow-2xl flex flex-col gap-0.5 z-50">
                  {emojis.map((em) => (
                    <button
                      key={em}
                      onClick={() => {
                        sendChatEmoji(em);
                        setShowEmojiPicker(false);
                      }}
                      className="text-left px-2.5 py-1.5 rounded text-xs text-[#CDB99E] hover:bg-[#251810] hover:text-[#E8DEC8] transition-colors"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3D vs 2D View Switcher */}
          <div className="flex items-center p-0.5 rounded-md bg-[#18110D] border border-[#2A1B13]">
            <button
              onClick={() => setViewMode("3d")}
              className={`py-1 px-2.5 rounded text-xs font-serif font-medium transition-colors ${
                viewMode === "3d"
                  ? "bg-[#281A12] text-[#E8DEC8] border border-[#442C1E] shadow-sm font-semibold"
                  : "text-[#8C7662] hover:text-[#D8C4AA]"
              }`}
            >
              <span>3D Monastery</span>
            </button>
            <button
              onClick={() => setViewMode("2d")}
              className={`py-1 px-2.5 rounded text-xs font-serif font-medium transition-colors ${
                viewMode === "2d"
                  ? "bg-[#281A12] text-[#E8DEC8] border border-[#442C1E] shadow-sm font-semibold"
                  : "text-[#8C7662] hover:text-[#D8C4AA]"
              }`}
            >
              <span>2D Classic</span>
            </button>
          </div>

          {/* 3D Camera Controls (Only in 3D Mode) */}
          {viewMode === "3d" && (
            <div className="hidden md:flex items-center gap-1 p-0.5 rounded-md bg-[#18110D] border border-[#2A1B13]">
              {cameraOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setCameraPreset(opt.id)}
                  className={`py-1 px-2.5 rounded text-xs font-serif transition-colors ${
                    cameraPreset === opt.id
                      ? "bg-[#281A12] text-[#E8DEC8] border border-[#442C1E] font-semibold"
                      : "text-[#8C7662] hover:text-[#D8C4AA]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}

              {/* Lock / Unlock Camera Orbit */}
              <button
                onClick={toggleCameraLock}
                title={cameraLocked ? "Camera View Locked (Click to allow free orbit)" : "Free Orbit Mode Active (Click to lock view)"}
                className={`flex items-center gap-1 py-1 px-2.5 rounded text-xs font-serif font-medium border transition-colors ${
                  cameraLocked
                    ? "bg-[#20140D] text-[#CDB99E] border-[#382419]"
                    : "bg-[#2A1F14] text-[#E8DEC8] border-[#8C6D46]"
                }`}
              >
                {cameraLocked ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Locked</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-[#E5B83B]" />
                    <span>Orbiting</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Coordinates toggle */}
          <button
            onClick={() => setShowCoordinates(!showCoordinates)}
            title="Toggle Algebraic Coordinates"
            className={`p-1.5 rounded border transition-colors ${
              showCoordinates
                ? "bg-[#251810] border-[#523727] text-[#C5A059]"
                : "bg-[#18110D] border-[#2A1B13] text-[#8C7662] hover:text-[#D8C4AA]"
            }`}
          >
            <Hash className="w-4 h-4" />
          </button>

          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? "Mute Web Audio" : "Unmute Web Audio"}
            className="p-1.5 rounded bg-[#18110D] border border-[#2A1B13] hover:border-[#442C1E] text-[#8C7662] hover:text-[#C5A059] transition-colors"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#C5A059]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#6E5D4E]" />
            )}
          </button>

          {/* New Match / Lobby button */}
          <button
            onClick={onOpenLobby}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded bg-[#967347] hover:bg-[#A88252] text-[#140D09] font-serif font-bold text-xs border border-[#B38E5B] shadow-sm transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Match</span>
          </button>
        </div>
      </header>

      {/* Floating Chat Emote Toasts */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-2 pointer-events-none">
        {chatEmojis.slice(-3).map((item) => (
          <div
            key={item.id}
            className={`py-1 px-3 rounded-full text-xs font-serif shadow-lg border animate-fade-in ${
              item.sender === "me"
                ? "bg-[#20140D] border-[#4A3222] text-[#E8DEC8] self-start"
                : "bg-[#160E0A] border-[#382419] text-[#CDB99E] self-start"
            }`}
          >
            <span className="font-semibold text-[#8C7662] mr-1.5">
              {item.sender === "me" ? "You:" : "Opponent:"}
            </span>
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </>
  );
};
