import { Chess, Square, PieceSymbol, Move } from "chess.js";
import { AIDifficulty } from "@/types/chess";

// Piece values in centipawns
const PIECE_VALUES: Record<PieceSymbol, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Simplified PeSTO-style Piece-Square Tables (from White's perspective, flip rank for Black)
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0
];

const KNIGHT_TABLE = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

const BISHOP_TABLE = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

const ROOK_TABLE = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
];

const QUEEN_TABLE = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20
];

const KING_MID_TABLE = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20
];

function getSquareIndex(square: Square, color: "w" | "b"): number {
  const file = square.charCodeAt(0) - 97; // a=0, h=7
  const rank = parseInt(square[1], 10) - 1; // 1=0, 8=7
  // White table index: 0 is a8, 63 is h1
  const standardRank = 7 - rank;
  if (color === "w") {
    return standardRank * 8 + file;
  } else {
    // Mirror for black
    return (7 - standardRank) * 8 + file;
  }
}

function evaluatePosition(chess: Chess): number {
  if (chess.isCheckmate()) {
    return chess.turn() === "w" ? -100000 : 100000;
  }
  if (chess.isDraw()) {
    return 0;
  }

  let score = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const val = PIECE_VALUES[piece.type];
      const square = `${String.fromCharCode(97 + c)}${8 - r}` as Square;
      const sqIdx = getSquareIndex(square, piece.color);

      let psqt = 0;
      switch (piece.type) {
        case "p":
          psqt = PAWN_TABLE[sqIdx];
          break;
        case "n":
          psqt = KNIGHT_TABLE[sqIdx];
          break;
        case "b":
          psqt = BISHOP_TABLE[sqIdx];
          break;
        case "r":
          psqt = ROOK_TABLE[sqIdx];
          break;
        case "q":
          psqt = QUEEN_TABLE[sqIdx];
          break;
        case "k":
          psqt = KING_MID_TABLE[sqIdx];
          break;
      }

      const totalVal = val + psqt;
      if (piece.color === "w") {
        score += totalVal;
      } else {
        score -= totalVal;
      }
    }
  }

  return score;
}

// Order moves for alpha-beta efficiency (MVV-LVA: Most Valuable Victim - Least Valuable Attacker)
function orderMoves(moves: Move[]): Move[] {
  return moves.slice().sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (a.captured) {
      scoreA = PIECE_VALUES[a.captured] * 10 - PIECE_VALUES[a.piece];
    }
    if (a.promotion) {
      scoreA += PIECE_VALUES[a.promotion];
    }

    if (b.captured) {
      scoreB = PIECE_VALUES[b.captured] * 10 - PIECE_VALUES[b.piece];
    }
    if (b.promotion) {
      scoreB += PIECE_VALUES[b.promotion];
    }

    return scoreB - scoreA;
  });
}

// Async Minimax with Alpha-Beta pruning that yields to event loop
async function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  nodeCount: { count: number }
): Promise<number> {
  nodeCount.count++;
  // Periodically yield to keep UI thread silky smooth
  if (nodeCount.count % 500 === 0) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  if (depth === 0 || chess.isGameOver()) {
    return evaluatePosition(chess);
  }

  const moves = orderMoves(chess.moves({ verbose: true }));

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalScore = await minimax(chess, depth - 1, alpha, beta, false, nodeCount);
      chess.undo();
      maxEval = Math.max(maxEval, evalScore);
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break; // Pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move(move);
      const evalScore = await minimax(chess, depth - 1, alpha, beta, true, nodeCount);
      chess.undo();
      minEval = Math.min(minEval, evalScore);
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break; // Pruning
    }
    return minEval;
  }
}

export interface BestMoveResult {
  from: Square;
  to: Square;
  promotion?: PieceSymbol;
  evaluation: number;
}

