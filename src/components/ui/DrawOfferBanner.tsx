"use client";

import React from "react";
import { useChessStore } from "@/store/useChessStore";
import { Handshake } from "lucide-react";

export const DrawOfferBanner: React.FC = () => {
  const incomingDrawOffer = useChessStore((s) => s.incomingDrawOffer);
  const acceptDraw = useChessStore((s) => s.acceptDraw);
  const declineDraw = useChessStore((s) => s.declineDraw);

  if (!incomingDrawOffer) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 py-2 px-4 rounded-lg bg-[#1E140E] border border-[#6B4E31] shadow-2xl text-[#E8DEC8] text-xs font-serif select-none">
      <Handshake className="w-4 h-4 text-[#C5A059]" />
      <span>Opponent has offered a peaceful draw.</span>
      <div className="flex items-center gap-2 ml-2">
        <button
          onClick={acceptDraw}
          className="px-2.5 py-1 rounded bg-[#967347] hover:bg-[#A88252] text-[#140D09] font-bold text-xs border border-[#B38E5B] transition-colors"
        >
          Accept
        </button>
        <button
          onClick={declineDraw}
          className="px-2.5 py-1 rounded bg-[#160E0A] hover:bg-[#20140D] text-[#A69078] hover:text-[#D8C4AA] text-xs border border-[#3E281C] transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  );
};
