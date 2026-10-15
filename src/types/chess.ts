import { Square, PieceSymbol, Color } from "chess.js";

export type { Square, PieceSymbol, Color };

export type GameMode = "ai" | "p2p" | "pass_and_play";

export type AIDifficulty = "novice" | "adept" | "master" | "grandmaster";

export type CameraPreset = "player" | "topdown" | "cinematic" | "opponent";

export interface TimeControl {
  name: string;
  initialSeconds: number;
  incrementSeconds: number;
}

export type PlayerColor = "w" | "b";

export interface MoveRecord {
  san: string;
  from: Square;
  to: Square;
  piece: PieceSymbol;
  color: Color;
  captured?: PieceSymbol;
  promotion?: PieceSymbol;
  fenAfter: string;
  timestamp: number;
}

export interface P2PPacket {
  type:
    | "INIT_GAME"
    | "MOVE"
    | "SYNC_STATE"
    | "PING"
    | "PONG"
    | "OFFER_DRAW"
    | "ACCEPT_DRAW"
    | "DECLINE_DRAW"
    | "REQUEST_REMATCH"
    | "ACCEPT_REMATCH"
    | "RESIGN"
    | "CHAT_EMOJI";
  payload: any;
  timestamp: number;
}

export interface P2PInitGamePayload {
  fen: string;
  hostColor: PlayerColor;
  timeControl: TimeControl;
  timestamp: number;
}

export interface P2PMovePayload {
  from: Square;
  to: Square;
  promotion?: PieceSymbol;
  san: string;
  fenAfter: string;
  whiteTimeMs: number;
  blackTimeMs: number;
  moveTimestamp: number;
}

export interface CapturedPieces {
  w: PieceSymbol[];
  b: PieceSymbol[];
}