// Stockfish Web Worker Manager
class StockfishWorkerClient {
  private worker: Worker | null = null;
  private isReady = false;
  private isFailed = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === "undefined") return;
    try {
      // Create inline worker that loads Stockfish from CDN with fallback
      const workerCode = `
        let stockfish = null;
        try {
          importScripts("https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js");
          if (typeof STOCKFISH === "function") {
            stockfish = STOCKFISH();
          } else if (typeof Stockfish === "function") {
            stockfish = Stockfish();
          }
          if (stockfish) {
            stockfish.onmessage = function(event) {
              postMessage(event.data || event);
            };
            postMessage("ready");
          } else {
            postMessage("error:not_loaded");
          }
        } catch (err) {
          postMessage("error:" + err.message);
        }

        onmessage = function(e) {
          if (stockfish) {
            stockfish.postMessage(e.data);
          }
        };
      `;
      const blob = new Blob([workerCode], { type: "application/javascript" });
      const workerUrl = URL.createObjectURL(blob);
      this.worker = new Worker(workerUrl);

      this.worker.onmessage = (e) => {
        const msg = String(e.data);
        if (msg === "ready") {
          this.isReady = true;
          this.worker?.postMessage("uci");
          this.worker?.postMessage("isready");
        } else if (msg.startsWith("error:")) {
          this.isFailed = true;
        }
      };

      this.worker.onerror = () => {
        this.isFailed = true;
      };
    } catch {
      this.isFailed = true;
    }
  }

  async getMove(fen: string, depth = 14, timeoutMs = 4000): Promise<string | null> {
    if (this.isFailed || !this.worker) return null;

    return new Promise((resolve) => {
      let resolved = false;
      const timer = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve(null);
        }
      }, timeoutMs);

      const handler = (e: MessageEvent) => {
        const msg = String(e.data);
        if (msg.startsWith("bestmove")) {
          const parts = msg.split(" ");
          const bestMove = parts[1];
          if (!resolved) {
            resolved = true;
            clearTimeout(timer);
            this.worker?.removeEventListener("message", handler);
            resolve(bestMove && bestMove !== "(none)" ? bestMove : null);
          }
        }
      };

      this.worker?.addEventListener("message", handler);
      this.worker?.postMessage(`position fen ${fen}`);
      this.worker?.postMessage(`go depth ${depth}`);
    });
  }
}

const stockfishClient = typeof window !== "undefined" ? new StockfishWorkerClient() : null;

// Public compute function supporting all 4 difficulties with async yield & Stockfish fallback
export async function computeBestMove(
  fen: string,
  difficulty: AIDifficulty
): Promise<BestMoveResult | null> {
  const chess = new Chess(fen);
  const legalMoves = chess.moves({ verbose: true });
  if (legalMoves.length === 0) return null;

  // 1. Grandmaster Difficulty: Attempt Stockfish first
  if (difficulty === "grandmaster" && stockfishClient) {
    try {
      const sfMove = await stockfishClient.getMove(fen, 14, 3500);
      if (sfMove && sfMove.length >= 4) {
        const from = sfMove.substring(0, 2) as Square;
        const to = sfMove.substring(2, 4) as Square;
        const promotion = (sfMove.length > 4 ? sfMove[4] : undefined) as PieceSymbol | undefined;

        // Verify validity
        const matching = legalMoves.find((m) => m.from === from && m.to === to);
        if (matching) {
          return {
            from,
            to,
            promotion: promotion || (matching.promotion as PieceSymbol | undefined),
            evaluation: 0,
          };
        }
      }
    } catch (e) {
      // Fall through to Minimax
    }
  }

  // 2. Built-in Asynchronous Minimax Evaluator
  let depth = 2;
  let blunderChance = 0;

  switch (difficulty) {
    case "novice": // Samanera / Apprentice (~800 ELO)
      depth = 2;
      blunderChance = 0.35;
      break;
    case "adept": // Bhikkhu / Monk (~1300 ELO)
      depth = 3;
      blunderChance = 0.1;
      break;
    case "master": // Lama / Scholar (~1800 ELO)
      depth = 4;
      blunderChance = 0.0;
      break;
    case "grandmaster": // Vajra fallback
      depth = 5;
      blunderChance = 0.0;
      break;
  }

  // Novice blunder injects random legal move occasionally
  if (blunderChance > 0 && Math.random() < blunderChance) {
    const randomMove = legalMoves[Math.floor(Math.random() * legalMoves.length)];
    return {
      from: randomMove.from,
      to: randomMove.to,
      promotion: randomMove.promotion as PieceSymbol | undefined,
      evaluation: 0,
    };
  }

  const isMaximizing = chess.turn() === "w";
  let bestEval = isMaximizing ? -Infinity : Infinity;
  let bestMove: Move = legalMoves[0];

  const orderedMoves = orderMoves(legalMoves);
  const nodeCount = { count: 0 };

  for (const move of orderedMoves) {
    chess.move(move);
    const score = await minimax(
      chess,
      depth - 1,
      -Infinity,
      Infinity,
      !isMaximizing,
      nodeCount
    );
    chess.undo();

    if (isMaximizing) {
      if (score > bestEval) {
        bestEval = score;
        bestMove = move;
      }
    } else {
      if (score < bestEval) {
        bestEval = score;
        bestMove = move;
      }
    }
  }

  return {
    from: bestMove.from,
    to: bestMove.to,
    promotion: bestMove.promotion as PieceSymbol | undefined,
    evaluation: bestEval,
  };
}

export function getEvaluationBar(score: number): { whitePercent: number; label: string } {
  // Clamp between -1000 and 1000 centipawns for bar rendering
  const clamped = Math.max(-1000, Math.min(1000, score));
  // Logistic curve for visual balance
  const whitePercent = 50 + (clamped / 1000) * 45;
  const pawnVal = (score / 100).toFixed(1);
  const label = score > 0 ? `+${pawnVal}` : pawnVal;
  return { whitePercent, label };
}
