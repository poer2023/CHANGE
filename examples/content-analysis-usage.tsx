import React, { useState, useCallback } from 'react';
import { 
  ContentAnalysisPanel, 
  QualityIndicator, 
  SuggestionCard 
} from '../src/components/analysis';
import { 
  useContentAnalysis, 
  useQuickQualityCheck 
} from '../src/hooks/useContentAnalysis';
import { Button } from '../src/components/UI/Button';
import { Card } from '../src/components/UI/Card';
import { Input } from '../src/components/UI/Input';
import { 
  FileText, 
  BarChart3, 
  Lightbulb, 
  CheckCircle, 
  Settings,
  RefreshCw
} from 'lucide-react';

/**
 * 智能内容分析引擎使用示例
 * 
 * 这个示例展示了如何在实际应用中使用内容分析功能：
 * 1. 实时内容分析
 * 2. 质量指示器显示
 * 3. 改进建议展示
 * 4. 分析结果面板
 */

const ContentAnalysisExample: React.FC = () => {
  const [content, setContent] = useState(`
人工智能在现代社会中的应用越来越广泛。从自动驾驶汽车到智能语音助手，AI技术正在改变我们的生活方式。

然而，随着AI技术的快速发展，我们也面临着许多挑战。数据隐私、算法偏见和就业替代等问题需要我们认真考虑。

本文将探讨人工智能技术的发展现状、应用领域以及未来面临的挑战，并提出相应的解决方案和建议。

在技术发展方面，深度学习和神经网络的突破为AI带来了新的可能性。机器学习算法的不断完善使得计算机能够更好地理解和处理人类语言。

教育领域的AI应用包括个性化学习、智能辅导系统和自动评分等。这些技术帮助教师更好地了解学生的学习情况，提供针对性的教学支持。

医疗健康领域也是AI应用的重要方向。医学影像分析、药物研发和疾病预测等应用正在改善医疗服务质量。

总的来说，人工智能技术的发展为社会带来了巨大的机遇，但同时也需要我们谨慎对待相关风险，确保技术发展能够造福人类。
`.trim());

  const [analysisSettings, setAnalysisSettings] = useState({
    citationStyle: 'APA' as const,
    paperType: '学术论文',
    field: '计算机科学',
    enableRealTimeAnalysis: true,
    showQuickResults: true
  });

  // 使用内容分析Hook
  const {
    result,
    quickResult,
    isAnalyzing,
    error,
    analyze,
    reanalyze,
    clearAnalysis,
    hasResult,
    shouldShowQuickResult
  } = useContentAnalysis(content, {
    enableRealTimeAnalysis: analysisSettings.enableRealTimeAnalysis,
    autoAnalyze: true,
    enableCache: true,
    debounceDelay: 1000
  });

  // 快速质量检查Hook
  const { 
    result: quickQualityResult, 
    isChecking: isQuickChecking 
  } = useQuickQualityCheck(content, 500);

  // 处理内容变化
  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  // 处理建议点击
  const handleInsightClick = useCallback((insight: any) => {
    console.log('Insight clicked:', insight);
    // 这里可以实现具体的建议应用逻辑
    alert(`点击了建议: ${insight.title}\n\n${insight.description}\n\n建议操作: ${insight.action}`);
  }, []);

  // 手动分析
  const handleManualAnalysis = useCallback(() => {
    analyze(content, {
      citationStyle: analysisSettings.citationStyle,
      paperType: analysisSettings.paperType,
      field: analysisSettings.field,
      force: true
    });
  }, [content, analysisSettings, analyze]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">智能内容分析引擎</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BarChart3 className="w-4 h-4" />
              <span>GLM-4.5 驱动</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* 快速质量指示器 */}
            {quickQualityResult && (
              <QualityIndicator 
                score={quickQualityResult.score}
                size="small"
                showScore={true}
                showGrade={true}
                animated={true}
              />
            )}
            
            {/* 分析按钮 */}
            <Button
              onClick={handleManualAnalysis}
              disabled={isAnalyzing}
              className="flex items-center space-x-2"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>分析中...</span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  <span>开始分析</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* 左侧编辑区域 */}
        <div className="flex-1 flex flex-col bg-white">
          {/* 编辑器工具栏 */}
          <div className="border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-medium text-gray-900">内容编辑</h2>
                <div className="text-sm text-gray-500">
                  {content.length} 字符 | {content.split(/\s+/).filter(w => w.length > 0).length} 词
                </div>
              </div>
              
              {/* 分析设置 */}
              <div className="flex items-center space-x-2">
                <select
                  value={analysisSettings.citationStyle}
                  onChange={(e) => setAnalysisSettings(prev => ({
                    ...prev,
                    citationStyle: e.target.value as any
                  }))}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="APA">APA</option>
                  <option value="MLA">MLA</option>
                  <option value="Chicago">Chicago</option>
                  <option value="IEEE">IEEE</option>
                  <option value="Harvard">Harvard</option>
                </select>
                
                <select
                  value={analysisSettings.field}
                  onChange={(e) => setAnalysisSettings(prev => ({
                    ...prev,
                    field: e.target.value
                  }))}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="计算机科学">计算机科学</option>
                  <option value="医学">医学</option>
                  <option value="教育学">教育学</option>
                  <option value="经济学">经济学</option>
                  <option value="文学">文学</option>
                </select>
                
                <label className="flex items-center space-x-1 text-sm">
                  <input
                    type="checkbox"
                    checked={analysisSettings.enableRealTimeAnalysis}
                    onChange={(e) => setAnalysisSettings(prev => ({
                      ...prev,
                      enableRealTimeAnalysis: e.target.checked
                    }))}
                  />
                  <span>实时分析</span>
                </label>
              </div>
            </div>
          </div>

          {/* 内容编辑器 */}
          <div className="flex-1 p-4">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="在此输入您的学术内容..."
              className="w-full h-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm leading-relaxed"
            />
          </div>

          {/* 状态栏 */}
          <div className="border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              {isAnalyzing && (
                <div className="flex items-center space-x-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>AI正在分析内容...</span>
                </div>
              )}
              
              {shouldShowQuickResult && quickResult && (
                <div className="flex items-center space-x-2">
                  <span>快速评分: {quickResult.score}分</span>
                  <span>发现问题: {quickResult.issues}处</span>
                </div>
              )}
            </div>
            
            {error && (
              <div className="text-red-600 text-sm">
                分析出错: {error}
              </div>
            )}
          </div>
        </div>

        {/* 右侧分析面板 */}
        <div className="w-96 border-l border-gray-200">
          <ContentAnalysisPanel
            content={content}
            onInsightClick={handleInsightClick}
            onReanalyze={handleManualAnalysis}
            options={{
              citationStyle: analysisSettings.citationStyle,
              paperType: analysisSettings.paperType,
              field: analysisSettings.field,
              showQuickResults: analysisSettings.showQuickResults,
              enableRealTimeAnalysis: analysisSettings.enableRealTimeAnalysis
            }}
          />
        </div>
      </div>

      {/* 底部建议区域 */}
      {hasResult && result?.actionableInsights && result.actionableInsights.length > 0 && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
              改进建议
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {result.actionableInsights.slice(0, 3).map((insight, index) => (
                <SuggestionCard
                  key={index}
                  insight={insight}
                  onClick={handleInsightClick}
                  showActions={true}
                  showProgress={true}
                  className="max-w-sm"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 简化的质量指示器示例
const QualityIndicatorExample: React.FC = () => {
  const scores = [95, 87, 72, 65, 45];
  const sizes = ['small', 'medium', 'large'] as const;

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">质量指示器示例</h2>
      
      {/* 不同分数示例 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">不同质量等级</h3>
        <div className="flex flex-wrap gap-4">
          {scores.map((score, index) => (
            <QualityIndicator
              key={index}
              score={score}
              size="medium"
              showScore={true}
              showGrade={true}
              animated={true}
            />
          ))}
        </div>
      </div>

      {/* 不同尺寸示例 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">不同尺寸</h3>
        <div className="flex items-end gap-8">
          {sizes.map((size, index) => (
            <QualityIndicator
              key={index}
              score={85}
              size={size}
              showScore={true}
              showGrade={true}
              animated={true}
            />
          ))}
        </div>
      </div>

      {/* 带趋势的示例 */}
      <div>
        <h3 className="text-lg font-semibold mb-4">带趋势显示</h3>
        <div className="flex gap-4">
          <QualityIndicator
            score={88}
            size="large"
            showScore={true}
            showGrade={true}
            showTrend={true}
            trend={{
              value: 12,
              direction: 'up',
              isImprovement: true
            }}
            animated={true}
          />
          <QualityIndicator
            score={72}
            size="large"
            showScore={true}
            showGrade={true}
            showTrend={true}
            trend={{
              value: 8,
              direction: 'down',
              isImprovement: false
            }}
            animated={true}
          />
        </div>
      </div>
    </div>
  );
};

// App组件，包含路由示例
const ContentAnalysisApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'analysis' | 'indicators'>('analysis');

  return (
    <div>
      {/* 导航 */}
      <nav className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">内容分析引擎示例</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('analysis')}
              className={`px-3 py-1 rounded ${
                currentView === 'analysis' 
                  ? 'bg-blue-800' 
                  : 'bg-blue-500 hover:bg-blue-700'
              }`}
            >
              内容分析
            </button>
            <button
              onClick={() => setCurrentView('indicators')}
              className={`px-3 py-1 rounded ${
                currentView === 'indicators' 
                  ? 'bg-blue-800' 
                  : 'bg-blue-500 hover:bg-blue-700'
              }`}
            >
              质量指示器
            </button>
          </div>
        </div>
      </nav>

      {/* 内容区域 */}
      {currentView === 'analysis' ? (
        <ContentAnalysisExample />
      ) : (
        <QualityIndicatorExample />
      )}
    </div>
  );
};

export default ContentAnalysisApp;

// 使用说明和最佳实践
export const UsageGuide = {
  /**
   * 1. 基本使用
   * 
   * import { useContentAnalysis } from '@/hooks/useContentAnalysis';
   * import { ContentAnalysisPanel } from '@/components/analysis';
   * 
   * const MyEditor = () => {
   *   const [content, setContent] = useState('');
   *   const { result, isAnalyzing } = useContentAnalysis(content);
   *   
   *   return (
   *     <div className="flex">
   *       <textarea value={content} onChange={e => setContent(e.target.value)} />
   *       <ContentAnalysisPanel content={content} />
   *     </div>
   *   );
   * };
   */

  /**
   * 2. 自定义分析设置
   * 
   * const { result, analyze } = useContentAnalysis(content, {
   *   enableRealTimeAnalysis: true,
   *   enableCache: true,
   *   debounceDelay: 1000
   * });
   * 
   * // 手动触发分析
   * const handleAnalyze = () => {
   *   analyze(content, {
   *     citationStyle: 'APA',
   *     paperType: '学术论文',
   *     field: '计算机科学'
   *   });
   * };
   */

  /**
   * 3. 处理分析结果
   * 
   * const handleInsightClick = (insight) => {
   *   // 应用建议
   *   if (insight.category === 'correction') {
   *     // 修正错误
   *   } else if (insight.category === 'improvement') {
   *     // 改进内容
   *   }
   * };
   */

  /**
   * 4. 质量指示器使用
   * 
   * <QualityIndicator 
   *   score={85}
   *   size="large"
   *   showTrend={true}
   *   trend={{ value: 10, direction: 'up', isImprovement: true }}
   * />
   */

  bestPractices: [
    '启用缓存以避免重复分析相同内容',
    '合理设置防抖延迟以平衡响应速度和性能',
    '根据文档类型选择合适的引用格式',
    '及时处理高优先级的改进建议',
    '定期查看分析历史以跟踪改进进度',
    '配置GLM-4.5 API密钥以获得最佳分析效果'
  ]
};