import React, { useState, useEffect } from 'react';
import { ContentAnalysisResult, ActionableInsight } from '../../services/content-analyzer';
import { useContentAnalysis } from '../../hooks/useContentAnalysis';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { ProgressBar } from '../UI/Progress';
import QualityIndicator from './QualityIndicator';
import SuggestionCard from './SuggestionCard';
import { cn } from '../../utils/cn';
import { 
  BarChart3, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw, 
  Settings,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Target,
  Clock,
  MoreHorizontal
} from 'lucide-react';

interface ContentAnalysisPanelProps {
  content: string;
  className?: string;
  onInsightClick?: (insight: ActionableInsight) => void;
  onReanalyze?: () => void;
  options?: {
    citationStyle?: 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'Harvard';
    paperType?: string;
    field?: string;
    showQuickResults?: boolean;
    enableRealTimeAnalysis?: boolean;
  };
}

type AnalysisTab = 'overview' | 'academics' | 'language' | 'structure' | 'innovation' | 'insights';

const ContentAnalysisPanel: React.FC<ContentAnalysisPanelProps> = ({
  content,
  className = '',
  onInsightClick,
  onReanalyze,
  options = {}
}) => {
  const {
    showQuickResults = true,
    enableRealTimeAnalysis = true,
    citationStyle = 'APA',
    paperType,
    field
  } = options;

  const [activeTab, setActiveTab] = useState<AnalysisTab>('overview');
  const [showSettings, setShowSettings] = useState(false);

  const {
    result,
    quickResult,
    isAnalyzing,
    error,
    progress,
    analyze,
    reanalyze,
    clearAnalysis,
    hasResult,
    shouldShowQuickResult
  } = useContentAnalysis(content, {
    enableRealTimeAnalysis,
    autoAnalyze: true,
    enableCache: true
  });

  // 手动分析
  const handleAnalyze = () => {
    analyze(content, { citationStyle, paperType, field, force: true });
    onReanalyze?.();
  };

  // 重新分析
  const handleReanalyze = () => {
    reanalyze({ citationStyle, paperType, field });
    onReanalyze?.();
  };

  // 分析指标卡片
  const renderMetricCard = (
    title: string,
    value: string | number,
    icon: React.ReactNode,
    color: string = 'blue',
    trend?: { value: number; isUp: boolean }
  ) => (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
          {trend && (
            <div className={`flex items-center text-sm ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`w-3 h-3 mr-1 ${!trend.isUp ? 'rotate-180' : ''}`} />
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          {icon}
        </div>
      </div>
    </Card>
  );

  // 标签页导航
  const tabs = [
    { id: 'overview', label: '总览', icon: BarChart3 },
    { id: 'academics', label: '学术规范', icon: BookOpen },
    { id: 'language', label: '语言质量', icon: FileText },
    { id: 'structure', label: '结构分析', icon: Target },
    { id: 'innovation', label: '创新性', icon: Lightbulb },
    { id: 'insights', label: '改进建议', icon: CheckCircle }
  ] as const;

  // 渲染总览标签页
  const renderOverviewTab = () => {
    if (!result) return null;

    const { overall, statistics } = result;

    return (
      <div className="space-y-6">
        {/* 总体评分 */}
        <Card className="p-6">
          <div className="text-center">
            <QualityIndicator 
              score={overall.score} 
              grade={overall.grade}
              size="large"
            />
            <h3 className="text-lg font-semibold mt-4 mb-2">内容质量评估</h3>
            <p className="text-gray-600 text-sm whitespace-pre-line">{overall.summary}</p>
          </div>
        </Card>

        {/* 关键指标 */}
        <div className="grid grid-cols-2 gap-4">
          {renderMetricCard(
            '总体评分',
            `${overall.score}分`,
            <BarChart3 className="w-5 h-5 text-blue-600" />,
            'blue'
          )}
          {renderMetricCard(
            '质量等级',
            overall.grade,
            <Target className="w-5 h-5 text-green-600" />,
            'green'
          )}
          {renderMetricCard(
            '字数统计',
            statistics.wordCount.toLocaleString(),
            <FileText className="w-5 h-5 text-purple-600" />,
            'purple'
          )}
          {renderMetricCard(
            '段落数',
            statistics.paragraphCount,
            <BookOpen className="w-5 h-5 text-orange-600" />,
            'orange'
          )}
        </div>

        {/* 各维度评分 */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">各维度评分</h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>学术规范性</span>
                <span>{result.academics.score}分</span>
              </div>
              <ProgressBar value={result.academics.score} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>语言质量</span>
                <span>{result.language.score}分</span>
              </div>
              <ProgressBar value={result.language.score} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>结构完整性</span>
                <span>{result.structure.score}分</span>
              </div>
              <ProgressBar value={result.structure.score} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>创新性</span>
                <span>{result.innovation.score}分</span>
              </div>
              <ProgressBar value={result.innovation.score} className="h-2" />
            </div>
          </div>
        </Card>

        {/* 关键词密度 */}
        {statistics.keywordDensity.length > 0 && (
          <Card className="p-6">
            <h4 className="font-semibold mb-4">关键词分析</h4>
            <div className="space-y-2">
              {statistics.keywordDensity.slice(0, 5).map((keyword, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{keyword.keyword}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{keyword.count}次</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {keyword.density.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  };

  // 渲染学术规范标签页
  const renderAcademicsTab = () => {
    if (!result) return null;

    const { academics } = result;

    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">学术规范性评分</h4>
            <QualityIndicator score={academics.score} />
          </div>
          
          {academics.issues.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-700">发现的问题</h5>
              {academics.issues.map((issue, index) => (
                <div key={index} className={`p-3 rounded-lg border-l-4 ${
                  issue.severity === 'high' ? 'border-red-500 bg-red-50' :
                  issue.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                      issue.severity === 'high' ? 'text-red-600' :
                      issue.severity === 'medium' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{issue.message}</p>
                      {issue.suggestion && (
                        <p className="text-xs text-gray-600 mt-1">{issue.suggestion}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {academics.recommendations.length > 0 && (
            <div className="mt-6">
              <h5 className="text-sm font-medium text-gray-700 mb-3">改进建议</h5>
              <ul className="space-y-2">
                {academics.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
    );
  };

  // 渲染语言质量标签页
  const renderLanguageTab = () => {
    if (!result) return null;

    const { language } = result;

    return (
      <div className="space-y-6">
        {/* 语言质量总览 */}
        <div className="grid grid-cols-2 gap-4">
          {renderMetricCard(
            '语法质量',
            `${language.grammar.score}分`,
            <CheckCircle className="w-5 h-5 text-green-600" />,
            'green'
          )}
          {renderMetricCard(
            '拼写准确性',
            `${language.spelling.score}分`,
            <FileText className="w-5 h-5 text-blue-600" />,
            'blue'
          )}
          {renderMetricCard(
            '写作风格',
            `${language.style.score}分`,
            <Lightbulb className="w-5 h-5 text-purple-600" />,
            'purple'
          )}
          {renderMetricCard(
            '可读性',
            language.readability.level,
            <BookOpen className="w-5 h-5 text-orange-600" />,
            'orange'
          )}
        </div>

        {/* 语法错误 */}
        {language.grammar.errors.length > 0 && (
          <Card className="p-6">
            <h4 className="font-semibold mb-4">语法问题</h4>
            <div className="space-y-3">
              {language.grammar.errors.map((error, index) => (
                <div key={index} className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <p className="text-sm font-medium text-red-800">{error.message}</p>
                  <p className="text-xs text-red-600 mt-1">建议：{error.suggestion}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 拼写错误 */}
        {language.spelling.errors.length > 0 && (
          <Card className="p-6">
            <h4 className="font-semibold mb-4">拼写问题</h4>
            <div className="space-y-3">
              {language.spelling.errors.map((error, index) => (
                <div key={index} className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800">
                    拼写错误："{error.word}"
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    建议：{error.suggestions.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 风格建议 */}
        {language.style.suggestions.length > 0 && (
          <Card className="p-6">
            <h4 className="font-semibold mb-4">风格改进</h4>
            <div className="space-y-3">
              {language.style.suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">{suggestion.message}</p>
                  <p className="text-xs text-blue-600 mt-1">建议：{suggestion.suggestion}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 可读性指标 */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">可读性分析</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">平均句长：</span>
              <span className="font-medium">{language.readability.metrics.averageSentenceLength.toFixed(1)} 词</span>
            </div>
            <div>
              <span className="text-gray-600">复杂词汇：</span>
              <span className="font-medium">{language.readability.metrics.complexWords} 个</span>
            </div>
            <div>
              <span className="text-gray-600">阅读等级：</span>
              <span className="font-medium">{language.readability.metrics.fleschKincaidGrade.toFixed(1)} 级</span>
            </div>
            <div>
              <span className="text-gray-600">易读性：</span>
              <span className="font-medium">{language.readability.metrics.fleschReadingEase.toFixed(1)} 分</span>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // 渲染结构分析标签页
  const renderStructureTab = () => {
    if (!result) return null;

    const { structure } = result;

    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">结构完整性</h4>
            <QualityIndicator score={structure.score} />
          </div>

          {/* 章节分析 */}
          <div className="space-y-4">
            <h5 className="text-sm font-medium text-gray-700">章节分析</h5>
            {structure.sections.map((section, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h6 className="font-medium">{section.title}</h6>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{section.wordCount} 词</span>
                    {section.isComplete ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                </div>
                
                {section.issues.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-red-600 font-medium">问题：</p>
                    <ul className="text-xs text-red-600 list-disc list-inside">
                      {section.issues.map((issue, i) => (
                        <li key={i}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {section.suggestions.length > 0 && (
                  <div>
                    <p className="text-xs text-blue-600 font-medium">建议：</p>
                    <ul className="text-xs text-blue-600 list-disc list-inside">
                      {section.suggestions.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 流程和连贯性 */}
          <div className="mt-6 space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">逻辑流程</h5>
              <div className="flex items-center space-x-2">
                <ProgressBar value={structure.flow.score} className="flex-1 h-2" />
                <span className="text-sm font-medium">{structure.flow.score}分</span>
              </div>
              {structure.flow.issues.length > 0 && (
                <div className="mt-2 space-y-1">
                  {structure.flow.issues.map((issue, index) => (
                    <p key={index} className="text-xs text-yellow-600">
                      {issue.section}: {issue.message}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">内容连贯性</h5>
              <div className="flex items-center space-x-2">
                <ProgressBar value={structure.coherence.score} className="flex-1 h-2" />
                <span className="text-sm font-medium">{structure.coherence.score}分</span>
              </div>
              {structure.coherence.suggestions.length > 0 && (
                <ul className="mt-2 text-xs text-blue-600 list-disc list-inside">
                  {structure.coherence.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // 渲染创新性标签页
  const renderInnovationTab = () => {
    if (!result) return null;

    const { innovation } = result;

    return (
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">创新性评估</h4>
            <QualityIndicator score={innovation.score} />
          </div>

          <div className="space-y-4">
            {/* 新颖性 */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">新颖性分析</h5>
              <div className="flex items-center space-x-2 mb-2">
                <ProgressBar value={innovation.novelty.score} className="flex-1 h-2" />
                <span className="text-sm font-medium">{innovation.novelty.score}分</span>
              </div>
              <div className="space-y-2">
                {innovation.novelty.aspects.map((aspect, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span>{aspect.aspect}</span>
                    <span className="text-gray-600">{aspect.score}分</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 学术贡献 */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">学术贡献</h5>
              <div className="flex items-center space-x-2 mb-2">
                <ProgressBar value={innovation.contribution.score} className="flex-1 h-2" />
                <span className="text-sm font-medium">{innovation.contribution.score}分</span>
              </div>
              <p className="text-sm text-gray-600">{innovation.contribution.analysis}</p>
            </div>

            {/* 原创性 */}
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">原创性检查</h5>
              <div className="flex items-center space-x-2 mb-2">
                <ProgressBar value={innovation.originality.score} className="flex-1 h-2" />
                <span className="text-sm font-medium">{innovation.originality.score}分</span>
              </div>
              {innovation.originality.similarityChecks.length > 0 && (
                <div className="text-xs text-gray-600">
                  发现 {innovation.originality.similarityChecks.length} 处相似内容
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // 渲染改进建议标签页
  const renderInsightsTab = () => {
    if (!result) return null;

    const { actionableInsights } = result;

    return (
      <div className="space-y-4">
        {actionableInsights.map((insight, index) => (
          <SuggestionCard
            key={index}
            insight={insight}
            onClick={() => onInsightClick?.(insight)}
          />
        ))}
        {actionableInsights.length === 0 && (
          <Card className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">表现优秀！</h3>
            <p className="text-gray-600">您的内容质量很高，暂无重要改进建议。</p>
          </Card>
        )}
      </div>
    );
  };

  // 渲染内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'academics': return renderAcademicsTab();
      case 'language': return renderLanguageTab();
      case 'structure': return renderStructureTab();
      case 'innovation': return renderInnovationTab();
      case 'insights': return renderInsightsTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <div className={cn('flex flex-col h-full bg-white', className)}>
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">内容分析</h2>
          {isAnalyzing && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>分析中...</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {hasResult && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReanalyze}
              disabled={isAnalyzing}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              重新分析
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 快速结果显示 */}
      {shouldShowQuickResult && showQuickResults && quickResult && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="text-gray-600">快速评分：</span>
                <span className="font-semibold text-blue-600">{quickResult.score}分</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">发现问题：</span>
                <span className="font-semibold text-orange-600">{quickResult.issues}处</span>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              详细分析
            </Button>
          </div>
        </div>
      )}

      {/* 进度条 */}
      {isAnalyzing && (
        <div className="px-4 py-2 border-b border-gray-200">
          <ProgressBar value={progress} className="h-1" />
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200">
          <div className="flex items-center space-x-2 text-red-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAnalyze}
              className="ml-auto"
            >
              重试
            </Button>
          </div>
        </div>
      )}

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {hasResult ? (
          <>
            {/* 标签页导航 */}
            <div className="flex overflow-x-auto border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as AnalysisTab)}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 标签页内容 */}
            <div className="flex-1 overflow-y-auto p-4">
              {renderTabContent()}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            {!content.trim() ? (
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">开始写作</h3>
                <p className="text-gray-500">输入内容后自动进行智能分析</p>
              </div>
            ) : isAnalyzing ? (
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">正在分析...</h3>
                <p className="text-gray-600">AI正在深度分析您的内容</p>
              </div>
            ) : (
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">准备分析</h3>
                <Button onClick={handleAnalyze}>
                  开始分析
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 时间戳 */}
      {result && (
        <div className="px-4 py-2 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>分析时间：{result.timestamp.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>GLM-4.5 驱动</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentAnalysisPanel;