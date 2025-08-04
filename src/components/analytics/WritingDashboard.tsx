import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import QualityScore from './QualityScore';
// import ProgressChart from './ProgressChart';
// import TrendAnalysis from './TrendAnalysis';
// import ImprovementSuggestions from './ImprovementSuggestions';
import { usePaperStore } from '../../store/paperStore';

interface WritingDashboardProps {
  className?: string;
  paperId?: string;
}

interface DashboardData {
  qualityScore: number;
  progressData: {
    totalWords: number;
    targetWords: number;
    completedSections: number;
    totalSections: number;
    timeSpent: number; // minutes
    averageWritingSpeed: number; // words per minute
    sessionsToday: number;
  };
  trendData: {
    dailyProgress: Array<{
      date: string;
      words: number;
      quality: number;
      timeSpent: number;
    }>;
    weeklyTrends: {
      averageDaily: number;
      improvement: number;
      consistency: number;
    };
  };
  suggestions: Array<{
    id: string;
    type: 'quality' | 'productivity' | 'structure' | 'style';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    actionable: boolean;
  }>;
}

const WritingDashboard: React.FC<WritingDashboardProps> = ({ className = '', paperId }) => {
  const { currentPaper, papers } = usePaperStore();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'progress' | 'trends' | 'suggestions'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, [currentPaper, paperId, selectedTimeRange]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // 模拟从API获取分析数据
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: DashboardData = {
        qualityScore: calculateQualityScore(currentPaper),
        progressData: {
          totalWords: currentPaper?.wordCount || 0,
          targetWords: currentPaper?.wordCount ? Math.max(currentPaper.wordCount * 1.5, 5000) : 5000,
          completedSections: currentPaper?.sections?.filter(s => s.content.length > 100).length || 0,
          totalSections: currentPaper?.sections?.length || 8,
          timeSpent: Math.floor(Math.random() * 240) + 60, // 1-5 hours
          averageWritingSpeed: Math.floor(Math.random() * 30) + 20, // 20-50 words/min
          sessionsToday: Math.floor(Math.random() * 5) + 1,
        },
        trendData: {
          dailyProgress: generateDailyProgress(),
          weeklyTrends: {
            averageDaily: Math.floor(Math.random() * 500) + 200,
            improvement: (Math.random() - 0.5) * 40, // -20% to +20%
            consistency: Math.random() * 40 + 60, // 60-100%
          },
        },
        suggestions: generateSuggestions(currentPaper),
      };
      
      setDashboardData(mockData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateQualityScore = (paper: any): number => {
    if (!paper) return 0;
    
    let score = 0;
    let factors = 0;
    
    // 字数评分 (25%)
    if (paper.wordCount > 0) {
      const wordScore = Math.min(paper.wordCount / 5000, 1) * 25;
      score += wordScore;
    }
    factors += 25;
    
    // 结构完整性 (25%)
    if (paper.sections && paper.sections.length > 0) {
      const completedSections = paper.sections.filter((s: any) => s.content.length > 50).length;
      const structureScore = (completedSections / paper.sections.length) * 25;
      score += structureScore;
    }
    factors += 25;
    
    // 内容丰富度 (25%)
    if (paper.content) {
      const contentLength = paper.content.length;
      const contentScore = Math.min(contentLength / 10000, 1) * 25;
      score += contentScore;
    }
    factors += 25;
    
    // 元数据完整性 (25%)
    let metadataScore = 0;
    if (paper.title && paper.title.length > 10) metadataScore += 8;
    if (paper.abstract && paper.abstract.length > 100) metadataScore += 8;
    if (paper.keywords && paper.keywords.length >= 3) metadataScore += 9;
    score += metadataScore;
    factors += 25;
    
    return Math.round(score);
  };

  const generateDailyProgress = () => {
    const days = selectedTimeRange === '7d' ? 7 : selectedTimeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        words: Math.floor(Math.random() * 800) + 100,
        quality: Math.floor(Math.random() * 30) + 70,
        timeSpent: Math.floor(Math.random() * 180) + 30,
      });
    }
    
    return data;
  };

  const generateSuggestions = (paper: any) => {
    const suggestions = [
      {
        id: '1',
        type: 'quality' as const,
        title: '提升论文结构清晰度',
        description: '建议在各章节之间添加更明确的过渡段落，增强逻辑连贯性。',
        priority: 'high' as const,
        actionable: true,
      },
      {
        id: '2',
        type: 'productivity' as const,
        title: '优化写作时间安排',
        description: '根据您的写作模式，建议在上午9-11点进行核心内容写作。',
        priority: 'medium' as const,
        actionable: true,
      },
      {
        id: '3',
        type: 'structure' as const,
        title: '完善文献综述部分',
        description: '当前文献综述部分内容较少，建议增加更多相关研究的讨论。',
        priority: 'high' as const,
        actionable: true,
      },
      {
        id: '4',
        type: 'style' as const,
        title: '词汇多样性提升',
        description: '检测到某些词汇使用频率较高，建议使用更多样化的表达方式。',
        priority: 'low' as const,
        actionable: true,
      },
    ];
    
    return suggestions;
  };

  const exportReport = async () => {
    if (!dashboardData) return;
    
    const reportData = {
      paper: currentPaper?.title || 'Unknown Paper',
      generatedAt: new Date().toISOString(),
      timeRange: selectedTimeRange,
      ...dashboardData,
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `writing-analysis-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600">加载分析数据中...</span>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500 mb-4">暂无分析数据</div>
        <Button onClick={loadDashboardData} variant="outline">
          重新加载
        </Button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 顶部控制栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">写作分析仪表板</h1>
          <p className="text-gray-600 mt-1">
            {currentPaper?.title || '所有论文'} - 深度分析与洞察
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* 时间范围选择 */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeRange === range
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range === '7d' ? '7天' : range === '30d' ? '30天' : '90天'}
              </button>
            ))}
          </div>
          
          {/* 导出按钮 */}
          <Button onClick={exportReport} variant="outline" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            导出报告
          </Button>
        </div>
      </div>

      {/* 视图切换 */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'overview', label: '总览' },
          { key: 'progress', label: '进度' },
          { key: 'trends', label: '趋势' },
          { key: 'suggestions', label: '建议' },
        ].map((view) => (
          <button
            key={view.key}
            onClick={() => setSelectedView(view.key as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedView === view.key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="min-h-[500px]">
        {selectedView === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <QualityScore
                score={dashboardData.qualityScore}
                breakdown={{
                  structure: Math.floor(dashboardData.qualityScore * 0.9),
                  content: Math.floor(dashboardData.qualityScore * 1.1),
                  style: Math.floor(dashboardData.qualityScore * 0.95),
                  formatting: Math.floor(dashboardData.qualityScore * 1.05),
                }}
              />
              {/* <ProgressChart data={dashboardData.progressData} /> */}
              <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Progress Chart - Coming Soon</p>
              </div>
            </div>
            <div className="space-y-6">
              {/* <TrendAnalysis
                data={dashboardData.trendData}
                timeRange={selectedTimeRange}
              /> */}
              <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Trend Analysis - Coming Soon</p>
              </div>
              {/* <ImprovementSuggestions
                suggestions={dashboardData.suggestions.slice(0, 3)}
                showAll={false}
              /> */}
              <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Improvement Suggestions - Coming Soon</p>
              </div>
            </div>
          </div>
        )}

        {selectedView === 'progress' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              {/* <ProgressChart
                data={dashboardData.progressData}
                detailed={true}
              /> */}
              <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Detailed Progress Chart - Coming Soon</p>
              </div>
            </div>
            <div>
              <QualityScore
                score={dashboardData.qualityScore}
                breakdown={{
                  structure: Math.floor(dashboardData.qualityScore * 0.9),
                  content: Math.floor(dashboardData.qualityScore * 1.1),
                  style: Math.floor(dashboardData.qualityScore * 0.95),
                  formatting: Math.floor(dashboardData.qualityScore * 1.05),
                }}
                compact={true}
              />
            </div>
          </div>
        )}

        {selectedView === 'trends' && (
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Detailed Trend Analysis - Coming Soon</p>
          </div>
        )}

        {selectedView === 'suggestions' && (
          <div className="p-6 bg-gray-50 rounded-lg">
            <p className="text-gray-500">All Improvement Suggestions - Coming Soon</p>
          </div>
        )}
      </div>

      {/* 快速操作 */}
      <Card className="p-6 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">基于分析的建议操作</h3>
            <p className="text-gray-600 text-sm mt-1">
              根据当前分析结果，我们为您推荐以下操作来提升写作效果
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              优化结构
            </Button>
            <Button size="sm">
              生成改进计划
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WritingDashboard;