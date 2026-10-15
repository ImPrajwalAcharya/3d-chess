import { create } from "zustand";
import { Chess, Square, PieceSymbol, Color, Move } from "chess.js";
import {
  GameMode,
  AIDifficulty,
  CameraPreset,
  TimeControl,
  PlayerColor,
  MoveRecord,
  CapturedPieces,
  P2PPacket,
  P2PMovePayload,
} from "@/types/chess";
import { sound } from "@/lib/soundEffects";
import { computeBestMove } from "@/lib/aiEngine";
import { webrtcManager, ConnectionStatus } from "@/lib/webrtcPeer";

export const TIME_CONTROLS: Record<string, TimeControl> = {
  bullet1: { name: "1+0 Bullet", initialSeconds: 60, incrementSeconds: 0 },
  bullet2_1: { name: "2+1 Bullet", initialSeconds: 120, incrementSeconds: 1 },
  blitz3: { name: "3+0 Blitz", initialSeconds: 180, incrementSeconds: 0 },
  blitz3_2: { name: "3+2 Blitz", initialSeconds: 180, incrementSeconds: 2 },
  blitz5: { name: "5+0 Blitz", initialSeconds: 300, incrementSeconds: 0 },
  rapid10: { name: "10+0 Rapid", initialSeconds: 600, incrementSeconds: 0 },
  rapid15_10: { name: "15+10 Rapid", initialSeconds: 900, incrementSeconds: 10 },
  untimed: { name: "Untimed Zen", initialSeconds: 0, incrementSeconds: 0 },
};

interface ChessState {
  // Core Game
  chess: Chess;
  fen: string;
  gameMode: GameMode;
  aiDifficulty: AIDifficulty;
  playerColor: PlayerColor; // The local player's perspective in AI/P2P
  selectedSquare: Square | null;
  validMoves: Move[];
  lastMove: { from: Square; to: Square } | null;
  moveHistory: MoveRecord[];
  capturedPieces: CapturedPieces;
  materialAdvantage: { white: number; black: number };
  
  // Game Status
  isGameOver: boolean;
  gameResult: string | null;
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  kingInCheckSquare: Square | null;
  pendingPromotion: { from: Square; to: Square } | null;

  // Clocks
  timeControl: TimeControl;
  whiteTimeMs: number;
  blackTimeMs: number;
  lastClockTick: number;
  isClockRunning: boolean;

  // AI
  isAIThinking: boolean;
  evaluationScore: number;
  showEvalBar: boolean;

  // Camera & Visuals
  cameraPreset: CameraPreset;
  cameraLocked: boolean;
  viewMode: "3d" | "2d";
  autoFlip: boolean;
  showCoordinates: boolean;
  soundEnabled: boolean;

  // WebRTC Multiplayer
  peerStatus: ConnectionStatus;
  roomId: string;
  pingMs: number;
  errorMessage: string | null;
  incomingDrawOffer: boolean;
  incomingRematchOffer: boolean;
  chatEmojis: Array<{ id: number; sender: "me" | "opponent"; text: string }>;

  // Actions
  initGame: (options?: {
    mode?: GameMode;
    color?: PlayerColor | "random";
    difficulty?: AIDifficulty;
    timeControl?: TimeControl;
  }) => void;
  selectSquare: (square: Square | null) => void;
  makeMove: (from: Square, to: Square, promotion?: PieceSymbol) => boolean;
  triggerAIMove: () => Promise<void>;
  promotePawn: (piece: PieceSymbol) => void;
  cancelPromotion: () => void;
  undoMove: () => void;
  setCameraPreset: (preset: CameraPreset) => void;
  setCameraLocked: (locked: boolean) => void;
  toggleCameraLock: () => void;
  setViewMode: (mode: "3d" | "2d") => void;
  setAutoFlip: (enabled: boolean) => void;
  setShowCoordinates: (enabled: boolean) => void;
  toggleSound: () => void;
  setShowEvalBar: (enabled: boolean) => void;
  
  // Clocks
  tickClock: () => void;

  // Multiplayer Actions
  hostP2PGame: () => Promise<string>;
  joinP2PGame: (targetPeerId: string) => Promise<void>;
  sendChatEmoji: (emoji: string) => void;
  offerDraw: () => void;
  acceptDraw: () => void;
  declineDraw: () => void;
  resignGame: () => void;
  requestRematch: () => void;
  acceptRematch: () => void;
  clearError: () => void;
}

// Material values for advantage calculation
const PIECE_VALS: Record<PieceSymbol, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

function calculateCapturedAndMaterial(chess: Chess): {
  captured: CapturedPieces;
  advantage: { white: number; black: number };
} {
  const initial: Record<Color, Record<PieceSymbol, number>> = {
    w: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 },
    b: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 },
  };

  const current: Record<Color, Record<PieceSymbol, number>> = {
    w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
    b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
  };

  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        current[piece.color][piece.type]++;
      }
    }
  }

  const captured: CapturedPieces = { w: [], b: [] };
  let whiteMat = 0;
  let blackMat = 0;

  (["p", "n", "b", "r", "q"] as PieceSymbol[]).forEach((type) => {
    // White pieces missing were captured by Black
    const missingWhite = Math.max(0, initial.w[type] - current.w[type]);
    for (let i = 0; i < missingWhite; i++) {
      captured.w.push(type);
    }
    // Black pieces missing were captured by White
    const missingBlack = Math.max(0, initial.b[type] - current.b[type]);
    for (let i = 0; i < missingBlack; i++) {
      captured.b.push(type);
    }

    whiteMat += current.w[type] * PIECE_VALS[type];
    blackMat += current.b[type] * PIECE_VALS[type];
  });

  return {
    captured,
    advantage: {
      white: Math.max(0, whiteMat - blackMat),
      black: Math.max(0, blackMat - whiteMat),
    },
  };
}

function findKingSquare(chess: Chess, color: Color): Square | null {
  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === "k" && p.color === color) {
        return `${String.fromCharCode(97 + c)}${8 - r}` as Square;
      }
    }
  }
  return null;
}

export const useChessStore = create<ChessState>((set, get) => {
  const initialChess = new Chess();

  // Setup WebRTC observers
  webrtcManager.setObservers({
    onStatusChange: (status) => {
      set({ peerStatus: status });
      if (status === "connected") {
        sound.playTibetanBowl(true);
      }
    },
    onPingUpdate: (pingMs) => set({ pingMs }),
    onError: (err) => set({ errorMessage: err }),
    onPacket: (packet: P2PPacket) => {
      const state = get();
      switch (packet.type) {
        case "INIT_GAME": {
          const { fen, hostColor, timeControl } = packet.payload;
          const newChess = new Chess(fen);
          const assignedColor: PlayerColor = hostColor === "w" ? "b" : "w";
          const ms = (timeControl?.initialSeconds || 0) * 1000;
          set({
            chess: newChess,
            fen: newChess.fen(),
            playerColor: assignedColor,
            timeControl: timeControl || TIME_CONTROLS.rapid10,
            whiteTimeMs: ms,
            blackTimeMs: ms,
            lastClockTick: Date.now(),
            isClockRunning: ms > 0,
            isGameOver: false,
            gameResult: null,
            moveHistory: [],
            lastMove: null,
            selectedSquare: null,
            validMoves: [],
          });
          sound.playTibetanBowl(true);
          break;
        }

        case "MOVE": {
          const payload = packet.payload as P2PMovePayload;
          const { chess } = state;
          try {
            const moveResult = chess.move({
              from: payload.from,
              to: payload.to,
              promotion: payload.promotion,
            });

            if (moveResult) {
              const { captured, advantage } = calculateCapturedAndMaterial(chess);
              const isCheck = chess.inCheck();
              const isOver = chess.isGameOver();

              if (moveResult.captured) {
                sound.playCapture();
              } else {
                sound.playMove();
              }

              if (isCheck) {
                sound.playCheck();
              }

              let resultText = null;
              if (chess.isCheckmate()) {
                resultText = `Checkmate — ${chess.turn() === "w" ? "Black" : "White"} Wins!`;
                sound.playTibetanBowl(true);
              } else if (chess.isDraw()) {
                resultText = "Draw by Rules";
                sound.playTibetanBowl(false);
              }

              const newRecord: MoveRecord = {
                san: moveResult.san,
                from: moveResult.from,
                to: moveResult.to,
                piece: moveResult.piece,
                color: moveResult.color,
                captured: moveResult.captured as PieceSymbol | undefined,
                promotion: moveResult.promotion as PieceSymbol | undefined,
                fenAfter: chess.fen(),
                timestamp: Date.now(),
              };

              const nextChess = new Chess(chess.fen());
              set({
                chess: nextChess,
                fen: nextChess.fen(),
                lastMove: { from: payload.from, to: payload.to },
                moveHistory: [...state.moveHistory, newRecord],
                capturedPieces: captured,
                materialAdvantage: advantage,
                whiteTimeMs: payload.whiteTimeMs,
                blackTimeMs: payload.blackTimeMs,
                lastClockTick: Date.now(),
                isGameOver: isOver,
                gameResult: resultText,
                isCheck,
                isCheckmate: chess.isCheckmate(),
                isDraw: chess.isDraw(),
                kingInCheckSquare: isCheck ? findKingSquare(chess, chess.turn()) : null,
                selectedSquare: null,
                validMoves: [],
              });
            }
          } catch (e) {
            console.error("Invalid P2P move received", e);
          }
          break;
        }

        case "OFFER_DRAW":
          set({ incomingDrawOffer: true });
          break;

        case "ACCEPT_DRAW":
          set({
            isGameOver: true,
            gameResult: "Draw Agreed by Both Players",
            incomingDrawOffer: false,
          });
          sound.playTibetanBowl(false);
          break;

        case "DECLINE_DRAW":
          set({ incomingDrawOffer: false, errorMessage: "Draw offer declined" });
          break;

        case "RESIGN": {
          const payload = packet.payload as { resigningColor?: PlayerColor } | null;
          const resigningColor = payload?.resigningColor || (state.playerColor === "w" ? "b" : "w");
          const winningSide = resigningColor === "w" ? "Black" : "White";
          set({
            isGameOver: true,
            gameResult: `Opponent Resigned — ${winningSide} Wins!`,
            isClockRunning: false,
            selectedSquare: null,
            validMoves: [],
            pendingPromotion: null,
          });
          sound.playTibetanBowl(true);
          break;
        }

        case "REQUEST_REMATCH":
          set({ incomingRematchOffer: true });
          break;

        case "ACCEPT_REMATCH":
          set({ incomingRematchOffer: false });
          state.initGame();
          break;

        case "CHAT_EMOJI":
          set((s) => ({
            chatEmojis: [
              ...s.chatEmojis.slice(-8),
              { id: Date.now(), sender: "opponent", text: packet.payload.text },
            ],
          }));
          break;
      }
    },
  });

  return {
    chess: initialChess,
    fen: initialChess.fen(),
    gameMode: "ai",
    aiDifficulty: "adept",
    playerColor: "w",
    selectedSquare: null,
    validMoves: [],
    lastMove: null,
    moveHistory: [],
    capturedPieces: { w: [], b: [] },
    materialAdvantage: { white: 0, black: 0 },

    isGameOver: false,
    gameResult: null,
    isCheck: false,
    isCheckmate: false,
    isDraw: false,
    kingInCheckSquare: null,
    pendingPromotion: null,

    timeControl: TIME_CONTROLS.rapid10,
    whiteTimeMs: 600000,
    blackTimeMs: 600000,
    lastClockTick: Date.now(),
    isClockRunning: false,

    isAIThinking: false,
    evaluationScore: 0,
    showEvalBar: true,

    cameraPreset: "player",
    cameraLocked: true,
    viewMode: "3d",
    autoFlip: false,
    showCoordinates: true,
    soundEnabled: true,

    peerStatus: "disconnected",
    roomId: "",
    pingMs: 0,
    errorMessage: null,
    incomingDrawOffer: false,
    incomingRematchOffer: false,
    chatEmojis: [],

    initGame: (options = {}) => {
      const {
        mode = get().gameMode,
        color = get().playerColor,
        difficulty = get().aiDifficulty,
        timeControl = get().timeControl,
      } = options;

      const newChess = new Chess();
      let chosenColor: PlayerColor = "w";
      if (color === "random") {
        chosenColor = Math.random() > 0.5 ? "w" : "b";
      } else {
        chosenColor = color as PlayerColor;
      }

      const ms = timeControl.initialSeconds * 1000;

      sound.playTibetanBowl(true);

      set({
        chess: newChess,
        fen: newChess.fen(),
        gameMode: mode,
        playerColor: chosenColor,
        aiDifficulty: difficulty,
        timeControl,
        whiteTimeMs: ms,
        blackTimeMs: ms,
        lastClockTick: Date.now(),
        isClockRunning: ms > 0,
        isGameOver: false,
        gameResult: null,
        isCheck: false,
        isCheckmate: false,
        isDraw: false,
        kingInCheckSquare: null,
        pendingPromotion: null,
        selectedSquare: null,
        validMoves: [],
        lastMove: null,
        moveHistory: [],
        capturedPieces: { w: [], b: [] },
        materialAdvantage: { white: 0, black: 0 },
        isAIThinking: false,
        evaluationScore: 0,
        incomingDrawOffer: false,
        incomingRematchOffer: false,
      });

      // If playing as Black against AI, trigger AI first move
      if (mode === "ai" && chosenColor === "b") {
        setTimeout(() => {
          get().triggerAIMove();
        }, 500);
      }
    },

    selectSquare: (square: Square | null) => {
      const state = get();
      if (state.isGameOver || state.isAIThinking) return;

      // In AI mode, prevent moving during AI turn
      if (state.gameMode === "ai" && state.chess.turn() !== state.playerColor) {
        return;
      }

      // In P2P mode, prevent moving during opponent's turn
      if (state.gameMode === "p2p" && state.chess.turn() !== state.playerColor) {
        return;
      }

      if (!square) {
        set({ selectedSquare: null, validMoves: [] });
        return;
      }

      // If square already selected, deselect
      if (state.selectedSquare === square) {
        set({ selectedSquare: null, validMoves: [] });
        return;
      }

      // If already selected another piece and clicked a valid destination, make the move!
      if (state.selectedSquare) {
        const matchingMove = state.validMoves.find((m) => m.to === square);
        if (matchingMove) {
          // Check for pawn promotion
          const piece = state.chess.get(state.selectedSquare);
          const isPromotion =
            piece?.type === "p" &&
            ((piece.color === "w" && square[1] === "8") ||
              (piece.color === "b" && square[1] === "1"));

          if (isPromotion) {
            set({
              pendingPromotion: { from: state.selectedSquare, to: square },
              selectedSquare: null,
              validMoves: [],
            });
            return;
          }

          state.makeMove(state.selectedSquare, square);
          set({ selectedSquare: null, validMoves: [] });
          return;
        }
      }

      // Otherwise select piece if it belongs to active player
      const pieceOnSquare = state.chess.get(square);
      if (pieceOnSquare && pieceOnSquare.color === state.chess.turn()) {
        const moves = state.chess.moves({ square, verbose: true });
        set({ selectedSquare: square, validMoves: moves });
      } else {
        set({ selectedSquare: null, validMoves: [] });
      }
    },

    makeMove: (from: Square, to: Square, promotion?: PieceSymbol) => {
      const state = get();
      const { chess, timeControl, gameMode, playerColor } = state;

      try {
        const move = chess.move({ from, to, promotion: promotion || "q" });
        if (!move) return false;

        // Sound trigger
        if (move.captured) {
          sound.playCapture();
        } else {
          sound.playMove();
        }

        const isCheck = chess.inCheck();
        if (isCheck) {
          sound.playCheck();
        }

        const { captured, advantage } = calculateCapturedAndMaterial(chess);
        const isCheckmate = chess.isCheckmate();
        const isDraw = chess.isDraw();
        const isOver = chess.isGameOver();

        let gameResult = null;
        if (isCheckmate) {
          gameResult = `Checkmate — ${move.color === "w" ? "White" : "Black"} Wins!`;
          sound.playTibetanBowl(true);
        } else if (isDraw) {
          if (chess.isStalemate()) gameResult = "Draw by Stalemate";
          else if (chess.isThreefoldRepetition()) gameResult = "Draw by Threefold Repetition";
          else if (chess.isInsufficientMaterial()) gameResult = "Draw by Insufficient Material";
          else gameResult = "Draw by 50-Move Rule";
          sound.playTibetanBowl(false);
        }

        // Apply clock increment
        let newWhiteTime = state.whiteTimeMs;
        let newBlackTime = state.blackTimeMs;
        if (timeControl.incrementSeconds > 0) {
          if (move.color === "w") {
            newWhiteTime += timeControl.incrementSeconds * 1000;
          } else {
            newBlackTime += timeControl.incrementSeconds * 1000;
          }
        }

        const newRecord: MoveRecord = {
          san: move.san,
          from: move.from,
          to: move.to,
          piece: move.piece,
          color: move.color,
          captured: move.captured as PieceSymbol | undefined,
          promotion: move.promotion as PieceSymbol | undefined,
          fenAfter: chess.fen(),
          timestamp: Date.now(),
        };

        const nextChess = new Chess(chess.fen());
        set({
          chess: nextChess,
          fen: nextChess.fen(),
          lastMove: { from, to },
          moveHistory: [...state.moveHistory, newRecord],
          capturedPieces: captured,
          materialAdvantage: advantage,
          whiteTimeMs: newWhiteTime,
          blackTimeMs: newBlackTime,
          lastClockTick: Date.now(),
          isGameOver: isOver,
          gameResult,
          isCheck,
          isCheckmate: chess.isCheckmate(),
          isDraw: chess.isDraw(),
          kingInCheckSquare: isCheck ? findKingSquare(chess, chess.turn()) : null,
          selectedSquare: null,
          validMoves: [],
          pendingPromotion: null,
        });

        // P2P packet broadcast
        if (gameMode === "p2p" && webrtcManager.isConnected()) {
          webrtcManager.send({
            type: "MOVE",
            payload: {
              from,
              to,
              promotion,
              san: move.san,
              fenAfter: chess.fen(),
              whiteTimeMs: newWhiteTime,
              blackTimeMs: newBlackTime,
              moveTimestamp: Date.now(),
            },
            timestamp: Date.now(),
          });
        }

        // Trigger AI if against AI and next turn is AI's
        if (gameMode === "ai" && !isOver && chess.turn() !== playerColor) {
          setTimeout(() => {
            get().triggerAIMove();
          }, 350);
        }

        return true;
      } catch (err) {
        console.error("Illegal move attempt", err);
        return false;
      }
    },

    promotePawn: (piece: PieceSymbol) => {
      const state = get();
      if (!state.pendingPromotion) return;
      const { from, to } = state.pendingPromotion;
      state.makeMove(from, to, piece);
    },

    cancelPromotion: () => {
      set({
        pendingPromotion: null,
        selectedSquare: null,
        validMoves: [],
      });
    },

    undoMove: () => {
      const state = get();
      if (state.moveHistory.length === 0) return;
      if (state.gameMode === "p2p") return;

      // In Vs AI mode:
      // If AI just moved (so it's user's turn): undo 2 half-moves (AI's move + User's move)
      // If user just moved and AI hasn't moved yet: undo 1 half-move
      let movesToUndo = 1;
      if (state.gameMode === "ai") {
        if (state.chess.turn() === state.playerColor && state.moveHistory.length >= 2) {
          movesToUndo = 2;
        } else {
          movesToUndo = 1;
        }
      }

      const targetHistory = state.moveHistory.slice(0, -movesToUndo);
      const restoredChess = new Chess();
      for (const rec of targetHistory) {
        try {
          restoredChess.move({
            from: rec.from,
            to: rec.to,
            promotion: rec.promotion,
          });
        } catch (e) {
          console.error("Error replaying move on undo", e);
        }
      }

      const lastRec = targetHistory[targetHistory.length - 1];
      const { captured, advantage } = calculateCapturedAndMaterial(restoredChess);
      const isCheck = restoredChess.inCheck();

      sound.playMove();

      set({
        chess: restoredChess,
        fen: restoredChess.fen(),
        moveHistory: targetHistory,
        lastMove: lastRec ? { from: lastRec.from, to: lastRec.to } : null,
        capturedPieces: captured,
        materialAdvantage: advantage,
        isGameOver: false,
        gameResult: null,
        isCheck,
        isCheckmate: false,
        isDraw: false,
        kingInCheckSquare: isCheck ? findKingSquare(restoredChess, restoredChess.turn()) : null,
        selectedSquare: null,
        validMoves: [],
        pendingPromotion: null,
        isAIThinking: false,
      });
    },

    triggerAIMove: async () => {
      const state = get();
      if (state.isGameOver || state.isAIThinking) return;
      if (state.gameMode === "ai" && state.chess.turn() === state.playerColor) return;

      const startFen = state.fen;
      set({ isAIThinking: true });

      try {
        const result = await computeBestMove(startFen, state.aiDifficulty);
        const current = get();
        if (
          result &&
          !current.isGameOver &&
          current.fen === startFen &&
          current.chess.turn() !== current.playerColor
        ) {
          get().makeMove(result.from, result.to, result.promotion);
          set({ evaluationScore: result.evaluation });
        }
      } catch (e) {
        console.error("AI Move error", e);
      } finally {
        set({ isAIThinking: false });
      }
    },

    tickClock: () => {
      const state = get();
      if (
        state.isGameOver ||
        !state.isClockRunning ||
        state.timeControl.initialSeconds === 0
      ) {
        return;
      }

      const now = Date.now();
      const delta = now - state.lastClockTick;
      const turn = state.chess.turn();

      let whiteTime = state.whiteTimeMs;
      let blackTime = state.blackTimeMs;

      if (turn === "w") {
        whiteTime = Math.max(0, whiteTime - delta);
      } else {
        blackTime = Math.max(0, blackTime - delta);
      }

      // Check timeout (Flag Fall)
      if (whiteTime <= 0 || blackTime <= 0) {
        const timedOutPlayer = whiteTime <= 0 ? "White" : "Black";
        const winner = whiteTime <= 0 ? "Black" : "White";

        // FIDE timeout rule: if winner has insufficient material to mate, it's a Draw
        const isInsufficient = state.chess.isInsufficientMaterial();
        const result = isInsufficient
          ? `Timeout (${timedOutPlayer}) — Draw (Insufficient Material)`
          : `Timeout — ${winner} Wins on Time!`;

        sound.playTibetanBowl(true);
        set({
          whiteTimeMs: whiteTime,
          blackTimeMs: blackTime,
          lastClockTick: now,
          isGameOver: true,
          gameResult: result,
          isClockRunning: false,
        });
        return;
      }

      // Low-time audio tick pulse under 15s
      const activeTime = turn === "w" ? whiteTime : blackTime;
      if (activeTime < 15000 && activeTime > 0 && Math.floor(activeTime / 1000) !== Math.floor((activeTime + delta) / 1000)) {
        sound.playTick();
      }

      set({
        whiteTimeMs: whiteTime,
        blackTimeMs: blackTime,
        lastClockTick: now,
      });
    },

    setCameraPreset: (preset) => set({ cameraPreset: preset }),
    setCameraLocked: (locked) => set({ cameraLocked: locked }),
    toggleCameraLock: () => set((s) => ({ cameraLocked: !s.cameraLocked })),
    setViewMode: (mode) => set({ viewMode: mode }),
    setAutoFlip: (enabled) => set({ autoFlip: enabled }),
    setShowCoordinates: (enabled) => set({ showCoordinates: enabled }),
    toggleSound: () => {
      const next = !get().soundEnabled;
      sound.enabled = next;
      set({ soundEnabled: next });
    },
    setShowEvalBar: (enabled) => set({ showEvalBar: enabled }),

    // Multiplayer
    hostP2PGame: async () => {
      const peerId = await webrtcManager.hostRoom();
      set({
        roomId: peerId,
        gameMode: "p2p",
        playerColor: "w",
      });
      return peerId;
    },

    joinP2PGame: async (targetPeerId: string) => {
      await webrtcManager.joinRoom(targetPeerId);
      set({
        roomId: targetPeerId,
        gameMode: "p2p",
        playerColor: "b",
      });
    },

    sendChatEmoji: (emoji: string) => {
      const state = get();
      if (webrtcManager.isConnected()) {
        webrtcManager.send({
          type: "CHAT_EMOJI",
          payload: { text: emoji },
          timestamp: Date.now(),
        });
        set((s) => ({
          chatEmojis: [
            ...s.chatEmojis.slice(-8),
            { id: Date.now(), sender: "me", text: emoji },
          ],
        }));
      }
    },

    offerDraw: () => {
      if (webrtcManager.isConnected()) {
        webrtcManager.send({
          type: "OFFER_DRAW",
          payload: null,
          timestamp: Date.now(),
        });
      }
    },

    acceptDraw: () => {
      if (webrtcManager.isConnected()) {
        webrtcManager.send({
          type: "ACCEPT_DRAW",
          payload: null,
          timestamp: Date.now(),
        });
        set({
          isGameOver: true,
          gameResult: "Draw Agreed by Both Players",
          incomingDrawOffer: false,
        });
        sound.playTibetanBowl(false);
      }
    },

    declineDraw: () => {
      if (webrtcManager.isConnected()) {
        webrtcManager.send({
          type: "DECLINE_DRAW",
          payload: null,
          timestamp: Date.now(),
        });
        set({ incomingDrawOffer: false });
      }
    },

    resignGame: () => {
      const state = get();
      if (state.isGameOver) return;

      const resigningColor: PlayerColor =
        state.gameMode === "pass_and_play"
          ? state.chess.turn()
          : state.playerColor;

      const winner = resigningColor === "w" ? "Black" : "White";

      if (state.gameMode === "p2p" && webrtcManager.isConnected()) {
        webrtcManager.send({
          type: "RESIGN",
          payload: { resigningColor },
          timestamp: Date.now(),
        });
      }

      set({
        isGameOver: true,
        gameResult: `Resigned — ${winner} Wins!`,
        isClockRunning: false,
        selectedSquare: null,
        validMoves: [],
        pendingPromotion: null,
      });
      sound.playTibetanBowl(false);
    },

    requestRematch: () => {
      if (webrtcManager.isConnected()) {
        webrtcManager.send({
          type: "REQUEST_REMATCH",
          payload: null,
          timestamp: Date.now(),
        });
      }
    },

    acceptRematch: () => {
      if (webrtcManager.isConnected()) {
        webrtcManager.send({
          type: "ACCEPT_REMATCH",
          payload: null,
          timestamp: Date.now(),
        });
        set({ incomingRematchOffer: false });
        get().initGame();
      }
    },

    clearError: () => set({ errorMessage: null }),
  };
});
