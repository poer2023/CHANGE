import React, { useState, useCallback } from 'react';
import { 
  ContentAnalysisPanel, 
  QualityIndicator, 
  SuggestionCard,
  SuggestionList
} from '../../components/analysis';
import { 
  useContentAnalysis, 
  useQuickQualityCheck,
  useBatchContentAnalysis
} from '../../hooks/useContentAnalysis';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { ProgressBar as Progress } from '../../components/UI/Progress';
import { cn } from '../../utils/cn';
import { 
  FileText, 
  BarChart3, 
  Lightbulb, 
  CheckCircle, 
  Settings,
  RefreshCw,
  Download,
  Share2,
  Zap,
  Target,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  Star,
  Clock,
  Users,
  Globe,
  Code,
  Database
} from 'lucide-react';

// 示例文档
const SAMPLE_DOCUMENTS = {
  academic: {
    title: '学术论文示例',
    content: `人工智能在现代教育中的应用与挑战

摘要

随着人工智能技术的快速发展，其在教育领域的应用越来越广泛。本文系统分析了AI技术在个性化学习、智能辅导、自动评估等方面的应用现状，探讨了实施过程中面临的技术、伦理和社会挑战，并提出了相应的解决策略。研究表明，AI技术能够显著提升教育效率和学习效果，但需要在技术标准、数据隐私、算法公平性等方面建立完善的保障机制。

关键词：人工智能；教育技术；个性化学习；智能辅导系统

1. 引言

教育是人类社会发展的基石，而技术的进步始终推动着教育方式的变革。从传统的黑板粉笔到多媒体教学，再到现在的人工智能辅助教学，每一次技术革新都为教育带来了新的可能性。人工智能（AI）作为当前最具变革性的技术之一，正在深刻地改变着教育的各个方面。

本文旨在全面分析人工智能在现代教育中的应用现状，探讨其带来的机遇与挑战，并提出相应的发展策略。通过系统的研究和分析，我们希望为教育工作者、政策制定者和技术开发者提供有价值的参考。

2. 人工智能在教育中的主要应用

2.1 个性化学习系统

个性化学习是人工智能在教育领域最具前景的应用之一。传统的"一刀切"教学模式无法满足每个学生的个体需求，而AI技术能够根据学生的学习能力、兴趣偏好、知识基础等因素，为每个学生量身定制学习方案。

智能推荐算法能够分析学生的学习行为数据，识别学习模式和薄弱环节，从而推荐最适合的学习内容和学习路径。这种个性化的学习体验不仅提高了学习效率，还能增强学生的学习动机和自信心。`
  },
  business: {
    title: '商业报告示例',
    content: `2023年数字化转型趋势报告

执行摘要

随着全球数字化进程的加速，企业数字化转型已成为保持竞争优势的关键战略。本报告基于对500家企业的深度调研，分析了2023年数字化转型的主要趋势、挑战和机遇。

主要发现：
• 85%的企业已将数字化转型列为战略优先级
• 云计算采用率达到78%，同比增长23%
• 人工智能应用在企业中的渗透率为45%
• 数据驱动决策成为企业核心竞争力

1. 市场概览

全球数字化转型市场规模预计将从2022年的4800亿美元增长到2027年的1.2万亿美元，年复合增长率达到20.1%。这一增长主要由以下因素驱动：

1.1 技术成熟度提升
云计算、大数据、人工智能等核心技术日趋成熟，为企业数字化转型提供了坚实的技术基础。边缘计算、5G网络等新兴技术的发展，进一步拓展了数字化应用的边界。

1.2 市场竞争压力
在日益激烈的市场竞争中，传统的商业模式面临冲击。企业必须通过数字化手段提升运营效率、创新产品服务、优化客户体验，以保持竞争优势。`
  },
  creative: {
    title: '创意写作示例',
    content: `星空下的约定

夜幕降临，繁星点缀着深蓝色的天空，如同无数颗钻石镶嵌在天鹅绒般的帷幕上。微风轻抚过脸颊，带来阵阵花香，让人心旷神怡。

林小雨站在山顶的观星台上，仰望着浩瀚的星空。她的眼中闪烁着与星星一样的光芒，充满了对未来的憧憬和对梦想的执着。今晚是她和星空的约定——无论遇到什么困难，都要坚持追求心中的那颗最亮的星。

"每一颗星星都有自己的故事。"她轻声自语，声音在空旷的山顶显得格外清晰。这是爷爷生前常说的话，也是支撑她走过无数个困难时刻的精神力量。

爷爷是一位天文学家，从小就教导她要像星星一样，即使在最黑暗的夜晚也要发出自己的光芒。他说，人生就像观星，需要耐心、专注，还要有一颗纯净的心。

小雨想起了那些艰难的日子——高考失利、家庭变故、就业挫折...每当她感到迷茫和绝望时，都会来到这个地方，在星空下寻找答案和力量。`
  }
};

