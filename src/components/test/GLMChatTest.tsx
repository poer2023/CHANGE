/**
 * GLM聊天功能测试组件
 * 用于测试GLM-4.5 API的基础聊天和流式响应功能
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Card } from '../UI/Card';
import { useStreamingAI } from '../../hooks/useStreamingAI';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const GLMChatTest: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'testing' | 'connected' | 'failed'>('unknown');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    content,
    isStreaming,
    isComplete,
    error,
    startStreaming,
    generateContent,
    stopStreaming,
    reset,
    testConnection,
    getClientStatus,
    isReady
  } = useStreamingAI({
    temperature: 0.7,
    maxTokens: 1000,
    systemMessage: '你是一个友好的AI助手，请用简洁明了的方式回答用户的问题。'
  });

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, content]);

  // 测试连接
  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    try {
      const result = await testConnection();
      setConnectionStatus(result.success ? 'connected' : 'failed');
      
      if (result.success) {
        console.log('连接成功，延迟:', result.latency, 'ms');
      } else {
        console.error('连接失败:', result.error);
      }
    } catch (error) {
      setConnectionStatus('failed');
      console.error('测试连接时出错:', error);
    }
  };

  // 发送消息（流式）
  const handleSendStreamMessage = async () => {
    if (!inputValue.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // 添加AI消息占位符
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      await startStreaming(userMessage.content, (chunk) => {
        // 更新流式内容
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: msg.content + chunk }
            : msg
        ));
      });

      // 流式完成后更新消息状态
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: content, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error('发送消息失败:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: '抱歉，发生了错误：' + (error instanceof Error ? error.message : '未知错误'), isStreaming: false }
          : msg
      ));
    }
  };

  // 发送消息（非流式）
  const handleSendDirectMessage = async () => {
    if (!inputValue.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // 添加AI消息占位符
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '正在生成回复...',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, aiMessage]);

    try {
      const response = await generateContent(userMessage.content);
      
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: response, isStreaming: false }
          : msg
      ));

    } catch (error) {
      console.error('发送消息失败:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: '抱歉，发生了错误：' + (error instanceof Error ? error.message : '未知错误'), isStreaming: false }
          : msg
      ));
    }
  };

  // 清空对话
  const handleClearChat = () => {
    setMessages([]);
    reset();
  };

  // 停止生成
  const handleStopGeneration = () => {
    stopStreaming();
  };

  const clientStatus = getClientStatus();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">GLM-4.5 API 测试</h1>
        <p className="text-gray-600">测试GLM聊天对话和流式响应功能</p>
      </div>

      {/* 状态面板 */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">连接状态</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isReady ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm">
              客户端: {isReady ? '已配置' : '未配置'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {connectionStatus === 'testing' && <Loader2 className="w-4 h-4 animate-spin" />}
            {connectionStatus === 'connected' && <CheckCircle className="w-4 h-4 text-green-500" />}
            {connectionStatus === 'failed' && <AlertCircle className="w-4 h-4 text-red-500" />}
            <span className="text-sm">
              连接: {connectionStatus === 'unknown' ? '未测试' : connectionStatus === 'testing' ? '测试中' : connectionStatus}
            </span>
          </div>

          <Button 
            onClick={handleTestConnection}
            disabled={!isReady || connectionStatus === 'testing'}
            size="sm"
            variant="outline"
          >
            测试连接
          </Button>
        </div>

        {clientStatus.modelInfo && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">模型信息:</p>
            <p className="text-sm text-gray-600">
              {clientStatus.modelInfo.name} - 最大Token: {clientStatus.modelInfo.maxTokens}
            </p>
            <p className="text-sm text-gray-600">
              功能: {clientStatus.modelInfo.supportedFeatures.join(', ')}
            </p>
          </div>
        )}
      </Card>

      {/* 聊天界面 */}
      <Card className="h-96 flex flex-col">
        {/* 消息列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>开始与GLM-4.5对话吧！</p>
              <p className="text-sm">你可以测试流式响应和直接响应两种模式</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' ? (
                      <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                    ) : (
                      <User className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.isStreaming && (
                        <div className="flex items-center space-x-1 mt-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                          <span className="text-xs opacity-70">正在输入...</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="border-t p-4">
          {error && (
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              错误: {error}
            </div>
          )}
          
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e: any) => setInputValue(e.target?.value || '')}
              placeholder="输入消息..."
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendStreamMessage();
                }
              }}
              disabled={isStreaming || !isReady}
            />
            
            {isStreaming ? (
              <Button onClick={handleStopGeneration} variant="outline">
                停止
              </Button>
            ) : (
              <>
                <Button 
                  onClick={handleSendStreamMessage}
                  disabled={!inputValue.trim() || !isReady}
                  className="px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={handleSendDirectMessage}
                  disabled={!inputValue.trim() || !isReady}
                  variant="outline"
                  className="px-3"
                  title="直接响应"
                >
                  <Bot className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">
              {isReady ? '按Enter发送流式消息，点击机器人图标发送直接消息' : '请配置GLM API密钥'}
            </div>
            <Button
              onClick={handleClearChat}
              variant="ghost"
              size="sm"
              className="text-gray-500"
            >
              清空对话
            </Button>
          </div>
        </div>
      </Card>

      {/* 使用说明 */}
      <Card className="p-6">
        <h3 className="font-semibold mb-2">使用说明</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 确保已配置 .env.local 文件中的 VITE_GLM_API_KEY</li>
          <li>• 流式消息: 实时显示AI回复过程（推荐）</li>
          <li>• 直接消息: 等待完整回复后一次性显示</li>
          <li>• 可以随时停止正在生成的回复</li>
          <li>• 支持多轮对话和上下文记忆</li>
        </ul>
      </Card>
    </div>
  );
};

export default GLMChatTest;