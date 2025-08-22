import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import type { AppState, Action, AnalyticsEvent } from './types';
import { appReducer, createInitialState, persistState, loadPersistedState } from './reducer';
import { startAutopilot as apiStartAutopilot, pauseAutopilot, resumeAutopilot, stopAutopilot as apiStopAutopilot, startGeneration } from '@/services/api';
import { streamManager } from '@/services/streaming';
import { TrackingBatch, createTrackingEvent, TrackingUtils, type TrackingCategory, type TrackingSchema } from '@/utils/tracking';

// Context interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  
  // Analytics - Enhanced tracking functions
  track: (event: string, properties?: Record<string, any>) => void;
  trackTyped: <T extends keyof TrackingSchema>(
    event: T, 
    properties: TrackingSchema[T], 
    category: TrackingCategory,
    subcategory?: string
  ) => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, createInitialState());

  // Load persisted state on mount
  useEffect(() => {
    const persistedState = loadPersistedState();
    if (Object.keys(persistedState).length > 0) {
      dispatch({ type: 'LOAD_PERSISTED_STATE', payload: persistedState });
    }
  }, []);

  // Auto-persist state changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      persistState(state);
    }, 500); // Debounce persistence

    return () => clearTimeout(timeoutId);
  }, [state]);

  // Enhanced Analytics tracking functions
  const track = (event: string, properties?: Record<string, any>) => {
    try {
      const analyticsEvent: AnalyticsEvent = {
        event,
        properties: TrackingUtils.enrichWithSession(properties || {}),
        timestamp: Date.now()
      };

      // Use the new tracking system for legacy events
      const trackingEvent = createTrackingEvent('feature_usage' as any, {
        feature: event,
        usageCount: 1,
        lastUsed: Date.now(),
        proficiency: 'intermediate'
      }, 'user_action');
      
      TrackingBatch.addEvent(trackingEvent);

      // Log to console in development
      if (import.meta.env.DEV) {
        console.log('📊 Legacy Analytics Event:', analyticsEvent);
      }
      
    } catch (error) {
      console.warn('Failed to track analytics event:', error);
    }
  };

  // Type-safe tracking function
  const trackTyped = <T extends keyof TrackingSchema>(
    event: T, 
    properties: TrackingSchema[T], 
    category: TrackingCategory,
    subcategory?: string
  ) => {
    try {
      const enrichedProperties = TrackingUtils.enrichWithSession(properties as any);
      const trackingEvent = createTrackingEvent(event, enrichedProperties, category, subcategory);
      TrackingBatch.addEvent(trackingEvent);
    } catch (error) {
      console.warn('Failed to track typed event:', error);
    }
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    track,
    trackTyped
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Convenience hooks for specific state slices
export const useStep1 = () => {
  const { state, dispatch, track, trackTyped } = useApp();
  
  const updateStep1 = (updates: Partial<AppState['step1']>) => {
    dispatch({ type: 'STEP1_UPDATE', payload: updates });
    
    // Track field changes with enhanced tracking
    Object.keys(updates).forEach(field => {
      const value = updates[field as keyof typeof updates];
      
      trackTyped('form_field_change', {
        step: 'topic',
        field,
        value,
        inputMethod: 'typing'
      }, 'writing_flow', 'form_interaction');
    });
  };

  return {
    step1: state.step1,
    updateStep1
  };
};

export const useEstimate = () => {
  const { state, dispatch, track, trackTyped } = useApp();
  
  const setEstimate = (estimate: AppState['estimate']) => {
    dispatch({ type: 'ESTIMATE_SET', payload: estimate });
    
    trackTyped('estimate_received', {
      priceRange: estimate.priceRange,
      citesRange: estimate.citesRange,
      etaMinutes: estimate.etaMinutes,
      verifyLevel: estimate.verifyLevel,
      assumptions: estimate.assumptions,
      requestId: 'unknown', // Should be passed from API
      responseTime: 0 // Should be measured
    }, 'payment', 'estimate');
  };

  return {
    estimate: state.estimate,
    setEstimate
  };
};

export const useAutopilot = () => {
  const { state, dispatch, track, trackTyped } = useApp();
  
  const startAutopilot = async (config: { verifyLevel: AppState['estimate']['verifyLevel']; allowPreprint: boolean; useStyle: boolean }) => {
    try {
      // Start autopilot via API
      const response = await apiStartAutopilot(state.step1, config);
      
      // Update local state with taskId
      dispatch({ 
        type: 'AUTOPILOT_START', 
        payload: { ...config, taskId: response.taskId }
      });
      
      trackTyped('autopilot_start', {
        verifyLevel: config.verifyLevel,
        allowPreprint: config.allowPreprint,
        useStyle: config.useStyle,
        taskId: response.taskId,
        estimatedPrice: state.estimate.priceRange[1] // Use max price as estimate
      }, 'writing_flow', 'autopilot');
      
      return response.taskId;
    } catch (error) {
      console.error('Failed to start autopilot:', error);
      trackTyped('autopilot_error', {
        step: 'start',
        error: error instanceof Error ? error.message : 'Failed to start autopilot',
        progress: 0,
        timeElapsed: 0
      }, 'error', 'autopilot');
      errorAutopilot(error instanceof Error ? error.message : 'Failed to start autopilot');
      throw error;
    }
  };

  const updateProgress = (updates: Partial<AppState['autopilot']>) => {
    dispatch({ type: 'AUTOPILOT_PROGRESS', payload: updates });
    if (updates.progress !== undefined) {
      trackTyped('autopilot_progress', {
        step: updates.step || state.autopilot.step,
        progress: updates.progress,
        stats: updates.stats || state.autopilot.stats,
        timeElapsed: Date.now() - (state.autopilot.logs[0]?.ts || Date.now())
      }, 'writing_flow', 'autopilot');
    }
  };

  const completeAutopilot = (docId?: string) => {
    dispatch({ type: 'AUTOPILOT_DONE', payload: docId ? { docId } : undefined });
    
    if (docId) {
      trackTyped('autopilot_complete', {
        docId,
        totalTime: Date.now() - (state.autopilot.logs[0]?.ts || Date.now()),
        finalStats: state.autopilot.stats
      }, 'writing_flow', 'autopilot');
    }
  };

  const errorAutopilot = (error: string) => {
    dispatch({ type: 'AUTOPILOT_ERROR', payload: error });
    
    trackTyped('autopilot_error', {
      step: state.autopilot.step,
      error,
      progress: state.autopilot.progress,
      timeElapsed: Date.now() - (state.autopilot.logs[0]?.ts || Date.now())
    }, 'error', 'autopilot');
  };

  const minimizeAutopilot = (minimized: boolean) => {
    dispatch({ type: 'AUTOPILOT_MINIMIZE', payload: minimized });
    
    trackTyped('autopilot_minimize', {
      minimized,
      step: state.autopilot.step
    }, 'user_action', 'autopilot_ui');
  };

  const pauseAutopilotAction = async () => {
    if (state.autopilot.taskId) {
      try {
        await pauseAutopilot(state.autopilot.taskId);
        dispatch({ type: 'AUTOPILOT_PAUSE' });
        
        trackTyped('autopilot_pause', {
          step: state.autopilot.step,
          progress: state.autopilot.progress,
          reason: 'user'
        }, 'user_action', 'autopilot');
      } catch (error) {
        console.error('Failed to pause autopilot:', error);
        errorAutopilot('Failed to pause autopilot');
      }
    }
  };

  const resumeAutopilotAction = async () => {
    if (state.autopilot.taskId) {
      try {
        await resumeAutopilot(state.autopilot.taskId);
        dispatch({ type: 'AUTOPILOT_RESUME' });
        
        trackTyped('autopilot_resume', {
          step: state.autopilot.step,
          progress: state.autopilot.progress,
          pauseDuration: 0 // TODO: Calculate actual pause duration
        }, 'user_action', 'autopilot');
      } catch (error) {
        console.error('Failed to resume autopilot:', error);
        errorAutopilot('Failed to resume autopilot');
      }
    }
  };

  const stopAutopilot = async () => {
    const totalTime = Date.now() - (state.autopilot.logs[0]?.ts || Date.now());
    
    if (state.autopilot.taskId) {
      try {
        await apiStopAutopilot(state.autopilot.taskId);
      } catch (error) {
        console.error('Failed to stop autopilot:', error);
        // Continue with local state update even if API call fails
      }
    }
    
    // Clean up any active streams
    streamManager.cleanupAll();
    
    dispatch({ type: 'AUTOPILOT_STOP' });
    
    trackTyped('autopilot_stop', {
      step: state.autopilot.step,
      progress: state.autopilot.progress,
      reason: 'user',
      totalTime
    }, 'user_action', 'autopilot');
  };

  return {
    autopilot: state.autopilot,
    startAutopilot,
    updateProgress,
    completeAutopilot,
    errorAutopilot,
    minimizeAutopilot,
    pauseAutopilot: pauseAutopilotAction,
    resumeAutopilot: resumeAutopilotAction,
    stopAutopilot
  };
};

export const usePayment = () => {
  const { state, dispatch, track, trackTyped } = useApp();

  const lockPrice = (value: number, expiresAt: number) => {
    dispatch({ type: 'LOCK_PRICE_SET', payload: { value, expiresAt } });
    
    trackTyped('price_lock', {
      value,
      currency: 'CNY',
      expiresAt,
      context: 'gate1'
    }, 'payment', 'price_lock');
  };

  const setGate1Ready = (ready: boolean) => {
    dispatch({ type: 'PAY_GATE1_READY', payload: ready });
    
    if (ready) {
      trackTyped('gate1_triggered', {
        docId: state.result.docId || 'unknown',
        price: state.pay.lockedPrice?.value || 0,
        expiresAt: state.pay.lockedPrice?.expiresAt || 0,
        benefits: ['full_access', 'generation', 'export'] // Default benefits
      }, 'payment', 'gate1');
    }
  };

  const setPreviewMode = (preview: boolean) => {
    dispatch({ type: 'PREVIEW_MODE_SET', payload: preview });
    
    if (preview) {
      trackTyped('gate1_preview_only', {
        docId: state.result.docId || 'unknown',
        price: state.pay.lockedPrice?.value || 0,
        reason: 'user_choice'
      }, 'payment', 'gate1');
    }
  };

  return {
    pay: state.pay,
    lockPrice,
    setGate1Ready,
    setPreviewMode
  };
};

export const useResult = () => {
  const { state, dispatch, track, trackTyped } = useApp();

  const setDocId = (docId: string) => {
    dispatch({ type: 'RESULT_SET_ID', payload: { docId } });
    
    trackTyped('feature_usage', {
      feature: 'result_doc_set',
      usageCount: 1,
      lastUsed: Date.now(),
      proficiency: 'intermediate'
    }, 'document', 'result');
  };

  const setGenerationState = (generation: AppState['result']['generation']) => {
    dispatch({ type: 'GENERATION_STATE', payload: generation });
    
    // Track state changes except for idle
    if (generation !== 'idle') {
      trackTyped('feature_usage', {
        feature: `generation_state_${generation}`,
        usageCount: 1,
        lastUsed: Date.now(),
        proficiency: 'intermediate'
      }, 'document', 'generation');
    }
  };

  const startDocumentGeneration = async (docId?: string) => {
    const targetDocId = docId || state.result.docId;
    if (!targetDocId) {
      throw new Error('No document ID available for generation');
    }

    try {
      setGenerationState('starting');
      const startTime = Date.now();
      const response = await startGeneration(targetDocId);
      
      // Update state with streamId
      dispatch({ 
        type: 'GENERATION_START', 
        payload: { streamId: response.streamId }
      });
      
      trackTyped('generation_start', {
        docId: targetDocId,
        streamId: response.streamId,
        trigger: 'manual',
        generationType: 'full'
      }, 'document', 'generation');
      
      return response.streamId;
    } catch (error) {
      console.error('Failed to start generation:', error);
      
      trackTyped('generation_error', {
        docId: targetDocId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stage: 'start',
        retryable: true
      }, 'error', 'generation');
      
      setGenerationState('error');
      throw error;
    }
  };

  return {
    result: state.result,
    setDocId,
    setGenerationState,
    startDocumentGeneration
  };
};

export const useWritingFlow = () => {
  const { state, dispatch, track, trackTyped } = useApp();
  
  const setCurrentStep = (step: AppState['writingFlow']['currentStep']) => {
    dispatch({ type: 'WRITING_FLOW_SET_STEP', payload: step });
    
    trackTyped('step_enter', {
      step,
      previousStep: state.writingFlow.currentStep,
      timeSpent: 0 // TODO: Calculate time spent on previous step
    }, 'writing_flow', 'step_navigation');
  };

  const updateMetrics = (metrics: Partial<AppState['writingFlow']['metrics']>) => {
    dispatch({ type: 'WRITING_FLOW_UPDATE_METRICS', payload: metrics });
    
    // Track metrics updates
    Object.keys(metrics).forEach(key => {
      const value = metrics[key as keyof typeof metrics];
      if (value !== undefined) {
        trackTyped('metrics_update', {
          step: state.writingFlow.currentStep,
          metric: key,
          value: typeof value === 'number' ? value : JSON.stringify(value),
          source: 'auto'
        }, 'writing_flow', 'metrics');
      }
    });
  };

  const toggleAddon = (addon: string, enabled: boolean) => {
    dispatch({ type: 'WRITING_FLOW_TOGGLE_ADDON', payload: { addon, enabled } });
    
    trackTyped('addon_toggle', {
      addon,
      enabled,
      step: state.writingFlow.currentStep,
      totalAddons: enabled 
        ? state.writingFlow.addons.length + 1 
        : state.writingFlow.addons.length - 1
    }, 'payment', 'addon_selection');
  };

  const setError = (error: string | undefined) => {
    dispatch({ type: 'WRITING_FLOW_SET_ERROR', payload: error });
    
    if (error) {
      trackTyped('workflow_error', {
        step: state.writingFlow.currentStep,
        error,
        context: 'writing_flow',
        recoverable: true
      }, 'error', 'workflow');
    }
  };

  return {
    writingFlow: state.writingFlow,
    setCurrentStep,
    updateMetrics,
    toggleAddon,
    setError
  };
};

export default AppContext;