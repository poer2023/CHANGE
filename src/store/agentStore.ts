import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Agent, 
  AgentRole, 
  AgentMessage, 
  ChatSession, 
  AgentContext, 
  AgentSuggestion,
  QuickAction,
  Paper 
} from '../types';
import { AGENTS, QUICK_ACTIONS } from '../data/agents';

// 扩展的上下文管理类型
export interface ContextualMemory {
  id: string;
  sessionId: string;
  content: string;
  type: 'document' | 'conversation' | 'preference' | 'action';
  timestamp: Date;
  relevanceScore: number;
  metadata?: Record<string, unknown>;
}

export interface UserPreferences {
  writingStyle: 'academic' | 'casual' | 'formal' | 'technical';
  preferredAgents: AgentRole[];
  frequentActions: string[];
  languageModel: string;
  responseLength: 'brief' | 'detailed' | 'comprehensive';
  expertise: string[];
  customPrompts: Record<string, string>;
}

export interface DocumentContext {
  paperId?: string;
  fullText: string;
  sections: Array<{
    id: string;
    title: string;
    content: string;
    level: number;
  }>;
  outline: string;
  wordCount: number;
  lastModified: Date;
  activeSection?: string;
  cursorPosition?: number;
  selectedText?: string;
}

export interface ConversationMemory {
  sessionId: string;
  messages: AgentMessage[];
  summary: string;
  keyTopics: string[];
  decisions: string[];
  unfinishedTasks: string[];
  contextRelevance: number;
}

export interface ContextWindow {
  maxTokens: number;
  currentTokens: number;
  prioritizedContext: ContextualMemory[];
  compressionRatio: number;
}

interface AgentStore {
  // 当前状态
  currentRole: AgentRole;
  currentAgent: Agent;
  isAgentPanelOpen: boolean;
  panelMode: 'chat' | 'agent';
  
  // 会话管理
  chatSessions: ChatSession[];
  activeSessionId: string | null;
  
  // 交互状态
  isLoading: boolean;
  selectedText: string;
  suggestions: AgentSuggestion[];
  
  // Agent上下文
  context: AgentContext;
  
  // 扩展的上下文管理
  contextualMemory: ContextualMemory[];
  userPreferences: UserPreferences;
  documentContext: DocumentContext | null;
  conversationMemories: ConversationMemory[];
  contextWindow: ContextWindow;
  crossSessionContext: Map<string, unknown>;
  
  // Actions
  setCurrentRole: (role: AgentRole) => void;
  toggleAgentPanel: () => void;
  setPanelMode: (mode: 'chat' | 'agent') => void;
  
  // 会话管理
  createChatSession: (role: AgentRole, title?: string) => ChatSession;
  setActiveSession: (sessionId: string | null) => void;
  updateSession: (sessionId: string, updates: Partial<ChatSession>) => void;
  deleteSession: (sessionId: string) => void;
  
  // 消息管理
  addMessage: (sessionId: string, message: AgentMessage) => void;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<AgentMessage>) => void;
  
  // 交互状态
  setLoading: (loading: boolean) => void;
  setSelectedText: (text: string) => void;
  addSuggestion: (suggestion: AgentSuggestion) => void;
  removeSuggestion: (suggestionId: string) => void;
  clearSuggestions: () => void;
  
  // 上下文管理
  updateContext: (updates: Partial<AgentContext>) => void;
  addRecentAction: (action: string) => void;
  
  // 快捷操作
  executeQuickAction: (action: QuickAction) => Promise<void>;
  
  // 智能建议
  generateSuggestions: (content: string, role: AgentRole) => AgentSuggestion[];
  
  // 数据持久化
  clearAllData: () => void;
  exportSessions: () => string;
  importSessions: (data: string) => void;
  
  // 上下文管理方法
  addContextualMemory: (memory: Omit<ContextualMemory, 'id' | 'timestamp'>) => void;
  getRelevantContext: (query: string, limit?: number) => ContextualMemory[];
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  setDocumentContext: (context: DocumentContext | null) => void;
  updateDocumentContext: (updates: Partial<DocumentContext>) => void;
  
  // 对话记忆管理
  saveConversationMemory: (sessionId: string) => void;
  getRelevantConversations: (topic: string, limit?: number) => ConversationMemory[];
  
  // 上下文窗口管理
  optimizeContextWindow: () => void;
  compressContext: (ratio: number) => void;
  prioritizeContext: (context: ContextualMemory[]) => ContextualMemory[];
  
  // 跨会话上下文
  setCrossSessionContext: <T>(key: string, value: T) => void;
  getCrossSessionContext: <T>(key: string) => T | undefined;
  
  // 智能上下文提取
  extractDocumentContext: (paper: Paper) => DocumentContext;
  analyzeConversationPatterns: () => { topics: string[]; preferences: Partial<UserPreferences> };
  
  // 上下文感知的建议生成
  generateContextualSuggestions: (input: string, context?: ContextualMemory[]) => AgentSuggestion[];
  
  // 会话持久化增强
  persistSession: (sessionId: string) => void;
  restoreSession: (sessionId: string) => void;
  
  // 辅助方法
  extractTopics: (messages: AgentMessage[]) => string[];
  generateSummary: (messages: AgentMessage[]) => string;
  extractDecisions: (messages: AgentMessage[]) => string[];
  extractTasks: (messages: AgentMessage[]) => string[];
  calculateRelevance: (messages: AgentMessage[]) => number;
}

