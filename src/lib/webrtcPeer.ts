import { P2PPacket } from "@/types/chess";
import type { DataConnection, Peer } from "peerjs";

export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "hosting"
  | "connected"
  | "reconnecting";

export interface WebRTCObservers {
  onStatusChange: (status: ConnectionStatus) => void;
  onPacket: (packet: P2PPacket) => void;
  onPingUpdate: (pingMs: number) => void;
  onError: (err: string) => void;
}

export class WebRTCManager {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private myPeerId: string = "";
  private isHost: boolean = false;
  private pingInterval: any = null;
  private pingStartTime: number = 0;
  private observers: WebRTCObservers | null = null;
  private reconnectTimeout: any = null;

  setObservers(observers: WebRTCObservers) {
    this.observers = observers;
  }

  getMyPeerId(): string {
    return this.myPeerId;
  }

  getIsHost(): boolean {
    return this.isHost;
  }

  isConnected(): boolean {
    return this.conn !== null && this.conn.open;
  }

  // Host a new game room
  async hostRoom(): Promise<string> {
    this.cleanup();
    this.isHost = true;
    this.observers?.onStatusChange("connecting");

    const { default: PeerClass } = await import("peerjs");

    return new Promise((resolve, reject) => {
      // Generate clean random 6-char id or let PeerJS assign
      const shortId = "nepali-" + Math.random().toString(36).substring(2, 8);

      const peer = new PeerClass(shortId, {
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" },
          ],
        },
      });

      peer.on("open", (id) => {
        this.peer = peer;
        this.myPeerId = id;
        this.observers?.onStatusChange("hosting");
        resolve(id);
      });

      peer.on("connection", (dataConn) => {
        this.setupConnection(dataConn);
      });

      peer.on("error", (err) => {
        this.observers?.onError(err.message || "PeerJS Host error");
        reject(err);
      });
    });
  }

  // Join existing room
  async joinRoom(targetPeerId: string): Promise<void> {
    this.cleanup();
    this.isHost = false;
    this.observers?.onStatusChange("connecting");

    const { default: PeerClass } = await import("peerjs");

    return new Promise((resolve, reject) => {
      const myId = "guest-" + Math.random().toString(36).substring(2, 8);
      const peer = new PeerClass(myId, {
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" },
          ],
        },
      });

      peer.on("open", (id) => {
        this.peer = peer;
        this.myPeerId = id;
        const conn = peer.connect(targetPeerId, {
          reliable: true,
        });

        conn.on("open", () => {
          this.setupConnection(conn);
          resolve();
        });

        conn.on("error", (err) => {
          this.observers?.onError(err.message || "Connection error to host");
          reject(err);
        });
      });

      peer.on("error", (err) => {
        this.observers?.onError(err.message || "Peer join error");
        reject(err);
      });
    });
  }

  private setupConnection(conn: DataConnection) {
    this.conn = conn;

    conn.on("open", () => {
      this.observers?.onStatusChange("connected");
      this.startHeartbeat();
    });

    conn.on("data", (data: any) => {
      const packet = data as P2PPacket;
      if (!packet || !packet.type) return;

      if (packet.type === "PING") {
        this.send({ type: "PONG", payload: null, timestamp: Date.now() });
        return;
      }

      if (packet.type === "PONG") {
        const pingMs = Math.max(1, Math.round((Date.now() - this.pingStartTime) / 2));
        this.observers?.onPingUpdate(pingMs);
        return;
      }

      this.observers?.onPacket(packet);
    });

    conn.on("close", () => {
      this.handleDisconnect();
    });

    conn.on("error", () => {
      this.handleDisconnect();
    });
  }

  private handleDisconnect() {
    this.stopHeartbeat();
    this.observers?.onStatusChange("reconnecting");

    // Grace period timer (60s)
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.reconnectTimeout = setTimeout(() => {
      this.observers?.onStatusChange("disconnected");
      this.observers?.onError("Opponent disconnected (60s grace period expired).");
    }, 60000);
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.conn && this.conn.open) {
        this.pingStartTime = Date.now();
        this.send({ type: "PING", payload: null, timestamp: this.pingStartTime });
      }
    }, 3000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  send(packet: P2PPacket): boolean {
    if (this.conn && this.conn.open) {
      try {
        this.conn.send(packet);
        return true;
      } catch (err) {
        return false;
      }
    }
    return false;
  }

  cleanup() {
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.conn) {
      try {
        this.conn.close();
      } catch {}
      this.conn = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {}
      this.peer = null;
    }
  }
}

export const webrtcManager = new WebRTCManager();
