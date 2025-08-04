import React, { useState, useEffect } from 'react';
import { Agent, AgentMessage, ChatSession } from '../../types';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import ChatInterface from './ChatInterface';
import glmClient from '../../services/glmClient';

interface AcademicWritingExpertProps {
  className?: string;
  initialContext?: string;
  selectedText?: string;
  onApplySuggestion?: (suggestion: string) => void;
}

const AcademicWritingExpert: React.FC<AcademicWritingExpertProps> = ({
  className = '',
  initialContext = '',
  selectedText = '',
  onApplySuggestion
}) => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [writingStats, setWritingStats] = useState({
    wordsAnalyzed: 0,
    issuesFound: 0,
    suggestionsProvided: 0
  });

  const agent: Agent = {
    id: 'academic-writing-expert',
    role: 'academic-writing-expert',
    name: '学术写作专家',
    description: '专注于学术写作规范、语言表达和论文结构优化',
    avatar: '👨‍🎓',
    capabilities: [
      '学术语言润色',
      '论文结构优化',
      '写作风格指导',
      '语法检查',
      '逻辑连贯性分析'
    ],
    expertise: [
      '学术写作规范',
      '论文结构设计',
      '科学表达',
      '批判性思维',
      '文献综述写作'
    ],
    isActive: true
  };

  // 写作改进建议模板
  const improvementTemplates = [
    {
      id: 'language-polish',
      title: '语言润色',
      description: '提升学术表达的准确性和流畅性',
      icon: '✨',
      prompt: '请对以下文本进行学术语言润色，重点关注：\n1. 使用更准确的学术词汇\n2. 改善句式结构\n3. 增强表达的严谨性\n4. 保持学术写作的正式语调'
    },
    {
      id: 'structure-optimize',
      title: '结构优化',
      description: '改善段落结构和逻辑组织',
      icon: '🏗️',
      prompt: '请分析以下文本的结构并提供优化建议：\n1. 段落间的逻辑关系\n2. 内容组织的合理性\n3. 过渡句的使用\n4. 整体结构的改进方案'
    },
    {
      id: 'argument-strengthen',
      title: '论证强化',
      description: '增强论证的逻辑性和说服力',
      icon: '🎯',
      prompt: '请评估以下论证的强度并提供改进建议：\n1. 论点是否清晰明确\n2. 证据是否充分有力\n3. 推理过程是否严密\n4. 如何加强论证效果'
    },
    {
      id: 'clarity-improve',
      title: '表达清晰度',
      description: '提高表达的清晰度和可读性',
      icon: '🔍',
      prompt: '请分析以下文本的清晰度并提供改进建议：\n1. 是否存在模糊表达\n2. 专业术语使用是否恰当\n3. 句子长度是否合适\n4. 如何提高可读性'
    }
  ];

  // 创建会话
  useEffect(() => {
    if (!session) {
      const newSession: ChatSession = {
        id: `session-writing-expert-${Date.now()}`,
        agentRole: 'academic-writing-expert',
        title: '与学术写作专家的对话',
        messages: [],
        context: {
          recentActions: [],
          conversationHistory: []
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true
      };
      setSession(newSession);
    }
  }, []);

  // 发送消息
  const handleSendMessage = async (content: string, messageType: AgentMessage['messageType'] = 'text') => {
    if (!session) return;

    setIsLoading(true);

    // 添加用户消息
    const userMessage: AgentMessage = {
      id: `msg-${Date.now()}-user`,
      content,
      role: 'user',
      timestamp: new Date(),
      messageType,
      agentRole: 'academic-writing-expert'
    };

    setSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage],
      updatedAt: new Date()
    } : null);

    try {
      // 调用GLM API
      const response = await glmClient.agentChat('academic-writing-expert', content, selectedText || initialContext);
      
      const aiResponse: AgentMessage = {
        id: `msg-${Date.now()}-ai`,
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        messageType: 'text',
        agentRole: 'academic-writing-expert'
      };

      setSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, aiResponse],
        updatedAt: new Date()
      } : null);

      // 更新统计
      setWritingStats(prev => ({
        ...prev,
        wordsAnalyzed: prev.wordsAnalyzed + content.length,
        suggestionsProvided: prev.suggestionsProvided + 1
      }));

    } catch (error) {
      console.error('学术写作专家API调用失败:', error);
      
      const errorMessage: AgentMessage = {
        id: `msg-${Date.now()}-error`,
        content: `抱歉，服务暂时不可用。错误信息: ${error instanceof Error ? error.message : '未知错误'}`,
        role: 'assistant',
        timestamp: new Date(),
        messageType: 'text',
        agentRole: 'academic-writing-expert'
      };

      setSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, errorMessage],
        updatedAt: new Date()
      } : null);
    } finally {
      setIsLoading(false);
    }
  };

  // 快速改进分析
  const handleQuickImprovement = async (template: typeof improvementTemplates[0]) => {
    if (!selectedText && !initialContext) {
      await handleSendMessage('请先选择文本或提供内容进行分析。');
      return;
    }

    const content = selectedText || initialContext;
    const fullPrompt = `${template.prompt}\n\n文本内容：\n${content}`;
    
    await handleSendMessage(fullPrompt);
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* 专家信息头部 */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{agent.avatar}</div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{agent.name}</h2>
            <p className="text-sm text-gray-600">{agent.description}</p>
          </div>
        </div>
        
        {/* 统计信息 */}
        <div className="flex space-x-4 mt-3 text-xs">
          <div className="bg-white px-2 py-1 rounded">
            <span className="text-gray-500">已分析: </span>
            <span className="font-medium text-blue-600">{writingStats.wordsAnalyzed}</span>
            <span className="text-gray-500"> 字</span>
          </div>
          <div className="bg-white px-2 py-1 rounded">
            <span className="text-gray-500">建议数: </span>
            <span className="font-medium text-green-600">{writingStats.suggestionsProvided}</span>
          </div>
        </div>
      </div>

      {/* 快速改进工具 */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">快速改进工具</h3>
        <div className="grid grid-cols-2 gap-2">
          {improvementTemplates.map((template) => (
            <Button
              key={template.id}
              variant="outline"
              size="sm"
              onClick={() => handleQuickImprovement(template)}
              disabled={isLoading}
              className="flex flex-col items-center p-3 h-auto text-center"
            >
              <div className="text-lg mb-1">{template.icon}</div>
              <div className="text-xs font-medium">{template.title}</div>
              <div className="text-xs opacity-75 mt-1 leading-tight">
                {template.description}
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* 选中文本显示 */}
      {selectedText && (
        <div className="p-3 bg-yellow-50 border-b border-yellow-200">
          <div className="text-xs text-yellow-800">
            <p className="font-medium mb-1">当前分析文本：</p>
            <p className="text-xs bg-white p-2 rounded border max-h-16 overflow-y-auto">
              {selectedText.length > 200 ? `${selectedText.substring(0, 200)}...` : selectedText}
            </p>
          </div>
        </div>
      )}

      {/* 聊天界面 */}
      <div className="flex-1 min-h-0">
        <ChatInterface
          session={session || undefined}
          agent={agent}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          selectedText={selectedText}
          enableStreaming={true}
        />
      </div>

      {/* 专业功能提示 */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-1">💡 专业提示：</p>
          <p>我可以帮您：</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>润色学术语言表达</li>
            <li>优化论文结构布局</li>
            <li>检查语法和用词</li>
            <li>增强论证逻辑性</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AcademicWritingExpert;