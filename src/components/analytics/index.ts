// 导出所有分析组件
export { default as WritingDashboard } from './WritingDashboard';
export { default as QualityScore } from './QualityScore';
export { default as ProgressChart } from './ProgressChart';
export { default as TrendAnalysis } from './TrendAnalysis';
export { default as ImprovementSuggestions } from './ImprovementSuggestions';

// 导出图表组件
export * from './charts';

// 导出工具函数
export * from '../../utils/analyticsEngine';
export * from '../../utils/reportGenerator';

// 分析组件类型定义
export interface AnalyticsComponentProps {
  className?: string;
  paperId?: string;
  timeRange?: '7d' | '30d' | '90d';
}

export interface DashboardConfig {
  showQualityScore?: boolean;
  showProgressChart?: boolean;
  showTrendAnalysis?: boolean;
  showSuggestions?: boolean;
  layout?: 'grid' | 'stack' | 'tabs';
  refreshInterval?: number; // in milliseconds
}

// 分析数据类型
export interface AnalyticsData {
  qualityMetrics: QualityMetrics;
  progressMetrics: ProgressMetrics;
  trendMetrics: TrendMetrics;
  suggestions: AnalyticsSuggestion[];
}

export interface QualityMetrics {
  overall: number;
  structure: number;
  content: number;
  style: number;
  formatting: number;
  lastUpdated: Date;
}

export interface ProgressMetrics {
  completionRate: number;
  wordCount: {
    current: number;
    target: number;
    daily: number[];
  };
  timeSpent: number;
  efficiency: number;
  sessionsCount: number;
}

export interface TrendMetrics {
  productivityTrend: number;
  qualityTrend: number;
  consistencyScore: number;
  patterns: TrendPattern[];
}

export interface TrendPattern {
  type: 'daily' | 'weekly' | 'monthly';
  description: string;
  confidence: number;
}

export interface AnalyticsSuggestion {
  id: string;
  type: 'quality' | 'productivity' | 'structure' | 'style';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionable: boolean;
  impact: number;
}

// 分析引擎配置
export interface AnalyticsEngineConfig {
  enableRealTimeAnalysis?: boolean;
  analysisDepth?: 'basic' | 'detailed' | 'comprehensive';
  updateInterval?: number;
  cacheResults?: boolean;
  cacheDuration?: number; // in milliseconds
}

// 工具函数
export const analyticsUtils = {
  /**
   * 格式化分析数据
   */
  formatAnalyticsData: (data: any): AnalyticsData => {
    return {
      qualityMetrics: {
        overall: data.qualityScore?.overall || 0,
        structure: data.qualityScore?.breakdown?.structure || 0,
        content: data.qualityScore?.breakdown?.content || 0,
        style: data.qualityScore?.breakdown?.style || 0,
        formatting: data.qualityScore?.breakdown?.formatting || 0,
        lastUpdated: new Date()
      },
      progressMetrics: {
        completionRate: data.progressMetrics?.completionRate || 0,
        wordCount: {
          current: data.progressMetrics?.wordCount?.current || 0,
          target: data.progressMetrics?.wordCount?.target || 0,
          daily: data.progressMetrics?.wordCount?.daily || []
        },
        timeSpent: data.progressMetrics?.timeMetrics?.totalTime || 0,
        efficiency: data.progressMetrics?.timeMetrics?.efficiency || 0,
        sessionsCount: data.progressMetrics?.sessions || 0
      },
      trendMetrics: {
        productivityTrend: data.trendAnalysis?.productivityTrend || 0,
        qualityTrend: data.trendAnalysis?.qualityTrend || 0,
        consistencyScore: data.trendAnalysis?.consistencyScore || 0,
        patterns: data.trendAnalysis?.patterns || []
      },
      suggestions: data.suggestions || []
    };
  },

  /**
   * 计算质量等级
   */
  getQualityGrade: (score: number): { grade: string; color: string; description: string } => {
    if (score >= 90) {
      return {
        grade: 'A',
        color: 'green',
        description: '优秀'
      };
    } else if (score >= 80) {
      return {
        grade: 'B',
        color: 'blue',
        description: '良好'
      };
    } else if (score >= 70) {
      return {
        grade: 'C',
        color: 'yellow',
        description: '中等'
      };
    } else if (score >= 60) {
      return {
        grade: 'D',
        color: 'orange',
        description: '及格'
      };
    } else {
      return {
        grade: 'F',
        color: 'red',
        description: '待改进'
      };
    }
  },

  /**
   * 计算进度状态
   */
  getProgressStatus: (completionRate: number): { status: string; color: string; urgency: string } => {
    if (completionRate >= 90) {
      return {
        status: '即将完成',
        color: 'green',
        urgency: 'low'
      };
    } else if (completionRate >= 70) {
      return {
        status: '进展良好',
        color: 'blue',
        urgency: 'low'
      };
    } else if (completionRate >= 50) {
      return {
        status: '进度正常',
        color: 'yellow',
        urgency: 'medium'
      };
    } else if (completionRate >= 30) {
      return {
        status: '需要加速',
        color: 'orange',
        urgency: 'medium'
      };
    } else {
      return {
        status: '进度滞后',
        color: 'red',
        urgency: 'high'
      };
    }
  },

  /**
   * 生成分析摘要
   */
  generateSummary: (data: AnalyticsData): string => {
    const qualityGrade = analyticsUtils.getQualityGrade(data.qualityMetrics.overall);
    const progressStatus = analyticsUtils.getProgressStatus(data.progressMetrics.completionRate);
    
    return `写作质量${qualityGrade.description}(${data.qualityMetrics.overall}分)，进度${progressStatus.status}(${data.progressMetrics.completionRate.toFixed(1)}%)。`;
  },

  /**
   * 计算预计完成时间
   */
  estimateCompletionTime: (progressMetrics: ProgressMetrics): Date | null => {
    const { completionRate, efficiency } = progressMetrics;
    const { current, target } = progressMetrics.wordCount;
    
    if (efficiency <= 0 || completionRate >= 100) return null;
    
    const remainingWords = target - current;
    const estimatedMinutes = remainingWords / efficiency;
    const estimatedDays = Math.ceil(estimatedMinutes / (2 * 60)); // 假设每天2小时
    
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + estimatedDays);
    
    return completionDate;
  },

  /**
   * 过滤建议
   */
  filterSuggestions: (
    suggestions: AnalyticsSuggestion[],
    filters: {
      type?: string[];
      priority?: string[];
      actionable?: boolean;
    }
  ): AnalyticsSuggestion[] => {
    return suggestions.filter(suggestion => {
      if (filters.type && !filters.type.includes(suggestion.type)) return false;
      if (filters.priority && !filters.priority.includes(suggestion.priority)) return false;
      if (filters.actionable !== undefined && suggestion.actionable !== filters.actionable) return false;
      return true;
    });
  },

  /**
   * 排序建议
   */
  sortSuggestions: (
    suggestions: AnalyticsSuggestion[],
    sortBy: 'priority' | 'impact' | 'type' = 'priority'
  ): AnalyticsSuggestion[] => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    
    return [...suggestions].sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'impact':
          return b.impact - a.impact;
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });
  },

  /**
   * 数据验证
   */
  validateAnalyticsData: (data: any): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!data) {
      errors.push('分析数据不能为空');
      return { valid: false, errors };
    }
    
    if (!data.qualityScore || typeof data.qualityScore.overall !== 'number') {
      errors.push('质量评分数据无效');
    }
    
    if (!data.progressMetrics || typeof data.progressMetrics.completionRate !== 'number') {
      errors.push('进度数据无效');
    }
    
    if (!data.trendAnalysis) {
      errors.push('趋势分析数据无效');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
};

// 默认配置
export const defaultAnalyticsConfig: AnalyticsEngineConfig = {
  enableRealTimeAnalysis: true,
  analysisDepth: 'detailed',
  updateInterval: 30000, // 30秒
  cacheResults: true,
  cacheDuration: 300000 // 5分钟
};

export const defaultDashboardConfig: DashboardConfig = {
  showQualityScore: true,
  showProgressChart: true,
  showTrendAnalysis: true,
  showSuggestions: true,
  layout: 'grid',
  refreshInterval: 60000 // 1分钟
};