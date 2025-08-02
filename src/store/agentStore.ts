import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Agent, 
  AgentRole, 
  AgentMessage, 
  ChatSession, 
  AgentContext, 
  AgentSuggestion,
  QuickAction 
} from '../types';
import { AGENTS, QUICK_ACTIONS } from '../data/agents';

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
      }
    }),
    {
      name: 'agent-store',
      partialize: (state) => ({
        currentRole: state.currentRole,
        panelMode: state.panelMode,
        chatSessions: state.chatSessions,
        activeSessionId: state.activeSessionId,
        context: state.context
      })
    }
  )
);