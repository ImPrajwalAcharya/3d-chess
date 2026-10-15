"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useChessStore } from "@/store/useChessStore";
import { TopBar } from "@/components/ui/TopBar";
import { PlayerCard } from "@/components/ui/PlayerCard";
import { MoveHistoryPanel } from "@/components/ui/MoveHistoryPanel";
import { PromotionModal } from "@/components/ui/PromotionModal";
import { GameOverModal } from "@/components/ui/GameOverModal";
import { LobbyModal } from "@/components/ui/LobbyModal";
import { MultiplayerInviteModal } from "@/components/ui/MultiplayerInviteModal";
import { DrawOfferBanner } from "@/components/ui/DrawOfferBanner";
import { DisconnectGraceBanner } from "@/components/ui/DisconnectGraceBanner";
import { Monastery2DBoard } from "@/components/ui/Monastery2DBoard";
import { ScrollText, Users, Loader2, Lock, Unlock, RotateCcw } from "lucide-react";

// Dynamically load R3F Canvas without SSR
const ChessScene = dynamic(
  () => import("@/components/canvas/ChessScene").then((m) => m.ChessScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center w-full h-full bg-[#100A07]">
        <div className="flex items-center justify-center w-14 h-14 mb-3 rounded-full bg-[#1C120C] border border-[#3E281C] text-[#C5A059] font-serif text-2xl">
          ☸
        </div>
        <p className="font-serif text-[#CDB99E] tracking-widest text-xs uppercase flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
          Awakening 3D Monastery Altar...
        </p>
      </div>
    ),
  }
);

export default function ChessAppPage() {
  const playerColor = useChessStore((s) => s.playerColor);
  const gameMode = useChessStore((s) => s.gameMode);
  const viewMode = useChessStore((s) => s.viewMode);
  const cameraLocked = useChessStore((s) => s.cameraLocked);
  const toggleCameraLock = useChessStore((s) => s.toggleCameraLock);
  const setCameraPreset = useChessStore((s) => s.setCameraPreset);
  const joinP2PGame = useChessStore((s) => s.joinP2PGame);

  const [isLobbyOpen, setIsLobbyOpen] = useState(false);
  const [isMultiplayerOpen, setIsMultiplayerOpen] = useState(false);
  const [showHistoryMobile, setShowHistoryMobile] = useState(false);

  // Auto-join if '?room=ROOM_ID' is in URL & expose store for dev inspection
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__chessStore = useChessStore;
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get("room");
      if (roomParam) {
        joinP2PGame(roomParam);
      }
    }
  }, [joinP2PGame]);

  const opponentColor = playerColor === "w" ? "b" : "w";

  return (
    <main className="relative flex flex-col w-screen h-screen overflow-hidden bg-[#0D0805]">
      {/* Top Bar Navigation */}
      <TopBar onOpenLobby={() => setIsLobbyOpen(true)} />

      {/* Disconnect and Draw Alert Banners */}
      <DisconnectGraceBanner />
      <DrawOfferBanner />

      {/* Main Viewport & HUD Overlay */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Main Board: 3D Three.js Altar OR Pure 2D High-Performance Pagoda Board */}
        <div className={`absolute inset-0 z-0 transition-opacity duration-300 ${viewMode === "3d" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <ChessScene />
        </div>
        {viewMode === "2d" && (
          <div className="absolute inset-0 z-0 flex items-center justify-center lg:pr-88 bg-[#0E0906]">
            <Monastery2DBoard />
          </div>
        )}

        {/* 2D HUD Overlays */}
        <div className="pointer-events-none absolute inset-0 z-10 p-3 md:p-5 flex flex-col justify-between">
          {/* Top Row: Opponent Card & Quick P2P Invite Action */}
          <div className="flex items-start justify-between w-full">
            <div className="pointer-events-auto w-full max-w-[260px] md:max-w-[290px]">
              <PlayerCard color={opponentColor} position="top" />
            </div>

            {/* Invite Friend Trigger if P2P mode */}
            {gameMode === "p2p" && (
              <button
                onClick={() => setIsMultiplayerOpen(true)}
                className="pointer-events-auto flex items-center gap-1.5 py-1.5 px-3 rounded bg-[#1C120C] hover:bg-[#261810] border border-[#3E281C] text-[#D8C4AA] text-xs font-serif font-medium transition-colors ml-2 shadow-sm"
              >
                <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="hidden sm:inline">Invite Friend</span>
              </button>
            )}
          </div>

          {/* Bottom Row: Local Player Card, 3D Camera Lock Controller, & History Toggle */}
          <div className="flex items-end justify-between w-full">
            <div className="pointer-events-auto w-full max-w-[260px] md:max-w-[290px]">
              <PlayerCard color={playerColor} position="bottom" />
            </div>

            {/* 3D Camera Lock / Unlock Quick Controller */}
            {viewMode === "3d" && (
              <div className="pointer-events-auto flex items-center gap-1.5 mb-1 bg-[#140D09] p-1 rounded-md border border-[#2A1B13] shadow-md">
                <button
                  onClick={toggleCameraLock}
                  className={`flex items-center gap-1.5 py-1 px-3 rounded text-xs font-serif font-medium transition-colors ${
                    cameraLocked
                      ? "bg-[#20140D] text-[#CDB99E] border border-[#3A261C]"
                      : "bg-[#281A12] text-[#E8DEC8] border border-[#6B4E31]"
                  }`}
                >
                  {cameraLocked ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>View Locked</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Free Orbit</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setCameraPreset("player")}
                  title="Reset to Default Angle"
                  className="flex items-center gap-1.5 py-1 px-2.5 rounded bg-[#1A110B] hover:bg-[#24170F] text-[#8C7662] hover:text-[#D8C4AA] border border-[#2A1B13] text-xs font-serif transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              </div>
            )}

            {/* Mobile Move History toggle button */}
            <div className="pointer-events-auto lg:hidden">
              <button
                onClick={() => setShowHistoryMobile(!showHistoryMobile)}
                className="p-2.5 rounded bg-[#1C120C] border border-[#3E281C] text-[#C5A059] shadow-md"
              >
                <ScrollText className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Move History Sidebar */}
        <div className="hidden lg:block pointer-events-auto absolute top-6 right-6 bottom-6 w-80 z-20">
          <MoveHistoryPanel />
        </div>

        {/* Mobile Move History Drawer Modal */}
        {showHistoryMobile && (
          <div className="lg:hidden fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="relative w-full max-w-sm h-3/4">
              <button
                onClick={() => setShowHistoryMobile(false)}
                className="absolute -top-10 right-0 text-amber-200 font-bold text-lg"
              >
                Close ✕
              </button>
              <MoveHistoryPanel />
            </div>
          </div>
        )}
      </div>

      {/* Floating Modals */}
      <PromotionModal />
      <GameOverModal />
      <LobbyModal
        isOpen={isLobbyOpen}
        onClose={() => setIsLobbyOpen(false)}
        onOpenMultiplayer={() => setIsMultiplayerOpen(true)}
      />
      <MultiplayerInviteModal
        isOpen={isMultiplayerOpen}
        onClose={() => setIsMultiplayerOpen(false)}
      />
    </main>
  );
}
