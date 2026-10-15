"use client";

import React from "react";
import { PieceSymbol, Color } from "@/types/chess";

interface PieceIconProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
}

export const NepaliTemplePiece2D: React.FC<PieceIconProps> = ({
  type,
  color,
  className = "w-full h-full",
}) => {
  const isWhite = color === "w";

  // Palette: Warm Monastic Boxwood for White; Dark Bronze / Ebony with Gold for Black
  const bodyColor = isWhite ? "#E2CFB4" : "#221A15";
  const strokeColor = isWhite ? "#4E3218" : "#E5B83B";
  const goldColor = "#E5B83B";
  const crimsonColor = isWhite ? "#8B1E24" : "#D4AF37";

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Soft shadow filter */}
        <filter id={`shadow-${type}-${color}`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.4" />
        </filter>
        {/* Gold gradient */}
        <linearGradient id={`gold-grad-${type}-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
      </defs>

      <g filter={`url(#shadow-${type}-${color})`}>
        {/* ============================================================== */}
        {/* 1. KING: SWAYAMBHU / BOUDHANATH MAHACHAITYA & 13-RING SPIRE    */}
        {/* ============================================================== */}
        {type === "k" && (
          <g>
            {/* Stepped plinth */}
            <path
              d="M18 90 L82 90 L76 82 L24 82 Z"
              fill={bodyColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />
            <path
              d="M24 82 L76 82 L70 76 L30 76 Z"
              fill={crimsonColor}
              stroke={strokeColor}
              strokeWidth="2"
            />

            {/* Hemispherical Anda Dome */}
            <path
              d="M26 76 C26 50, 74 50, 74 76 Z"
              fill={bodyColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />

            {/* Square Harmika with Wisdom Eyes */}
            <rect
              x="38"
              y="42"
              width="24"
              height="14"
              rx="2"
              fill={goldColor}
              stroke={strokeColor}
              strokeWidth="2"
            />
            {/* Wisdom Eyes of Buddha */}
            <circle cx="45" cy="48" r="2.2" fill="#1C100B" />
            <circle cx="55" cy="48" r="2.2" fill="#1C100B" />
            <path d="M49 53 Q50 51 51 53" stroke="#1C100B" strokeWidth="1.5" strokeLinecap="round" />

            {/* 13 Ascending Spire Rings */}
            <path d="M36 42 L64 42 L58 18 L42 18 Z" fill={goldColor} stroke={strokeColor} strokeWidth="2" />
            {[38, 34, 30, 26, 22].map((y, idx) => (
              <line
                key={idx}
                x1={40 + idx * 1.5}
                y1={y}
                x2={60 - idx * 1.5}
                y2={y}
                stroke={strokeColor}
                strokeWidth="1.5"
              />
            ))}

            {/* Chhatra Canopy & Golden Gajur Pinnacle */}
            <path d="M38 18 Q50 13 62 18 L50 9 Z" fill={`url(#gold-grad-${type}-${color})`} stroke={strokeColor} strokeWidth="2" />
            <circle cx="50" cy="7" r="3.5" fill={goldColor} stroke={strokeColor} strokeWidth="1.5" />
            <path d="M50 3.5 L50 1" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 2. QUEEN: TALEJU BHAWANI 3-TIERED NEWA PAGODA TEMPLE          */}
        {/* ============================================================== */}
        {type === "q" && (
          <g>
            {/* Stepped Plinth */}
            <path d="M16 90 L84 90 L78 83 L22 83 Z" fill={bodyColor} stroke={strokeColor} strokeWidth="2.5" />
            <path d="M22 83 L78 83 L72 78 L28 78 Z" fill={crimsonColor} stroke={strokeColor} strokeWidth="2" />

            {/* Lower Sanctum Chamber */}
            <rect x="32" y="66" width="36" height="12" fill={bodyColor} stroke={strokeColor} strokeWidth="2" />

            {/* Tier 1 Pagoda Roof (Lowest, flared eaves) */}
            <path
              d="M14 66 Q50 61 86 66 L74 54 Q50 51 26 54 Z"
              fill={crimsonColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />

            {/* Middle Sanctum Chamber */}
            <rect x="36" y="44" width="28" height="10" fill={bodyColor} stroke={strokeColor} strokeWidth="2" />

            {/* Tier 2 Pagoda Roof */}
            <path
              d="M22 44 Q50 40 78 44 L68 34 Q50 31 32 34 Z"
              fill={crimsonColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />

            {/* Upper Sanctum Chamber */}
            <rect x="40" y="27" width="20" height="7" fill={bodyColor} stroke={strokeColor} strokeWidth="1.5" />

            {/* Tier 3 Pagoda Roof */}
            <path
              d="M28 27 Q50 23 72 27 L62 18 Q50 15 38 18 Z"
              fill={crimsonColor}
              stroke={strokeColor}
              strokeWidth="2"
            />

            {/* Triple Golden Pinnacle (Tri-Gajur) */}
            <circle cx="50" cy="11" r="3.5" fill={goldColor} stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="42" cy="14" r="2.2" fill={goldColor} stroke={strokeColor} strokeWidth="1.2" />
            <circle cx="58" cy="14" r="2.2" fill={goldColor} stroke={strokeColor} strokeWidth="1.2" />
            <path d="M50 7 L50 4" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 3. BISHOP: PATAN KRISHNA MANDIR & SHIKHAR STONE CHAITYA       */}
        {/* ============================================================== */}
        {type === "b" && (
          <g>
            {/* Lotus Base */}
            <path d="M22 90 L78 90 L72 82 L28 82 Z" fill={bodyColor} stroke={strokeColor} strokeWidth="2.5" />
            {/* Lotus petal carvings */}
            <path d="M28 82 Q38 76 50 82 Q62 76 72 82 Z" fill={crimsonColor} stroke={strokeColor} strokeWidth="2" />

            {/* Curvilinear Shikhar Stone Tower */}
            <path
              d="M28 82 C28 48, 40 25, 45 20 L55 20 C60 25, 72 48, 72 82 Z"
              fill={bodyColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />

            {/* Vertical Shikhar ribbed striations */}
            <path d="M38 82 C38 52, 45 32, 47 21" stroke={strokeColor} strokeWidth="1.5" />
            <path d="M62 82 C62 52, 55 32, 53 21" stroke={strokeColor} strokeWidth="1.5" />

            {/* Torana Arch Niche */}
            <path
              d="M43 65 Q50 56 57 65 L57 76 L43 76 Z"
              fill={goldColor}
              stroke={strokeColor}
              strokeWidth="1.5"
            />

            {/* Amalaka Ribbed Stone Ring */}
            <ellipse cx="50" cy="18" rx="10" ry="4" fill={goldColor} stroke={strokeColor} strokeWidth="2" />

            {/* Kalasha & Gajur Finial */}
            <circle cx="50" cy="11" r="3" fill={goldColor} stroke={strokeColor} strokeWidth="1.5" />
            <path d="M50 7 L50 3" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 4. KNIGHT: TEMPLE GUARDIAN STEED / LION (SIMHA-ASHWA)         */}
        {/* ============================================================== */}
        {type === "n" && (
          <g>
            {/* Carved Plinth */}
            <rect x="20" y="82" width="60" height="9" rx="2" fill={bodyColor} stroke={strokeColor} strokeWidth="2.5" />
            <rect x="25" y="78" width="50" height="4" fill={crimsonColor} stroke={strokeColor} strokeWidth="1.5" />

            {/* Arched Temple Steed Chest & Neck */}
            <path
              d="M32 78 C30 50, 42 35, 54 26 C64 18, 74 24, 72 38 C70 44, 62 48, 56 50 C48 52, 46 64, 48 78 Z"
              fill={bodyColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />

            {/* Muzzle / Head */}
            <path
              d="M54 26 C50 18, 36 24, 34 32 C32 38, 42 44, 52 42 Z"
              fill={bodyColor}
              stroke={strokeColor}
              strokeWidth="2"
            />

            {/* Ornate Newa Cloud / Flame Mane Scrolls */}
            <path
              d="M62 26 C68 28, 72 35, 70 42 C74 46, 76 54, 72 60 C76 65, 74 72, 68 76"
              stroke={goldColor}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Guardian Ear */}
            <path d="M48 24 L52 14 L56 22 Z" fill={goldColor} stroke={strokeColor} strokeWidth="1.5" />

            {/* Forehead Temple Tika Jewel */}
            <circle cx="44" cy="28" r="2.5" fill={goldColor} stroke={strokeColor} strokeWidth="1" />

            {/* Ceremonial Bell Collar (Ghanti) */}
            <path d="M38 56 Q44 60 50 56" stroke={crimsonColor} strokeWidth="3" fill="none" />
            <circle cx="44" cy="62" r="3" fill={goldColor} stroke={strokeColor} strokeWidth="1.5" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 5. ROOK: KASTHAMANDAP PAVILION / FORTRESS WATCHTOWER          */}
        {/* ============================================================== */}
        {type === "r" && (
          <g>
            {/* Timber Base */}
            <rect x="20" y="82" width="60" height="9" rx="2" fill={bodyColor} stroke={strokeColor} strokeWidth="2.5" />
            <rect x="25" y="77" width="50" height="5" fill={crimsonColor} stroke={strokeColor} strokeWidth="1.5" />

            {/* 4 Carved Wooden Pillars (Thām) */}
            <rect x="28" y="48" width="8" height="29" fill={bodyColor} stroke={strokeColor} strokeWidth="2" />
            <rect x="42" y="48" width="6" height="29" fill={crimsonColor} stroke={strokeColor} strokeWidth="1.5" />
            <rect x="52" y="48" width="6" height="29" fill={crimsonColor} stroke={strokeColor} strokeWidth="1.5" />
            <rect x="64" y="48" width="8" height="29" fill={bodyColor} stroke={strokeColor} strokeWidth="2" />

            {/* Capital Brackets */}
            <path d="M24 48 L76 48 L72 44 L28 44 Z" fill={goldColor} stroke={strokeColor} strokeWidth="2" />

            {/* Pavilion Pagoda Roof with Carved Struts */}
            <path
              d="M16 44 Q50 38 84 44 L70 24 Q50 20 30 24 Z"
              fill={bodyColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />

            {/* Central Temple Pinnacle (Gajur) */}
            <rect x="46" y="16" width="8" height="8" rx="1" fill={goldColor} stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="50" cy="11" r="3.5" fill={goldColor} stroke={strokeColor} strokeWidth="1.5" />
            <path d="M50 7 L50 3" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* ============================================================== */}
        {/* 6. PAWN: COURTYARD MINI CHAITYA & LOTUS STUPA                 */}
        {/* ============================================================== */}
        {type === "p" && (
          <g>
            {/* Lotus Base */}
            <path d="M26 88 L74 88 L68 81 L32 81 Z" fill={bodyColor} stroke={strokeColor} strokeWidth="2.5" />
            <path d="M32 81 Q41 76 50 81 Q59 76 68 81 Z" fill={crimsonColor} stroke={strokeColor} strokeWidth="1.5" />

            {/* Meditation Dome (Anda) */}
            <path
              d="M32 81 C32 58, 68 58, 68 81 Z"
              fill={bodyColor}
              stroke={strokeColor}
              strokeWidth="2.5"
            />

            {/* Mini Harmika */}
            <rect x="42" y="52" width="16" height="9" rx="1.5" fill={goldColor} stroke={strokeColor} strokeWidth="1.5" />

            {/* 5 Spire Rings */}
            <path d="M43 52 L57 52 L54 32 L46 32 Z" fill={goldColor} stroke={strokeColor} strokeWidth="1.5" />
            {[47, 42, 37].map((y, idx) => (
              <line key={idx} x1={44 + idx} y1={y} x2={56 - idx} y2={y} stroke={strokeColor} strokeWidth="1.2" />
            ))}

            {/* Sacred Mani Jewel Pinnacle */}
            <circle cx="50" cy="27" r="3.5" fill={`url(#gold-grad-${type}-${color})`} stroke={strokeColor} strokeWidth="1.5" />
            <path d="M50 23 L50 19" stroke={goldColor} strokeWidth="2" strokeLinecap="round" />
          </g>
        )}
      </g>
    </svg>
  );
};