/**
 * 内容分析演示组件
 */
const ContentAnalysisDemo: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<keyof typeof SAMPLE_DOCUMENTS>('academic');
  const [customContent, setCustomContent] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState<any[]>([]);

  // 使用内容分析Hook
  const {
    result: analysis,
    isAnalyzing,
    error,
    analyze: analyzeContent,
    clearAnalysis,
    getCacheStats
  } = useContentAnalysis('', {
    enableCache: true,
    autoAnalyze: false,
    enableRealTimeAnalysis: false
  });

  // 使用快速质量检查Hook
  const {
    result: quickResult,
    isChecking,
    hasResult: hasQuickResult
  } = useQuickQualityCheck('');

  // 使用批量分析Hook
  const {
    analyses: batchResults,
    isAnalyzing: isBatchProcessing,
    analyzeBatch: processBatch,
    clearBatch: clearBatchResults
  } = useBatchContentAnalysis();

  // 快速检查函数
  const performQuickCheck = useCallback(async (content: string) => {
    try {
      const { quickQualityCheck } = await import('../../services/content-analyzer');
      return await quickQualityCheck(content);
    } catch (error) {
      console.error('快速检查失败:', error);
      return null;
    }
  }, []);

  // 获取当前分析的内容
  const getCurrentContent = () => {
    return isCustomMode ? customContent : SAMPLE_DOCUMENTS[selectedDoc].content;
  };

  // 执行完整分析
  const handleFullAnalysis = useCallback(async () => {
    const content = getCurrentContent();
    if (!content.trim()) return;

    try {
      const result = await analyzeContent(content);
      if (result) {
        setAnalysisHistory(prev => [{
          id: Date.now(),
          timestamp: new Date().toISOString(),
          content: content.substring(0, 100) + '...',
          result,
          type: 'full'
        }, ...prev.slice(0, 9)]); // 保留最近10条记录
      }
    } catch (error) {
      console.error('分析失败:', error);
    }
  }, [isCustomMode, selectedDoc, customContent, analyzeContent]);

  // 执行快速检查
  const handleQuickCheck = useCallback(async () => {
    const content = getCurrentContent();
    if (!content.trim()) return;

    try {
      const result = await performQuickCheck(content);
      if (result) {
        setAnalysisHistory(prev => [{
          id: Date.now(),
          timestamp: new Date().toISOString(),
          content: content.substring(0, 100) + '...',
          result,
          type: 'quick'
        }, ...prev.slice(0, 9)]);
      }
    } catch (error) {
      console.error('快速检查失败:', error);
    }
  }, [isCustomMode, selectedDoc, customContent, performQuickCheck]);

  // 批量处理示例文档
  const handleBatchAnalysis = useCallback(async () => {
    const documents = Object.values(SAMPLE_DOCUMENTS).map(doc => ({
      id: doc.title,
      content: doc.content,
      metadata: { title: doc.title }
    }));

    try {
      await processBatch(documents);
    } catch (error) {
      console.error('批量分析失败:', error);
    }
  }, [processBatch]);

  // 导出分析结果
  const handleExportResults = useCallback(() => {
    const exportData = {
      timestamp: new Date().toISOString(),
      currentAnalysis: analysis,
      quickResult,
      batchResults: Object.fromEntries(batchResults),
      history: analysisHistory,
      cacheStats: getCacheStats()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `content_analysis_${Date.now()}.json`);
    linkElement.click();
  }, [analysis, quickResult, batchResults, analysisHistory, getCacheStats]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            内容分析演示平台
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            体验强大的AI驱动内容分析功能，包括学术标准检查、语言质量评估、结构完整性分析等。
            支持实时分析、批量处理和缓存优化，为您的写作提供专业的质量评估和改进建议。
          </p>
        </div>

        {/* 功能导航 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={!isCustomMode ? "default" : "outline"}
              onClick={() => setIsCustomMode(false)}
              className="flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              示例文档
            </Button>
            <Button
              variant={isCustomMode ? "default" : "outline"}
              onClick={() => setIsCustomMode(true)}
              className="flex items-center gap-2"
            >
              <Code className="w-4 h-4" />
              自定义内容
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：内容输入区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 内容选择/输入 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                内容输入
              </h2>

              {!isCustomMode ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(SAMPLE_DOCUMENTS).map(([key, doc]) => (
                      <Button
                        key={key}
                        variant={selectedDoc === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDoc(key as keyof typeof SAMPLE_DOCUMENTS)}
                      >
                        {doc.title}
                      </Button>
                    ))}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <h3 className="font-medium mb-2">{SAMPLE_DOCUMENTS[selectedDoc].title}</h3>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {SAMPLE_DOCUMENTS[selectedDoc].content}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    placeholder="请输入您要分析的内容..."
                    className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="text-sm text-gray-500">
                    字数: {customContent.length} | 段落: {customContent.split('\n\n').length}
                  </div>
                </div>
              )}
            </Card>

            {/* 分析控制 */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                分析控制
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={handleQuickCheck}
                  disabled={isChecking || !getCurrentContent().trim()}
                  className="flex items-center gap-2"
                >
                  {isChecking ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  快速检查
                </Button>

                <Button
                  onClick={handleFullAnalysis}
                  disabled={isAnalyzing || !getCurrentContent().trim()}
                  className="flex items-center gap-2"
                >
                  {isAnalyzing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <BarChart3 className="w-4 h-4" />
                  )}
                  完整分析
                </Button>

                <Button
                  onClick={handleBatchAnalysis}
                  disabled={isBatchProcessing}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isBatchProcessing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Database className="w-4 h-4" />
                  )}
                  批量分析
                </Button>
              </div>

              {/* 进度指示器 */}
              {(isAnalyzing || isChecking || isBatchProcessing) && (
                <div className="mt-4">
                  <Progress value={65} className="w-full" />
                  <p className="text-sm text-gray-600 mt-2">
                    {isAnalyzing && "正在进行完整分析..."}
                    {isChecking && "正在进行快速检查..."}
                    {isBatchProcessing && "正在处理批量分析..."}
                  </p>
                </div>
              )}
            </Card>

            {/* 分析结果展示 */}
            {(analysis || quickResult) && (
              <ContentAnalysisPanel
                content={getCurrentContent()}
                onReanalyze={() => analyzeContent(getCurrentContent(), { force: true })}
              />
            )}

            {/* 批量分析结果 */}
            {batchResults.size > 0 && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    批量分析结果
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearBatchResults}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    清除结果
                  </Button>
                </div>

                <div className="space-y-4">
                  {Array.from(batchResults.entries()).map(([id, result], index) => (
                    <div key={id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{id || `文档 ${index + 1}`}</h3>
                        <QualityIndicator 
                          score={result?.overall?.score || 0}
                          grade={result?.overall?.grade || 'F'}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {result?.overall?.summary || '分析完成'}
                      </p>
                      {result?.actionableInsights && (
                        <SuggestionList 
                          insights={result.actionableInsights.slice(0, 3)}
                          maxVisible={3}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* 右侧：工具面板 */}
          <div className="space-y-6">
            {/* 质量指标 */}
            {(analysis || quickResult) && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  质量评分
                </h3>
                <QualityIndicator 
                  score={analysis?.overall?.score || quickResult?.score || 0}
                  grade={analysis?.overall?.grade || 'F'}
                  size="large"
                />
              </Card>
            )}

            {/* 快速操作 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                快速操作
              </h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportResults}
                  className="w-full flex items-center gap-2"
                  disabled={!analysis && !quickResult && batchResults.size === 0}
                >
                  <Download className="w-4 h-4" />
                  导出结果
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    clearAnalysis();
                    clearBatchResults();
                    setAnalysisHistory([]);
                  }}
                  className="w-full flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  清除所有
                </Button>
              </div>
            </Card>

            {/* 分析历史 */}
            {analysisHistory.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  分析历史
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {analysisHistory.map((item) => (
                    <div key={item.id} className="bg-gray-50 p-3 rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          item.type === 'full' ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        )}>
                          {item.type === 'full' ? '完整分析' : '快速检查'}
                        </span>
                        <span className="text-gray-500">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{item.content}</p>
                      {item.result?.overall && (
                        <div className="mt-2 flex items-center gap-2">
                          <QualityIndicator 
                            score={item.result.overall.score}
                            grade={item.result.overall.grade}
                            size="small"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 缓存统计 */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                缓存统计
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">总条目:</span>
                  <span className="ml-2 font-medium">{getCacheStats().totalEntries}</span>
                </div>
                <div>
                  <span className="text-gray-600">有效条目:</span>
                  <span className="ml-2 font-medium">{getCacheStats().validEntries}</span>
                </div>
                <div>
                  <span className="text-gray-600">过期条目:</span>
                  <span className="ml-2 font-medium">{getCacheStats().expiredEntries}</span>
                </div>
                <div>
                  <span className="text-gray-600">最新更新:</span>
                  <span className="ml-2 font-medium">
                    {getCacheStats().newestEntry ? new Date(Number(getCacheStats().newestEntry)).toLocaleTimeString() : '无'}
                  </span>
                </div>
                <div className="col-span-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAnalysis}
                    className="w-full"
                  >
                    清除所有缓存
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentAnalysisDemo;