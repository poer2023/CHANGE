import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  WritingProject,
  WritingStep,
  Topic,
  Source,
  Note,
  Strategy,
  OutlineNode,
  Content,
  ChangeLog,
  ProjectMetadata,
  StepValidation,
  PricingEstimation,
  AutoProgressState,
  AutoProgressConfig
} from '../types/writing-flow';

// Action types for the reducer
type WritingFlowAction =
  | { type: 'SET_CURRENT_STEP'; payload: WritingStep }
  | { type: 'UPDATE_TOPIC'; payload: Partial<Topic> }
  | { type: 'ADD_SOURCE'; payload: Source }
  | { type: 'REMOVE_SOURCE'; payload: string }
  | { type: 'UPDATE_SOURCE'; payload: { id: string; updates: Partial<Source> } }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'REMOVE_NOTE'; payload: string }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'UPDATE_STRATEGY'; payload: Partial<Strategy> }
  | { type: 'ADD_OUTLINE_NODE'; payload: OutlineNode }
  | { type: 'REMOVE_OUTLINE_NODE'; payload: string }
  | { type: 'UPDATE_OUTLINE_NODE'; payload: { id: string; updates: Partial<OutlineNode> } }
  | { type: 'REORDER_OUTLINE_NODES'; payload: { nodeId: string; newOrder: number } }
  | { type: 'UPDATE_CONTENT'; payload: Partial<Content> }
  | { type: 'ADD_CHANGE_LOG'; payload: Omit<ChangeLog, 'id' | 'timestamp'> }
  | { type: 'COMPLETE_STEP'; payload: WritingStep }
  | { type: 'RESET_PROJECT' }
  | { type: 'LOAD_PROJECT'; payload: WritingProject }
  | { type: 'UPDATE_PROJECT_STATUS'; payload: 'draft' | 'in_progress' | 'completed' }
  | { type: 'UPDATE_METADATA'; payload: Partial<ProjectMetadata> }
  | { type: 'SET_OUTLINE'; payload: OutlineNode[] }
  | { type: 'UPDATE_PRICING_ESTIMATION'; payload: PricingEstimation }
  | { type: 'START_AUTO_PROGRESS'; payload: AutoProgressConfig }
  | { type: 'UPDATE_AUTO_PROGRESS'; payload: Partial<AutoProgressState> }
  | { type: 'COMPLETE_AUTO_PROGRESS' }
  | { type: 'CANCEL_AUTO_PROGRESS' };

// Initial state
const createInitialProject = (): WritingProject => {
  const now = new Date();
  return {
    id: `project_${Date.now()}`,
    userId: 'anonymous',
    topic: {
      title: '',
      course: '',
      assignmentType: 'paper',
      wordLimit: 2000,
      citationStyle: 'APA',
      languageLevel: 'undergrad',
      sources: ['any'],
      styleFiles: [],
      extraRequirements: ''
    },
    sources: [],
    notes: [],
    strategy: undefined,
    outline: [],
    content: undefined,
    styleMetrics: undefined,
    metadata: {
      createdAt: now,
      updatedAt: now,
      sessionTime: 0,
      searchKeywords: [],
      citationActions: [],
      agentCommands: [],
      manualEditCount: 0,
      exportVersion: 1
    },
    currentStep: 'topic',
    completedSteps: [],
    status: 'draft'
  };
};

// Context interface
interface WritingFlowContextType {
  project: WritingProject;
  dispatch: React.Dispatch<WritingFlowAction>;
  
  // Convenience methods
  setCurrentStep: (step: WritingStep) => void;
  updateTopic: (updates: Partial<Topic>) => void;
  addSource: (source: Source) => void;
  removeSource: (sourceId: string) => void;
  updateSource: (sourceId: string, updates: Partial<Source>) => void;
  addNote: (note: Note) => void;
  removeNote: (noteId: string) => void;
  updateNote: (noteId: string, updates: Partial<Note>) => void;
  updateStrategy: (updates: Partial<Strategy>) => void;
  addOutlineNode: (node: OutlineNode) => void;
  removeOutlineNode: (nodeId: string) => void;
  updateOutlineNode: (nodeId: string, updates: Partial<OutlineNode>) => void;
  reorderOutlineNodes: (nodeId: string, newOrder: number) => void;
  setOutline: (nodes: OutlineNode[]) => void;
  updateContent: (updates: Partial<Content>) => void;
  addChangeLog: (log: Omit<ChangeLog, 'id' | 'timestamp'>) => void;
  completeStep: (step: WritingStep) => void;
  resetProject: () => void;
  loadProject: (project: WritingProject) => void;
  updateProjectStatus: (status: 'draft' | 'in_progress' | 'completed') => void;
  
  // Pricing and auto-progress methods
  updatePricingEstimation: (estimation: PricingEstimation) => void;
  startAutoProgress: (config: AutoProgressConfig) => Promise<void>;
  updateAutoProgress: (updates: Partial<AutoProgressState>) => void;
  completeAutoProgress: () => void;
  cancelAutoProgress: () => void;
  
  // Validation and utility methods
  validateStep: (step: WritingStep) => StepValidation;
  getProgressPercentage: () => number;
  canProceedToStep: (step: WritingStep) => boolean;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => boolean;
}

// Reducer function
const writingFlowReducer = (state: WritingProject, action: WritingFlowAction): WritingProject => {
  const updatedState = { ...state, metadata: { ...state.metadata, updatedAt: new Date() } };

  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...updatedState, currentStep: action.payload };

    case 'UPDATE_TOPIC':
      return {
        ...updatedState,
        topic: { ...state.topic, ...action.payload }
      };

    case 'ADD_SOURCE':
      return {
        ...updatedState,
        sources: [...state.sources, action.payload]
      };

    case 'REMOVE_SOURCE':
      return {
        ...updatedState,
        sources: state.sources.filter(source => source.id !== action.payload),
        notes: state.notes.filter(note => note.sourceId !== action.payload)
      };

    case 'UPDATE_SOURCE':
      return {
        ...updatedState,
        sources: state.sources.map(source =>
          source.id === action.payload.id 
            ? { ...source, ...action.payload.updates }
            : source
        )
      };

    case 'ADD_NOTE':
      return {
        ...updatedState,
        notes: [...state.notes, action.payload]
      };

    case 'REMOVE_NOTE':
      return {
        ...updatedState,
        notes: state.notes.filter(note => note.id !== action.payload)
      };

    case 'UPDATE_NOTE':
      return {
        ...updatedState,
        notes: state.notes.map(note =>
          note.id === action.payload.id
            ? { ...note, ...action.payload.updates }
            : note
        )
      };

    case 'UPDATE_STRATEGY':
      const existingStrategy = state.strategy;
      return {
        ...updatedState,
        strategy: existingStrategy 
          ? { ...existingStrategy, ...action.payload, updatedAt: new Date() }
          : {
              thesis: '',
              claims: [],
              argumentType: 'argumentative',
              approach: '',
              createdAt: new Date(),
              updatedAt: new Date(),
              ...action.payload
            } as Strategy
      };

    case 'ADD_OUTLINE_NODE':
      return {
        ...updatedState,
        outline: [...state.outline, action.payload]
      };

    case 'REMOVE_OUTLINE_NODE':
      const removeNodeRecursively = (nodes: OutlineNode[], targetId: string): OutlineNode[] => {
        return nodes.filter(node => {
          if (node.id === targetId) return false;
          if (node.children.length > 0) {
            node.children = removeNodeRecursively(node.children, targetId);
          }
          return true;
        });
      };
      return {
        ...updatedState,
        outline: removeNodeRecursively(state.outline, action.payload)
      };

    case 'UPDATE_OUTLINE_NODE':
      const updateNodeRecursively = (nodes: OutlineNode[]): OutlineNode[] => {
        return nodes.map(node => {
          if (node.id === action.payload.id) {
            return { ...node, ...action.payload.updates };
          }
          if (node.children.length > 0) {
            return { ...node, children: updateNodeRecursively(node.children) };
          }
          return node;
        });
      };
      return {
        ...updatedState,
        outline: updateNodeRecursively(state.outline)
      };

    case 'REORDER_OUTLINE_NODES':
      const reorderNodes = (nodes: OutlineNode[]): OutlineNode[] => {
        return nodes.map(node => {
          if (node.id === action.payload.nodeId) {
            return { ...node, order: action.payload.newOrder };
          }
          if (node.children.length > 0) {
            return { ...node, children: reorderNodes(node.children) };
          }
          return node;
        }).sort((a, b) => a.order - b.order);
      };
      return {
        ...updatedState,
        outline: reorderNodes(state.outline)
      };

    case 'UPDATE_CONTENT':
      const existingContent = state.content;
      return {
        ...updatedState,
        content: existingContent
          ? { ...existingContent, ...action.payload, lastModified: new Date() }
          : {
              id: `content_${Date.now()}`,
              title: state.topic.title || 'Untitled',
              body: '',
              wordCount: 0,
              citations: [],
              bibliography: [],
              lastModified: new Date(),
              version: 1,
              changeHistory: [],
              ...action.payload
            } as Content
      };

    case 'ADD_CHANGE_LOG':
      const newLog: ChangeLog = {
        ...action.payload,
        id: `log_${Date.now()}`,
        timestamp: new Date()
      };
      
      return {
        ...updatedState,
        content: state.content 
          ? { 
              ...state.content, 
              changeHistory: [...state.content.changeHistory, newLog] 
            }
          : undefined,
        metadata: {
          ...updatedState.metadata,
          agentCommands: action.payload.actor === 'agent'
            ? [...state.metadata.agentCommands, {
                command: action.payload.action,
                timestamp: new Date(),
                success: true
              }]
            : state.metadata.agentCommands,
          manualEditCount: action.payload.actor === 'user'
            ? state.metadata.manualEditCount + 1
            : state.metadata.manualEditCount
        }
      };

    case 'COMPLETE_STEP':
      return {
        ...updatedState,
        completedSteps: state.completedSteps.includes(action.payload)
          ? state.completedSteps
          : [...state.completedSteps, action.payload]
      };

    case 'RESET_PROJECT':
      return createInitialProject();

    case 'LOAD_PROJECT':
      return { ...action.payload, metadata: { ...action.payload.metadata, updatedAt: new Date() } };

    case 'UPDATE_PROJECT_STATUS':
      return { ...updatedState, status: action.payload };

    case 'UPDATE_METADATA':
      return {
        ...updatedState,
        metadata: { ...state.metadata, ...action.payload, updatedAt: new Date() }
      };

    case 'SET_OUTLINE':
      return {
        ...updatedState,
        outline: action.payload
      };

    case 'UPDATE_PRICING_ESTIMATION':
      return {
        ...updatedState,
        metadata: {
          ...state.metadata,
          pricingEstimation: action.payload,
          updatedAt: new Date()
        }
      };

    case 'START_AUTO_PROGRESS':
      return {
        ...updatedState,
        metadata: {
          ...state.metadata,
          autoProgressState: {
            isActive: true,
            currentStage: 'research',
            progress: 0,
            stages: [
              { name: '文献检索', status: 'in_progress' },
              { name: '写作策略', status: 'pending' },
              { name: '大纲构建', status: 'pending' }
            ],
            config: action.payload
          },
          updatedAt: new Date()
        }
      };

    case 'UPDATE_AUTO_PROGRESS':
      return {
        ...updatedState,
        metadata: {
          ...state.metadata,
          autoProgressState: state.metadata.autoProgressState 
            ? { ...state.metadata.autoProgressState, ...action.payload }
            : undefined,
          updatedAt: new Date()
        }
      };

    case 'COMPLETE_AUTO_PROGRESS':
      return {
        ...updatedState,
        currentStep: 'outline',
        completedSteps: ['topic', 'research', 'strategy', 'outline'],
        metadata: {
          ...state.metadata,
          autoProgressState: state.metadata.autoProgressState 
            ? { 
                ...state.metadata.autoProgressState, 
                isActive: false, 
                currentStage: 'completed',
                progress: 100,
                stages: state.metadata.autoProgressState.stages.map(stage => ({
                  ...stage,
                  status: 'completed' as const
                }))
              }
            : undefined,
          updatedAt: new Date()
        }
      };

    case 'CANCEL_AUTO_PROGRESS':
      return {
        ...updatedState,
        metadata: {
          ...state.metadata,
          autoProgressState: undefined,
          updatedAt: new Date()
        }
      };

    default:
      return state;
  }
};

// Create context
const WritingFlowContext = createContext<WritingFlowContextType | undefined>(undefined);

// Context provider component
interface WritingFlowProviderProps {
  children: ReactNode;
}

export const WritingFlowProvider: React.FC<WritingFlowProviderProps> = ({ children }) => {
  const [project, dispatch] = useReducer(writingFlowReducer, createInitialProject());

  // Auto-save to localStorage on project changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('writingFlow_project', JSON.stringify(project));
      } catch (error) {
        console.warn('Failed to save project to localStorage:', error);
      }
    }, 1000); // Debounce saves by 1 second

    return () => clearTimeout(timeoutId);
  }, [project]);

  // Load from localStorage on mount
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // Convenience methods
  const setCurrentStep = (step: WritingStep) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  };

  const updateTopic = (updates: Partial<Topic>) => {
    dispatch({ type: 'UPDATE_TOPIC', payload: updates });
  };

  const addSource = (source: Source) => {
    dispatch({ type: 'ADD_SOURCE', payload: source });
  };

  const removeSource = (sourceId: string) => {
    dispatch({ type: 'REMOVE_SOURCE', payload: sourceId });
  };

  const updateSource = (sourceId: string, updates: Partial<Source>) => {
    dispatch({ type: 'UPDATE_SOURCE', payload: { id: sourceId, updates } });
  };

  const addNote = (note: Note) => {
    dispatch({ type: 'ADD_NOTE', payload: note });
  };

  const removeNote = (noteId: string) => {
    dispatch({ type: 'REMOVE_NOTE', payload: noteId });
  };

  const updateNote = (noteId: string, updates: Partial<Note>) => {
    dispatch({ type: 'UPDATE_NOTE', payload: { id: noteId, updates } });
  };

  const updateStrategy = (updates: Partial<Strategy>) => {
    dispatch({ type: 'UPDATE_STRATEGY', payload: updates });
  };

  const addOutlineNode = (node: OutlineNode) => {
    dispatch({ type: 'ADD_OUTLINE_NODE', payload: node });
  };

  const removeOutlineNode = (nodeId: string) => {
    dispatch({ type: 'REMOVE_OUTLINE_NODE', payload: nodeId });
  };

  const updateOutlineNode = (nodeId: string, updates: Partial<OutlineNode>) => {
    dispatch({ type: 'UPDATE_OUTLINE_NODE', payload: { id: nodeId, updates } });
  };

  const reorderOutlineNodes = (nodeId: string, newOrder: number) => {
    dispatch({ type: 'REORDER_OUTLINE_NODES', payload: { nodeId, newOrder } });
  };
  
  const setOutline = (nodes: OutlineNode[]) => {
    dispatch({ type: 'SET_OUTLINE', payload: nodes });
  };

  const updateContent = (updates: Partial<Content>) => {
    dispatch({ type: 'UPDATE_CONTENT', payload: updates });
  };

  const addChangeLog = (log: Omit<ChangeLog, 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_CHANGE_LOG', payload: log });
  };

  const completeStep = (step: WritingStep) => {
    dispatch({ type: 'COMPLETE_STEP', payload: step });
  };

  const resetProject = () => {
    dispatch({ type: 'RESET_PROJECT' });
  };

  const loadProject = (newProject: WritingProject) => {
    dispatch({ type: 'LOAD_PROJECT', payload: newProject });
  };

  const updateProjectStatus = (status: 'draft' | 'in_progress' | 'completed') => {
    dispatch({ type: 'UPDATE_PROJECT_STATUS', payload: status });
  };

  // Pricing and auto-progress methods
  const updatePricingEstimation = (estimation: PricingEstimation) => {
    dispatch({ type: 'UPDATE_PRICING_ESTIMATION', payload: estimation });
  };

  const startAutoProgress = async (config: AutoProgressConfig) => {
    dispatch({ type: 'START_AUTO_PROGRESS', payload: config });
    
    try {
      // Simulate research step
      await new Promise(resolve => setTimeout(resolve, 2000));
      dispatch({ type: 'UPDATE_AUTO_PROGRESS', payload: { 
        currentStage: 'strategy',
        progress: 33,
        stages: [
          { name: '文献检索', status: 'completed', message: '已找到相关文献' },
          { name: '写作策略', status: 'in_progress' },
          { name: '大纲构建', status: 'pending' }
        ]
      }});

      // Simulate strategy step
      await new Promise(resolve => setTimeout(resolve, 2000));
      dispatch({ type: 'UPDATE_AUTO_PROGRESS', payload: { 
        currentStage: 'outline',
        progress: 66,
        stages: [
          { name: '文献检索', status: 'completed', message: '已找到相关文献' },
          { name: '写作策略', status: 'completed', message: '策略制定完成' },
          { name: '大纲构建', status: 'in_progress' }
        ]
      }});

      // Simulate outline step
      await new Promise(resolve => setTimeout(resolve, 2000));
      dispatch({ type: 'COMPLETE_AUTO_PROGRESS' });
      
    } catch (error) {
      console.error('Auto-progress failed:', error);
      dispatch({ type: 'CANCEL_AUTO_PROGRESS' });
    }
  };

  const updateAutoProgress = (updates: Partial<AutoProgressState>) => {
    dispatch({ type: 'UPDATE_AUTO_PROGRESS', payload: updates });
  };

  const completeAutoProgress = () => {
    dispatch({ type: 'COMPLETE_AUTO_PROGRESS' });
  };

  const cancelAutoProgress = () => {
    dispatch({ type: 'CANCEL_AUTO_PROGRESS' });
  };

  // Validation and utility methods
  const validateStep = (step: WritingStep): StepValidation => {
    const warnings: string[] = [];
    const errors: string[] = [];
    let completionPercentage = 0;
    let isValid = false;

    switch (step) {
      case 'topic':
        if (!project.topic.title) errors.push('论文标题不能为空');
        if (project.topic.wordLimit <= 0) errors.push('字数限制必须大于0');
        if (!project.topic.assignmentType) errors.push('作业类型不能为空');
        if (!project.topic.citationStyle) errors.push('引用格式不能为空');
        if (!project.topic.languageLevel) errors.push('语言水平不能为空');
        if (!project.topic.sources || project.topic.sources.length === 0) errors.push('请选择至少一种资源类型');
        
        const requiredFields = [
          project.topic.title,
          project.topic.assignmentType,
          project.topic.wordLimit > 0,
          project.topic.citationStyle,
          project.topic.languageLevel,
          project.topic.sources?.length > 0
        ];
        const optionalFields = [
          project.topic.course,
          project.topic.styleFiles?.length > 0,
          project.topic.extraRequirements
        ];
        
        const filledRequired = requiredFields.filter(Boolean).length;
        const filledOptional = optionalFields.filter(Boolean).length;
        
        completionPercentage = Math.round(((filledRequired / requiredFields.length) * 80) + ((filledOptional / optionalFields.length) * 20));
        isValid = errors.length === 0 && filledRequired === requiredFields.length;
        break;

      case 'research':
        if (project.sources.length === 0) {
          errors.push('至少需要添加一个参考文献');
        } else {
          const selectedSources = project.sources.filter(s => s.selected);
          if (selectedSources.length === 0) errors.push('至少需要选择一个参考文献');
          
          const verifiedSources = selectedSources.filter(s => s.verified);
          if (verifiedSources.length < selectedSources.length) {
            warnings.push('部分参考文献尚未验证');
          }
        }
        
        completionPercentage = Math.min(
          (project.sources.filter(s => s.selected).length / Math.max(3, project.sources.length)) * 100,
          100
        );
        isValid = errors.length === 0;
        break;

      case 'strategy':
        if (!project.strategy?.thesis) errors.push('论文主题句不能为空');
        if (!project.strategy?.claims || project.strategy.claims.length === 0) {
          errors.push('至少需要一个论点');
        }
        if (!project.strategy?.approach) errors.push('写作方法不能为空');
        
        const strategyFields = [
          project.strategy?.thesis,
          project.strategy?.claims?.length || 0 > 0,
          project.strategy?.approach
        ];
        completionPercentage = (strategyFields.filter(Boolean).length / strategyFields.length) * 100;
        isValid = errors.length === 0 && completionPercentage === 100;
        break;

      case 'outline':
        if (project.outline.length === 0) errors.push('至少需要创建一个大纲节点');
        
        const incompleteNodes = project.outline.filter(node => !node.completed);
        if (incompleteNodes.length > 0) {
          warnings.push(`还有 ${incompleteNodes.length} 个大纲节点未完成`);
        }
        
        completionPercentage = project.outline.length > 0 
          ? (project.outline.filter(node => node.completed).length / project.outline.length) * 100
          : 0;
        isValid = errors.length === 0;
        break;

      default:
        isValid = false;
    }

    return {
      step,
      isValid,
      warnings,
      errors,
      completionPercentage: Math.round(completionPercentage)
    };
  };

  const getProgressPercentage = (): number => {
    const totalSteps = 4; // topic, research, strategy, outline
    const completedCount = project.completedSteps.length;
    return Math.round((completedCount / totalSteps) * 100);
  };

  const canProceedToStep = (step: WritingStep): boolean => {
    const stepOrder: WritingStep[] = ['topic', 'research', 'strategy', 'outline'];
    const targetIndex = stepOrder.indexOf(step);
    const currentIndex = stepOrder.indexOf(project.currentStep);
    
    // Can always go back to previous steps
    if (targetIndex <= currentIndex) return true;
    
    // Can proceed to next step if current step is valid
    if (targetIndex === currentIndex + 1) {
      const validation = validateStep(project.currentStep);
      return validation.isValid;
    }
    
    // Can't skip steps
    return false;
  };

  const saveToLocalStorage = (): void => {
    try {
      localStorage.setItem('writingFlow_project', JSON.stringify(project));
    } catch (error) {
      console.error('Failed to save project to localStorage:', error);
    }
  };

  const loadFromLocalStorage = (): boolean => {
    try {
      const savedProject = localStorage.getItem('writingFlow_project');
      if (savedProject) {
        const parsedProject = JSON.parse(savedProject);
        // Validate and sanitize the loaded project
        if (parsedProject.id && parsedProject.currentStep) {
          dispatch({ type: 'LOAD_PROJECT', payload: parsedProject });
          return true;
        }
      }
    } catch (error) {
      console.warn('Failed to load project from localStorage:', error);
    }
    return false;
  };

  const contextValue: WritingFlowContextType = {
    project,
    dispatch,
    
    // Convenience methods
    setCurrentStep,
    updateTopic,
    addSource,
    removeSource,
    updateSource,
    addNote,
    removeNote,
    updateNote,
    updateStrategy,
    addOutlineNode,
    removeOutlineNode,
    updateOutlineNode,
    reorderOutlineNodes,
    setOutline,
    updateContent,
    addChangeLog,
    completeStep,
    resetProject,
    loadProject,
    updateProjectStatus,
    
    // Pricing and auto-progress methods
    updatePricingEstimation,
    startAutoProgress,
    updateAutoProgress,
    completeAutoProgress,
    cancelAutoProgress,
    
    // Validation and utility methods
    validateStep,
    getProgressPercentage,
    canProceedToStep,
    saveToLocalStorage,
    loadFromLocalStorage
  };

  return (
    <WritingFlowContext.Provider value={contextValue}>
      {children}
    </WritingFlowContext.Provider>
  );
};

// Custom hook for using the writing flow context
export const useWritingFlow = (): WritingFlowContextType => {
  const context = useContext(WritingFlowContext);
  if (!context) {
    throw new Error('useWritingFlow must be used within a WritingFlowProvider');
  }
  return context;
};

export default WritingFlowContext;