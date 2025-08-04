import React, { useState, useEffect } from 'react';
import { Agent, AgentMessage, ChatSession } from '../../types';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import ChatInterface from './ChatInterface';
import glmClient from '../../services/glmClient';

interface ResearchAssistantProps {
  className?: string;
  initialContext?: string;
  selectedText?: string;
  onApplySuggestion?: (suggestion: string) => void;
}

const ResearchAssistant: React.FC<ResearchAssistantProps> = ({
  className = '',
  initialContext = '',
  selectedText = '',
  onApplySuggestion
}) => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [researchStats, setResearchStats] = useState({
    literatureSearched: 0,
    methodsRecommended: 0,
    dataAnalyzed: 0
  });

  const agent: Agent = {
    id: 'research-assistant',
    role: 'research-assistant',
    name: '研究助手',
    description: '协助文献检索、数据分析和研究方法指导',
    avatar: '🔬',
    capabilities: [
      '文献检索建议',
      '研究方法指导',
      '数据分析协助',
      '实验设计建议',
      '统计分析指导'
    ],
    expertise: [
      '文献管理',
      '研究方法论',
      '数据收集',
      '统计分析',
      '实证研究'
    ],
    isActive: true
  };

  // 研究工具模板
  const researchTools = [
    {
      id: 'literature-search',
      title: '文献检索',
      description: '推荐相关文献和数据库',
      icon: '📚',
      prompt: '请基于以下研究主题或内容，推荐相关的高质量学术文献：\n1. 核心期刊论文（近5年）\n2. 经典理论文献\n3. 最新研究进展\n4. 相关综述文章\n5. 数据库和检索策略'
    },
    {
      id: 'methodology-design',
      title: '方法论设计',
      description: '设计研究方法和实验方案',
      icon: '⚗️',
      prompt: '请为以下研究问题设计合适的研究方法：\n1. 研究设计类型选择\n2. 数据收集方法\n3. 样本大小和抽样方法\n4. 变量控制策略\n5. 研究流程规划'
    },
    {
      id: 'data-analysis',
      title: '数据分析',
      description: '数据分析方法和统计检验',
      icon: '📊',
      prompt: '请针对以下数据或研究问题，推荐合适的分析方法：\n1. 描述性统计分析\n2. 推断性统计方法\n3. 多变量分析技术\n4. 数据可视化建议\n5. 结果解释指导'
    },
    {
      id: 'research-gap',
      title: '研究空白分析',
      description: '识别研究空白和创新点',
      icon: '🔍',
      prompt: '请分析以下研究领域的现状，识别研究空白：\n1. 当前研究的局限性\n2. 未解决的关键问题\n3. 新的研究方向\n4. 方法论创新机会\n5. 实践应用潜力'
    },
    {
      id: 'theory-framework',
      title: '理论框架',
      description: '构建理论框架和概念模型',
      icon: '🏗️',
      prompt: '请帮助构建研究的理论框架：\n1. 相关理论基础\n2. 概念关系模型\n3. 假设提出依据\n4. 理论整合方案\n5. 框架验证方法'
    },
    {
      id: 'quality-validation',
      title: '研究质量',
      description: '研究信度效度和质量评估',
      icon: '✅',
      prompt: '请评估以下研究设计的质量并提供改进建议：\n1. 内部效度评估\n2. 外部效度考虑\n3. 信度保障措施\n4. 偏差控制方法\n5. 质量提升策略'
    }
  ];

  // 创建会话
  useEffect(() => {
    if (!session) {
      const newSession: ChatSession = {
        id: `session-research-assistant-${Date.now()}`,
        agentRole: 'research-assistant',
        title: '与研究助手的对话',
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
      agentRole: 'research-assistant'
    };

    setSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage],
      updatedAt: new Date()
    } : null);

    try {
      // 调用GLM API
      const response = await glmClient.agentChat('research-assistant', content, selectedText || initialContext);
      
      const aiResponse: AgentMessage = {
        id: `msg-${Date.now()}-ai`,
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        messageType: 'text',
        agentRole: 'research-assistant'
      };

      setSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, aiResponse],
        updatedAt: new Date()
      } : null);

      // 更新统计
      setResearchStats(prev => {
        const newStats = { ...prev };
        if (content.includes('文献') || content.includes('literature')) {
          newStats.literatureSearched++;
        }
        if (content.includes('方法') || content.includes('method')) {
          newStats.methodsRecommended++;
        }
        if (content.includes('数据') || content.includes('data')) {
          newStats.dataAnalyzed++;
        }
        return newStats;
      });

    } catch (error) {
      console.error('研究助手API调用失败:', error);
      
      const errorMessage: AgentMessage = {
        id: `msg-${Date.now()}-error`,
        content: `抱歉，服务暂时不可用。错误信息: ${error instanceof Error ? error.message : '未知错误'}`,
        role: 'assistant',
        timestamp: new Date(),
        messageType: 'text',
        agentRole: 'research-assistant'
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

  // 快速研究工具
  const handleResearchTool = async (tool: typeof researchTools[0]) => {
    if (!selectedText && !initialContext) {
      await handleSendMessage('请先选择研究内容或提供研究问题进行分析。');
      return;
    }

    const content = selectedText || initialContext;
    const fullPrompt = `${tool.prompt}\n\n研究内容：\n${content}`;
    
    await handleSendMessage(fullPrompt);
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* 研究助手信息头部 */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{agent.avatar}</div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{agent.name}</h2>
            <p className="text-sm text-gray-600">{agent.description}</p>
          </div>
        </div>
        
        {/* 研究统计 */}
        <div className="flex space-x-4 mt-3 text-xs">
          <div className="bg-white px-2 py-1 rounded">
            <span className="text-gray-500">文献检索: </span>
            <span className="font-medium text-green-600">{researchStats.literatureSearched}</span>
          </div>
          <div className="bg-white px-2 py-1 rounded">
            <span className="text-gray-500">方法建议: </span>
            <span className="font-medium text-blue-600">{researchStats.methodsRecommended}</span>
          </div>
          <div className="bg-white px-2 py-1 rounded">
            <span className="text-gray-500">数据分析: </span>
            <span className="font-medium text-purple-600">{researchStats.dataAnalyzed}</span>
          </div>
        </div>
      </div>

      {/* 研究工具面板 */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">研究工具箱</h3>
        <div className="grid grid-cols-3 gap-2">
          {researchTools.map((tool) => (
            <Button
              key={tool.id}
              variant="outline"
              size="sm"
              onClick={() => handleResearchTool(tool)}
              disabled={isLoading}
              className="flex flex-col items-center p-2 h-auto text-center"
            >
              <div className="text-base mb-1">{tool.icon}</div>
              <div className="text-xs font-medium leading-tight">{tool.title}</div>
            </Button>
          ))}
        </div>
      </div>

      {/* 研究背景信息 */}
      {(selectedText || initialContext) && (
        <div className="p-3 bg-blue-50 border-b border-blue-200">
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">当前研究内容：</p>
            <p className="text-xs bg-white p-2 rounded border max-h-16 overflow-y-auto">
              {(selectedText || initialContext).length > 200 
                ? `${(selectedText || initialContext).substring(0, 200)}...` 
                : (selectedText || initialContext)
              }
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

      {/* 研究资源提示 */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-1">🔬 研究支持：</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-medium">文献检索：</p>
              <ul className="list-disc list-inside text-xs space-y-0.5">
                <li>核心数据库推荐</li>
                <li>检索策略设计</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">方法指导：</p>
              <ul className="list-disc list-inside text-xs space-y-0.5">
                <li>研究设计方案</li>
                <li>数据分析方法</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchAssistant;