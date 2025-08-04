import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAgentStore } from '../store/agentStore';
import { Paper, AgentMessage, AgentSuggestion } from '../types';
import type { ContextualMemory, DocumentContext, ConversationMemory } from '../store/agentStore';

export interface ContextAwareConfig {
  enableAutoExtraction?: boolean;
  contextWindowSize?: number;
  maxHistoryDepth?: number;
  enableRealTimeUpdates?: boolean;
  compressionThreshold?: number;
}

export interface EditingContext {
  currentText: string;
  cursorPosition: number;
  selectedText: string;
  surroundingContext: string;
  sectionInfo?: {
    title: string;
    level: number;
    index: number;
  };
}

export interface ContextAwareState {
  currentContext: ContextualMemory[];
  relevantHistory: ConversationMemory[];
  documentInsights: {
    wordCount: number;
    readabilityScore: number;
    structureAnalysis: string[];
    suggestions: AgentSuggestion[];
  };
  isProcessing: boolean;
  lastUpdate: Date;
}

/**
 * 上下文感知Hook - 提供智能的上下文管理和感知能力
 * 
 * @param config 配置选项
 * @returns 上下文感知的状态和方法
 */
export const useContextAware = (config: ContextAwareConfig = {}) => {
  const {
    enableAutoExtraction = true,
    contextWindowSize = 4000,
    maxHistoryDepth = 10,
    enableRealTimeUpdates = true,
    compressionThreshold = 0.8
  } = config;

  // Store hooks
  const {
    documentContext,
    contextualMemory,
    conversationMemories,
    contextWindow,
    userPreferences,
    currentRole,
    activeSessionId,
    // Actions
    setDocumentContext,
    updateDocumentContext,
    addContextualMemory,
    getRelevantContext,
    getRelevantConversations,
    optimizeContextWindow,
    compressContext,
    generateContextualSuggestions,
    extractDocumentContext,
    analyzeConversationPatterns
  } = useAgentStore();

  // Local state
  const [contextState, setContextState] = useState<ContextAwareState>({
    currentContext: [],
    relevantHistory: [],
    documentInsights: {
      wordCount: 0,
      readabilityScore: 0,
      structureAnalysis: [],
      suggestions: []
    },
    isProcessing: false,
    lastUpdate: new Date()
  });

  const [editingContext, setEditingContext] = useState<EditingContext>({
    currentText: '',
    cursorPosition: 0,
    selectedText: '',
    surroundingContext: ''
  });

  // Refs for performance optimization
  const processingRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const lastTextRef = useRef('');

  /**
   * 自动提取当前编辑上下文
   */
  const extractCurrentContext = useCallback((
    text: string,
    cursorPos: number,
    selection?: string
  ) => {
    const contextRadius = 200; // 前后200字符作为上下文
    const start = Math.max(0, cursorPos - contextRadius);
    const end = Math.min(text.length, cursorPos + contextRadius);
    const surroundingContext = text.substring(start, end);

    // 分析当前段落和章节
    const paragraphs = text.split(/\n\s*\n/);
    let currentParagraph = '';
    let charCount = 0;
    
    for (const paragraph of paragraphs) {
      if (charCount + paragraph.length >= cursorPos) {
        currentParagraph = paragraph;
        break;
      }
      charCount += paragraph.length + 2; // +2 for line breaks
    }

    // 尝试识别当前章节
    const sectionPattern = /^#{1,6}\s+(.+)$/gm;
    const sections = text.match(sectionPattern) || [];
    let currentSection = '';
    let sectionLevel = 0;
    
    const textBeforeCursor = text.substring(0, cursorPos);
    const sectionMatches = textBeforeCursor.match(sectionPattern);
    if (sectionMatches && sectionMatches.length > 0) {
      const lastSection = sectionMatches[sectionMatches.length - 1];
      const levelMatch = lastSection.match(/^(#{1,6})/);
      sectionLevel = levelMatch ? levelMatch[1].length : 0;
      currentSection = lastSection.replace(/^#{1,6}\s+/, '');
    }

    const newEditingContext: EditingContext = {
      currentText: text,
      cursorPosition: cursorPos,
      selectedText: selection || '',
      surroundingContext,
      sectionInfo: currentSection ? {
        title: currentSection,
        level: sectionLevel,
        index: sections.length > 0 ? sections.findIndex(section => section.includes(currentSection)) : -1
      } : undefined
    };

    setEditingContext(newEditingContext);

    // 自动添加到上下文记忆
    if (enableAutoExtraction && activeSessionId) {
      addContextualMemory({
        sessionId: activeSessionId,
        content: `编辑上下文: ${surroundingContext.substring(0, 100)}...`,
        type: 'document',
        relevanceScore: 0.7,
        metadata: {
          cursorPosition: cursorPos,
          section: currentSection,
          characterCount: text.length
        }
      });
    }

    return newEditingContext;
  }, [activeSessionId, enableAutoExtraction, addContextualMemory]);

  /**
   * 智能上下文窗口管理
   */
  const manageContextWindow = useCallback(() => {
    if (contextWindow.currentTokens > contextWindow.maxTokens * compressionThreshold) {
      // 触发压缩
      compressContext(0.7);
      optimizeContextWindow();
    }
  }, [contextWindow, compressionThreshold, compressContext, optimizeContextWindow]);

  /**
   * 获取相关历史对话
   */
  const getRelevantHistoryForContext = useCallback((context: string, limit = 3) => {
    const relevant = getRelevantConversations(context, limit);
    setContextState(prev => ({
      ...prev,
      relevantHistory: relevant,
      lastUpdate: new Date()
    }));
    return relevant;
  }, [getRelevantConversations]);

  /**
   * 分析文档并提供洞察
   */
  const analyzeDocument = useCallback(async (paper?: Paper) => {
    if (!paper && !documentContext) return;

    setContextState(prev => ({ ...prev, isProcessing: true }));

    try {
      const docContext = paper ? extractDocumentContext(paper) : documentContext!;
      
      // 计算文档统计信息
      const wordCount = docContext.wordCount;
      const sentences = docContext.fullText.split(/[.!?]+/).length;
      const avgWordsPerSentence = sentences > 0 ? wordCount / sentences : 0;
      
      // 简单的可读性评分（基于平均句长）
      const readabilityScore = Math.max(0, Math.min(100, 100 - (avgWordsPerSentence - 15) * 2));
      
      // 结构分析
      const structureAnalysis = [
        `共 ${docContext.sections.length} 个章节`,
        `总字数: ${wordCount}`,
        `平均句长: ${avgWordsPerSentence.toFixed(1)} 词`,
        `可读性评分: ${readabilityScore.toFixed(0)}/100`
      ];

      // 生成改进建议
      const suggestions = generateContextualSuggestions(docContext.fullText);

      setContextState(prev => ({
        ...prev,
        documentInsights: {
          wordCount,
          readabilityScore,
          structureAnalysis,
          suggestions
        },
        isProcessing: false,
        lastUpdate: new Date()
      }));

    } catch (error) {
      console.error('文档分析失败:', error);
      setContextState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [documentContext, extractDocumentContext, generateContextualSuggestions]);

  /**
   * 实时更新上下文
   */
  const updateContext = useCallback((input: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (input === lastTextRef.current) return;
      lastTextRef.current = input;

      const relevantContext = getRelevantContext(input);
      setContextState(prev => ({
        ...prev,
        currentContext: relevantContext,
        lastUpdate: new Date()
      }));

      // 管理上下文窗口
      manageContextWindow();
    }, 300); // 300ms防抖
  }, [getRelevantContext, manageContextWindow]);

  /**
   * 获取上下文增强的建议
   */
  const getContextualSuggestions = useCallback((input: string) => {
    const relevantContext = getRelevantContext(input, 5);
    return generateContextualSuggestions(input, relevantContext);
  }, [getRelevantContext, generateContextualSuggestions]);

  /**
   * 设置文档上下文并分析
   */
  const setAndAnalyzeDocument = useCallback((paper: Paper) => {
    const docContext = extractDocumentContext(paper);
    setDocumentContext(docContext);
    analyzeDocument(paper);
  }, [extractDocumentContext, setDocumentContext, analyzeDocument]);

  /**
   * 获取智能写作建议
   */
  const getWritingSuggestions = useCallback(() => {
    if (!editingContext.currentText) return [];

    const context = editingContext.surroundingContext;
    const suggestions = [];

    // 基于用户偏好的建议
    if (userPreferences.writingStyle === 'academic') {
      // 学术写作检查
      if (context.includes('我觉得') || context.includes('我认为')) {
        suggestions.push({
          id: 'academic-tone-' + Date.now(),
          type: 'improvement' as const,
          title: '学术语调建议',
          content: '建议使用更客观的学术表达',
          confidence: 0.9
        });
      }
    }

    // 结构建议
    if (editingContext.sectionInfo) {
      const { level, title } = editingContext.sectionInfo;
      if (level > 3) {
        suggestions.push({
          id: 'structure-' + Date.now(),
          type: 'warning' as const,
          title: '结构层次',
          content: '当前章节层次较深，考虑重新组织结构',
          confidence: 0.75
        });
      }
    }

    return suggestions;
  }, [editingContext, userPreferences]);

  /**
   * 分析对话模式并更新偏好
   */
  const updateUserPreferencesFromPatterns = useCallback(() => {
    const patterns = analyzeConversationPatterns();
    
    if (patterns?.preferences?.frequentActions && patterns.preferences.frequentActions.length > 0) {
      // 自动更新用户偏好
      const updatedPreferences = {
        ...userPreferences,
        frequentActions: patterns.preferences.frequentActions
      };
      
      // 这里可以调用 updateUserPreferences，但为了避免循环依赖，我们返回分析结果
      return patterns;
    }
    
    return null;
  }, [analyzeConversationPatterns, userPreferences]);

  // Effects
  useEffect(() => {
    if (enableRealTimeUpdates && documentContext) {
      analyzeDocument();
    }
  }, [documentContext, enableRealTimeUpdates, analyzeDocument]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Memoized values
  const contextSummary = useMemo(() => ({
    totalMemories: contextualMemory.length,
    relevantContextCount: contextState.currentContext.length,
    historyDepth: contextState.relevantHistory.length,
    documentWordCount: contextState.documentInsights.wordCount,
    lastUpdate: contextState.lastUpdate
  }), [contextualMemory.length, contextState]);

  const isContextReady = useMemo(() => 
    !contextState.isProcessing && contextState.currentContext.length > 0,
    [contextState.isProcessing, contextState.currentContext.length]
  );

  return {
    // State
    contextState,
    editingContext,
    contextSummary,
    isContextReady,
    
    // Actions
    extractCurrentContext,
    updateContext,
    getRelevantHistoryForContext,
    analyzeDocument,
    getContextualSuggestions,
    setAndAnalyzeDocument,
    getWritingSuggestions,
    updateUserPreferencesFromPatterns,
    
    // Context management
    manageContextWindow,
    
    // Computed values
    currentContextCount: contextState.currentContext.length,
    hasDocumentContext: !!documentContext,
    processingStatus: contextState.isProcessing ? 'processing' : 'ready'
  };
};

export default useContextAware;