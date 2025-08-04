import React, { useState, useEffect } from 'react';
import { Agent, AgentMessage, ChatSession } from '../../types';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import ChatInterface from './ChatInterface';
import glmClient from '../../services/glmClient';

interface FormatExpertProps {
  className?: string;
  initialContext?: string;
  selectedText?: string;
  onApplySuggestion?: (suggestion: string) => void;
}

const FormatExpert: React.FC<FormatExpertProps> = ({
  className = '',
  initialContext = '',
  selectedText = '',
  onApplySuggestion
}) => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formatStats, setFormatStats] = useState({
    citationsChecked: 0,
    formatsFixed: 0,
    tablesOptimized: 0
  });
  const [selectedFormat, setSelectedFormat] = useState<string>('APA');

  const agent: Agent = {
    id: 'format-expert',
    role: 'format-expert',
    name: '格式专家',
    description: '专门处理引用格式、排版规范和学术标准',
    avatar: '📝',
    capabilities: [
      '引用格式检查',
      '排版规范指导',
      '图表格式优化',
      '参考文献管理',
      '期刊投稿格式'
    ],
    expertise: [
      'APA格式',
      'MLA格式',
      'Chicago格式',
      'IEEE格式',
      '图表设计规范'
    ],
    isActive: true
  };

  // 格式标准选项
  const formatStandards = [
    { id: 'APA', name: 'APA 7th', description: '美国心理学会格式', icon: '📘' },
    { id: 'MLA', name: 'MLA 9th', description: '现代语言协会格式', icon: '📗' },
    { id: 'Chicago', name: 'Chicago 17th', description: '芝加哥格式', icon: '📙' },
    { id: 'IEEE', name: 'IEEE', description: '电气电子工程师学会格式', icon: '📕' },
    { id: 'Vancouver', name: 'Vancouver', description: '温哥华格式', icon: '📔' },
    { id: 'Harvard', name: 'Harvard', description: '哈佛引用格式', icon: '📒' }
  ];

  // 格式检查工具
  const formatTools = [
    {
      id: 'citation-check',
      title: '引用检查',
      description: '检查文内引用格式',
      icon: '🔍',
      prompt: `请按照${selectedFormat}格式标准检查以下引用：\n1. 文内引用格式是否正确\n2. 作者姓名书写规范\n3. 出版年份位置\n4. 页码标注方式\n5. 多作者引用格式`
    },
    {
      id: 'reference-format',
      title: '参考文献',
      description: '整理参考文献列表',
      icon: '📚',
      prompt: `请按照${selectedFormat}格式整理以下参考文献：\n1. 排序规则检查\n2. 每条引用格式\n3. 期刊名称斜体\n4. DOI/URL格式\n5. 缺失信息补充`
    },
    {
      id: 'table-format',
      title: '表格格式',
      description: '优化表格设计和格式',
      icon: '📊',
      prompt: `请优化以下表格的格式设计：\n1. 表格标题位置和格式\n2. 表头设计和对齐\n3. 数据呈现方式\n4. 表格注释格式\n5. 三线表规范`
    },
    {
      id: 'figure-format',
      title: '图片格式',
      description: '图片和插图格式规范',
      icon: '🖼️',
      prompt: `请检查以下图片格式是否符合学术规范：\n1. 图片标题和编号\n2. 图片质量和分辨率\n3. 图例和标注\n4. 引用和来源标注\n5. 版权信息`
    },
    {
      id: 'layout-check',
      title: '版面检查',
      description: '整体排版和布局检查',
      icon: '📐',
      prompt: `请检查以下内容的版面格式：\n1. 页边距和行距\n2. 字体和字号规范\n3. 标题层级格式\n4. 段落对齐方式\n5. 页眉页脚设置`
    },
    {
      id: 'journal-format',
      title: '期刊要求',
      description: '特定期刊格式要求',
      icon: '📄',
      prompt: `请帮助调整内容以符合期刊投稿要求：\n1. 期刊特定格式要求\n2. 文章结构调整\n3. 字数限制检查\n4. 投稿模板适配\n5. 格式检查清单`
    }
  ];

  // 创建会话
  useEffect(() => {
    if (!session) {
      const newSession: ChatSession = {
        id: `session-format-expert-${Date.now()}`,
        agentRole: 'format-expert',
        title: '与格式专家的对话',
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
      agentRole: 'format-expert'
    };

    setSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, userMessage],
      updatedAt: new Date()
    } : null);

    try {
      // 调用GLM API
      const contextWithFormat = `当前使用${selectedFormat}格式标准。${selectedText || initialContext}`;
      const response = await glmClient.agentChat('format-expert', content, contextWithFormat);
      
      const aiResponse: AgentMessage = {
        id: `msg-${Date.now()}-ai`,
        content: response,
        role: 'assistant',
        timestamp: new Date(),
        messageType: 'text',
        agentRole: 'format-expert'
      };

      setSession(prev => prev ? {
        ...prev,
        messages: [...prev.messages, aiResponse],
        updatedAt: new Date()
      } : null);

      // 更新统计
      setFormatStats(prev => {
        const newStats = { ...prev };
        if (content.includes('引用') || content.includes('citation')) {
          newStats.citationsChecked++;
        }
        if (content.includes('格式') || content.includes('format')) {
          newStats.formatsFixed++;
        }
        if (content.includes('表格') || content.includes('table')) {
          newStats.tablesOptimized++;
        }
        return newStats;
      });

    } catch (error) {
      console.error('格式专家API调用失败:', error);
      
      const errorMessage: AgentMessage = {
        id: `msg-${Date.now()}-error`,
        content: `抱歉，服务暂时不可用。错误信息: ${error instanceof Error ? error.message : '未知错误'}`,
        role: 'assistant',
        timestamp: new Date(),
        messageType: 'text',
        agentRole: 'format-expert'
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

  // 格式工具处理
  const handleFormatTool = async (tool: typeof formatTools[0]) => {
    if (!selectedText && !initialContext) {
      await handleSendMessage('请先选择文本内容或提供需要格式检查的内容。');
      return;
    }

    const content = selectedText || initialContext;
    const fullPrompt = `${tool.prompt}\n\n需要检查的内容：\n${content}`;
    
    await handleSendMessage(fullPrompt);
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* 格式专家信息头部 */}
      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{agent.avatar}</div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{agent.name}</h2>
            <p className="text-sm text-gray-600">{agent.description}</p>
          </div>
        </div>
        
        {/* 格式统计 */}
        <div className="flex space-x-4 mt-3 text-xs">
          <div className="bg-white px-2 py-1 rounded">
            <span className="text-gray-500">引用检查: </span>
            <span className="font-medium text-purple-600">{formatStats.citationsChecked}</span>
          </div>
          <div className="bg-white px-2 py-1 rounded">
            <span className="text-gray-500">格式修正: </span>
            <span className="font-medium text-pink-600">{formatStats.formatsFixed}</span>
          </div>
          <div className="bg-white px-2 py-1 rounded">
            <span className="text-gray-500">表格优化: </span>
            <span className="font-medium text-indigo-600">{formatStats.tablesOptimized}</span>
          </div>
        </div>
      </div>

      {/* 格式标准选择 */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">引用格式标准</h3>
        <div className="grid grid-cols-3 gap-2">
          {formatStandards.map((format) => (
            <Button
              key={format.id}
              variant={selectedFormat === format.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFormat(format.id)}
              className="flex flex-col items-center p-2 h-auto text-center"
            >
              <div className="text-base mb-1">{format.icon}</div>
              <div className="text-xs font-medium">{format.name}</div>
            </Button>
          ))}
        </div>
        <div className="mt-2 text-xs text-gray-600">
          当前标准：<span className="font-medium text-purple-600">{selectedFormat}</span>
        </div>
      </div>

      {/* 格式检查工具 */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">格式检查工具</h3>
        <div className="grid grid-cols-3 gap-2">
          {formatTools.map((tool) => (
            <Button
              key={tool.id}
              variant="outline"
              size="sm"
              onClick={() => handleFormatTool(tool)}
              disabled={isLoading}
              className="flex flex-col items-center p-2 h-auto text-center"
            >
              <div className="text-base mb-1">{tool.icon}</div>
              <div className="text-xs font-medium leading-tight">{tool.title}</div>
            </Button>
          ))}
        </div>
      </div>

      {/* 当前格式信息 */}
      {(selectedText || initialContext) && (
        <div className="p-3 bg-purple-50 border-b border-purple-200">
          <div className="text-xs text-purple-800">
            <p className="font-medium mb-1">待检查内容 ({selectedFormat}标准)：</p>
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

      {/* 格式规范提示 */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-600">
          <p className="font-medium mb-1">📝 格式规范：</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="font-medium">引用格式：</p>
              <ul className="list-disc list-inside text-xs space-y-0.5">
                <li>文内引用检查</li>
                <li>参考文献整理</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">排版规范：</p>
              <ul className="list-disc list-inside text-xs space-y-0.5">
                <li>图表格式优化</li>
                <li>版面布局调整</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormatExpert;