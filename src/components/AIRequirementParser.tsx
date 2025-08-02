'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { FormData, AIMessage, ValidationError } from '@/types/form';

interface AIRequirementParserProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: ValidationError[];
}

const AIRequirementParser: React.FC<AIRequirementParserProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [extractedRequirements, setExtractedRequirements] = useState<{
    wordCount: number;
    format: string;
    specialRequirements: string;
    topics: string[];
    urgency: string;
  } | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 模拟AI回复的预设问题和回答
  const aiResponses = [
    {
      trigger: 'start',
      response: '您好！我是您的AI论文助手。让我帮您分析和整理论文需求。首先，请告诉我您希望论文的主要研究主题或问题是什么？',
      delay: 1000
    },
    {
      trigger: 'topic',
      response: '很好！您提到的主题很有意思。现在请告诉我：\n\n1. 您希望论文大概多少字？\n2. 有特定的格式要求吗？（如APA、MLA等）\n3. 截止日期是什么时候？',
      delay: 1500
    },
    {
      trigger: 'details',
      response: '明白了。让我为您总结一下需求，并提取关键信息。还有什么特殊要求或补充说明吗？比如：\n\n• 特定的研究方法偏好\n• 必须包含的章节\n• 参考文献的数量要求\n• 其他特殊说明',
      delay: 1200
    },
    {
      trigger: 'final',
      response: '完美！我已经分析了您的所有需求。让我为您生成详细的需求分析报告...',
      delay: 800
    }
  ];

  // 初始化对话
  useEffect(() => {
    const initMessage: AIMessage = {
      id: '1',
      type: 'ai',
      content: '您好！我是您的AI论文助手。让我帮您分析和整理论文需求。首先，请告诉我您希望论文的主要研究主题或问题是什么？',
      timestamp: new Date()
    };
    setMessages([initMessage]);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 模拟AI思考并回复
  const simulateAIResponse = async (userMessage: string, messageCount: number) => {
    setIsTyping(true);
    
    let response = '';
    let delay = 1000;
    
    // 根据对话轮次和内容决定回复
    if (messageCount === 2) {
      response = aiResponses[1].response;
      delay = aiResponses[1].delay;
    } else if (messageCount === 4) {
      response = aiResponses[2].response;
      delay = aiResponses[2].delay;
    } else if (messageCount === 6) {
      response = aiResponses[3].response;
      delay = aiResponses[3].delay;
      
      // 开始分析需求
      setTimeout(() => {
        analyzeRequirements();
      }, delay + 1000);
    } else {
      // 通用回复
      response = '我理解了。请继续告诉我更多详细信息。';
      delay = 800;
    }

    await new Promise(resolve => setTimeout(resolve, delay));
    
    const aiMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  // 分析需求并提取信息
  const analyzeRequirements = async () => {
    setIsTyping(true);
    
    // 模拟分析过程
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 从对话中提取信息（简化的mock实现）
    const allMessages = messages.filter(m => m.type === 'user').map(m => m.content).join(' ');
    
    // 模拟提取的需求信息
    const requirements = {
      wordCount: extractWordCount(allMessages) || 3000,
      format: extractFormat(allMessages) || 'academic',
      specialRequirements: extractSpecialRequirements(allMessages),
      topics: extractTopics(allMessages),
      urgency: extractUrgency(allMessages) || 'normal'
    };
    
    setExtractedRequirements(requirements);
    
    // 生成分析结果消息
    const analysisMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: `太好了！我已经完成了需求分析。以下是我为您提取的关键信息：

📊 **论文字数**: ${requirements.wordCount}字
📋 **格式要求**: ${requirements.format}
📝 **主要主题**: ${requirements.topics.join(', ') || '待细化'}
⏰ **紧急程度**: ${requirements.urgency}

${requirements.specialRequirements ? `🔍 **特殊要求**: ${requirements.specialRequirements}` : ''}

这些信息将帮助我为您生成更精准的论文大纲和写作建议。您可以继续下一步了！`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, analysisMessage]);
    setIsTyping(false);
    setAnalysisComplete(true);
    
    // 更新表单数据
    updateFormData({
      requirements: JSON.stringify(requirements),
      wordCount: requirements.wordCount,
      format: requirements.format,
      specialRequirements: requirements.specialRequirements
    });
  };

  // 简单的文本分析函数（mock实现）
  const extractWordCount = (text: string): number | null => {
    const matches = text.match(/(\d+)[\s]*字|(\d+)[\s]*words?/i);
    return matches ? parseInt(matches[1] || matches[2]) : null;
  };

  const extractFormat = (text: string): string => {
    if (/apa/i.test(text)) return 'APA';
    if (/mla/i.test(text)) return 'MLA';
    if (/chicago/i.test(text)) return 'Chicago';
    if (/ieee/i.test(text)) return 'IEEE';
    return 'academic';
  };

  const extractSpecialRequirements = (text: string): string => {
    const keywords = ['必须', '要求', '需要', '包含', '参考文献', '章节', '方法'];
    const sentences = text.split(/[。！？.!?]/);
    const relevantSentences = sentences.filter(sentence => 
      keywords.some(keyword => sentence.includes(keyword))
    );
    return relevantSentences.join('; ');
  };

  const extractTopics = (text: string): string[] => {
    // 简化的主题提取
    const topics = [];
    if (text.includes('人工智能') || text.includes('AI')) topics.push('人工智能');
    if (text.includes('机器学习')) topics.push('机器学习');
    if (text.includes('数据分析')) topics.push('数据分析');
    if (text.includes('算法')) topics.push('算法研究');
    return topics;
  };

  const extractUrgency = (text: string): string => {
    if (/紧急|急|赶|马上|立即/i.test(text)) return '紧急';
    if (/一周|7天|week/i.test(text)) return '较急';
    if (/一个月|month/i.test(text)) return '正常';
    return '不急';
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;
    
    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput.trim(),
      timestamp: new Date()
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setCurrentInput('');
    
    // 模拟AI回复
    await simulateAIResponse(currentInput, newMessages.length);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const hasError = errors.some(error => error.field === 'requirements');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* 对话界面 */}
      <div className={`
        bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto border-2
        ${hasError ? 'border-red-300' : 'border-gray-200'}
      `}>
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* 头像 */}
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  ${message.type === 'user' ? 'bg-primary-500' : 'bg-green-500'}
                `}>
                  {message.type === 'user' ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>
                
                {/* 消息内容 */}
                <div className={`
                  chat-bubble
                  ${message.type === 'user' ? 'user' : 'ai'}
                `}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div className={`
                    text-xs mt-1 opacity-70
                    ${message.type === 'user' ? 'text-white' : 'text-gray-500'}
                  `}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* AI正在输入指示器 */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 text-gray-500"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="flex items-center space-x-1">
              <Loader size={16} className="animate-spin" />
              <span className="text-sm">AI助手正在思考...</span>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={analysisComplete ? "对话已完成，您可以继续下一步" : "输入您的需求或问题..."}
            disabled={analysisComplete}
            className={`
              form-input
              ${analysisComplete ? 'bg-gray-100 cursor-not-allowed' : ''}
            `}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!currentInput.trim() || isTyping || analysisComplete}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>

      {/* 需求分析结果 */}
      {extractedRequirements && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 border border-green-200 rounded-lg p-6"
        >
          <div className="flex items-center mb-4">
            <CheckCircle className="text-green-500 mr-3" size={24} />
            <h3 className="text-lg font-semibold text-green-800">
              需求分析完成！
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-green-700">论文字数</label>
                <p className="text-green-800">{extractedRequirements.wordCount} 字</p>
              </div>
              <div>
                <label className="text-sm font-medium text-green-700">格式要求</label>
                <p className="text-green-800">{extractedRequirements.format}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-green-700">主要主题</label>
                <p className="text-green-800">
                  {extractedRequirements.topics.length > 0 
                    ? extractedRequirements.topics.join(', ')
                    : '通用学术论文'
                  }
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-green-700">紧急程度</label>
                <p className="text-green-800">{extractedRequirements.urgency}</p>
              </div>
            </div>
            {extractedRequirements.specialRequirements && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-green-700">特殊要求</label>
                <p className="text-green-800 text-sm leading-relaxed">
                  {extractedRequirements.specialRequirements}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 使用提示 */}
      {!analysisComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="text-blue-500 mt-0.5" size={20} />
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-900">
                对话提示
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                请详细描述您的论文需求，包括主题、字数、格式要求、截止时间等。
                AI助手会根据您的描述自动提取和整理关键信息。
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AIRequirementParser;