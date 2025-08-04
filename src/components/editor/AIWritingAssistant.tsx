import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Lightbulb, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  X,
  Zap,
  FileText,
  BarChart3,
  Wand2,
  MessageSquare,
  Settings,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Target,
  Clock,
  Award
} from 'lucide-react';
import { PaperModule } from '@/types/modular';
import { useAIWritingAssist, AISuggestion, ContentAnalysis } from '@/hooks/useAIWritingAssist';

interface AIWritingAssistantProps {
  selectedModule: PaperModule | null;
  onModuleUpdate: (moduleId: string, updates: Partial<PaperModule>) => void;
  onSuggestionApply: (suggestion: AISuggestion) => void;
}

const AIWritingAssistant: React.FC<AIWritingAssistantProps> = ({
  selectedModule,
  onModuleUpdate,
  onSuggestionApply
}) => {
  const {
    suggestions,
    currentAnalysis,
    isAnalyzing,
    isGenerating,
    error,
    performRealTimeAnalysis,
    generateContinuation,
    applySuggestion,
    dismissSuggestion,
    clearError
  } = useAIWritingAssist();

  const [activeTab, setActiveTab] = useState<'suggestions' | 'analysis' | 'generate'>('suggestions');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [autoAnalysis, setAutoAnalysis] = useState(true);

  // 自动分析当前模块
  useEffect(() => {
    if (selectedModule && autoAnalysis) {
      performRealTimeAnalysis(
        selectedModule.content,
        selectedModule.type,
        selectedModule.id
      );
    }
  }, [selectedModule?.content, selectedModule?.type, selectedModule?.id, autoAnalysis, performRealTimeAnalysis]);

  // 处理建议应用
  const handleApplySuggestion = async (suggestion: AISuggestion) => {
    if (!selectedModule) return;

    const updatedContent = applySuggestion(suggestion.id, selectedModule.content);
    onModuleUpdate(selectedModule.id, { 
      content: updatedContent,
      updatedAt: new Date()
    });
    onSuggestionApply(suggestion);
  };

  // 生成AI续写
  const handleGenerateContinuation = async () => {
    if (!selectedModule) return;

    try {
      const continuation = await generateContinuation(selectedModule.content, {
        moduleType: selectedModule.type
      });

      const updatedContent = selectedModule.content + 
        (selectedModule.content.endsWith('\n') ? '' : '\n\n') + continuation;

      onModuleUpdate(selectedModule.id, {
        content: updatedContent,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('生成续写失败:', error);
    }
  };

  // 手动触发分析
  const handleManualAnalysis = () => {
    if (selectedModule) {
      performRealTimeAnalysis(
        selectedModule.content,
        selectedModule.type,
        selectedModule.id
      );
    }
  };

  // 获取置信度颜色
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600 bg-green-100';
    if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  // 获取建议类型图标
  const getSuggestionIcon = (type: AISuggestion['type']) => {
    switch (type) {
      case 'content':
        return <FileText className="h-4 w-4" />;
      case 'structure':
        return <BarChart3 className="h-4 w-4" />;
      case 'grammar':
        return <CheckCircle className="h-4 w-4" />;
      case 'style':
        return <Wand2 className="h-4 w-4" />;
      case 'citation':
        return <Award className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  if (!selectedModule) {
    return (
      <div className="p-4 text-center text-gray-500">
        <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-sm">选择一个模块开始AI辅助写作</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 标题栏 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">AI写作助手</h3>
          {isAnalyzing && (
            <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoAnalysis(!autoAnalysis)}
            className={`p-1 rounded ${autoAnalysis ? 'text-blue-600' : 'text-gray-400'}`}
            title={autoAnalysis ? '关闭自动分析' : '开启自动分析'}
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-gray-600 hover:text-gray-900 rounded"
          >
            {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* 错误提示 */}
          {error && (
            <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* 标签导航 */}
          <div className="flex border-b border-gray-200">
            {[
              { key: 'suggestions', label: '建议', icon: Lightbulb },
              { key: 'analysis', label: '分析', icon: BarChart3 },
              { key: 'generate', label: '生成', icon: Wand2 }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium ${
                  activeTab === key
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
                {key === 'suggestions' && suggestions.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {suggestions.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto">
            {/* 建议标签 */}
            {activeTab === 'suggestions' && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">智能建议</h4>
                  <button
                    onClick={handleManualAnalysis}
                    disabled={isAnalyzing}
                    className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 flex items-center space-x-1"
                  >
                    <RefreshCw className={`h-3 w-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>刷新</span>
                  </button>
                </div>

                {suggestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">暂无建议</p>
                    <p className="text-xs text-gray-400 mt-1">继续编写内容获取AI建议</p>
                  </div>
                ) : (
                  suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className={`p-3 border rounded-lg ${
                        suggestion.isApplied ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-1 rounded ${
                          suggestion.type === 'content' ? 'bg-blue-100 text-blue-600' :
                          suggestion.type === 'structure' ? 'bg-purple-100 text-purple-600' :
                          suggestion.type === 'grammar' ? 'bg-green-100 text-green-600' :
                          suggestion.type === 'style' ? 'bg-yellow-100 text-yellow-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getSuggestionIcon(suggestion.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium text-gray-900 text-sm">{suggestion.title}</h5>
                            <div className="flex items-center space-x-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(suggestion.confidence)}`}>
                                {Math.round(suggestion.confidence * 100)}%
                              </span>
                              <button
                                onClick={() => dismissSuggestion(suggestion.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              {suggestion.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {!suggestion.isApplied && (
                              <button
                                onClick={() => handleApplySuggestion(suggestion)}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                              >
                                应用建议
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 分析标签 */}
            {activeTab === 'analysis' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">内容分析</h4>
                  <button
                    onClick={handleManualAnalysis}
                    disabled={isAnalyzing}
                    className="text-xs text-blue-600 hover:text-blue-700 disabled:text-gray-400 flex items-center space-x-1"
                  >
                    <RefreshCw className={`h-3 w-3 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    <span>重新分析</span>
                  </button>
                </div>

                {currentAnalysis ? (
                  <div className="space-y-4">
                    {/* 基础统计 */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-900 font-medium">字数</span>
                        </div>
                        <p className="text-lg font-semibold text-blue-900">{currentAnalysis.wordCount}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-900 font-medium">段落</span>
                        </div>
                        <p className="text-lg font-semibold text-green-900">{currentAnalysis.paragraphCount}</p>
                      </div>
                    </div>

                    {/* 质量指标 */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">可读性</span>
                          <span className="font-medium">{currentAnalysis.readabilityScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              currentAnalysis.readabilityScore >= 70 ? 'bg-green-500' :
                              currentAnalysis.readabilityScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${currentAnalysis.readabilityScore}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">连贯性</span>
                          <span className="font-medium">{currentAnalysis.coherenceScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              currentAnalysis.coherenceScore >= 70 ? 'bg-green-500' :
                              currentAnalysis.coherenceScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${currentAnalysis.coherenceScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 学术水平 */}
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Award className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-purple-900 font-medium">学术水平</span>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        currentAnalysis.academicLevel === 'advanced' ? 'bg-purple-100 text-purple-800' :
                        currentAnalysis.academicLevel === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {currentAnalysis.academicLevel === 'advanced' ? '高级' :
                         currentAnalysis.academicLevel === 'intermediate' ? '中级' : '基础'}
                      </span>
                    </div>

                    {/* 优势和改进建议 */}
                    {currentAnalysis.strengths.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span>优势</span>
                        </h5>
                        <ul className="space-y-1">
                          {currentAnalysis.strengths.map((strength, index) => (
                            <li key={index} className="text-sm text-green-700 flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {currentAnalysis.improvements.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                          <Target className="h-4 w-4 text-blue-600" />
                          <span>改进建议</span>
                        </h5>
                        <ul className="space-y-1">
                          {currentAnalysis.improvements.map((improvement, index) => (
                            <li key={index} className="text-sm text-blue-700 flex items-center space-x-2">
                              <AlertCircle className="h-3 w-3" />
                              <span>{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">
                      {isAnalyzing ? '正在分析内容...' : '暂无分析数据'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 生成标签 */}
            {activeTab === 'generate' && (
              <div className="p-4 space-y-4">
                <h4 className="font-medium text-gray-900">AI内容生成</h4>
                
                <div className="space-y-3">
                  <button
                    onClick={handleGenerateContinuation}
                    disabled={isGenerating || !selectedModule.content}
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    <Zap className="h-4 w-4" />
                    <span>{isGenerating ? '生成中...' : '智能续写'}</span>
                  </button>

                  <div className="text-xs text-gray-500 text-center">
                    基于当前内容和模块类型生成相关续写内容
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h5 className="font-medium text-gray-900 mb-2">快捷生成</h5>
                    <div className="grid grid-cols-1 gap-2">
                      <button className="text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200">
                        生成段落总结
                      </button>
                      <button className="text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200">
                        添加具体例子
                      </button>
                      <button className="text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200">
                        扩展理论分析
                      </button>
                      <button className="text-left p-2 text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200">
                        生成过渡段落
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AIWritingAssistant;