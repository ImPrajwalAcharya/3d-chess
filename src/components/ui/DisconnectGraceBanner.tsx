"use client";

import React from "react";
import { useChessStore } from "@/store/useChessStore";
import { AlertTriangle, Loader2 } from "lucide-react";

export const DisconnectGraceBanner: React.FC = () => {
  const peerStatus = useChessStore((s) => s.peerStatus);
  const gameMode = useChessStore((s) => s.gameMode);

  if (gameMode !== "p2p" || peerStatus !== "reconnecting") return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 py-2 px-4 rounded-lg bg-[#221010] border border-[#482020] shadow-2xl text-[#D88A8A] text-xs font-serif select-none">
      <AlertTriangle className="w-4 h-4 text-[#D88A8A]" />
      <span>Opponent disconnected — waiting 60s for reconnect...</span>
      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#D88A8A]" />
    </div>
  );
};
