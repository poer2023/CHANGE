import React, { useState, useRef, useEffect } from 'react';
import { Agent, AgentRole, AgentMessage, ChatSession, QuickAction } from '../../types';
import { AGENTS, QUICK_ACTIONS, MOCK_RESPONSES } from '../../data/agents';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import AgentRoleSwitcher from './AgentRoleSwitcher';
import ChatInterface from './ChatInterface';
import QuickActionBar from './QuickActionBar';
import AgentSuggestionCard from './AgentSuggestionCard';

interface AgentPanelProps {
  className?: string;
}

type PanelMode = 'chat' | 'agent';

const AgentPanel: React.FC<AgentPanelProps> = ({ className = '' }) => {
  const [currentRole, setCurrentRole] = useState<AgentRole>('academic-writing-expert');
  const [panelMode, setPanelMode] = useState<PanelMode>('agent');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState<string>('');
  
  const currentAgent = AGENTS[currentRole];
  const activeSession = chatSessions.find(session => session.id === activeSessionId);

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

  // 发送消息
  const sendMessage = async (content: string, messageType: AgentMessage['messageType'] = 'text') => {
    if (!activeSession) {
      createNewSession(currentRole);
      return;
    }

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

    // 模拟AI响应
    setTimeout(() => {
      const aiResponse: AgentMessage = {
        id: `msg-${Date.now()}-ai`,
        content: generateAIResponse(content, currentRole),
        role: 'assistant',
        timestamp: new Date(),
        messageType: 'text',
        agentRole: currentRole,
        suggestions: generateSuggestions(content, currentRole),
        actions: generateActions(content, currentRole)
      };

      setChatSessions(prev => prev.map(session => 
        session.id === activeSessionId
          ? {
              ...session,
              messages: [...session.messages, userMessage, aiResponse],
              updatedAt: new Date()
            }
          : session
      ));

      setIsLoading(false);
    }, 1000 + Math.random() * 1500); // 1-2.5秒随机延迟
  };

  // 执行快捷操作
  const executeQuickAction = async (action: QuickAction) => {
    if (!activeSession && panelMode === 'chat') {
      createNewSession(action.agentRole, `${action.label}咨询`);
    }

    setIsLoading(true);
    setCurrentRole(action.agentRole);

    // 模拟处理时间
    setTimeout(() => {
      const mockResponse = MOCK_RESPONSES[action.id as keyof typeof MOCK_RESPONSES];
      
      if (mockResponse) {
        const actionMessage: AgentMessage = {
          id: `msg-${Date.now()}-action`,
          content: `正在执行"${action.label}"...`,
          role: 'assistant',
          timestamp: new Date(),
          messageType: 'action',
          agentRole: action.agentRole,
          suggestions: mockResponse.suggestions,
          actions: mockResponse.actions
        };

        if (panelMode === 'chat' && activeSession) {
          setChatSessions(prev => prev.map(session => 
            session.id === activeSessionId
              ? {
                  ...session,
                  messages: [...session.messages, actionMessage],
                  updatedAt: new Date()
                }
              : session
          ));
        }
      }

      setIsLoading(false);
    }, 800 + Math.random() * 1200);
  };

  // 生成AI响应
  const generateAIResponse = (userInput: string, role: AgentRole): string => {
    const responses = {
      'academic-writing-expert': [
        '我来帮您提升学术写作质量。根据您的描述，我建议从以下几个方面优化：',
        '作为学术写作专家，我注意到您的表达可以更加严谨。让我为您提供一些建议：',
        '从学术规范的角度来看，这段内容有几个需要改进的地方：'
      ],
      'research-assistant': [
        '我来协助您的研究工作。基于您的需求，我推荐以下研究方法：',
        '作为您的研究助手，我可以帮您找到相关的文献和数据源：',
        '让我分析一下您的研究问题，并提供一些建议：'
      ],
      'format-expert': [
        '我来检查您的格式规范。发现以下需要调整的地方：',
        '从格式标准来看，这里有几个需要注意的细节：',
        '让我帮您确保文档符合学术出版的格式要求：'
      ],
      'content-advisor': [
        '我来分析您的内容结构。总体来说，逻辑清晰，但有几个可以强化的地方：',
        '从内容策略的角度，我建议调整以下部分：',
        '让我帮您优化论证结构和内容组织：'
      ]
    };

    const roleResponses = responses[role];
    return roleResponses[Math.floor(Math.random() * roleResponses.length)];
  };

  // 生成建议
  const generateSuggestions = (userInput: string, role: AgentRole) => {
    // 这里可以根据用户输入和角色生成相应的建议
    return [];
  };

  // 生成操作
  const generateActions = (userInput: string, role: AgentRole) => {
    // 这里可以根据用户输入和角色生成相应的操作
    return [];
  };

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
            selectedText={selectedText}
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

              {/* 显示最近的建议 */}
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