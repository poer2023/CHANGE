import React, { useEffect } from 'react';
import { useAutopilot, useResult, usePayment, useApp } from '@/state/AppContext';
import { useAutopilotStream, useGenerationStream, useStreamManager } from '@/hooks/useStreaming';
import AutopilotBanner from '@/components/AutopilotBanner';
import ArticleCard from '@/components/Result/ArticleCard';
import StreamingDemo from '@/components/StreamingDemo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Wifi, WifiOff } from 'lucide-react';

/**
 * Example page demonstrating full streaming integration
 * This page shows how all the streaming components work together
 * in a real application scenario.
 */
const StreamingExamplePage: React.FC = () => {
  const { track } = useApp();
  const { autopilot } = useAutopilot();
  const { result } = useResult();
  const { pay } = usePayment();
  const { getActiveStreams, isStreamActive } = useStreamManager();

  // Autopilot streaming integration
  const { isStreaming: autopilotStreaming, streamId: autopilotStreamId } = useAutopilotStream(
    autopilot.taskId,
    {
      enabled: true,
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 30000
    }
  );

  // Generation streaming integration
  const { isStreaming: generationStreaming, streamId: generationStreamId } = useGenerationStream(
    result.streamId,
    {
      enabled: result.generation === 'streaming',
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 30000
    }
  );

  // Track streaming events
  useEffect(() => {
    if (autopilotStreaming) {
      track('autopilot_streaming_started', { streamId: autopilotStreamId });
    }
  }, [autopilotStreaming, autopilotStreamId, track]);

  useEffect(() => {
    if (generationStreaming) {
      track('generation_streaming_started', { streamId: generationStreamId });
    }
  }, [generationStreaming, generationStreamId, track]);

  const activeStreams = getActiveStreams();
  const hasActiveConnections = activeStreams.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Autopilot Banner - automatically integrates with streaming */}
      <AutopilotBanner
        state={autopilot}
        onMinimize={(minimize) => {
          // This would normally be handled by a parent component
          console.log('Minimize autopilot:', minimize);
        }}
        onPause={async () => {
          console.log('Pause autopilot');
        }}
        onResume={async () => {
          console.log('Resume autopilot');
        }}
        onStop={async () => {
          console.log('Stop autopilot');
        }}
      />

      <div className={`transition-all duration-300 ${autopilot.running && !autopilot.minimized ? 'pt-20' : autopilot.running ? 'pt-12' : 'pt-0'}`}>
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          
          {/* Streaming Status Dashboard */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Streaming Status Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Connection Status */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    {hasActiveConnections ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-gray-400" />
                    )}
                    Connection Status
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active Streams:</span>
                      <Badge variant={hasActiveConnections ? "default" : "secondary"}>
                        {activeStreams.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Autopilot Stream:</span>
                      <Badge variant={autopilotStreaming ? "default" : "secondary"}>
                        {autopilotStreaming ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Generation Stream:</span>
                      <Badge variant={generationStreaming ? "default" : "secondary"}>
                        {generationStreaming ? 'Connected' : 'Disconnected'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Autopilot Status */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Autopilot Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Running:</span>
                      <Badge variant={autopilot.running ? "default" : "secondary"}>
                        {autopilot.running ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Step:</span>
                      <Badge variant="outline">{autopilot.step}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Progress:</span>
                      <span className="text-sm font-medium">{Math.round(autopilot.progress)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Task ID:</span>
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {autopilot.taskId ? `${autopilot.taskId.slice(0, 8)}...` : 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Generation Status */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Generation Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">State:</span>
                      <Badge variant="outline">{result.generation}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Document ID:</span>
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {result.docId ? `${result.docId.slice(0, 8)}...` : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Stream ID:</span>
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {result.streamId ? `${result.streamId.slice(0, 8)}...` : 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Preview Mode:</span>
                      <Badge variant={pay.previewMode ? "secondary" : "default"}>
                        {pay.previewMode ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Stream Details */}
              {activeStreams.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium text-gray-900 mb-3">Active Stream Details</h4>
                  <div className="space-y-2">
                    {activeStreams.map((streamId) => (
                      <div key={streamId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="text-sm font-mono">{streamId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {isStreamActive(streamId) ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              console.log(`Manual cleanup for stream: ${streamId}`);
                              // In a real app, you might want more granular control
                            }}
                          >
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interactive Demo */}
          <StreamingDemo />

          {/* Article Card with Generation Streaming */}
          {result.docId && (
            <div className="flex justify-center">
              <ArticleCard 
                docId={result.docId} 
                disabled={pay.previewMode} 
              />
            </div>
          )}

          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Instructions</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p>This page demonstrates the full streaming integration:</p>
              <ol>
                <li><strong>Start Autopilot:</strong> Click "Start Autopilot Demo" to begin the autopilot process with real-time streaming updates.</li>
                <li><strong>Monitor Progress:</strong> Watch the AutopilotBanner update in real-time as the process progresses through search, strategy, and outline phases.</li>
                <li><strong>View Streaming Status:</strong> The dashboard above shows all active connections and their states.</li>
                <li><strong>Document Generation:</strong> Once autopilot completes, you can start document generation to see real-time content streaming.</li>
                <li><strong>Connection Management:</strong> All connections are automatically managed with retry logic and cleanup.</li>
              </ol>
              
              <h4>Key Features Demonstrated:</h4>
              <ul>
                <li>Automatic reconnection with exponential backoff</li>
                <li>Real-time progress updates</li>
                <li>Connection state management</li>
                <li>Error handling and recovery</li>
                <li>Memory leak prevention through automatic cleanup</li>
                <li>Integration with existing UI components</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StreamingExamplePage;