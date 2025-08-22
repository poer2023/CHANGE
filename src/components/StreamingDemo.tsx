import React from 'react';
import { useAutopilot } from '@/state/AppContext';
import { useAutopilotStream } from '@/hooks/useStreaming';
import AutopilotBanner from './AutopilotBanner';

/**
 * Demo component showing how to integrate AutopilotBanner with streaming
 * This component demonstrates the proper usage of the streaming hooks
 * with the existing UI components.
 */
const StreamingDemo: React.FC = () => {
  const {
    autopilot,
    startAutopilot,
    minimizeAutopilot,
    pauseAutopilot,
    resumeAutopilot,
    stopAutopilot
  } = useAutopilot();

  // The streaming hook automatically handles the connection based on autopilot state
  const { isStreaming, streamId } = useAutopilotStream(
    autopilot.taskId,
    {
      enabled: true, // Enable streaming
      maxRetries: 3,  // Retry failed connections up to 3 times
      retryDelay: 1000, // Wait 1 second between retries
      timeout: 30000    // 30 second connection timeout
    }
  );

  const handleStartAutopilot = async () => {
    try {
      await startAutopilot({
        verifyLevel: 'Standard',
        allowPreprint: true,
        useStyle: true
      });
    } catch (error) {
      console.error('Failed to start autopilot:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Streaming Integration Demo
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Autopilot State</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Running: {autopilot.running ? 'Yes' : 'No'}</div>
                <div>Step: {autopilot.step}</div>
                <div>Progress: {Math.round(autopilot.progress)}%</div>
                <div>Task ID: {autopilot.taskId || 'None'}</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Streaming State</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Active: {isStreaming ? 'Yes' : 'No'}</div>
                <div>Stream ID: {streamId || 'None'}</div>
                <div>Hits: {autopilot.stats.hits}</div>
                <div>Verified: {autopilot.stats.verified}</div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <button
              onClick={handleStartAutopilot}
              disabled={autopilot.running}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              {autopilot.running ? 'Autopilot Running...' : 'Start Autopilot Demo'}
            </button>
          </div>
        </div>
      </div>

      {/* The AutopilotBanner component automatically integrates with streaming */}
      <AutopilotBanner
        state={autopilot}
        onMinimize={(minimize) => minimizeAutopilot(minimize)}
        onPause={pauseAutopilot}
        onResume={resumeAutopilot}
        onStop={stopAutopilot}
      />
      
      {/* Logs display */}
      {autopilot.logs.length > 0 && (
        <div className="p-4 bg-white border rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Autopilot Logs</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {autopilot.logs.map((log, index) => (
              <div
                key={index}
                className={`text-sm p-2 rounded ${
                  log.level === 'error'
                    ? 'bg-red-50 text-red-700'
                    : log.level === 'warn'
                    ? 'bg-yellow-50 text-yellow-700'
                    : 'bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span>{log.msg}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(log.ts).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamingDemo;