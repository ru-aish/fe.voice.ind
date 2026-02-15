export interface VoiceWebSocketConfig {
  url: string;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  onMessage?: (data: unknown) => void;
  enableReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
}

export class VoiceWebSocket {
  private ws: WebSocket | null = null;
  private config: VoiceWebSocketConfig;
  private reconnectAttempts = 0;
  private maxReconnectAttempts: number;
  private reconnectDelay: number;
  private enableReconnect: boolean;
  private intentionalDisconnect = false;

  constructor(config: VoiceWebSocketConfig) {
    this.config = config;
    this.maxReconnectAttempts = config.maxReconnectAttempts ?? 5;
    this.reconnectDelay = config.reconnectDelay ?? 1000;
    this.enableReconnect = config.enableReconnect ?? true;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.intentionalDisconnect = false;
        let settled = false;
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          settled = true;
          this.config.onOpen?.();
          resolve();
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket closed');
          this.config.onClose?.(event);
          if (!settled) {
            reject(new Error('WebSocket closed before connection'));
            return;
          }
          if (this.enableReconnect && !this.intentionalDisconnect) {
            this.attemptReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.config.onError?.(error);
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.config.onMessage?.(data);
          } catch {
            this.config.onMessage?.(event.data);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => {
        this.connect().catch((err) => {
          console.error('Reconnect failed:', err);
        });
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  send(data: unknown): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(message);
      return true;
    }
    return false;
  }

  sendAudio(audioData: ArrayBuffer): boolean {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(audioData);
      return true;
    }
    return false;
  }

  disconnect(): void {
    if (this.ws) {
      this.intentionalDisconnect = true;
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getReadyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}
