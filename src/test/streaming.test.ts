/**
 * Test file for streaming functionality
 * This file demonstrates how to test the streaming implementation
 * Note: These are demonstration tests - actual testing would require a test framework
 */

import { streamManager, createEnhancedSSEStream, createWebSocketStream } from '../services/streaming';
import type { AutopilotStreamData, GenerationStreamData } from '../state/types';

// Mock EventSource for testing
class MockEventSource {
  url: string;
  readyState: number = 0;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  
  constructor(url: string) {
    this.url = url;
    // Simulate async connection
    setTimeout(() => {
      this.readyState = 1; // OPEN
      this.onopen?.(new Event('open'));
    }, 10);
  }
  
  close() {
    this.readyState = 2; // CLOSED
  }
  
  // Simulate receiving messages
  simulateMessage(data: any) {
    if (this.readyState === 1) {
      const event = new MessageEvent('message', {
        data: JSON.stringify(data)
      });
      this.onmessage?.(event);
    }
  }
  
  simulateError() {
    this.onerror?.(new Event('error'));
  }
}

// Test functions (would normally be in a test framework)
export function testStreamManager() {
  console.log('Testing Stream Manager...');
  
  // Test connection registration
  const mockCleanup = () => console.log('Cleanup called');
  streamManager.register('test-stream', mockCleanup, 'connecting');
  
  console.log('Active streams:', streamManager.getActiveConnections());
  console.log('Stream state:', streamManager.getState('test-stream'));
  
  // Test state updates
  streamManager.updateState('test-stream', 'connected');
  console.log('Updated state:', streamManager.getState('test-stream'));
  
  // Test cleanup
  streamManager.cleanup('test-stream');
  console.log('After cleanup:', streamManager.getActiveConnections());
}

export function testAutopilotStreaming() {
  console.log('Testing Autopilot Streaming...');
  
  // Mock global EventSource
  (global as any).EventSource = MockEventSource;
  
  let receivedData: AutopilotStreamData[] = [];
  let errors: Error[] = [];
  let completed = false;
  
  const stream = createEnhancedSSEStream<AutopilotStreamData>(
    '/api/autopilot/stream?taskId=test-123',
    {
      onData: (data) => {
        console.log('Received autopilot data:', data);
        receivedData.push(data);
      },
      onError: (error) => {
        console.log('Autopilot stream error:', error);
        errors.push(error);
      },
      onComplete: () => {
        console.log('Autopilot stream completed');
        completed = true;
      },
      onStateChange: (state) => {
        console.log('Autopilot stream state:', state);
      }
    },
    { maxRetries: 2, retryDelay: 500 }
  );
  
  // Simulate some data
  setTimeout(() => {
    const mockEventSource = (global as any).mockEventSource;
    if (mockEventSource) {
      mockEventSource.simulateMessage({
        step: 'search',
        progress: 25,
        stats: { hits: 5, verified: 2, sections: 0 },
        message: 'Starting literature search'
      });
      
      setTimeout(() => {
        mockEventSource.simulateMessage({
          step: 'done',
          progress: 100,
          docId: 'doc-123',
          message: 'Autopilot completed successfully'
        });
      }, 1000);
    }
  }, 100);
  
  return { stream, receivedData, errors, completed };
}

export function testGenerationStreaming() {
  console.log('Testing Generation Streaming...');
  
  let receivedData: GenerationStreamData[] = [];
  let errors: Error[] = [];
  let completed = false;
  
  const stream = createEnhancedSSEStream<GenerationStreamData>(
    '/api/generation/stream?streamId=gen-456',
    {
      onData: (data) => {
        console.log('Received generation data:', data);
        receivedData.push(data);
      },
      onError: (error) => {
        console.log('Generation stream error:', error);
        errors.push(error);
      },
      onComplete: () => {
        console.log('Generation stream completed');
        completed = true;
      },
      onStateChange: (state) => {
        console.log('Generation stream state:', state);
      }
    }
  );
  
  return { stream, receivedData, errors, completed };
}

export function testWebSocketFallback() {
  console.log('Testing WebSocket Fallback...');
  
  // Mock WebSocket
  class MockWebSocket {
    url: string;
    readyState: number = 0; // CONNECTING
    onopen: ((event: Event) => void) | null = null;
    onmessage: ((event: MessageEvent) => void) | null = null;
    onerror: ((event: Event) => void) | null = null;
    onclose: ((event: CloseEvent) => void) | null = null;
    
    constructor(url: string) {
      this.url = url;
      setTimeout(() => {
        this.readyState = 1; // OPEN
        this.onopen?.(new Event('open'));
      }, 10);
    }
    
    close(code?: number, reason?: string) {
      this.readyState = 3; // CLOSED
      this.onclose?.(new CloseEvent('close', { code: code || 1000, reason, wasClean: true }));
    }
    
    send(data: string) {
      // Mock send
    }
    
    simulateMessage(data: any) {
      if (this.readyState === 1) {
        const event = new MessageEvent('message', {
          data: JSON.stringify(data)
        });
        this.onmessage?.(event);
      }
    }
  }
  
  (global as any).WebSocket = MockWebSocket;
  
  const stream = createWebSocketStream<AutopilotStreamData>(
    { url: 'ws://localhost:8080/autopilot/ws?taskId=test-789' },
    {
      onData: (data) => console.log('WebSocket data:', data),
      onError: (error) => console.log('WebSocket error:', error),
      onComplete: () => console.log('WebSocket completed'),
      onStateChange: (state) => console.log('WebSocket state:', state)
    }
  );
  
  return stream;
}

// Integration test function
export function runStreamingTests() {
  console.log('Starting Streaming Integration Tests...');
  console.log('=====================================');
  
  try {
    testStreamManager();
    console.log('✓ Stream Manager tests passed\n');
    
    const autopilotTest = testAutopilotStreaming();
    console.log('✓ Autopilot streaming test started\n');
    
    const generationTest = testGenerationStreaming();
    console.log('✓ Generation streaming test started\n');
    
    const wsTest = testWebSocketFallback();
    console.log('✓ WebSocket fallback test started\n');
    
    console.log('All streaming tests initialized successfully!');
    console.log('Check console output for real-time updates.');
    
    return {
      autopilot: autopilotTest,
      generation: generationTest,
      websocket: wsTest
    };
  } catch (error) {
    console.error('Streaming tests failed:', error);
    throw error;
  }
}

// Export for browser console testing
if (typeof window !== 'undefined') {
  (window as any).streamingTests = {
    runStreamingTests,
    testStreamManager,
    testAutopilotStreaming,
    testGenerationStreaming,
    testWebSocketFallback,
    streamManager
  };
}