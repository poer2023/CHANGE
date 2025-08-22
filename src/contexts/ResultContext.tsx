import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { Deliverables, DeliverableState, TimelineEvent, AssetItem, QualityScore } from '@/types/writing-flow';

// 交付物操作类型
export type DeliverableKey = 'quality' | 'processPdf' | 'refs' | 'timeline' | 'viva' | 'assets' | 'bundle';

export type DeliverableAction =
  | { type: 'GENERATE'; key: DeliverableKey }
  | { type: 'RETRY'; key: DeliverableKey }
  | { type: 'UPDATE_SCORES'; payload: { overall: number; scores: QualityScore[] } }
  | { type: 'ADD_FIGURE'; payload: { id: string; url: string; caption: string; sourceRef: string } }
  | { type: 'UPDATE_REFS'; payload: { added: string[]; removed: string[] } }
  | { type: 'APPEND_AUDIT'; payload: TimelineEvent }
  | { type: 'SET_STATE'; key: DeliverableKey; state: DeliverableState }
  | { type: 'SET_PROGRESS'; key: DeliverableKey; progress: number }
  | { type: 'UPDATE_REFS_COUNT'; payload: { total: number; byType: Record<string, number> } }
  | { type: 'ADD_ASSET'; payload: AssetItem }
  | { type: 'SET_BUNDLE_URL'; url: string };

// 初始状态
const initialDeliverables: Deliverables = {
  quality: { 
    scores: [], 
    overall: 0, 
    state: 'idle' as DeliverableState
  },
  processPdf: { 
    state: 'idle' as DeliverableState 
  },
  refs: { 
    total: 0, 
    target: 10, 
    byType: { paper: 0, book: 0, web: 0, dataset: 0, report: 0 }, 
    state: 'idle' as DeliverableState 
  },
  timeline: { 
    events: [], 
    state: 'idle' as DeliverableState 
  },
  viva: { 
    state: 'idle' as DeliverableState 
  },
  assets: { 
    items: [], 
    state: 'idle' as DeliverableState 
  },
  bundle: { 
    progress: 0, 
    state: 'idle' as DeliverableState 
  }
};

// Reducer 函数
function deliverablesReducer(state: Deliverables, action: DeliverableAction): Deliverables {
  switch (action.type) {
    case 'GENERATE':
    case 'RETRY':
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          state: 'generating' as DeliverableState
        }
      };

    case 'SET_STATE':
      return {
        ...state,
        [action.key]: {
          ...state[action.key],
          state: action.state
        }
      };

    case 'SET_PROGRESS':
      if (action.key === 'bundle') {
        return {
          ...state,
          bundle: {
            ...state.bundle,
            progress: action.progress
          }
        };
      }
      return state;

    case 'UPDATE_SCORES':
      return {
        ...state,
        quality: {
          ...state.quality,
          scores: action.payload.scores,
          overall: action.payload.overall,
          state: 'ready' as DeliverableState
        }
      };

    case 'UPDATE_REFS_COUNT':
      return {
        ...state,
        refs: {
          ...state.refs,
          total: action.payload.total,
          byType: action.payload.byType,
          state: 'ready' as DeliverableState
        }
      };

    case 'UPDATE_REFS':
      // 这里可以处理引用的添加和删除
      return {
        ...state,
        refs: {
          ...state.refs,
          state: 'ready' as DeliverableState
        }
      };

    case 'ADD_FIGURE': {
      // 添加图表到素材包
      const newAsset: AssetItem = {
        id: action.payload.id,
        name: action.payload.caption,
        type: 'chart',
        thumbnail: action.payload.url,
        url: action.payload.url,
        description: action.payload.sourceRef
      };
      return {
        ...state,
        assets: {
          ...state.assets,
          items: [...state.assets.items, newAsset],
          state: 'ready' as DeliverableState
        }
      };
    }

    case 'ADD_ASSET':
      return {
        ...state,
        assets: {
          ...state.assets,
          items: [...state.assets.items, action.payload],
          state: 'ready' as DeliverableState
        }
      };

    case 'APPEND_AUDIT':
      return {
        ...state,
        timeline: {
          ...state.timeline,
          events: [...state.timeline.events, action.payload],
          state: 'ready' as DeliverableState
        }
      };

    case 'SET_BUNDLE_URL':
      return {
        ...state,
        bundle: {
          ...state.bundle,
          zipUrl: action.url,
          state: 'ready' as DeliverableState,
          lastGenerated: new Date().toISOString()
        }
      };

    default:
      return state;
  }
}

// Context 类型
interface ResultContextType {
  state: Deliverables;
  dispatch: React.Dispatch<DeliverableAction>;
  
  // 便捷方法
  generateDeliverable: (key: DeliverableKey) => void;
  updateQualityScores: (overall: number, scores: QualityScore[]) => void;
  addAuditEvent: (event: TimelineEvent) => void;
  updateRefsCount: (total: number, byType: Record<string, number>) => void;
  setDeliverableState: (key: DeliverableKey, state: DeliverableState) => void;
}

// 创建 Context
const ResultContext = createContext<ResultContextType | undefined>(undefined);

// Provider 组件
interface ResultProviderProps {
  children: ReactNode;
}

export const ResultProvider: React.FC<ResultProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(deliverablesReducer, initialDeliverables);

  // 便捷方法
  const generateDeliverable = useCallback((key: DeliverableKey) => {
    dispatch({ type: 'GENERATE', key });
  }, []);

  const updateQualityScores = useCallback((overall: number, scores: QualityScore[]) => {
    dispatch({ type: 'UPDATE_SCORES', payload: { overall, scores } });
  }, []);

  const addAuditEvent = useCallback((event: TimelineEvent) => {
    dispatch({ type: 'APPEND_AUDIT', payload: event });
  }, []);

  const updateRefsCount = useCallback((total: number, byType: Record<string, number>) => {
    dispatch({ type: 'UPDATE_REFS_COUNT', payload: { total, byType } });
  }, []);

  const setDeliverableState = useCallback((key: DeliverableKey, state: DeliverableState) => {
    dispatch({ type: 'SET_STATE', key, state });
  }, []);

  const contextValue: ResultContextType = {
    state,
    dispatch,
    generateDeliverable,
    updateQualityScores,
    addAuditEvent,
    updateRefsCount,
    setDeliverableState
  };

  return (
    <ResultContext.Provider value={contextValue}>
      {children}
    </ResultContext.Provider>
  );
};

// Hook for using the context
export const useResult = (): ResultContextType => {
  const context = useContext(ResultContext);
  if (context === undefined) {
    throw new Error('useResult must be used within a ResultProvider');
  }
  return context;
};

export default ResultContext;