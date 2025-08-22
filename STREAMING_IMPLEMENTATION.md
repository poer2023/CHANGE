# SSE/WebSocket Streaming Implementation

This document provides a comprehensive overview of the real-time streaming implementation for the writing flow application.

## Overview

The streaming implementation provides robust, production-ready SSE (Server-Sent Events) and WebSocket streaming capabilities with:

- **Automatic reconnection** with exponential backoff
- **Connection pooling and management**
- **Heartbeat monitoring**
- **Error handling and recovery**
- **State management integration**
- **WebSocket fallback support**

## Architecture

### Core Components

1. **Enhanced API Service** (`/src/services/api.ts`)
   - Improved existing streaming functions with retry logic
   - Better error handling and connection management

2. **Streaming Service** (`/src/services/streaming.ts`)
   - Centralized connection management
   - SSE and WebSocket implementations
   - Connection pooling and cleanup utilities

3. **Streaming Hooks** (`/src/hooks/useStreaming.ts`)
   - React hooks for easy integration
   - Automatic state management
   - Component lifecycle integration

4. **State Management Integration** (`/src/state/AppContext.tsx`)
   - Updated AppContext with streaming support
   - API integration for starting streams
   - Automatic cleanup

## Usage Guide

### 1. Autopilot Progress Streaming

The autopilot streaming automatically integrates with the existing `AutopilotBanner` component:

```typescript
import { useAutopilot } from '@/state/AppContext';
import { useAutopilotStream } from '@/hooks/useStreaming';
import AutopilotBanner from './AutopilotBanner';

const MyComponent = () => {
  const { autopilot, startAutopilot, /* other actions */ } = useAutopilot();
  
  // Streaming hook automatically manages connection based on autopilot state
  useAutopilotStream(autopilot.taskId, {
    enabled: true,
    maxRetries: 3,
    retryDelay: 1000,
    timeout: 30000
  });
  
  const handleStart = async () => {
    try {
      await startAutopilot({
        verifyLevel: 'Standard',
        allowPreprint: true,
        useStyle: true
      });
      // Streaming will start automatically when taskId is available
    } catch (error) {
      console.error('Failed to start autopilot:', error);
    }
  };
  
  return (
    <div>
      <button onClick={handleStart}>Start Autopilot</button>
      <AutopilotBanner
        state={autopilot}
        onMinimize={(minimize) => /* handle minimize */}
        onPause={() => /* handle pause */}
        onResume={() => /* handle resume */}
        onStop={() => /* handle stop */}
      />
    </div>
  );
};
```

### 2. Document Generation Streaming

The generation streaming integrates with the `ArticleCard` component for real-time content updates:

```typescript
import { useResult } from '@/state/AppContext';
import { useGenerationStream } from '@/hooks/useStreaming';
import ArticleCard from './Result/ArticleCard';

const ResultPage = () => {
  const { result, startDocumentGeneration } = useResult();
  
  // Streaming automatically manages based on generation state
  useGenerationStream(result.streamId, {
    enabled: !disabled && result.generation === 'streaming'
  });
  
  const handleStartGeneration = async () => {
    try {
      await startDocumentGeneration(docId);
      // ArticleCard will automatically show streaming progress
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };
  
  return (
    <ArticleCard 
      docId={docId} 
      disabled={previewMode} 
    />
  );
};
```

### 3. Advanced Usage

For more control over streaming, you can use the lower-level services directly:

```typescript
import { createEnhancedSSEStream, streamManager } from '@/services/streaming';

// Custom streaming implementation
const customStream = createEnhancedSSEStream(
  '/api/custom-endpoint',
  {
    onData: (data) => {
      console.log('Received:', data);
    },
    onError: (error) => {
      console.error('Stream error:', error);
    },
    onComplete: () => {
      console.log('Stream completed');
    },
    onStateChange: (state) => {
      console.log('Connection state:', state);
    }
  },
  {
    maxRetries: 5,
    retryDelay: 2000,
    timeout: 60000,
    heartbeatInterval: 30000
  }
);

// Manual cleanup
streamManager.cleanup(customStream.id);
```

## Configuration Options

### StreamConfig Interface