export const useAgentStore = create<AgentStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentRole: 'academic-writing-expert',
      currentAgent: AGENTS['academic-writing-expert'],
      isAgentPanelOpen: false,
      panelMode: 'agent',
      
      chatSessions: [],
      activeSessionId: null,
      
      isLoading: false,
      selectedText: '',
      suggestions: [],
      
      context: {
        recentActions: [],
        conversationHistory: []
      },
      
      // 扩展的上下文管理初始状态
      contextualMemory: [],
      userPreferences: {
        writingStyle: 'academic',
        preferredAgents: ['academic-writing-expert'],
        frequentActions: [],
        languageModel: 'default',
        responseLength: 'detailed',
        expertise: [],
        customPrompts: {}
      },
      documentContext: null,
      conversationMemories: [],
      contextWindow: {
        maxTokens: 4000,
        currentTokens: 0,
        prioritizedContext: [],
        compressionRatio: 1.0
      },
      crossSessionContext: new Map(),
      
      // Role管理
      setCurrentRole: (role: AgentRole) => {
        set({
          currentRole: role,
          currentAgent: AGENTS[role]
        });
      },
      
      toggleAgentPanel: () => {
        set((state) => ({
          isAgentPanelOpen: !state.isAgentPanelOpen
        }));
      },
      
      setPanelMode: (mode: 'chat' | 'agent') => {
        set({ panelMode: mode });
      },
      
      // 会话管理
      createChatSession: (role: AgentRole, title?: string) => {
        const newSession: ChatSession = {
          id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          agentRole: role,
          title: title || `与${AGENTS[role].name}的对话`,
          messages: [],
          context: {
            recentActions: [],
            conversationHistory: []
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        };
        
        set((state) => ({
          chatSessions: [...state.chatSessions, newSession],
          activeSessionId: newSession.id
        }));
        
        return newSession;
      },
      
      setActiveSession: (sessionId: string | null) => {
        set({ activeSessionId: sessionId });
      },
      
      updateSession: (sessionId: string, updates: Partial<ChatSession>) => {
        set((state) => ({
          chatSessions: state.chatSessions.map(session =>
            session.id === sessionId
              ? { ...session, ...updates, updatedAt: new Date() }
              : session
          )
        }));
      },
      
      deleteSession: (sessionId: string) => {
        set((state) => ({
          chatSessions: state.chatSessions.filter(session => session.id !== sessionId),
          activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId
        }));
      },
      
      // 消息管理
      addMessage: (sessionId: string, message: AgentMessage) => {
        set((state) => ({
          chatSessions: state.chatSessions.map(session =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: [...session.messages, message],
                  updatedAt: new Date()
                }
              : session
          )
        }));
      },
      
      updateMessage: (sessionId: string, messageId: string, updates: Partial<AgentMessage>) => {
        set((state) => ({
          chatSessions: state.chatSessions.map(session =>
            session.id === sessionId
              ? {
                  ...session,
                  messages: session.messages.map(msg =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                  ),
                  updatedAt: new Date()
                }
              : session
          )
        }));
      },
      
      // 交互状态
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
      
      setSelectedText: (text: string) => {
        set({ selectedText: text });
      },
      
      addSuggestion: (suggestion: AgentSuggestion) => {
        set((state) => ({
          suggestions: [...state.suggestions, suggestion]
        }));
      },
      
      removeSuggestion: (suggestionId: string) => {
        set((state) => ({
          suggestions: state.suggestions.filter(s => s.id !== suggestionId)
        }));
      },
      
      clearSuggestions: () => {
        set({ suggestions: [] });
      },
      
      // 上下文管理
      updateContext: (updates: Partial<AgentContext>) => {
        set((state) => ({
          context: { ...state.context, ...updates }
        }));
      },
      
      addRecentAction: (action: string) => {
        set((state) => ({
          context: {
            ...state.context,
            recentActions: [action, ...state.context.recentActions].slice(0, 10)
          }
        }));
      },
      
      // 快捷操作
      executeQuickAction: async (action: QuickAction) => {
        const { setLoading, addRecentAction, addSuggestion, currentRole } = get();
        
        setLoading(true);
        addRecentAction(action.label);
        
        try {
          // 模拟异步操作
          await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
          
          // 根据操作类型生成相应的建议
          const suggestion = get().generateSuggestions(action.description, action.agentRole)[0];
          if (suggestion) {
            addSuggestion(suggestion);
          }
          
        } catch (error) {
          console.error('执行操作失败:', error);
        } finally {
          setLoading(false);
        }
      },
      
      // 智能建议生成
      generateSuggestions: (content: string, role: AgentRole): AgentSuggestion[] => {
        const suggestions: AgentSuggestion[] = [];
        
        // 根据不同角色生成不同类型的建议
        switch (role) {
          case 'academic-writing-expert':
            if (content.includes('我') || content.includes('觉得')) {
              suggestions.push({
                id: 'writing-' + Date.now(),
                type: 'improvement',
                title: '学术语言规范',
                content: '建议使用更客观的学术表达方式',
                confidence: 0.9
              });
            }
            break;
            
          case 'research-assistant':
            suggestions.push({
              id: 'research-' + Date.now(),
              type: 'enhancement',
              title: '研究方法建议',
              content: '基于您的研究问题，推荐适合的研究方法',
              confidence: 0.85
            });
            break;
            
          case 'format-expert':
            suggestions.push({
              id: 'format-' + Date.now(),
              type: 'warning',
              title: '格式检查',
              content: '发现可能的格式问题，建议进行检查',
              confidence: 0.88
            });
            break;
            
          case 'content-advisor':
            suggestions.push({
              id: 'content-' + Date.now(),
              type: 'improvement',
              title: '内容结构优化',
              content: '建议优化内容结构和逻辑连贯性',
              confidence: 0.87
            });
            break;
        }
        
        return suggestions;
      },
      
      // 数据管理
      clearAllData: () => {
        set({
          chatSessions: [],
          activeSessionId: null,
          suggestions: [],
          context: {
            recentActions: [],
            conversationHistory: []
          }
        });
      },
      
      exportSessions: () => {
        const { chatSessions, suggestions, context } = get();
        return JSON.stringify({
          chatSessions,
          suggestions,
          context,
          exportDate: new Date().toISOString()
        });
      },
      
      importSessions: (data: string) => {
        try {
          const parsed = JSON.parse(data);
          set({
            chatSessions: parsed.chatSessions || [],
            suggestions: parsed.suggestions || [],
            context: parsed.context || { recentActions: [], conversationHistory: [] }
          });
        } catch (error) {
          console.error('导入数据失败:', error);
        }
      },
      
      // 上下文管理方法实现
      addContextualMemory: (memory: Omit<ContextualMemory, 'id' | 'timestamp'>) => {
        const newMemory: ContextualMemory = {
          ...memory,
          id: `memory-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date()
        };
        
        set((state) => ({
          contextualMemory: [...state.contextualMemory, newMemory].slice(-100) // 保持最近100条记忆
        }));
      },
      
      getRelevantContext: (query: string, limit = 5): ContextualMemory[] => {
        const { contextualMemory } = get();
        const queryLower = query.toLowerCase();
        
        // 简单的相关性评分（实际应用中可以使用更复杂的算法）
        const scoredMemories = contextualMemory.map(memory => ({
          ...memory,
          score: memory.content.toLowerCase().includes(queryLower) ? 
            memory.relevanceScore * 2 : memory.relevanceScore
        }));
        
        return scoredMemories
          .sort((a, b) => b.score - a.score)
          .slice(0, limit);
      },
      
      updateUserPreferences: (preferences: Partial<UserPreferences>) => {
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences }
        }));
      },
      
      setDocumentContext: (context: DocumentContext | null) => {
        set({ documentContext: context });
        
        // 自动添加文档上下文到记忆中
        if (context) {
          get().addContextualMemory({
            sessionId: get().activeSessionId || 'global',
            content: `文档: ${context.outline}`,
            type: 'document',
            relevanceScore: 0.9,
            metadata: { paperId: context.paperId, wordCount: context.wordCount }
          });
        }
      },
      
      updateDocumentContext: (updates: Partial<DocumentContext>) => {
        set((state) => ({
          documentContext: state.documentContext ? 
            { ...state.documentContext, ...updates, lastModified: new Date() } : 
            null
        }));
      },
      
      saveConversationMemory: (sessionId: string) => {
        const { chatSessions } = get();
        const session = chatSessions.find(s => s.id === sessionId);
        
        if (!session) return;
        
        const messages = session.messages;
        const keyTopics = get().extractTopics(messages);
        const summary = get().generateSummary(messages);
        
        const memory: ConversationMemory = {
          sessionId,
          messages,
          summary,
          keyTopics,
          decisions: get().extractDecisions(messages),
          unfinishedTasks: get().extractTasks(messages),
          contextRelevance: get().calculateRelevance(messages)
        };
        
        set((state) => ({
          conversationMemories: [...state.conversationMemories, memory].slice(-20) // 保持最近20个对话记忆
        }));
      },
      
      getRelevantConversations: (topic: string, limit = 3): ConversationMemory[] => {
        const { conversationMemories } = get();
        const topicLower = topic.toLowerCase();
        
        return conversationMemories
          .filter(memory => 
            memory.keyTopics.some(t => t.toLowerCase().includes(topicLower)) ||
            memory.summary.toLowerCase().includes(topicLower)
          )
          .sort((a, b) => b.contextRelevance - a.contextRelevance)
          .slice(0, limit);
      },
      
      optimizeContextWindow: () => {
        const { contextualMemory, contextWindow } = get();
        const prioritized = get().prioritizeContext(contextualMemory);
        
        let currentTokens = 0;
        const optimized: ContextualMemory[] = [];
        
        for (const context of prioritized) {
          const tokens = Math.ceil(context.content.length / 4); // 粗略估算token数
          if (currentTokens + tokens <= contextWindow.maxTokens) {
            optimized.push(context);
            currentTokens += tokens;
          } else {
            break;
          }
        }
        
        set((state) => ({
          contextWindow: {
            ...state.contextWindow,
            prioritizedContext: optimized,
            currentTokens
          }
        }));
      },
      
      compressContext: (ratio: number) => {
        const { contextualMemory } = get();
        const compressed = contextualMemory.map(memory => ({
          ...memory,
          content: memory.content.substring(0, Math.floor(memory.content.length * ratio))
        }));
        
        set((state) => ({
          contextualMemory: compressed,
          contextWindow: {
            ...state.contextWindow,
            compressionRatio: ratio
          }
        }));
      },
      
      prioritizeContext: (context: ContextualMemory[]): ContextualMemory[] => {
        const now = new Date().getTime();
        
        return context.sort((a, b) => {
          // 计算时间衰减分数
          const aAge = now - a.timestamp.getTime();
          const bAge = now - b.timestamp.getTime();
          const aTimeScore = Math.exp(-aAge / (1000 * 60 * 60 * 24)); // 24小时衰减
          const bTimeScore = Math.exp(-bAge / (1000 * 60 * 60 * 24));
          
          // 综合分数 = 相关性分数 * 时间分数
          const aScore = a.relevanceScore * aTimeScore;
          const bScore = b.relevanceScore * bTimeScore;
          
          return bScore - aScore;
        });
      },
      
      setCrossSessionContext: <T>(key: string, value: T) => {
        set((state) => {
          const newMap = new Map(state.crossSessionContext);
          newMap.set(key, value);
          return { crossSessionContext: newMap };
        });
      },
      
      getCrossSessionContext: <T>(key: string): T | undefined => {
        const { crossSessionContext } = get();
        return crossSessionContext.get(key) as T | undefined;
      },
      
      extractDocumentContext: (paper: Paper): DocumentContext => {
        return {
          paperId: paper.id,
          fullText: paper.content,
          sections: paper.sections?.map(section => ({
            id: section.id,
            title: section.title,
            content: section.content,
            level: section.level
          })) || [],
          outline: paper.sections?.map(s => `${'  '.repeat(s.level - 1)}${s.title}`).join('\n') || '',
          wordCount: paper.wordCount,
          lastModified: new Date()
        };
      },
      
      analyzeConversationPatterns: () => {
        const { conversationMemories, contextualMemory } = get();
        
        // 分析话题频率
        const topicCounts = new Map<string, number>();
        conversationMemories.forEach(memory => {
          memory.keyTopics.forEach(topic => {
            topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1);
          });
        });
        
        const topics = Array.from(topicCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([topic]) => topic);
        
        // 分析用户偏好
        const actionCounts = new Map<string, number>();
        contextualMemory
          .filter(m => m.type === 'action')
          .forEach(memory => {
            actionCounts.set(memory.content, (actionCounts.get(memory.content) || 0) + 1);
          });
        
        const frequentActions = Array.from(actionCounts.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([action]) => action);
        
        return {
          topics,
          preferences: { frequentActions }
        };
      },
      
      generateContextualSuggestions: (input: string, context?: ContextualMemory[]): AgentSuggestion[] => {
        const { userPreferences, documentContext } = get();
        const relevantContext = context || get().getRelevantContext(input);
        
        const suggestions: AgentSuggestion[] = [];
        
        // 基于用户偏好的建议
        if (userPreferences.writingStyle === 'academic' && input.includes('我认为')) {
          suggestions.push({
            id: 'academic-style-' + Date.now(),
            type: 'improvement',
            title: '学术写作建议',
            content: '建议使用更客观的表达方式，如"研究表明"、"数据显示"',
            confidence: 0.9
          });
        }
        
        // 基于文档上下文的建议
        if (documentContext && input.length > 100) {
          suggestions.push({
            id: 'structure-' + Date.now(),
            type: 'enhancement',
            title: '结构建议',
            content: '当前段落较长，建议考虑分段以提高可读性',
            confidence: 0.85
          });
        }
        
        // 基于历史上下文的建议
        relevantContext.forEach(memory => {
          if (memory.type === 'conversation' && memory.relevanceScore > 0.8) {
            suggestions.push({
              id: 'context-' + Date.now(),
              type: 'enhancement',
              title: '相关讨论',
              content: `之前讨论过类似话题: ${memory.content.substring(0, 50)}...`,
              confidence: memory.relevanceScore
            });
          }
        });
        
        return suggestions;
      },
      
      persistSession: (sessionId: string) => {
        const { chatSessions } = get();
        const session = chatSessions.find(s => s.id === sessionId);
        
        if (session) {
          // 保存到 localStorage 或其他持久化存储
          localStorage.setItem(`session-${sessionId}`, JSON.stringify(session));
          get().saveConversationMemory(sessionId);
        }
      },
      
      restoreSession: (sessionId: string) => {
        try {
          const sessionData = localStorage.getItem(`session-${sessionId}`);
          if (sessionData) {
            const session = JSON.parse(sessionData);
            set((state) => ({
              chatSessions: [...state.chatSessions.filter(s => s.id !== sessionId), session],
              activeSessionId: sessionId
            }));
          }
        } catch (error) {
          console.error('恢复会话失败:', error);
        }
      },
      
      // 辅助方法
      extractTopics: (messages: AgentMessage[]): string[] => {
        // 简单的话题提取（实际应用中可以使用NLP技术）
        const topics = new Set<string>();
        messages.forEach(message => {
          const words = message.content.split(/\s+/).filter(word => word.length > 3);
          words.forEach(word => topics.add(word.toLowerCase()));
        });
        return Array.from(topics).slice(0, 5);
      },
      
      generateSummary: (messages: AgentMessage[]): string => {
        // 简单的总结生成
        const content = messages.map(m => m.content).join(' ');
        return content.length > 200 ? content.substring(0, 200) + '...' : content;
      },
      
      extractDecisions: (messages: AgentMessage[]): string[] => {
        // 提取决策信息
        return messages
          .filter(m => m.content.includes('决定') || m.content.includes('选择'))
          .map(m => m.content)
          .slice(0, 3);
      },
      
      extractTasks: (messages: AgentMessage[]): string[] => {
        // 提取未完成任务
        return messages
          .filter(m => m.content.includes('需要') || m.content.includes('待完成'))
          .map(m => m.content)
          .slice(0, 3);
      },
      
      calculateRelevance: (messages: AgentMessage[]): number => {
        // 计算对话相关性分数
        return Math.min(0.9, messages.length * 0.1);
      }
    }),
    {
      name: 'agent-store',
      partialize: (state) => ({
        currentRole: state.currentRole,
        panelMode: state.panelMode,
        chatSessions: state.chatSessions,
        activeSessionId: state.activeSessionId,
        context: state.context,
        contextualMemory: state.contextualMemory,
        userPreferences: state.userPreferences,
        documentContext: state.documentContext,
        conversationMemories: state.conversationMemories,
        contextWindow: state.contextWindow
        // crossSessionContext 不持久化，因为Map类型序列化复杂
      })
    }
  )
);