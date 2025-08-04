import React, { useState, useRef, useEffect } from 'react';
import { Agent, AgentRole, AgentMessage, ChatSession, QuickAction } from '../../types';
import { AGENTS, QUICK_ACTIONS } from '../../data/agents';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import AgentRoleSwitcher from './AgentRoleSwitcher';
import ChatInterface from './ChatInterface';
import QuickActionBar from './QuickActionBar';
import AgentSuggestionCard from './AgentSuggestionCard';
import glmClient from '../../services/glmClient';

interface AgentPanelProps {
  className?: string;
  selectedText?: string;
  documentContext?: string;
  content?: string;
  onContentChange?: (content: string) => void;
  onInsertText?: (text: string) => void;
  onApplySuggestion?: (suggestion: string) => void;
}

type PanelMode = 'chat' | 'agent';

const AgentPanel: React.FC<AgentPanelProps> = ({ 
  className = '', 
  selectedText: propSelectedText = '',
  documentContext = '',
  content = '',
  onContentChange,
  onInsertText,
  onApplySuggestion
}) => {
  const [currentRole, setCurrentRole] = useState<AgentRole>('academic-writing-expert');
  const [panelMode, setPanelMode] = useState<PanelMode>('agent');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSelectedText, setCurrentSelectedText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  
  const currentAgent = AGENTS[currentRole];
  const activeSession = chatSessions.find(session => session.id === activeSessionId);

  // 获取文档上下文
  const getDocumentContext = (): string => {
    // 优先使用传入的文档上下文，其次是内容，然后是选中文本，最后使用默认文本
    return documentContext || content || propSelectedText || '当前文档内容...';
  };

  // 创建新的对话会话
  const createNewSession = (role: AgentRole, title?: string) => {
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

    setChatSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    return newSession;
  };

  // 发送消息 - 使用真实GLM API
  const sendMessage = async (content: string, messageType: AgentMessage['messageType'] = 'text') => {
    if (!activeSession) {
      const newSession = createNewSession(currentRole);
      // 等待状态更新
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    const session = activeSession || chatSessions.find(s => s.agentRole === currentRole);
    if (!session) return;

    setIsLoading(true);

    // 添加用户消息
    const userMessage: AgentMessage = {
      id: `msg-${Date.now()}-user`,
      content,
      role: 'user',
      timestamp: new Date(),
      messageType,
      agentRole: currentRole
    };

    // 立即更新用户消息
    setChatSessions(prev => prev.map(s => 
      s.id === session.id
        ? {
            ...s,
            messages: [...s.messages, userMessage],
            updatedAt: new Date()
          }
        : s
    ));

    try {
      // 调用真实GLM API
      const response = await glmClient.agentChat(currentRole, content, propSelectedText);
      
      const aiResponse: AgentMessage = {
        id: `msg-${Date.now()}-ai`,
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        messageType: 'text',
        agentRole: currentRole,
        suggestions: [], // GLM响应中可以解析建议
        actions: [] // GLM响应中可以解析操作
      };

      setChatSessions(prev => prev.map(s => 
        s.id === session.id
          ? {
              ...s,
              messages: [...s.messages.filter(m => m.id !== userMessage.id), userMessage, aiResponse],
              updatedAt: new Date()
            }
          : s
      ));

    } catch (error) {
      console.error('GLM API调用失败:', error);
      
      // 显示错误消息
      const errorMessage: AgentMessage = {
        id: `msg-${Date.now()}-error`,
        content: `抱歉，AI服务暂时不可用。错误信息: ${error instanceof Error ? error.message : '未知错误'}`,
        role: 'assistant',
        timestamp: new Date(),
        messageType: 'text',
        agentRole: currentRole
      };

      setChatSessions(prev => prev.map(s => 
        s.id === session.id
          ? {
              ...s,
              messages: [...s.messages.filter(m => m.id !== userMessage.id), userMessage, errorMessage],
              updatedAt: new Date()
            }
          : s
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // 执行快捷操作 - 使用真实GLM API
  const executeQuickAction = async (action: QuickAction) => {
    if (!activeSession && panelMode === 'chat') {
      createNewSession(action.agentRole, `${action.label}咨询`);
    }

    setIsLoading(true);
    setCurrentRole(action.agentRole);

    try {
      // 获取当前文档内容作为上下文
      const documentContext = getDocumentContext();
      
      // 调用真实GLM API执行快捷操作
      const response = await glmClient.executeQuickAction(action, documentContext, propSelectedText);
      
      const actionMessage: AgentMessage = {
        id: `msg-${Date.now()}-action`,
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        messageType: 'action',
        agentRole: action.agentRole,
        suggestions: [], // 可以从响应中解析建议
        actions: [{
          id: `apply-${action.id}`,
          type: 'apply-suggestion',
          label: '应用建议',
          description: '将AI建议应用到文档中',
          icon: '✅'
        }]
      };

      if (panelMode === 'chat' && (activeSession || chatSessions.length > 0)) {
        const targetSession = activeSession || chatSessions.find(s => s.agentRole === action.agentRole);
        if (targetSession) {
          setChatSessions(prev => prev.map(session => 
            session.id === targetSession.id
              ? {
                  ...session,
                  messages: [...session.messages, actionMessage],
                  updatedAt: new Date()
                }
              : session
          ));
        }
      }

    } catch (error) {
      console.error('快捷操作执行失败:', error);
      
      // 显示错误消息
      const errorMessage: AgentMessage = {
        id: `msg-${Date.now()}-error`,
        content: `执行"${action.label}"失败。错误信息: ${error instanceof Error ? error.message : '未知错误'}`,
        role: 'assistant',
        timestamp: new Date(),
        messageType: 'action',
        agentRole: action.agentRole
      };

      if (panelMode === 'chat' && (activeSession || chatSessions.length > 0)) {
        const targetSession = activeSession || chatSessions.find(s => s.agentRole === action.agentRole);
        if (targetSession) {
          setChatSessions(prev => prev.map(session => 
            session.id === targetSession.id
              ? {
                  ...session,
                  messages: [...session.messages, errorMessage],
                  updatedAt: new Date()
                }
              : session
          ));
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 监听选中文本变化
  useEffect(() => {
    const handleTextSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString() || '';
      setCurrentSelectedText(selectedText);
    };

    document.addEventListener('selectionchange', handleTextSelection);
    return () => {
      document.removeEventListener('selectionchange', handleTextSelection);
    };
  }, []);

  // 切换角色时创建新会话
  const handleRoleChange = (newRole: AgentRole) => {
    setCurrentRole(newRole);
    if (panelMode === 'chat') {
      createNewSession(newRole);
    }
  };

  // 切换模式
  const handleModeChange = (mode: PanelMode) => {
    setPanelMode(mode);
    if (mode === 'chat' && !activeSession) {
      createNewSession(currentRole);
    }
  };

  // 处理建议操作
  const handleSuggestionAction = (action: any) => {
    if (action.type === 'apply-suggestion' && action.content) {
      if (onApplySuggestion) {
        onApplySuggestion(action.content);
      } else if (onInsertText) {
        onInsertText(action.content);
      }
    }
  };

  // 处理建议关闭
  const handleSuggestionDismiss = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  return (
    <div className={`flex flex-col h-full bg-white border-l border-gray-200 ${className}`}>
      {/* 顶部标题栏 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">AI助手</span>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span>在线</span>
          </div>
        </div>
        
        {/* 模式切换器 */}
        <div className="flex items-center space-x-1 p-1 bg-gray-100 rounded-lg">
          <Button
            variant={panelMode === 'chat' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeChange('chat')}
            className="px-3 py-1 text-xs"
          >
            Chat
          </Button>
          <Button
            variant={panelMode === 'agent' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeChange('agent')}
            className="px-3 py-1 text-xs"
          >
            Agent
          </Button>
        </div>
      </div>

      {/* Agent角色切换器 */}
      <div className="p-4 border-b border-gray-200">
        <AgentRoleSwitcher
          currentRole={currentRole}
          onRoleChange={handleRoleChange}
          agents={AGENTS}
        />
      </div>

      {/* 快捷操作栏 */}
      <div className="p-4 border-b border-gray-200">
        <QuickActionBar
          actions={QUICK_ACTIONS.filter(action => action.agentRole === currentRole)}
          onActionClick={executeQuickAction}
          isLoading={isLoading}
          selectedText={propSelectedText}
          documentContext={getDocumentContext()}
        />
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {panelMode === 'chat' ? (
          <ChatInterface
            session={activeSession}
            agent={currentAgent}
            onSendMessage={sendMessage}
            isLoading={isLoading}
            selectedText={propSelectedText}
          />
        ) : (
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Agent模式下的建议卡片 */}
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="text-4xl mb-2">{currentAgent.avatar}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {currentAgent.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {currentAgent.description}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentAgent.capabilities.map((capability, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {capability}
                    </span>
                  ))}
                </div>
              </div>

              {/* 显示建议卡片 */}
              {suggestions.map((suggestion) => (
                <AgentSuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onActionClick={handleSuggestionAction}
                  onDismiss={handleSuggestionDismiss}
                />
              ))}

              {/* 显示加载状态 */}
              {isLoading && (
                <Card className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600">AI正在分析...</span>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentPanel;