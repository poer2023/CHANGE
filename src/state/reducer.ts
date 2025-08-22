import type { AppState, Action, Step1Inputs, Estimate, Autopilot, PayLocks, ResultState, WritingFlowState } from './types';

// Initial state factory
export const createInitialState = (): AppState => ({
  step1: {
    title: '',
    assignmentType: 'paper',
    wordCount: 2000,
    format: 'APA',
    level: 'UG',
    resources: ['paper'],
    styleSamples: [],
    notes: ''
  },
  estimate: {
    priceRange: [0, 0],
    citesRange: [0, 0],
    etaMinutes: [0, 0],
    verifyLevel: 'Standard',
    assumptions: [],
    updatedAt: 0
  },
  autopilot: {
    running: false,
    step: 'idle',
    progress: 0,
    stats: { hits: 0, verified: 0, sections: 0 },
    canPause: false,
    minimized: false,
    logs: []
  },
  pay: {
    gate1Ready: false,
    previewMode: true
  },
  result: {
    generation: 'idle',
    exportPending: false
  },
  writingFlow: {
    currentStep: 'topic',
    metrics: {},
    addons: []
  }
});

// Reducer function
export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'STEP1_UPDATE':
      return {
        ...state,
        step1: { ...state.step1, ...action.payload }
      };

    case 'ESTIMATE_SET':
      return {
        ...state,
        estimate: action.payload
      };

    case 'AUTOPILOT_START':
      return {
        ...state,
        autopilot: {
          ...state.autopilot,
          running: true,
          step: 'search',
          progress: 0,
          stats: { hits: 0, verified: 0, sections: 0 },
          canPause: true,
          minimized: false,
          taskId: action.payload.taskId,
          logs: [
            {
              ts: Date.now(),
              msg: '开始自动推进流程',
              level: 'info'
            }
          ],
          config: {
            verifyLevel: action.payload.verifyLevel,
            allowPreprint: action.payload.allowPreprint,
            useStyle: action.payload.useStyle
          }
        }
      };

    case 'AUTOPILOT_PROGRESS':
      return {
        ...state,
        autopilot: {
          ...state.autopilot,
          ...action.payload,
          logs: action.payload.logs 
            ? [...state.autopilot.logs, ...action.payload.logs]
            : state.autopilot.logs
        }
      };

    case 'AUTOPILOT_DONE':
      return {
        ...state,
        autopilot: {
          ...state.autopilot,
          running: false,
          step: 'done',
          progress: 100,
          canPause: false,
          logs: [
            ...state.autopilot.logs,
            {
              ts: Date.now(),
              msg: '自动推进完成',
              level: 'info'
            }
          ]
        },
        result: action.payload?.docId 
          ? { ...state.result, docId: action.payload.docId }
          : state.result,
        pay: {
          ...state.pay,
          gate1Ready: true
        }
      };

    case 'AUTOPILOT_ERROR':
      return {
        ...state,
        autopilot: {
          ...state.autopilot,
          running: false,
          step: 'error',
          canPause: false,
          logs: [
            ...state.autopilot.logs,
            {
              ts: Date.now(),
              msg: `错误: ${action.payload}`,
              level: 'error'
            }
          ]
        }
      };

    case 'AUTOPILOT_MINIMIZE':
      return {
        ...state,
        autopilot: {
          ...state.autopilot,
          minimized: action.payload
        }
      };

    case 'AUTOPILOT_PAUSE':
      return {
        ...state,
        autopilot: {
          ...state.autopilot,
          canPause: false,
          logs: [
            ...state.autopilot.logs,
            {
              ts: Date.now(),
              msg: '已暂停',
              level: 'info'
            }
          ]
        }
      };

    case 'AUTOPILOT_RESUME':
      return {
        ...state,
        autopilot: {
          ...state.autopilot,
          canPause: true,
          logs: [
            ...state.autopilot.logs,
            {
              ts: Date.now(),
              msg: '已恢复',
              level: 'info'
            }
          ]
        }
      };

    case 'AUTOPILOT_STOP':
      return {
        ...state,
        autopilot: {
          ...state.autopilot,
          running: false,
          step: 'idle',
          progress: 0,
          canPause: false,
          logs: [
            ...state.autopilot.logs,
            {
              ts: Date.now(),
              msg: '已停止',
              level: 'warn'
            }
          ]
        }
      };

    case 'LOCK_PRICE_SET':
      return {
        ...state,
        pay: {
          ...state.pay,
          lockedPrice: {
            value: action.payload.value,
            currency: 'CNY',
            expiresAt: action.payload.expiresAt
          }
        }
      };

    case 'PAY_GATE1_READY':
      return {
        ...state,
        pay: {
          ...state.pay,
          gate1Ready: action.payload
        }
      };

    case 'PREVIEW_MODE_SET':
      return {
        ...state,
        pay: {
          ...state.pay,
          previewMode: action.payload
        }
      };

    case 'RESULT_SET_ID':
      return {
        ...state,
        result: {
          ...state.result,
          docId: action.payload.docId
        }
      };

    case 'GENERATION_STATE':
      return {
        ...state,
        result: {
          ...state.result,
          generation: action.payload
        }
      };

    case 'GENERATION_START':
      return {
        ...state,
        result: {
          ...state.result,
          streamId: action.payload.streamId,
          generation: 'streaming'
        }
      };

    case 'RESET_STATE':
      return createInitialState();

    case 'WRITING_FLOW_SET_STEP':
      return {
        ...state,
        writingFlow: {
          ...state.writingFlow,
          currentStep: action.payload
        }
      };

    case 'WRITING_FLOW_UPDATE_METRICS':
      return {
        ...state,
        writingFlow: {
          ...state.writingFlow,
          metrics: {
            ...state.writingFlow.metrics,
            ...action.payload
          }
        }
      };

    case 'WRITING_FLOW_TOGGLE_ADDON':
      const { addon, enabled } = action.payload;
      const currentAddons = state.writingFlow.addons;
      const updatedAddons = enabled
        ? [...currentAddons, addon as any]
        : currentAddons.filter(a => a !== addon);
      
      return {
        ...state,
        writingFlow: {
          ...state.writingFlow,
          addons: updatedAddons
        }
      };

    case 'WRITING_FLOW_SET_ERROR':
      return {
        ...state,
        writingFlow: {
          ...state.writingFlow,
          error: action.payload
        }
      };

    case 'LOAD_PERSISTED_STATE':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

