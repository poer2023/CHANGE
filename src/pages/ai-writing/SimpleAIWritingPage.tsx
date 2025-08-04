import React, { useState } from 'react';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';

const SimpleAIWritingPage: React.FC = () => {
  const [content, setContent] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'assistant' | 'templates'>('assistant');
  const [suggestions, setSuggestions] = useState([
    {
      id: '1',
      type: 'improvement',
      title: '语言表达优化',
      content: '建议使用更专业的学术表达方式',
      confidence: 0.9
    },
    {
      id: '2',
      type: 'structure',
      title: '结构建议',
      content: '考虑增加段落间的逻辑连接',
      confidence: 0.85
    }
  ]);

  const templates = [
    {
      id: 'research-intro',
      name: '研究引言模板',
      description: '用于学术论文引言部分',
      content: '随着[研究领域]的快速发展，[具体问题]已成为学术界关注的焦点。本研究旨在...'
    },
    {
      id: 'methodology',
      name: '研究方法模板',
      description: '描述研究方法和设计',
      content: '本研究采用[研究方法]，通过[数据收集方式]收集数据，并运用[分析方法]进行分析...'
    },
    {
      id: 'conclusion',
      name: '结论模板',
      description: '总结研究结果和贡献',
      content: '综上所述，本研究通过[研究内容]，得出以下主要结论：首先，[结论一]；其次，[结论二]...'
    }
  ];

  const modes = [
    { id: 'assistant', name: 'AI助手', icon: '🤖', description: '智能写作建议' },
    { id: 'chat', name: 'AI对话', icon: '💬', description: '与AI交流讨论' },
    { id: 'templates', name: '智能模板', icon: '📝', description: '专业写作模板' }
  ];

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
      // 模拟生成建议
      setSuggestions([
        {
          id: Date.now().toString(),
          type: 'improvement',
          title: '针对选中文本的优化建议',
          content: `对于"${selection.toString().substring(0, 30)}..."，建议使用更正式的学术表达`,
          confidence: 0.92
        }
      ]);
    }
  };

  const handleGenerateContent = async (prompt: string) => {
    setIsGenerating(true);
    // 模拟AI生成
    setTimeout(() => {
      const generatedText = `基于您的要求"${prompt}"，AI生成的内容如下：\n\n这是一段模拟的AI生成内容，展示了人工智能在写作辅助方面的能力。通过深度学习技术，AI能够理解用户意图并生成相关的文本内容。`;
      setContent(prev => prev + '\n\n' + generatedText);
      setIsGenerating(false);
    }, 2000);
  };

  const applyTemplate = (template: typeof templates[0]) => {
    setContent(prev => prev + '\n\n' + template.content);
  };

  const getWordCount = () => content.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI智能写作助手</h1>
            <p className="text-sm text-gray-600 mt-1">
              字数: {getWordCount()} • 选中文本: {selectedText ? `"${selectedText.substring(0, 20)}..."` : '无'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              导出文档
            </Button>
            <Button size="sm">
              保存草稿
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* 左侧写作区域 */}
        <div className="flex-1 p-6">
          <Card className="h-full p-6">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">写作区域</h2>
                <div className="text-sm text-gray-500">
                  {getWordCount()} 字
                </div>
              </div>
              
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onMouseUp={handleTextSelection}
                className="flex-1 w-full resize-none border border-gray-200 rounded-lg p-4 text-gray-900 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="开始您的写作，选中文本可获得AI建议..."
                style={{ minHeight: '500px' }}
              />
            </div>
          </Card>
        </div>

        {/* 右侧AI助手面板 */}
        <div className="w-96 bg-white border-l border-gray-200">
          {/* 模式切换 */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex space-x-1">
              {modes.map((mode) => (
                <Button
                  key={mode.id}
                  variant={activeMode === mode.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveMode(mode.id as any)}
                  className="flex-1"
                >
                  <span className="mr-1">{mode.icon}</span>
                  {mode.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="p-4 h-[calc(100%-80px)] overflow-y-auto">
            {activeMode === 'assistant' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">写作建议</h3>
                  {suggestions.map((suggestion) => (
                    <div key={suggestion.id} className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-blue-900">
                          {suggestion.title}
                        </h4>
                        <span className="text-xs text-blue-700">
                          {Math.round(suggestion.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-sm text-blue-800 mb-2">
                        {suggestion.content}
                      </p>
                      <Button size="sm" variant="outline" className="text-xs">
                        应用建议
                      </Button>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">快捷操作</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleGenerateContent('优化这段文字')}
                      disabled={isGenerating}
                    >
                      ✨ 优化文字表达
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleGenerateContent('检查语法错误')}
                    >
                      🔍 语法检查
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleGenerateContent('增加专业表达')}
                    >
                      🎓 学术化表达
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeMode === 'chat' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">与AI对话</h3>
                  <div className="space-y-3 mb-4" style={{ height: '300px', overflowY: 'auto' }}>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <div className="text-sm text-gray-700">
                        <strong>AI:</strong> 您好！我是您的写作助手，可以帮您改进文章、提供建议或回答写作相关问题。
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="输入您的问题..."
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <Button size="sm">发送</Button>
                  </div>
                </div>
              </div>
            )}

            {activeMode === 'templates' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">智能模板</h3>
                  {templates.map((template) => (
                    <div key={template.id} className="mb-3 p-3 border border-gray-200 rounded-lg">
                      <div className="mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {template.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {template.description}
                        </p>
                      </div>
                      <div className="text-xs text-gray-700 mb-2 bg-gray-50 p-2 rounded">
                        {template.content.substring(0, 60)}...
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => applyTemplate(template)}
                      >
                        使用模板
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 生成中的加载提示 */}
      {isGenerating && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            AI正在生成内容...
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleAIWritingPage;