import type { AutopilotStreamData, GenerationStreamData } from '@/state/types';

// Base streaming configuration
interface StreamConfig {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
  heartbeatInterval?: number;
}

// Connection states
type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error' | 'retrying';

// Base stream handler interface
interface StreamHandler<T> {
  onData: (data: T) => void;
  onError: (error: Error) => void;
  onComplete: () => void;
  onStateChange?: (state: ConnectionState) => void;
}

// WebSocket fallback support
interface WebSocketConfig extends StreamConfig {
  url: string;
  protocols?: string[];
}

// Connection manager for tracking active connections
class StreamConnectionManager {
  private static instance: StreamConnectionManager;
  private connections = new Map<string, () => void>();
  private connectionStates = new Map<string, ConnectionState>();
  
  static getInstance(): StreamConnectionManager {
    if (!StreamConnectionManager.instance) {
      StreamConnectionManager.instance = new StreamConnectionManager();
    }
    return StreamConnectionManager.instance;
  }

  register(id: string, cleanup: () => void, initialState: ConnectionState = 'connecting'): void {
    this.connections.set(id, cleanup);
    this.connectionStates.set(id, initialState);
    console.log(`Stream connection registered: ${id}`);
  }

  updateState(id: string, state: ConnectionState): void {
    this.connectionStates.set(id, state);
    console.log(`Stream connection state updated: ${id} -> ${state}`);
  }

  cleanup(id: string): void {
    const cleanup = this.connections.get(id);
    if (cleanup) {
      cleanup();
      this.connections.delete(id);
      this.connectionStates.delete(id);
      console.log(`Stream connection cleaned up: ${id}`);
    }
  }

  cleanupAll(): void {
    console.log('Cleaning up all stream connections');
    for (const [id, cleanup] of this.connections) {
      cleanup();
    }
    this.connections.clear();
    this.connectionStates.clear();
  }

  getState(id: string): ConnectionState | undefined {
    return this.connectionStates.get(id);
  }

  getActiveConnections(): string[] {
    return Array.from(this.connections.keys());
  }

  isConnected(id: string): boolean {
    return this.connectionStates.get(id) === 'connected';
  }
}

// Enhanced SSE stream creator with advanced features
export function createEnhancedSSEStream<T>(
  url: string,
  handler: StreamHandler<T>,
  config: StreamConfig = {}
): { id: string; cleanup: () => void } {
  const streamId = `sse-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const manager = StreamConnectionManager.getInstance();
  
  const {
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 30000,
    heartbeatInterval = 25000
  } = config;
  
  let eventSource: EventSource | null = null;
  let retryCount = 0;
  let retryTimeout: NodeJS.Timeout | null = null;
  let connectionTimeout: NodeJS.Timeout | null = null;
  let heartbeatTimer: NodeJS.Timeout | null = null;
  let isActive = true;
  let lastHeartbeat = Date.now();

  const setState = (state: ConnectionState) => {
    manager.updateState(streamId, state);
    handler.onStateChange?.(state);
  };

  const cleanup = () => {
    isActive = false;
    
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    
    [retryTimeout, connectionTimeout, heartbeatTimer].forEach(timer => {
      if (timer) clearTimeout(timer);
    });
    
    retryTimeout = null;
    connectionTimeout = null;
    heartbeatTimer = null;
    
    manager.cleanup(streamId);
  };

  const setupHeartbeat = () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
    }
    
    heartbeatTimer = setInterval(() => {
      const now = Date.now();
      if (now - lastHeartbeat > heartbeatInterval + 5000) {
        console.warn(`SSE heartbeat timeout for ${streamId}`);
        handler.onError(new Error('Heartbeat timeout'));
        if (eventSource) {
          eventSource.close();
        }
      }
    }, heartbeatInterval) as any;
  };

  const connect = () => {
    if (!isActive) return;
    
    setState('connecting');
    
    try {
      eventSource = new EventSource(url);
      lastHeartbeat = Date.now();
      
      // Connection timeout
      connectionTimeout = setTimeout(() => {
        if (eventSource && eventSource.readyState !== EventSource.OPEN) {
          console.warn(`SSE connection timeout for ${streamId}`);
          handler.onError(new Error('Connection timeout'));
          cleanup();
        }
      }, timeout);

      eventSource.onopen = () => {
        console.log(`SSE stream connected: ${streamId}`);
        setState('connected');
        retryCount = 0;
        lastHeartbeat = Date.now();
        
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
        
        setupHeartbeat();
      };

      eventSource.onmessage = (event) => {
        lastHeartbeat = Date.now();
        
        try {
          // Handle heartbeat messages
          if (event.data === 'heartbeat') {
            return;
          }
          
          const data: T = JSON.parse(event.data);
          handler.onData(data);
          
          // Check for completion based on common patterns
          const anyData = data as any;
          if (anyData.done || anyData.error || anyData.step === 'done' || anyData.step === 'error') {
            handler.onComplete();
            cleanup();
          }
        } catch (error) {
          console.error(`Failed to parse SSE data for ${streamId}:`, error);
          handler.onError(new Error('Invalid stream data'));
        }
      };

      eventSource.onerror = (event) => {
        console.error(`SSE stream error for ${streamId}:`, event);
        
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
        
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }

        if (isActive && retryCount < maxRetries) {
          setState('retrying');
          retryCount++;
          console.log(`Retrying SSE connection ${streamId} (${retryCount}/${maxRetries})`);
          
          retryTimeout = setTimeout(() => {
            if (isActive) {
              connect();
            }
          }, retryDelay * Math.pow(2, retryCount - 1)); // Exponential backoff
        } else if (isActive) {
          setState('error');
          handler.onError(new Error(`Stream connection failed after ${maxRetries} retries`));
          cleanup();
        }
      };
    } catch (error) {
      console.error(`Failed to create SSE stream ${streamId}:`, error);
      setState('error');
      handler.onError(error as Error);
      cleanup();
    }
  };

  // Register with manager and start connection
  manager.register(streamId, cleanup, 'connecting');
  connect();

  return { id: streamId, cleanup };
}

// WebSocket fallback implementation
export function createWebSocketStream<T>(
  config: WebSocketConfig,
  handler: StreamHandler<T>
): { id: string; cleanup: () => void } {
  const streamId = `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const manager = StreamConnectionManager.getInstance();
  
  const {
    url,
    protocols,
    maxRetries = 3,
    retryDelay = 1000,
    timeout = 30000
  } = config;
  
  let websocket: WebSocket | null = null;
  let retryCount = 0;
  let retryTimeout: NodeJS.Timeout | null = null;
  let connectionTimeout: NodeJS.Timeout | null = null;
  let isActive = true;

  const setState = (state: ConnectionState) => {
    manager.updateState(streamId, state);
    handler.onStateChange?.(state);
  };

  const cleanup = () => {
    isActive = false;
    
    if (websocket) {
      websocket.close(1000, 'Client cleanup');
      websocket = null;
    }
    
    [retryTimeout, connectionTimeout].forEach(timer => {
      if (timer) clearTimeout(timer);
    });
    
    retryTimeout = null;
    connectionTimeout = null;
    
    manager.cleanup(streamId);
  };

  const connect = () => {
    if (!isActive) return;
    
    setState('connecting');
    
    try {
      websocket = new WebSocket(url, protocols);
      
      // Connection timeout
      connectionTimeout = setTimeout(() => {
        if (websocket && websocket.readyState !== WebSocket.OPEN) {
          console.warn(`WebSocket connection timeout for ${streamId}`);
          handler.onError(new Error('Connection timeout'));
          cleanup();
        }
      }, timeout);

      websocket.onopen = () => {
        console.log(`WebSocket stream connected: ${streamId}`);
        setState('connected');
        retryCount = 0;
        
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
      };

      websocket.onmessage = (event) => {
        try {
          const data: T = JSON.parse(event.data);
          handler.onData(data);
          
          // Check for completion
          const anyData = data as any;
          if (anyData.done || anyData.error || anyData.step === 'done' || anyData.step === 'error') {
            handler.onComplete();
            cleanup();
          }
        } catch (error) {
          console.error(`Failed to parse WebSocket data for ${streamId}:`, error);
          handler.onError(new Error('Invalid stream data'));
        }
      };

      websocket.onerror = (event) => {
        console.error(`WebSocket stream error for ${streamId}:`, event);
        setState('error');
        handler.onError(new Error('WebSocket connection error'));
      };

      websocket.onclose = (event) => {
        console.log(`WebSocket stream closed for ${streamId}:`, event.code, event.reason);
        
        if (websocket) {
          websocket = null;
        }
        
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }

        if (isActive && !event.wasClean && retryCount < maxRetries) {
          setState('retrying');
          retryCount++;
          console.log(`Retrying WebSocket connection ${streamId} (${retryCount}/${maxRetries})`);
          
          retryTimeout = setTimeout(() => {
            if (isActive) {
              connect();
            }
          }, retryDelay * Math.pow(2, retryCount - 1));
        } else if (isActive && event.code !== 1000) {
          setState('error');
          handler.onError(new Error(`WebSocket connection closed: ${event.code} ${event.reason}`));
          cleanup();
        } else {
          setState('disconnected');
          cleanup();
        }
      };
    } catch (error) {
      console.error(`Failed to create WebSocket stream ${streamId}:`, error);
      setState('error');
      handler.onError(error as Error);
      cleanup();
    }
  };

  // Register with manager and start connection
  manager.register(streamId, cleanup, 'connecting');
  connect();

  return { id: streamId, cleanup };
}

// Autopilot streaming helper
export function createAutopilotStreamEnhanced(
  taskId: string,
  handler: StreamHandler<AutopilotStreamData>,
  config?: StreamConfig
): { id: string; cleanup: () => void } {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
  const url = `${API_BASE_URL}/autopilot/stream?taskId=${taskId}`;
  
  return createEnhancedSSEStream(url, handler, config);
}

// Generation streaming helper
export function createGenerationStreamEnhanced(
  streamId: string,
  handler: StreamHandler<GenerationStreamData>,
  config?: StreamConfig
): { id: string; cleanup: () => void } {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
  const url = `${API_BASE_URL}/generation/stream?streamId=${streamId}`;
  
  return createEnhancedSSEStream(url, handler, config);
}

// Export the connection manager for external use
export const streamManager = StreamConnectionManager.getInstance();

// Cleanup utility for React components
export const useStreamCleanup = () => {
  return () => {
    streamManager.cleanupAll();
  };
};

// Stream health checker
export const checkStreamHealth = (streamId: string): boolean => {
  return streamManager.isConnected(streamId);
};

// Get all active streams
export const getActiveStreams = (): string[] => {
  return streamManager.getActiveConnections();
};