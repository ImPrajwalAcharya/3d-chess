"use client";

import React, { useState } from "react";
import { useChessStore } from "@/store/useChessStore";
import { Check, Users, Link as LinkIcon, Loader2, Sparkles } from "lucide-react";

interface MultiplayerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiplayerInviteModal: React.FC<MultiplayerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const roomId = useChessStore((s) => s.roomId);
  const peerStatus = useChessStore((s) => s.peerStatus);
  const hostP2PGame = useChessStore((s) => s.hostP2PGame);
  const joinP2PGame = useChessStore((s) => s.joinP2PGame);
  const errorMessage = useChessStore((s) => s.errorMessage);
  const clearError = useChessStore((s) => s.clearError);

  const [inputRoomCode, setInputRoomCode] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  if (!isOpen) return null;

  const inviteUrl =
    typeof window !== "undefined" && roomId
      ? `${window.location.origin}?room=${roomId}`
      : "";

  const handleCopyLink = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCreateRoom = async () => {
    clearError();
    await hostP2PGame();
  };

  const handleJoinRoom = async () => {
    if (!inputRoomCode.trim()) return;
    setIsJoining(true);
    clearError();
    try {
      await joinP2PGame(inputRoomCode.trim());
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="relative w-full max-w-lg p-6 md:p-7 rounded-xl bg-[#160E0A] border border-[#3E281C] shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#7A6756] hover:text-[#D8C4AA] transition-colors text-lg font-bold"
        >
          ✕
        </button>

        {/* Sacred Header */}
        <div className="flex items-center justify-center gap-2 text-[#C5A059] font-serif tracking-widest text-xs uppercase mb-1">
          <Users className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Serverless Peer-to-Peer</span>
        </div>
        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#E8DEC8] text-center mb-1">
          Play with a Friend
        </h2>
        <p className="text-xs text-[#8C7662] text-center mb-5">
          Direct browser-to-browser connection encrypted via WebRTC.
        </p>

        {errorMessage && (
          <div className="mb-4 p-2.5 rounded-lg bg-[#221010] border border-[#482020] text-[#D88A8A] text-xs">
            {errorMessage}
          </div>
        )}

        {/* Host Room Section */}
        <div className="p-3.5 rounded-lg bg-[#120B07] border border-[#2A1B13] mb-4">
          <h3 className="font-serif font-bold text-[#E8DEC8] text-xs mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            Host an Online Room
          </h3>

          {!roomId || peerStatus === "disconnected" ? (
            <button
              onClick={handleCreateRoom}
              disabled={peerStatus === "connecting"}
              className="w-full py-2 px-4 rounded-lg bg-[#967347] hover:bg-[#A88252] text-[#140D09] font-serif font-bold text-xs tracking-wider uppercase border border-[#B38E5B] shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              {peerStatus === "connecting" ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating Room...
                </>
              ) : (
                "Generate Invite Code & Room"
              )}
            </button>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#18110D] border border-[#3E281C]">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#7A6756] uppercase font-mono">
                    Room Code
                  </span>
                  <span className="text-sm font-mono font-bold text-[#E8DEC8] tracking-wider">
                    {roomId}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#C5A059] font-serif">
                    {peerStatus === "connected" ? "Opponent Connected!" : "Waiting for friend..."}
                  </span>
                </div>
              </div>

              {/* Copy Invite Link */}
              <button
                onClick={handleCopyLink}
                className="w-full py-1.5 px-3 rounded-lg bg-[#1E140E] hover:bg-[#281A12] border border-[#3E281C] text-[#CDB99E] text-xs font-serif font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#86C29C]" />
                    <span>Invite Link Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Copy Shareable Link</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Join Room Section */}
        <div className="p-3.5 rounded-lg bg-[#120B07] border border-[#2A1B13]">
          <h3 className="font-serif font-bold text-[#E8DEC8] text-xs mb-2">
            Join with a Room Code
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputRoomCode}
              onChange={(e) => setInputRoomCode(e.target.value)}
              placeholder="e.g. vajra-xyz123"
              className="flex-1 px-3 py-1.5 rounded-lg bg-[#18110D] border border-[#3E281C] text-[#E8DEC8] text-xs font-mono focus:outline-none focus:border-[#8C6D46] placeholder:text-[#6E5D4E]"
            />
            <button
              onClick={handleJoinRoom}
              disabled={isJoining || !inputRoomCode.trim()}
              className="px-4 py-1.5 rounded-lg bg-[#967347] hover:bg-[#A88252] disabled:opacity-40 text-[#140D09] font-serif font-bold text-xs uppercase tracking-wider border border-[#B38E5B] transition-colors flex items-center gap-1.5"
            >
              {isJoining && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Join</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
