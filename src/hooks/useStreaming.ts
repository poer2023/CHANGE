import { useEffect, useRef, useCallback } from 'react';
import { useAutopilot, useResult } from '@/state/AppContext';
import { 
  createAutopilotStreamEnhanced, 
  createGenerationStreamEnhanced,
  streamManager,
  type StreamConfig
} from '@/services/streaming';
import type { AutopilotStreamData, GenerationStreamData, AutopilotLog } from '@/state/types';

// Hook for autopilot streaming
export function useAutopilotStream(
  taskId?: string,
  config?: StreamConfig & { enabled?: boolean }
) {
  const { autopilot, updateProgress, completeAutopilot, errorAutopilot } = useAutopilot();
  const streamRef = useRef<{ id: string; cleanup: () => void } | null>(null);
  const { enabled = true, ...streamConfig } = config || {};

  const startStreaming = useCallback((id: string) => {
    if (!enabled || streamRef.current || !id) return;

    console.log('Starting autopilot stream for taskId:', id);

    const stream = createAutopilotStreamEnhanced(
      id,
      {
        onData: (data: AutopilotStreamData) => {
          console.log('Autopilot stream data:', data);
          
          // Create log entry for significant events
          const logs: AutopilotLog[] = [];
          if (data.message) {
            logs.push({
              ts: Date.now(),
              msg: data.message,
              level: data.step === 'error' ? 'error' : 'info'
            });
          }

          // Update progress with new data
          updateProgress({
            step: data.step,
            progress: data.progress,
            stats: data.stats || autopilot.stats,
            logs: logs.length > 0 ? logs : undefined
          });

          // Handle completion
          if (data.step === 'done') {
            completeAutopilot(data.docId);
          } else if (data.step === 'error') {
            errorAutopilot(data.message || 'Unknown error occurred');
          }
        },
        onError: (error: Error) => {
          console.error('Autopilot stream error:', error);
          errorAutopilot(error.message);
          streamRef.current = null;
        },
        onComplete: () => {
          console.log('Autopilot stream completed');
          streamRef.current = null;
        },
        onStateChange: (state) => {
          console.log('Autopilot stream state:', state);
          // Could update UI to show connection status
        }
      },
      streamConfig
    );

    streamRef.current = stream;
  }, [enabled, updateProgress, completeAutopilot, errorAutopilot, autopilot.stats, streamConfig]);

  const stopStreaming = useCallback(() => {
    if (streamRef.current) {
      console.log('Stopping autopilot stream');
      streamRef.current.cleanup();
      streamRef.current = null;
    }
  }, []);

  // Auto-start streaming when taskId is available and autopilot is running
  useEffect(() => {
    if (taskId && autopilot.running && autopilot.step !== 'idle' && autopilot.step !== 'done' && autopilot.step !== 'error') {
      startStreaming(taskId);
    } else if (!autopilot.running || autopilot.step === 'done' || autopilot.step === 'error') {
      stopStreaming();
    }

    return () => {
      stopStreaming();
    };
  }, [taskId, autopilot.running, autopilot.step, startStreaming, stopStreaming]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, [stopStreaming]);

  return {
    isStreaming: streamRef.current !== null,
    streamId: streamRef.current?.id,
    startStreaming,
    stopStreaming
  };
}

// Hook for generation streaming
export function useGenerationStream(
  streamId?: string,
  config?: StreamConfig & { enabled?: boolean }
) {
  const { result, setGenerationState } = useResult();
  const streamRef = useRef<{ id: string; cleanup: () => void } | null>(null);
  const contentRef = useRef<Map<string, string>>(new Map()); // Track content blocks
  const { enabled = true, ...streamConfig } = config || {};

  const startStreaming = useCallback((id: string) => {
    if (!enabled || streamRef.current || !id) return;

    console.log('Starting generation stream for streamId:', id);
    setGenerationState('streaming');
    contentRef.current.clear();

    const stream = createGenerationStreamEnhanced(
      id,
      {
        onData: (data: GenerationStreamData) => {
          console.log('Generation stream data:', data);
          
          // Update content blocks
          if (data.blockId && data.delta) {
            const currentContent = contentRef.current.get(data.blockId) || '';
            contentRef.current.set(data.blockId, currentContent + data.delta);
            
            // Could emit content update event here for real-time display
            window.dispatchEvent(new CustomEvent('generation-content-update', {
              detail: {
                blockId: data.blockId,
                content: contentRef.current.get(data.blockId),
                cites: data.cites
              }
            }));
          }

          // Handle completion or error
          if (data.done) {
            setGenerationState('ready');
          } else if (data.error) {
            setGenerationState('error');
            console.error('Generation error:', data.error);
          }
        },
        onError: (error: Error) => {
          console.error('Generation stream error:', error);
          setGenerationState('error');
          streamRef.current = null;
        },
        onComplete: () => {
          console.log('Generation stream completed');
          if (result.generation === 'streaming') {
            setGenerationState('ready');
          }
          streamRef.current = null;
        },
        onStateChange: (state) => {
          console.log('Generation stream state:', state);
          // Could update UI to show connection status
        }
      },
      streamConfig
    );

    streamRef.current = stream;
  }, [enabled, setGenerationState, result.generation, streamConfig]);

  const stopStreaming = useCallback(() => {
    if (streamRef.current) {
      console.log('Stopping generation stream');
      streamRef.current.cleanup();
      streamRef.current = null;
    }
  }, []);

  // Auto-start streaming when streamId is available and generation is active
  useEffect(() => {
    if (streamId && (result.generation === 'starting' || result.generation === 'streaming')) {
      startStreaming(streamId);
    } else if (result.generation === 'ready' || result.generation === 'error' || result.generation === 'idle') {
      stopStreaming();
    }

    return () => {
      stopStreaming();
    };
  }, [streamId, result.generation, startStreaming, stopStreaming]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, [stopStreaming]);

  const getContent = useCallback((blockId: string): string => {
    return contentRef.current.get(blockId) || '';
  }, []);

  const getAllContent = useCallback((): Map<string, string> => {
    return new Map(contentRef.current);
  }, []);

  return {
    isStreaming: streamRef.current !== null,
    streamId: streamRef.current?.id,
    startStreaming,
    stopStreaming,
    getContent,
    getAllContent
  };
}

// Hook for managing all streams in a component
export function useStreamManager() {
  const cleanup = useCallback(() => {
    streamManager.cleanupAll();
  }, []);

  const getActiveStreams = useCallback(() => {
    return streamManager.getActiveConnections();
  }, []);

  const isStreamActive = useCallback((streamId: string) => {
    return streamManager.isConnected(streamId);
  }, []);

  // Cleanup all streams on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    cleanup,
    getActiveStreams,
    isStreamActive
  };
}

// Utility hook for listening to generation content updates
export function useGenerationContentListener(
  onContentUpdate: (data: { blockId: string; content: string; cites?: Array<{ key: string; source: string }> }) => void
) {
  useEffect(() => {
    const handleContentUpdate = (event: CustomEvent) => {
      onContentUpdate(event.detail);
    };

    window.addEventListener('generation-content-update', handleContentUpdate as EventListener);
    
    return () => {
      window.removeEventListener('generation-content-update', handleContentUpdate as EventListener);
    };
  }, [onContentUpdate]);
}

export default {
  useAutopilotStream,
  useGenerationStream,
  useStreamManager,
  useGenerationContentListener
};