"use client";

import React from "react";
import { PieceSymbol, Color } from "@/types/chess";

interface PieceProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
}

// Exact Chess.com Neo / Standard Classical Vector Chess Pieces
export const ChessComPiece: React.FC<PieceProps> = ({
  type,
  color,
  className = "w-full h-full",
}) => {
  const isWhite = color === "w";

  // White piece fill: warm crisp white (#ffffff or #f9f9f9) with black contour lines
  // Black piece fill: dark slate/ebony (#1c1c1c) with white contour lines
  const fill = isWhite ? "#FFFFFF" : "#1C1C1C";
  const stroke = isWhite ? "#000000" : "#FFFFFF";

  return (
    <svg
      viewBox="0 0 45 45"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))" }}
    >
      {/* ======================= PAWN ======================= */}
      {type === "p" &&
        (isWhite ? (
          <path
            d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 l 23,0 c 0,-7.92 -4.41,-12.41 -7.41,-13.47 1.47,-1.19 2.41,-3 2.41,-5.03 0,-2.41 -1.33,-4.5 -3.28,-5.62 0.49,-0.67 0.78,-1.49 0.78,-2.38 0,-2.21 -1.79,-4 -4,-4 z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="m 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 l 23,0 c 0,-7.92 -4.41,-12.41 -7.41,-13.47 1.47,-1.19 2.41,-3 2.41,-5.03 0,-2.41 -1.33,-4.5 -3.28,-5.62 0.49,-0.67 0.78,-1.49 0.78,-2.38 0,-2.21 -1.79,-4 -4,-4 z"
            fill="#1C1C1C"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}

      {/* ======================= KNIGHT (EXACT CHESS.COM NEO) ======================= */}
      {type === "n" &&
        (isWhite ? (
          <g fill="none" fillRule="evenodd" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 22 10 C 32.5 11 38.5 18 38 39 L 15 39 C 15 30 25 32.5 23 18"
              fill="#FFFFFF"
            />
            <path
              d="M 24 18 C 24.38 20.91 18.45 25.37 16 27 C 13 29 13.18 31.34 11 31 C 9.96 30.06 9.58 27.96 11 28 C 12.5 28 11.13 26.21 12 25 C 13 25.5 13.5 24.5 14 24 C 13.5 23.59 12.94 23.47 13 22.5 C 13.3 21.27 15.5 21.5 16 20.5 C 16.5 19.5 17.05 18.52 17 17.5 C 17 15.22 19.53 13.63 21 13.5 C 22.25 13.39 23.6 14 24 15 z"
              fill="#FFFFFF"
            />
            <circle cx="9.5" cy="25.5" r="0.75" fill="#000000" />
            <path
              d="M 15 15.5 A 0.5 1.5 0 1 1 14 15.5 A 0.5 1.5 0 1 1 15 15.5 z"
              transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"
              fill="#000000"
            />
            <path
              d="M 24.5 10.5 C 26 12 27 15 27 18 M 29 13 C 31 15 32 18 32 22 M 33.5 17 C 35 19.5 36 23 36 27"
              stroke="#000000"
              strokeWidth="1.2"
            />
          </g>
        ) : (
          <g fill="none" fillRule="evenodd" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 22 10 C 32.5 11 38.5 18 38 39 L 15 39 C 15 30 25 32.5 23 18"
              fill="#1C1C1C"
              stroke="#FFFFFF"
            />
            <path
              d="M 24 18 C 24.38 20.91 18.45 25.37 16 27 C 13 29 13.18 31.34 11 31 C 9.96 30.06 9.58 27.96 11 28 C 12.5 28 11.13 26.21 12 25 C 13 25.5 13.5 24.5 14 24 C 13.5 23.59 12.94 23.47 13 22.5 C 13.3 21.27 15.5 21.5 16 20.5 C 16.5 19.5 17.05 18.52 17 17.5 C 17 15.22 19.53 13.63 21 13.5 C 22.25 13.39 23.6 14 24 15 z"
              fill="#1C1C1C"
              stroke="#FFFFFF"
            />
            <circle cx="9.5" cy="25.5" r="0.75" fill="#FFFFFF" />
            <path
              d="M 15 15.5 A 0.5 1.5 0 1 1 14 15.5 A 0.5 1.5 0 1 1 15 15.5 z"
              transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"
              fill="#FFFFFF"
            />
            <path
              d="M 24.5 10.5 C 26 12 27 15 27 18 M 29 13 C 31 15 32 18 32 22 M 33.5 17 C 35 19.5 36 23 36 27"
              stroke="#FFFFFF"
              strokeWidth="1.2"
            />
          </g>
        ))}

      {/* ======================= BISHOP ======================= */}
      {type === "b" &&
        (isWhite ? (
          <g fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <g fill="#FFFFFF" strokeLinejoin="miter">
              <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z" />
              <path d="M 12,36 C 12,32 15,27 15,27 C 15,27 16.5,25.5 16.5,24 C 16.5,22.5 15,21.5 15,20.5 C 15,19.5 16,18.5 16.5,18 C 17,17.5 17.5,17 18,15 C 18.5,13 18.5,10.5 22.5,10.5 C 26.5,10.5 26.5,13 27,15 C 27.5,17 28,17.5 28.5,18 C 29,18.5 30,19.5 30,20.5 C 30,21.5 28.5,22.5 28.5,24 C 28.5,25.5 30,27 30,27 C 30,27 33,32 33,36 z" />
              <circle cx="22.5" cy="8" r="1.5" />
            </g>
            <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" />
          </g>
        ) : (
          <g fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <g fill="#1C1C1C" strokeLinejoin="miter">
              <path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.65,38.99 6.68,38.97 6,38 C 7.35,36.54 9,36 9,36 z" />
              <path d="M 12,36 C 12,32 15,27 15,27 C 15,27 16.5,25.5 16.5,24 C 16.5,22.5 15,21.5 15,20.5 C 15,19.5 16,18.5 16.5,18 C 17,17.5 17.5,17 18,15 C 18.5,13 18.5,10.5 22.5,10.5 C 26.5,10.5 26.5,13 27,15 C 27.5,17 28,17.5 28.5,18 C 29,18.5 30,19.5 30,20.5 C 30,21.5 28.5,22.5 28.5,24 C 28.5,25.5 30,27 30,27 C 30,27 33,32 33,36 z" />
              <circle cx="22.5" cy="8" r="1.5" />
            </g>
            <path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18" />
          </g>
        ))}

      {/* ======================= ROOK ======================= */}
      {type === "r" &&
        (isWhite ? (
          <g fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 9,39 L 36,39 L 36,36 L 9,36 z"
              fill="#FFFFFF"
              strokeLinejoin="miter"
            />
            <path
              d="M 12,36 L 12,32 L 33,32 L 33,36 z"
              fill="#FFFFFF"
              strokeLinejoin="miter"
            />
            <path
              d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 z"
              fill="#FFFFFF"
              strokeLinejoin="miter"
            />
            <path
              d="M 34,14 L 31,17 L 14,17 L 11,14"
              fill="#FFFFFF"
            />
            <path
              d="M 31,17 L 31,29.5 L 14,29.5 L 14,17 z"
              fill="#FFFFFF"
              strokeLinejoin="miter"
            />
            <path
              d="M 11,30 L 34,30"
            />
          </g>
        ) : (
          <g fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 9,39 L 36,39 L 36,36 L 9,36 z"
              fill="#1C1C1C"
              strokeLinejoin="miter"
            />
            <path
              d="M 12,36 L 12,32 L 33,32 L 33,36 z"
              fill="#1C1C1C"
              strokeLinejoin="miter"
            />
            <path
              d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14 z"
              fill="#1C1C1C"
              strokeLinejoin="miter"
            />
            <path
              d="M 34,14 L 31,17 L 14,17 L 11,14"
              fill="#1C1C1C"
            />
            <path
              d="M 31,17 L 31,29.5 L 14,29.5 L 14,17 z"
              fill="#1C1C1C"
              strokeLinejoin="miter"
            />
            <path
              d="M 11,30 L 34,30"
            />
          </g>
        ))}

      {/* ======================= QUEEN ======================= */}
      {type === "q" &&
        (isWhite ? (
          <g fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 22.5,10 L 14,25 L 6.5,13.5 z"
              fill="#FFFFFF"
              strokeLinejoin="miter"
            />
            <path
              d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 L 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 z"
              fill="#FFFFFF"
            />
            <circle cx="6" cy="12" r="2" fill="#FFFFFF" />
            <circle cx="14" cy="9" r="2" fill="#FFFFFF" />
            <circle cx="22.5" cy="8" r="2" fill="#FFFFFF" />
            <circle cx="31" cy="9" r="2" fill="#FFFFFF" />
            <circle cx="39" cy="12" r="2" fill="#FFFFFF" />
          </g>
        ) : (
          <g fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 22.5,10 L 14,25 L 6.5,13.5 z"
              fill="#1C1C1C"
              strokeLinejoin="miter"
            />
            <path
              d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 L 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 z"
              fill="#1C1C1C"
            />
            <circle cx="6" cy="12" r="2" fill="#1C1C1C" />
            <circle cx="14" cy="9" r="2" fill="#1C1C1C" />
            <circle cx="22.5" cy="8" r="2" fill="#1C1C1C" />
            <circle cx="31" cy="9" r="2" fill="#1C1C1C" />
            <circle cx="39" cy="12" r="2" fill="#1C1C1C" />
          </g>
        ))}

      {/* ======================= KING ======================= */}
      {type === "k" &&
        (isWhite ? (
          <g fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 22.5,11.63 L 22.5,6 M 20,8 L 25,8"
              stroke="#000000"
            />
            <path
              d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 24,11.5 21,11.5 22.5,25 z"
              fill="#FFFFFF"
            />
            <path
              d="M 11.5,37 C 17,40.5 28,40.5 33.5,37 C 33.5,30 33.5,27.5 33.5,27.5 C 33.5,27.5 36.5,25 36.5,22 C 36.5,19 33.5,18 31,18 C 28.5,18 27.5,19.5 27.5,20.5 C 27.5,21.5 28.5,22.5 28.5,23.5 C 28.5,24.5 27.5,25.5 26,25.5 C 24.5,25.5 22.5,24 22.5,24 C 22.5,24 20.5,25.5 19,25.5 C 17.5,25.5 16.5,24.5 16.5,23.5 C 16.5,22.5 17.5,21.5 17.5,20.5 C 17.5,19.5 16.5,18 14,18 C 11.5,18 8.5,19 8.5,22 C 8.5,25 11.5,27.5 11.5,27.5 z"
              fill="#FFFFFF"
            />
            <path
              d="M 11.5,30 C 17,27 28,27 33.5,30 M 11.5,33.5 C 17,30.5 28,30.5 33.5,33.5 M 11.5,37 C 17,34 28,34 33.5,37"
            />
          </g>
        ) : (
          <g fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path
              d="M 22.5,11.63 L 22.5,6 M 20,8 L 25,8"
              stroke="#FFFFFF"
            />
            <path
              d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 24,11.5 21,11.5 22.5,25 z"
              fill="#1C1C1C"
            />
            <path
              d="M 11.5,37 C 17,40.5 28,40.5 33.5,37 C 33.5,30 33.5,27.5 33.5,27.5 C 33.5,27.5 36.5,25 36.5,22 C 36.5,19 33.5,18 31,18 C 28.5,18 27.5,19.5 27.5,20.5 C 27.5,21.5 28.5,22.5 28.5,23.5 C 28.5,24.5 27.5,25.5 26,25.5 C 24.5,25.5 22.5,24 22.5,24 C 22.5,24 20.5,25.5 19,25.5 C 17.5,25.5 16.5,24.5 16.5,23.5 C 16.5,22.5 17.5,21.5 17.5,20.5 C 17.5,19.5 16.5,18 14,18 C 11.5,18 8.5,19 8.5,22 C 8.5,25 11.5,27.5 11.5,27.5 z"
              fill="#1C1C1C"
            />
            <path
              d="M 11.5,30 C 17,27 28,27 33.5,30 M 11.5,33.5 C 17,30.5 28,30.5 33.5,33.5 M 11.5,37 C 17,34 28,34 33.5,37"
            />
          </g>
        ))}
    </svg>
  );
};