// Persistence utilities
export const persistState = (state: AppState): void => {
  try {
    // Save step1 to localStorage for long-term persistence
    localStorage.setItem('step1', JSON.stringify(state.step1));
    
    // Save locked price to sessionStorage (30 minutes)
    if (state.pay.lockedPrice) {
      sessionStorage.setItem('lockedPrice', JSON.stringify(state.pay.lockedPrice));
    }

    // Don't persist autopilot logs (memory only)
  } catch (error) {
    console.warn('Failed to persist state:', error);
  }
};

export const loadPersistedState = (): Partial<AppState> => {
  const partial: Partial<AppState> = {};

  try {
    // Load step1 from localStorage
    const step1Data = localStorage.getItem('step1');
    if (step1Data) {
      partial.step1 = JSON.parse(step1Data);
    }

    // Load locked price from sessionStorage
    const lockedPriceData = sessionStorage.getItem('lockedPrice');
    if (lockedPriceData) {
      const lockedPrice = JSON.parse(lockedPriceData);
      // Check if not expired
      if (lockedPrice.expiresAt > Date.now()) {
        partial.pay = { 
          gate1Ready: false, 
          previewMode: true,
          lockedPrice 
        };
      } else {
        // Remove expired price
        sessionStorage.removeItem('lockedPrice');
      }
    }
  } catch (error) {
    console.warn('Failed to load persisted state:', error);
  }

  return partial;
};