```typescript
interface StreamConfig {
  maxRetries?: number;        // Default: 3
  retryDelay?: number;        // Default: 1000ms
  timeout?: number;           // Default: 30000ms
  heartbeatInterval?: number; // Default: 25000ms
}
```

### Connection States

- `connecting` - Initial connection attempt
- `connected` - Successfully connected
- `disconnected` - Clean disconnection
- `error` - Connection failed
- `retrying` - Attempting to reconnect

## API Endpoints

### Autopilot Streaming

**Endpoint:** `GET /api/autopilot/stream?taskId={taskId}`

**Response Format:**
```typescript
interface AutopilotStreamData {
  step: 'search' | 'strategy' | 'outline' | 'done' | 'error';
  progress: number; // 0-100
  stats?: {
    hits: number;
    verified: number;
    sections: number;
  };
  docId?: string;
  message?: string;
}
```

### Generation Streaming

**Endpoint:** `GET /api/generation/stream?streamId={streamId}`

**Response Format:**
```typescript
interface GenerationStreamData {
  blockId: string;
  delta: string;
  cites?: Array<{ key: string; source: string }>;
  done?: boolean;
  error?: string;
}
```

## Error Handling

The implementation provides comprehensive error handling:

1. **Network Errors** - Automatic retry with exponential backoff
2. **Parse Errors** - Graceful handling of malformed data
3. **Timeout Errors** - Connection timeout with retry
4. **Heartbeat Failures** - Automatic reconnection on lost heartbeat

## Performance Considerations

### Memory Management

- Automatic cleanup of inactive connections
- Connection pooling to prevent memory leaks
- Efficient event listener management

### Network Optimization

- Exponential backoff to prevent server overload
- Heartbeat monitoring for connection health
- Proper connection lifecycle management

## Testing

The implementation includes comprehensive test utilities:

```typescript
import { runStreamingTests } from '@/test/streaming.test';

// Run all streaming tests
const testResults = runStreamingTests();

// Test individual components
import { testStreamManager, testAutopilotStreaming } from '@/test/streaming.test';
testStreamManager();
testAutopilotStreaming();
```

## Browser Compatibility

- **SSE Support:** All modern browsers
- **WebSocket Fallback:** Available for older browsers or restrictive networks
- **Graceful Degradation:** Automatic fallback to polling if streaming fails

## Security Considerations

1. **Authentication** - Streams inherit authentication from HTTP requests
2. **Rate Limiting** - Built-in retry limits prevent abuse
3. **Connection Limits** - Connection manager prevents resource exhaustion

## Deployment Notes

### Server Requirements

1. **SSE Support** - Server must support persistent HTTP connections
2. **CORS Configuration** - Proper headers for cross-origin requests
3. **Load Balancer** - Sticky sessions for WebSocket connections

### Environment Variables

```bash
VITE_API_BASE_URL=https://api.example.com  # API base URL for streaming endpoints
```

## Troubleshooting

### Common Issues

1. **Connection Timeouts**
   - Increase timeout configuration
   - Check network connectivity
   - Verify server endpoint availability

2. **Frequent Reconnections**
   - Check server stability
   - Verify heartbeat configuration
   - Monitor network quality

3. **Memory Leaks**
   - Ensure proper cleanup on component unmount
   - Use `streamManager.cleanupAll()` on page navigation
   - Monitor connection count in development

### Debug Tools

```typescript
// Check active connections
console.log('Active streams:', streamManager.getActiveConnections());

// Monitor connection states
streamManager.getState('stream-id');

// Enable debug logging
localStorage.setItem('debug', 'streaming:*');
```

## Migration from Legacy Implementation

If migrating from the basic streaming implementation:

1. Replace `createAutopilotStream` calls with `useAutopilotStream` hook
2. Replace `createGenerationStream` calls with `useGenerationStream` hook
3. Update error handling to use the new error patterns
4. Add proper cleanup in component unmount effects

## Contributing

When extending the streaming implementation:

1. Follow the existing patterns for error handling
2. Add appropriate TypeScript types
3. Include test coverage for new features
4. Update this documentation
5. Consider backward compatibility

## Support

For issues or questions about the streaming implementation:

1. Check the browser console for error messages
2. Verify network connectivity and server endpoints
3. Review the test utilities for examples
4. Check the streaming service logs for connection details