import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  Save, 
  Download, 
  FileText, 
  PenTool, 
  Zap, 
  LayoutGrid,
  Sparkles,
  RefreshCw,
  Check,
  AlertCircle,
  Bot,
  User,
  MessageSquare,
  Users,
  Send,
  Mic,
  Paperclip,
  MoreHorizontal,
  Lightbulb,
  Target,
  BarChart3,
  Clock,
  TrendingUp,
  Award,
  X
} from 'lucide-react';
import { usePaperStore } from '@/store';
import { useAIWritingAssist, useStreamingAI } from '@/hooks';
import AIWritingAssistant from '@/components/editor/AIWritingAssistant';
import ContentSuggestions from '@/components/editor/ContentSuggestions';
import SmartTemplates from '@/components/editor/SmartTemplates';

const AIWritingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    currentPaper, 
    setCurrentPaper, 
    papers,
    workflowState,
    navigateBack,
    setWorkflowMode
  } = usePaperStore();

  const [activeMode, setActiveMode] = useState<'chat' | 'agent' | 'assistant'>('assistant');
  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }>>([
    {
      id: '1',
      type: 'ai',
      content: '你好！我是你的AI写作助手。我可以帮助你生成论文内容、优化文本、检查语法等。有什么可以帮你的吗？',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [paperContent, setPaperContent] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isAIMode, setIsAIMode] = useState(true);
  const [assistantTab, setAssistantTab] = useState<'assistant' | 'suggestions' | 'templates'>('assistant');

  // AI写作助手hooks
  const {
    suggestions,
    currentAnalysis,
    isAnalyzing,
    isGenerating,
    error: aiError,
    performRealTimeAnalysis,
    generateContinuation,
    applySuggestion,
    dismissSuggestion,
    generateCompletions,
    clearError
  } = useAIWritingAssist();

  const {
    content: streamingContent,
    isStreaming,
    startStreaming,
    stopStreaming,
    reset: resetStreaming
  } = useStreamingAI({ delay: 30 });

  // 快捷操作处理函数
  const handleQuickAction = (action: string) => {
    let message = '';
    switch (action) {
      case 'continue':
        message = '请帮我续写当前段落';
        break;
      case 'optimize':
        message = '请帮我优化文本表达';
        break;
      case 'grammar':
        message = '请检查语法错误';
        break;
      case 'references':
        message = '请生成参考文献';
        break;
    }
    
    if (message) {
      setActiveMode('chat');
      // 直接发送消息而不是设置currentMessage然后调用handleSendMessage
      const userMessage = {
        id: Date.now().toString(),
        type: 'user' as const,
        content: message,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, userMessage]);
      setIsTyping(true);

      // 模拟AI响应
      setTimeout(() => {
        let response = '';
        
        if (message.includes('续写')) {
          response = '我可以帮你续写内容。请告诉我你想要续写的段落主题，或者在左侧编辑器中选择需要扩展的部分，我会为你生成相应的学术内容。';
        } else if (message.includes('优化')) {
          response = '我可以帮你优化文本表达。请将需要修改的段落复制到这里，我会为你提供更好的表达方式和学术用词建议。';
        } else if (message.includes('语法')) {
          response = '我可以检查语法和拼写错误。请将需要检查的文本发送给我，我会为你指出需要改进的地方。';
        } else if (message.includes('参考文献')) {
          response = '关于参考文献，我可以帮你：\n1. 格式化现有引用\n2. 建议相关文献\n3. 检查引用规范\n\n请告诉我你需要哪种帮助？';
        }
        
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai' as const,
          content: response,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  useEffect(() => {
    if (id) {
      const paper = papers.find(p => p.id === id);
      if (paper) {
        setCurrentPaper(paper);
      } else {
        navigate('/');
      }
    }
    // 设置工作流模式
    setWorkflowMode('ai-writing');
  }, [id, papers, setCurrentPaper, navigate, setWorkflowMode]);

  const handleNavigateBack = () => {
    const backPath = navigateBack();
    if (backPath) {
      navigate(backPath);
    }
  };

  const handleOpenModularEditor = () => {
    if (currentPaper) {
      navigate(`/modular-editor/${currentPaper.id}`);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const messageToSend = currentMessage.trim();
    const userMessage = {
      id: Date.now().toString(),
      type: 'user' as const,
      content: messageToSend,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    // 模拟AI响应
    setTimeout(() => {
      let response = '';
      const message = messageToSend.toLowerCase();
      
      if (message.includes('续写') || message.includes('生成')) {
        response = '我可以帮你续写内容。请告诉我你想要续写的段落主题，或者在左侧编辑器中选择需要扩展的部分，我会为你生成相应的学术内容。';
      } else if (message.includes('修改') || message.includes('优化')) {
        response = '我可以帮你优化文本表达。请将需要修改的段落复制到这里，我会为你提供更好的表达方式和学术用词建议。';
      } else if (message.includes('语法') || message.includes('检查')) {
        response = '我可以检查语法和拼写错误。请将需要检查的文本发送给我，我会为你指出需要改进的地方。';
      } else if (message.includes('参考文献') || message.includes('引用')) {
        response = '关于参考文献，我可以帮你：\n1. 格式化现有引用\n2. 建议相关文献\n3. 检查引用规范\n\n请告诉我你需要哪种帮助？';
      } else {
        response = `关于 "${messageToSend.slice(0, 30)}${messageToSend.length > 30 ? '...' : ''}" 的问题，我来帮你分析一下。作为AI写作助手，我建议你可以从以下几个方面来完善你的论文内容：\n\n1. 增强论述的逻辑性\n2. 补充相关的学术证据\n3. 优化表达的准确性`;
      }
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai' as const,
        content: response,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 初始化论文内容
  useEffect(() => {
    if (currentPaper) {
      const initialContent = `# ${currentPaper.title}

## 摘要

本研究探讨了...

## 1. 引言

在当今的学术研究中...

## 2. 文献综述

相关研究表明...

## 3. 研究方法

本研究采用...

## 4. 研究结果

实验结果显示...

## 5. 讨论

基于以上研究结果...

## 6. 结论

综上所述...

## 参考文献

[1] ...
      `;
      setPaperContent(initialContent);
      // 触发AI分析
      if (isAIMode) {
        performRealTimeAnalysis(initialContent, 'paper', currentPaper.id);
      }
    }
  }, [currentPaper, isAIMode, performRealTimeAnalysis]);

  // 处理内容变化
  const handleContentChange = useCallback((content: string) => {
    setPaperContent(content);
    if (isAIMode) {
      performRealTimeAnalysis(content, 'paper', currentPaper?.id || '');
    }
  }, [isAIMode, performRealTimeAnalysis, currentPaper?.id]);

  // 处理AI建议应用
  const handleSuggestionApply = useCallback((suggestion: any) => {
    const updatedContent = applySuggestion(suggestion.id, paperContent);
    setPaperContent(updatedContent);
  }, [applySuggestion, paperContent]);

  // 智能续写
  const handleSmartContinuation = useCallback(async () => {
    if (!currentPaper) return;

    try {
      const continuation = await generateContinuation(paperContent, {
        moduleType: 'paper'
      });
      const updatedContent = paperContent + 
        (paperContent.endsWith('\n') ? '' : '\n\n') + continuation;
      setPaperContent(updatedContent);
    } catch (error) {
      console.error('生成续写失败:', error);
    }
  }, [currentPaper, generateContinuation, paperContent]);

  // 流式AI写作
  const handleStreamingWrite = useCallback(async (prompt: string) => {
    resetStreaming();
    await startStreaming(prompt);
  }, [startStreaming, resetStreaming]);

  if (!currentPaper) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">论文不存在或正在加载...</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {workflowState.canNavigateBack && (
              <button
                onClick={handleNavigateBack}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回编辑器
              </button>
            )}
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-green-600" />
              <h1 className="text-lg font-semibold text-gray-900">
                AI论文写作 - {currentPaper.title}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              AI写作模式
            </span>
            <button
              onClick={handleOpenModularEditor}
              className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              编辑结构
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Save className="h-4 w-4 mr-1" />
              保存
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-1" />
              导出
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧信息面板 */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* 论文信息 */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">论文信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">标题:</span>
                <span className="text-gray-900 font-medium text-right">{currentPaper.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">状态:</span>
                <span className="text-green-600 font-medium">写作中</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">字数:</span>
                <span className="text-gray-900 font-medium">
                  {currentAnalysis ? currentAnalysis.wordCount.toLocaleString() : paperContent.length.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">进度:</span>
                <span className="text-blue-600 font-medium">
                  {currentAnalysis ? Math.round((currentAnalysis.wordCount / 8000) * 100) : 65}%
                </span>
              </div>
            </div>
          </div>

          {/* 论文结构大纲 */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">文档结构</h3>
            <div className="space-y-1">
              {[
                { title: '摘要', status: 'completed' },
                { title: '引言', status: 'completed' },
                { title: '文献综述', status: 'current' },
                { title: '研究方法', status: 'pending' },
                { title: '研究结果', status: 'pending' },
                { title: '讨论', status: 'pending' },
                { title: '结论', status: 'pending' },
                { title: '参考文献', status: 'pending' }
              ].map((section, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                  <div className={`w-2 h-2 rounded-full ${
                    section.status === 'completed' ? 'bg-green-500' :
                    section.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                  }`} />
                  <span className={`text-sm ${
                    section.status === 'current' ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}>
                    {section.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 写作统计 */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">写作统计</h3>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-700">今日写作</span>
                  <span className="font-semibold text-blue-900">1,240 字</span>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-700">总字数</span>
                  <span className="font-semibold text-green-900">8,450 字</span>
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-700">AI协助次数</span>
                  <span className="font-semibold text-purple-900">23 次</span>
                </div>
              </div>
            </div>
          </div>

          {/* 快捷操作 */}
          <div className="p-4 flex-1">
            <h3 className="font-semibold text-gray-900 mb-3">快捷操作</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleQuickAction('continue')}
                className="w-full flex items-center space-x-2 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>AI续写当前段落</span>
              </button>
              <button 
                onClick={() => handleQuickAction('optimize')}
                className="w-full flex items-center space-x-2 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4 text-blue-500" />
                <span>优化文本表达</span>
              </button>
              <button 
                onClick={() => handleQuickAction('grammar')}
                className="w-full flex items-center space-x-2 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Check className="h-4 w-4 text-green-500" />
                <span>检查语法错误</span>
              </button>
              <button 
                onClick={() => handleQuickAction('references')}
                className="w-full flex items-center space-x-2 p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <FileText className="h-4 w-4 text-purple-500" />
                <span>生成参考文献</span>
              </button>
            </div>
          </div>
        </div>

        {/* 中间内容编辑区域 */}
        <main className="flex-1 overflow-hidden bg-white">
          <div className="h-full p-6">
            <div className="h-full border border-gray-200 rounded-lg relative">
              {/* AI模式切换 */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setIsAIMode(!isAIMode)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    isAIMode 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-300'
                  }`}
                >
                  <Bot className="h-3 w-3" />
                  <span>{isAIMode ? 'AI辅助' : '普通模式'}</span>
                </button>
              </div>

              <textarea
                value={paperContent}
                onChange={(e) => handleContentChange(e.target.value)}
                onSelect={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  setCursorPosition(target.selectionStart);
                }}
                className="w-full h-full p-6 text-gray-800 leading-relaxed resize-none border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="开始编写您的论文..."
                style={{ fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: '1.6' }}
              />
            </div>
          </div>
        </main>

        {/* 右侧对话区域 */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* 模式切换标签 */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveMode('assistant')}
              className={`flex-1 flex items-center justify-center space-x-1 px-2 py-3 text-xs font-medium ${
                activeMode === 'assistant' 
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Bot className="h-3 w-3" />
              <span>AI助手</span>
            </button>
            <button
              onClick={() => setActiveMode('chat')}
              className={`flex-1 flex items-center justify-center space-x-1 px-2 py-3 text-xs font-medium ${
                activeMode === 'chat' 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="h-3 w-3" />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveMode('agent')}
              className={`flex-1 flex items-center justify-center space-x-1 px-2 py-3 text-xs font-medium ${
                activeMode === 'agent' 
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="h-3 w-3" />
              <span>Agent</span>
            </button>
          </div>

          {/* AI助手模式 */}
          {activeMode === 'assistant' && (
            <div className="h-full flex flex-col">
              {/* AI助手标签页 */}
              <div className="flex border-b border-gray-200">
                {[
                  { key: 'assistant', label: '助手', icon: Bot },
                  { key: 'suggestions', label: '建议', icon: Lightbulb },
                  { key: 'templates', label: '模板', icon: FileText }
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setAssistantTab(key as any)}
                    className={`flex-1 flex items-center justify-center space-x-1 px-2 py-2 text-xs font-medium ${
                      assistantTab === key
                        ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-3 w-3" />
                    <span>{label}</span>
                    {key === 'suggestions' && suggestions.length > 0 && (
                      <span className="bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                        {suggestions.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* AI助手内容 */}
              <div className="flex-1 overflow-hidden">
                {assistantTab === 'assistant' && (
                  <div className="h-full flex flex-col">
                    {/* 分析状态 */}
                    {(isAnalyzing || isGenerating) && (
                      <div className="p-3 bg-blue-50 border-b border-blue-200">
                        <div className="flex items-center space-x-2 text-sm text-blue-700">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>{isAnalyzing ? '正在分析内容...' : '正在生成内容...'}</span>
                        </div>
                      </div>
                    )}

                    {/* 错误提示 */}
                    {aiError && (
                      <div className="p-3 bg-red-50 border-b border-red-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-red-700">
                            <AlertCircle className="h-4 w-4" />
                            <span>{aiError}</span>
                          </div>
                          <button onClick={clearError} className="text-red-500 hover:text-red-700">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 内容分析摘要 */}
                    {currentAnalysis && (
                      <div className="p-3 border-b border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4 text-green-600" />
                          <span>内容分析</span>
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="bg-blue-50 p-2 rounded">
                            <span className="text-blue-600">字数</span>
                            <div className="font-semibold">{currentAnalysis.wordCount}</div>
                          </div>
                          <div className="bg-green-50 p-2 rounded">
                            <span className="text-green-600">可读性</span>
                            <div className="font-semibold">{currentAnalysis.readabilityScore}/100</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 快捷操作 */}
                    <div className="p-3 space-y-2">
                      <h4 className="font-medium text-gray-900 mb-2">快捷操作</h4>
                      <button
                        onClick={handleSmartContinuation}
                        disabled={isGenerating || !paperContent}
                        className="w-full flex items-center space-x-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded text-sm transition-colors"
                      >
                        <Zap className="h-4 w-4" />
                        <span>智能续写</span>
                      </button>
                      <button
                        onClick={() => handleStreamingWrite('优化当前段落的表达')}
                        disabled={isStreaming || !paperContent}
                        className="w-full flex items-center space-x-2 p-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 rounded text-sm transition-colors"
                      >
                        <RefreshCw className="h-4 w-4" />
                        <span>优化表达</span>
                      </button>
                    </div>

                    {/* 流式输出显示 */}
                    {isStreaming && streamingContent && (
                      <div className="p-3 border-t border-gray-200 bg-gray-50">
                        <h5 className="font-medium text-gray-900 mb-2">AI生成内容:</h5>
                        <div className="bg-white p-3 rounded border text-sm text-gray-700">
                          {streamingContent}
                        </div>
                        <div className="mt-2 flex space-x-2">
                          <button
                            onClick={() => {
                              setPaperContent(prev => prev + '\n\n' + streamingContent);
                              resetStreaming();
                            }}
                            className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                          >
                            应用
                          </button>
                          <button
                            onClick={stopStreaming}
                            className="text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1 rounded"
                          >
                            停止
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {assistantTab === 'suggestions' && (
                  <ContentSuggestions
                    suggestions={suggestions}
                    onApplySuggestion={handleSuggestionApply}
                    onDismissSuggestion={dismissSuggestion}
                    isCompact={true}
                  />
                )}

                {assistantTab === 'templates' && (
                  <SmartTemplates
                    onTemplateSelect={(template) => {
                      console.log('Selected template:', template);
                      // 这里可以集成模板应用逻辑
                    }}
                    onTemplatePreview={(template) => {
                      console.log('Preview template:', template);
                    }}
                    compactMode={true}
                  />
                )}
              </div>
            </div>
          )}

          {/* Chat 模式 */}
          {activeMode === 'chat' && (
            <>
              {/* 聊天消息区域 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 输入区域 */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end space-x-2">
                  <div className="flex-1 border border-gray-300 rounded-lg">
                    <textarea
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="输入消息..."
                      rows={1}
                      className="w-full p-3 resize-none border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ minHeight: '44px', maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isTyping}
                    className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Mic className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Agent 模式 */}
          {activeMode === 'agent' && (
            <div className="flex-1 p-4">
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Agent 模式</h3>
                <p className="text-gray-600 text-sm mb-6">
                  选择专业的AI助手来帮助您完成特定的写作任务
                </p>
                
                <div className="space-y-3">
                  <button className="w-full p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 text-left transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <PenTool className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">学术写作专家</h4>
                        <p className="text-sm text-gray-500">专业的学术论文写作指导</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 text-left transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">研究助手</h4>
                        <p className="text-sm text-gray-500">文献查找和研究方法建议</p>
                      </div>
                    </div>
                  </button>
                  
                  <button className="w-full p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 text-left transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Settings className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">格式专家</h4>
                        <p className="text-sm text-gray-500">论文格式和引用规范检查</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIWritingPage;