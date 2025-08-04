import React, { useState, useEffect, useRef } from 'react';
import { 
  createDefaultAIWritingSystem,
  AIWritingAssistantUtils,
  PaperType,
  type AIWritingAssistantSystem
} from '../../services/ai-writing-assistant-system';
import AIWritingAssistantPanel from '../../components/ai-assistant/AIWritingAssistantPanel';
import SuggestionActionPanel, { SuggestionNotification } from '../../components/ai-assistant/SuggestionActionPanel';
import { Paper, PaperSection } from '../../types';

/**
 * AI写作助手演示页面
 */
const AIWritingAssistantDemo: React.FC = () => {
  // 状态管理
  const [aiSystem, setAISystem] = useState<AIWritingAssistantSystem | null>(null);
  const [currentPaper, setCurrentPaper] = useState<Paper | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [isSystemReady, setIsSystemReady] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'initializing' | 'ready' | 'error'>('initializing');
  const [errorMessage, setErrorMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<any>(null);

  // 引用
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // 示例论文数据
  const samplePaper: Paper = {
    id: 'demo-paper-1',
    title: '基于深度学习的图像识别技术研究',
    content: '本研究探讨了深度学习在计算机视觉领域的应用，特别是在图像识别任务中的表现。',
    abstract: '随着人工智能技术的快速发展，深度学习已成为图像识别领域的主流方法。本文通过对比分析不同的深度学习模型，评估其在图像分类任务中的性能表现。',
    keywords: ['深度学习', '图像识别', '卷积神经网络', '计算机视觉'],
    status: 'writing',
    authorId: 'demo-user',
    createdAt: new Date(),
    updatedAt: new Date(),
    wordCount: 0,
    sections: [
      {
        id: 'intro',
        title: '引言',
        content: '在计算机视觉领域，图像识别一直是研究的热点问题。随着深度学习技术的发展，基于卷积神经网络的方法在图像识别任务中取得了显著成果。',
        order: 1,
        level: 1
      },
      {
        id: 'method',
        title: '方法论',
        content: '本研究采用卷积神经网络作为基础架构，通过数据增强和迁移学习等技术提升模型性能。',
        order: 2,
        level: 1
      }
    ],
    paperType: 'research',
    field: 'computer_science',
    citationStyle: 'APA',
    requirements: '研究论文，要求5000-8000字，包含完整的实验设计和结果分析。'
  };

  // 初始化AI系统
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        setSystemStatus('initializing');
        
        // 检查API密钥
        const apiKey = import.meta.env?.VITE_GLM_API_KEY;
        if (!apiKey) {
          throw new Error('GLM API密钥未配置，请在环境变量中设置 VITE_GLM_API_KEY');
        }

        // 创建AI系统
        const system = createDefaultAIWritingSystem(apiKey);
        
        // 测试连接
        const connectionTest = await system.glmClient.testConnection();
        if (!connectionTest.success) {
          throw new Error(`AI服务连接失败: ${connectionTest.error}`);
        }

        setAISystem(system);
        setCurrentPaper(samplePaper);
        setSystemStatus('ready');
        setIsSystemReady(true);
        
        console.log('AI写作助手系统初始化成功');
      } catch (error) {
        console.error('AI系统初始化失败:', error);
        setSystemStatus('error');
        setErrorMessage(error instanceof Error ? error.message : '未知错误');
      }
    };

    initializeSystem();
  }, []);

  // 处理文本选择
  const handleTextSelection = () => {
    if (!editorRef.current) return;
    
    const textarea = editorRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start !== end) {
      const selected = editorContent.substring(start, end);
      setSelectedText(selected);
    } else {
      setSelectedText('');
    }
  };

  // 处理内容变化
  const handleContentChange = (content: string) => {
    setEditorContent(content);
    
    // 更新论文字数
    if (currentPaper) {
      const updatedPaper = {
        ...currentPaper,
        content: content,
        wordCount: content.length
      };
      setCurrentPaper(updatedPaper);
    }

    // 触发实时协作
    if (aiSystem && isSystemReady) {
      aiSystem.collaborator.handleWritingEvent({
        type: 'text_insert',
        timestamp: new Date(),
        position: editorRef.current?.selectionStart || 0,
        content: content
      });
    }
  };

  // 应用建议
  const handleSuggestionApply = (suggestion: any) => {
    if (suggestion.position) {
      const { start, end } = suggestion.position;
      const before = editorContent.substring(0, start);
      const after = editorContent.substring(end);
      const newContent = before + suggestion.content + after;
      
      setEditorContent(newContent);
      handleContentChange(newContent);
    } else {
      // 如果没有位置信息，添加到光标位置
      const cursorPos = editorRef.current?.selectionStart || editorContent.length;
      const before = editorContent.substring(0, cursorPos);
      const after = editorContent.substring(cursorPos);
      const newContent = before + suggestion.content + after;
      
      setEditorContent(newContent);
      handleContentChange(newContent);
    }

    setShowNotification(false);
  };

  // 获取快速建议
  const getQuickSuggestions = async () => {
    if (!aiSystem || !currentPaper) return;

    try {
      const result = await AIWritingAssistantUtils.getQuickSuggestions(
        aiSystem,
        currentPaper,
        selectedText
      );
      
      console.log('快速建议结果:', result);
      
      if (result.suggestions.length > 0) {
        setCurrentSuggestion(result.suggestions[0]);
        setShowNotification(true);
      }
    } catch (error) {
      console.error('获取建议失败:', error);
    }
  };

  // 验证论文质量
  const validatePaper = () => {
    if (!aiSystem || !currentPaper) return;

    const validation = AIWritingAssistantUtils.validatePaperQuality(aiSystem, currentPaper);
    console.log('论文质量验证:', validation);
    
    // 这里可以显示验证结果
    alert(`论文验证结果:\n有效性: ${validation.isValid}\n缺失章节: ${validation.missingRequired.join(', ')}\n建议: ${validation.suggestions.slice(0, 3).join('\n')}`);
  };

  // 获取写作统计
  const getStats = () => {
    if (!aiSystem) return;

    const stats = AIWritingAssistantUtils.getWritingStats(aiSystem);
    console.log('写作统计:', stats);
    
    alert(`写作统计:\n效率: ${stats.overall.efficiency.toFixed(1)}%\n活动: ${stats.overall.activity}\n生产力: ${stats.overall.productivity} 建议/分钟`);
  };

  // 渲染系统状态
  const renderSystemStatus = () => {
    switch (systemStatus) {
      case 'initializing':
        return (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">正在初始化AI写作助手...</p>
            </div>
          </div>
        );
      
      case 'error':
        return (
          <div className="flex items-center justify-center p-8">
            <div className="text-center text-red-600">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-semibold mb-2">系统初始化失败</h3>
              <p className="text-sm">{errorMessage}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                重新加载
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (systemStatus !== 'ready') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-8">AI写作助手演示</h1>
          {renderSystemStatus()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">AI写作助手演示</h1>
          <div className="flex justify-center space-x-4">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              ✓ AI系统已就绪
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              📄 {currentPaper?.paperType} | {currentPaper?.field}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              📊 {editorContent.length} 字符
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 编辑器区域 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">论文编辑器</h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={getQuickSuggestions}
                      disabled={!selectedText}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      获取建议
                    </button>
                    <button
                      onClick={validatePaper}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      验证质量
                    </button>
                    <button
                      onClick={getStats}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                    >
                      统计信息
                    </button>
                  </div>
                </div>
                {selectedText && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                    <span className="text-blue-600 font-medium">已选择：</span>
                    <span className="text-blue-800">{selectedText.slice(0, 100)}...</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <textarea
                  ref={editorRef}
                  value={editorContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  onSelect={handleTextSelection}
                  placeholder="开始写作，或粘贴现有内容以获得AI写作建议..."
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 论文信息面板 */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-3">论文信息</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">标题：</span>
                  <span>{currentPaper?.title}</span>
                </div>
                <div>
                  <span className="font-medium">类型：</span>
                  <span>{currentPaper?.paperType}</span>
                </div>
                <div>
                  <span className="font-medium">领域：</span>
                  <span>{currentPaper?.field}</span>
                </div>
                <div>
                  <span className="font-medium">引用格式：</span>
                  <span>{currentPaper?.citationStyle}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">关键词：</span>
                  <span>{currentPaper?.keywords.join(', ')}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium">摘要：</span>
                  <span className="text-gray-600">{currentPaper?.abstract}</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI助手面板 */}
          <div className="lg:col-span-1">
            {aiSystem && currentPaper && (
              <AIWritingAssistantPanel
                paper={currentPaper}
                assistant={aiSystem.assistant}
                collaborator={aiSystem.collaborator}
                onSuggestionApply={handleSuggestionApply}
                onTextChange={setSelectedText}
              />
            )}
          </div>
        </div>

        {/* 建议通知 */}
        {showNotification && currentSuggestion && (
          <SuggestionNotification
            suggestion={currentSuggestion}
            onAccept={() => handleSuggestionApply(currentSuggestion)}
            onReject={() => setShowNotification(false)}
            autoHideMs={10000}
            position="bottom-right"
          />
        )}

        {/* 使用说明 */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">使用说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">基本功能</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 在编辑器中输入或粘贴内容</li>
                <li>• 选择文本后点击"获取建议"</li>
                <li>• 使用右侧AI助手面板获取各种建议</li>
                <li>• 点击"验证质量"检查论文结构</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">AI助手模式</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• 续写：基于上下文继续写作</li>
                <li>• 润色：改进语言表达</li>
                <li>• 扩展：增加内容细节</li>
                <li>• 总结：提炼核心要点</li>
                <li>• 重写：重新组织表达</li>
                <li>• 大纲：生成写作大纲</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIWritingAssistantDemo;