/**
 * AI写作助手服务整合 - 统一导出所有写作助手相关功能
 */

// 核心服务
export { 
  AIWritingAssistant,
  createAIWritingAssistant,
  type WritingAssistantMode,
  type WritingContext,
  type WritingSuggestion,
  type RealTimeSuggestion,
  type WritingSession,
  type WritingPreferences,
  type PaperTypeConfig
} from './ai-writing-assistant';

// 模式处理器
export {
  ModeProcessorFactory,
  type ModeProcessor
} from './writing-mode-processors';

// 实时协作
export {
  RealTimeWritingCollaborator,
  createRealTimeCollaborator,
  type RealTimeConfig,
  type WritingEventType,
  type WritingEvent,
  type CollaborationState
} from './real-time-collaborator';

// 论文类型适配
export {
  PaperTypeAdapter,
  paperTypeAdapter,
  getPaperGuidance,
  validatePaper,
  PaperType,
  AcademicField,
  type WritingGuidanceRule,
  type SectionTemplate,
  type CompletePaperTypeConfig
} from './paper-type-adapter';

// GLM客户端（重新导出）
export {
  GLMClient,
  createGLMClient,
  defaultGLMClient
} from './glm-client';

// 内容分析器（重新导出）
export {
  ContentAnalyzer,
  contentAnalyzer,
  analyzePaper,
  quickQualityCheck
} from './content-analyzer';

/**
 * 创建完整的AI写作助手系统
 */
import { GLMClient } from './glm-client';
import { AIWritingAssistant } from './ai-writing-assistant';
import { RealTimeWritingCollaborator } from './real-time-collaborator';
import { PaperTypeAdapter } from './paper-type-adapter';
import { ModeProcessorFactory } from './writing-mode-processors';
import { Paper } from '../types';

export interface AIWritingAssistantSystem {
  glmClient: GLMClient;
  assistant: AIWritingAssistant;
  collaborator: RealTimeWritingCollaborator;
  typeAdapter: PaperTypeAdapter;
  modeProcessor: ModeProcessorFactory;
}

export interface AISystemConfig {
  glmConfig: {
    apiKey: string;
    baseURL?: string;
    timeout?: number;
    maxRetries?: number;
  };
  collaborationConfig?: {
    enabled?: boolean;
    debounceMs?: number;
    maxSuggestions?: number;
  };
  preferenceDefaults?: {
    language?: 'zh' | 'en';
    writingStyle?: 'academic' | 'professional' | 'casual';
    detailLevel?: 'concise' | 'detailed' | 'comprehensive';
  };
}

/**
 * 创建完整的AI写作助手系统
 */
export const createAIWritingAssistantSystem = (config: AISystemConfig): AIWritingAssistantSystem => {
  // 创建GLM客户端
  const glmClient = new GLMClient(config.glmConfig);
  
  // 创建AI写作助手
  const assistant = new AIWritingAssistant(glmClient);
  
  // 创建实时协作器
  const collaborator = new RealTimeWritingCollaborator(assistant, config.collaborationConfig);
  
  // 创建论文类型适配器
  const typeAdapter = new PaperTypeAdapter();
  
  // 创建模式处理器工厂
  const modeProcessor = new ModeProcessorFactory(glmClient);

  return {
    glmClient,
    assistant,
    collaborator,
    typeAdapter,
    modeProcessor
  };
};

/**
 * AI写作助手工具函数集合
 */
export const AIWritingAssistantUtils = {
  /**
   * 快速获取论文建议
   */
  async getQuickSuggestions(
    system: AIWritingAssistantSystem,
    paper: Paper,
    selectedText?: string
  ) {
    // 开始会话
    await system.assistant.startWritingSession(paper);
    
    // 获取论文类型指导
    const guidance = system.typeAdapter.getWritingGuidance({
      paperType: paper.paperType as any || 'research',
      field: paper.field as any || 'other',
      wordCount: paper.wordCount,
      targetAudience: 'academic',
      language: 'zh'
    });

    // 获取快速建议
    const suggestions = selectedText 
      ? await system.assistant.getBatchSuggestions(selectedText, ['polish', 'expand', 'summarize'])
      : await system.assistant.getWritingSuggestion('continue');

    return {
      guidance: guidance.slice(0, 3),
      suggestions: Array.isArray(suggestions) ? suggestions : [suggestions]
    };
  },

  /**
   * 验证论文质量
   */
  validatePaperQuality(system: AIWritingAssistantSystem, paper: Paper) {
    const validation = system.typeAdapter.validatePaperStructure(paper);
    const commonMistakes = system.typeAdapter.getCommonMistakes(paper.paperType as any);
    const bestPractices = system.typeAdapter.getBestPractices(paper.paperType as any);

    return {
      ...validation,
      commonMistakes: commonMistakes.slice(0, 5),
      bestPractices: bestPractices.slice(0, 5)
    };
  },

  /**
   * 获取推荐的论文结构
   */
  getRecommendedStructure(system: AIWritingAssistantSystem, paperType: string, field?: string) {
    return system.typeAdapter.getRecommendedStructure(paperType as any, field as any);
  },

  /**
   * 开始实时协作
   */
  startRealTimeCollaboration(system: AIWritingAssistantSystem, paper: Paper) {
    system.collaborator.startCollaboration();
    
    // 设置基本监听器
    system.collaborator.on('suggestions:updated', (data) => {
      console.log('收到实时建议:', data.suggestions.length);
    });

    system.collaborator.on('suggestion:applied', (data) => {
      console.log('应用建议:', data.suggestion.id);
    });

    return system.collaborator;
  },

  /**
   * 获取写作统计
   */
  getWritingStats(system: AIWritingAssistantSystem) {
    const sessionStats = system.assistant.getSessionStats();
    const collaborationStats = system.collaborator.getWritingStats();
    
    return {
      session: sessionStats,
      collaboration: collaborationStats,
      overall: {
        efficiency: sessionStats ? (sessionStats.suggestionsApplied / Math.max(sessionStats.suggestionsGenerated, 1)) * 100 : 0,
        activity: collaborationStats.eventsCount,
        productivity: Math.round((collaborationStats.suggestionsApplied / Math.max(collaborationStats.sessionDuration / 60000, 1)) * 10) / 10 // 每分钟应用的建议数
      }
    };
  }
};

/**
 * 预设配置
 */
export const AIWritingAssistantPresets = {
  /**
   * 研究论文配置
   */
  research: {
    glmConfig: {
      apiKey: process.env.VITE_GLM_API_KEY || '',
      temperature: 0.3,
      maxTokens: 2000
    },
    collaborationConfig: {
      enabled: true,
      debounceMs: 800,
      maxSuggestions: 3,
      categories: {
        grammar: true,
        style: true,
        flow: true,
        citation: true,
        structure: false
      }
    },
    preferenceDefaults: {
      language: 'zh' as const,
      writingStyle: 'academic' as const,
      detailLevel: 'detailed' as const,
      creativityLevel: 0.3,
      formalityLevel: 0.8
    }
  },

  /**
   * 学位论文配置
   */
  thesis: {
    glmConfig: {
      apiKey: process.env.VITE_GLM_API_KEY || '',
      temperature: 0.4,
      maxTokens: 3000
    },
    collaborationConfig: {
      enabled: true,
      debounceMs: 1000,
      maxSuggestions: 5,
      categories: {
        grammar: true,
        style: true,
        flow: true,
        citation: true,
        structure: true
      }
    },
    preferenceDefaults: {
      language: 'zh' as const,
      writingStyle: 'academic' as const,
      detailLevel: 'comprehensive' as const,
      creativityLevel: 0.4,
      formalityLevel: 0.9
    }
  },

  /**
   * 快速写作配置
   */
  quick: {
    glmConfig: {
      apiKey: process.env.VITE_GLM_API_KEY || '',
      temperature: 0.5,
      maxTokens: 1000
    },
    collaborationConfig: {
      enabled: true,
      debounceMs: 300,
      maxSuggestions: 2,
      categories: {
        grammar: true,
        style: false,
        flow: false,
        citation: false,
        structure: false
      }
    },
    preferenceDefaults: {
      language: 'zh' as const,
      writingStyle: 'professional' as const,
      detailLevel: 'concise' as const,
      creativityLevel: 0.5,
      formalityLevel: 0.6
    }
  }
};

/**
 * 默认系统实例创建函数
 */
export const createDefaultAIWritingSystem = (apiKey?: string) => {
  const config: AISystemConfig = {
    glmConfig: {
      apiKey: apiKey || import.meta.env?.VITE_GLM_API_KEY || '',
      baseURL: import.meta.env?.VITE_GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4',
      timeout: 30000,
      maxRetries: 3
    },
    collaborationConfig: {
      enabled: true,
      debounceMs: 500,
      maxSuggestions: 3
    },
    preferenceDefaults: {
      language: 'zh',
      writingStyle: 'academic',
      detailLevel: 'detailed'
    }
  };

  return createAIWritingAssistantSystem(config);
};

// 错误处理
export class AIWritingAssistantError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: any
  ) {
    super(message);
    this.name = 'AIWritingAssistantError';
  }
}

export const ErrorCodes = {
  API_KEY_MISSING: 'API_KEY_MISSING',
  CLIENT_NOT_CONFIGURED: 'CLIENT_NOT_CONFIGURED',
  SESSION_NOT_STARTED: 'SESSION_NOT_STARTED',
  INVALID_PAPER_TYPE: 'INVALID_PAPER_TYPE',
  SUGGESTION_GENERATION_FAILED: 'SUGGESTION_GENERATION_FAILED',
  COLLABORATION_ERROR: 'COLLABORATION_ERROR'
} as const;

export default {
  createAIWritingAssistantSystem,
  createDefaultAIWritingSystem,
  AIWritingAssistantUtils,
  AIWritingAssistantPresets,
  AIWritingAssistantError,
  ErrorCodes
};