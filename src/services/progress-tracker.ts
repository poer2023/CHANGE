/**
 * 智能进度跟踪服务
 * 负责论文完成度可视化、进度统计、时间分析、里程碑提醒等
 */

import { GLMClient } from './glm-client';
import type { 
  Paper, 
  PaperSection, 
  WritingSession,
  EnglishPaperType,
  AcademicLevel,
  ModuleCompletionStatus 
} from '../types';

// 进度跟踪结果类型
export interface ProgressTrackingResult {
  overall: OverallProgress;
  sections: SectionProgress[];
  timeAnalysis: TimeAnalysis;
  milestones: Milestone[];
  productivity: ProductivityAnalysis;
  predictions: ProgressPrediction[];
  recommendations: ProgressRecommendation[];
  timestamp: Date;
}

// 整体进度
export interface OverallProgress {
  completionPercentage: number; // 0-100
  status: 'not_started' | 'in_progress' | 'review' | 'completed';
  totalWordCount: number;
  targetWordCount: number;
  estimatedTimeToCompletion: number; // 小时
  qualityScore: number; // 0-100
  phase: WritingPhase;
}

export type WritingPhase = 
  | 'planning'
  | 'research'
  | 'outline'
  | 'drafting'
  | 'revision'
  | 'proofreading'
  | 'finalization';

// 章节进度
export interface SectionProgress {
  sectionId: string;
  title: string;
  completionPercentage: number;
  wordCount: number;
  targetWordCount: number;
  status: SectionStatus;
  lastModified: Date;
  timeSpent: number; // 分钟
  issues: ProgressIssue[];
  qualityIndicators: QualityIndicator[];
}

export type SectionStatus = 
  | 'not_started'
  | 'in_progress'
  | 'draft_complete'
  | 'under_review'
  | 'revision_needed'
  | 'completed';

// 进度问题
export interface ProgressIssue {
  type: 'behind_schedule' | 'quality_concern' | 'structural_issue' | 'content_gap';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestion: string;
  estimatedTimeToResolve: number; // 分钟
}

// 质量指标
export interface QualityIndicator {
  aspect: 'content' | 'structure' | 'language' | 'formatting' | 'citations';
  score: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
  lastAssessment: Date;
}

// 时间分析
export interface TimeAnalysis {
  totalTimeSpent: number; // 分钟
  averageSessionLength: number; // 分钟
  mostProductiveHours: number[]; // 24小时制
  writingVelocity: WritingVelocity;
  sessionPatterns: SessionPattern[];
  timeDistribution: TimeDistribution;
}

// 写作速度
export interface WritingVelocity {
  wordsPerHour: number;
  wordsPerSession: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  factors: VelocityFactor[];
}

export interface VelocityFactor {
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  correlation: number; // -1 to 1
}

// 会话模式
export interface SessionPattern {
  timeOfDay: string;
  duration: number;
  productivity: number;
  frequency: number;
}

// 时间分布
export interface TimeDistribution {
  planning: number; // 百分比
  writing: number;
  revision: number;
  research: number;
  formatting: number;
}

// 里程碑
export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  actualDate?: Date;
  status: 'upcoming' | 'due' | 'overdue' | 'completed';
  importance: 'low' | 'medium' | 'high' | 'critical';
  requirements: MilestoneRequirement[];
  dependencies: string[];
}

export interface MilestoneRequirement {
  description: string;
  isCompleted: boolean;
  completedDate?: Date;
}

// 生产力分析
export interface ProductivityAnalysis {
  overallScore: number; // 0-100
  trends: ProductivityTrend[];
  peakPerformance: PeakPerformanceAnalysis;
  bottlenecks: ProductivityBottleneck[];
  recommendations: ProductivityRecommendation[];
}

export interface ProductivityTrend {
  period: 'daily' | 'weekly' | 'monthly';
  data: { date: string; score: number; wordsWritten: number }[];
  trend: 'improving' | 'stable' | 'declining';
}

export interface PeakPerformanceAnalysis {
  bestHours: number[];
  bestDays: string[];
  bestConditions: string[];
  averageWordsInPeakHours: number;
}

export interface ProductivityBottleneck {
  type: 'time_management' | 'content_difficulty' | 'technical_issues' | 'motivation';
  description: string;
  impact: number; // 0-100
  frequency: number;
  solutions: string[];
}

export interface ProductivityRecommendation {
  category: 'scheduling' | 'environment' | 'workflow' | 'goals';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: number;
  implementation: string[];
}

// 进度预测
export interface ProgressPrediction {
  type: 'completion_date' | 'word_count' | 'quality_score' | 'time_needed';
  prediction: any;
  confidence: number; // 0-1
  factors: PredictionFactor[];
  scenarios: PredictionScenario[];
}

export interface PredictionFactor {
  factor: string;
  weight: number;
  currentValue: number;
  trend: 'positive' | 'negative' | 'stable';
}

export interface PredictionScenario {
  name: 'optimistic' | 'realistic' | 'pessimistic';
  probability: number;
  outcome: any;
  assumptions: string[];
}

// 进度建议
export interface ProgressRecommendation {
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: 'time_management' | 'content_development' | 'quality_improvement' | 'milestone_tracking';
  title: string;
  description: string;
  actions: RecommendationAction[];
  expectedBenefit: string;
  timeToImplement: number; // 分钟
}

export interface RecommendationAction {
  action: string;
  description: string;
  priority: number;
  estimatedTime: number;
}

// 进度跟踪配置
export interface ProgressTrackingConfig {
  paperType: EnglishPaperType;
  academicLevel: AcademicLevel;
  targetWordCount: number;
  deadline?: Date;
  milestoneTemplate?: string;
  trackingGranularity: 'basic' | 'detailed' | 'comprehensive';
  enableAIInsights: boolean;
  autoMilestones: boolean;
  reminderSettings: ReminderSettings;
}

export interface ReminderSettings {
  enabled: boolean;
  milestoneReminders: boolean;
  deadlineReminders: boolean;
  productivityReminders: boolean;
  frequencyHours: number;
}

// 写作会话数据
export interface WritingSessionData {
  id: string;
  paperId: string;
  startTime: Date;
  endTime?: Date;
  wordsWritten: number;
  sectionsWorkedOn: string[];
  productivity: number; // 0-100
  mood?: 'excellent' | 'good' | 'neutral' | 'poor';
  distractions: number;
  notes?: string;
}

/**
 * 智能进度跟踪器
 */
export class ProgressTracker {
  private glmClient: GLMClient;
  private config: ProgressTrackingConfig;
  private sessions: Map<string, WritingSessionData[]> = new Map();
  private milestones: Map<string, Milestone[]> = new Map();

  constructor(glmClient: GLMClient, config: ProgressTrackingConfig) {
    this.glmClient = glmClient;
    this.config = config;
  }

  /**
   * 获取论文的完整进度分析
   */
  async getProgressAnalysis(paper: Paper): Promise<ProgressTrackingResult> {
    try {
      console.log(`开始进度分析: ${paper.title}`);

      // 并行执行各项分析
      const [
        overallProgress,
        sectionsProgress,
        timeAnalysis,
        milestones,
        productivity,
        predictions,
        recommendations
      ] = await Promise.all([
        this.calculateOverallProgress(paper),
        this.analyzeSectionProgress(paper),
        this.analyzeTimePatterns(paper),
        this.getMilestones(paper.id),
        this.analyzeProductivity(paper),
        this.generatePredictions(paper),
        this.generateRecommendations(paper)
      ]);

      return {
        overall: overallProgress,
        sections: sectionsProgress,
        timeAnalysis,
        milestones,
        productivity,
        predictions,
        recommendations,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('进度分析失败:', error);
      throw error;
    }
  }

  /**
   * 计算整体进度
   */
  private async calculateOverallProgress(paper: Paper): Promise<OverallProgress> {
    const sections = paper.sections || [];
    const totalWordCount = sections.reduce((sum, s) => sum + s.content.split(' ').length, 0);
    const targetWordCount = this.config.targetWordCount;
    
    // 计算完成百分比
    const completionPercentage = Math.min(100, Math.round((totalWordCount / targetWordCount) * 100));
    
    // 确定状态
    let status: OverallProgress['status'] = 'not_started';
    if (completionPercentage > 0) status = 'in_progress';
    if (completionPercentage >= 90) status = 'review';
    if (completionPercentage >= 100) status = 'completed';

    // 确定写作阶段
    const phase = this.determineWritingPhase(paper, completionPercentage);
    
    // 计算预计完成时间
    const estimatedTimeToCompletion = await this.estimateTimeToCompletion(paper);
    
    // 计算质量分数
    const qualityScore = await this.calculateQualityScore(paper);

    return {
      completionPercentage,
      status,
      totalWordCount,
      targetWordCount,
      estimatedTimeToCompletion,
      qualityScore,
      phase
    };
  }

  /**
   * 确定写作阶段
   */
  private determineWritingPhase(paper: Paper, completionPercentage: number): WritingPhase {
    if (completionPercentage < 10) return 'planning';
    if (completionPercentage < 30) return 'research';
    if (completionPercentage < 50) return 'outline';
    if (completionPercentage < 80) return 'drafting';
    if (completionPercentage < 95) return 'revision';
    if (completionPercentage < 100) return 'proofreading';
    return 'finalization';
  }

  /**
   * 分析章节进度
   */
  private async analyzeSectionProgress(paper: Paper): Promise<SectionProgress[]> {
    const sections = paper.sections || [];
    const sectionProgress: SectionProgress[] = [];

    for (const section of sections) {
      const wordCount = section.content.split(' ').length;
      const targetWordCount = this.estimateSectionTargetWords(section, paper);
      const completionPercentage = Math.min(100, Math.round((wordCount / targetWordCount) * 100));
      
      // 确定章节状态
      const status = this.determineSectionStatus(section, completionPercentage);
      
      // 计算时间花费
      const timeSpent = this.calculateSectionTimeSpent(paper.id, section.id);
      
      // 检测问题
      const issues = await this.detectSectionIssues(section, completionPercentage);
      
      // 质量指标
      const qualityIndicators = await this.assessSectionQuality(section);

      sectionProgress.push({
        sectionId: section.id,
        title: section.title,
        completionPercentage,
        wordCount,
        targetWordCount,
        status,
        lastModified: new Date(), // 应该从实际数据获取
        timeSpent,
        issues,
        qualityIndicators
      });
    }

    return sectionProgress;
  }

  /**
   * 估算章节目标字数
   */
  private estimateSectionTargetWords(section: PaperSection, paper: Paper): number {
    const totalSections = paper.sections?.length || 1;
    const baseTarget = this.config.targetWordCount / totalSections;
    
    // 根据章节类型调整
    const adjustmentFactors: Record<string, number> = {
      'introduction': 0.8,
      'literature review': 1.2,
      'methodology': 1.0,
      'results': 1.1,
      'discussion': 1.3,
      'conclusion': 0.7
    };

    const sectionType = this.identifySectionType(section.title);
    const factor = adjustmentFactors[sectionType] || 1.0;
    
    return Math.round(baseTarget * factor);
  }

  /**
   * 识别章节类型
   */
  private identifySectionType(title: string): string {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('introduction') || lowerTitle.includes('引言')) return 'introduction';
    if (lowerTitle.includes('literature') || lowerTitle.includes('文献')) return 'literature review';
    if (lowerTitle.includes('method') || lowerTitle.includes('方法')) return 'methodology';
    if (lowerTitle.includes('result') || lowerTitle.includes('结果')) return 'results';
    if (lowerTitle.includes('discussion') || lowerTitle.includes('讨论')) return 'discussion';
    if (lowerTitle.includes('conclusion') || lowerTitle.includes('结论')) return 'conclusion';
    
    return 'general';
  }

  /**
   * 确定章节状态
   */
  private determineSectionStatus(section: PaperSection, completionPercentage: number): SectionStatus {
    if (completionPercentage === 0) return 'not_started';
    if (completionPercentage < 50) return 'in_progress';
    if (completionPercentage < 80) return 'draft_complete';
    if (completionPercentage < 95) return 'under_review';
    if (completionPercentage < 100) return 'revision_needed';
    return 'completed';
  }

  /**
   * 计算章节时间花费
   */
  private calculateSectionTimeSpent(paperId: string, sectionId: string): number {
    const sessions = this.sessions.get(paperId) || [];
    return sessions
      .filter(session => session.sectionsWorkedOn.includes(sectionId))
      .reduce((total, session) => {
        const duration = session.endTime 
          ? (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60)
          : 0;
        return total + duration;
      }, 0);
  }

  /**
   * 检测章节问题
   */
  private async detectSectionIssues(section: PaperSection, completionPercentage: number): Promise<ProgressIssue[]> {
    const issues: ProgressIssue[] = [];

    // 进度延迟检测
    if (completionPercentage < 30) {
      issues.push({
        type: 'behind_schedule',
        severity: 'medium',
        description: '章节进度落后于预期',
        suggestion: '考虑调整写作计划或寻求帮助',
        estimatedTimeToResolve: 120
      });
    }

    // 内容质量检测
    if (section.content.length > 0 && section.content.split(' ').length < 100) {
      issues.push({
        type: 'content_gap',
        severity: 'low',
        description: '章节内容过于简短',
        suggestion: '扩充章节内容，增加详细说明和论证',
        estimatedTimeToResolve: 60
      });
    }

    return issues;
  }

  /**
   * 评估章节质量
   */
  private async assessSectionQuality(section: PaperSection): Promise<QualityIndicator[]> {
    const indicators: QualityIndicator[] = [];

    // 基础质量评估
    const contentScore = this.assessContentQuality(section.content);
    const structureScore = this.assessStructureQuality(section.content);

    indicators.push(
      {
        aspect: 'content',
        score: contentScore,
        trend: 'stable',
        lastAssessment: new Date()
      },
      {
        aspect: 'structure',
        score: structureScore,
        trend: 'stable',
        lastAssessment: new Date()
      }
    );

    return indicators;
  }

  /**
   * 评估内容质量
   */
  private assessContentQuality(content: string): number {
    let score = 70; // 基础分数

    const wordCount = content.split(' ').length;
    if (wordCount > 200) score += 10;
    if (wordCount > 500) score += 10;

    // 检查句子长度变化
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 3) {
      const avgLength = sentences.reduce((sum, s) => sum + s.split(' ').length, 0) / sentences.length;
      if (avgLength > 10 && avgLength < 25) score += 10;
    }

    return Math.min(100, score);
  }

  /**
   * 评估结构质量
   */
  private assessStructureQuality(content: string): number {
    let score = 70;

    // 检查段落结构
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    if (paragraphs.length > 1) score += 15;
    if (paragraphs.length > 3) score += 10;

    return Math.min(100, score);
  }

  /**
   * 分析时间模式
   */
  private async analyzeTimePatterns(paper: Paper): Promise<TimeAnalysis> {
    const sessions = this.sessions.get(paper.id) || [];
    
    if (sessions.length === 0) {
      return {
        totalTimeSpent: 0,
        averageSessionLength: 0,
        mostProductiveHours: [],
        writingVelocity: {
          wordsPerHour: 0,
          wordsPerSession: 0,
          trend: 'stable',
          factors: []
        },
        sessionPatterns: [],
        timeDistribution: {
          planning: 20,
          writing: 60,
          revision: 15,
          research: 3,
          formatting: 2
        }
      };
    }

    const totalTimeSpent = sessions.reduce((sum, session) => {
      const duration = session.endTime 
        ? (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60)
        : 0;
      return sum + duration;
    }, 0);

    const averageSessionLength = totalTimeSpent / sessions.length;
    
    // 分析最高效时间段
    const hourlyProductivity = this.analyzeHourlyProductivity(sessions);
    const mostProductiveHours = Object.entries(hourlyProductivity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));

    // 计算写作速度
    const writingVelocity = this.calculateWritingVelocity(sessions);

    // 分析会话模式
    const sessionPatterns = this.analyzeSessionPatterns(sessions);

    return {
      totalTimeSpent,
      averageSessionLength,
      mostProductiveHours,
      writingVelocity,
      sessionPatterns,
      timeDistribution: {
        planning: 20,
        writing: 60,
        revision: 15,
        research: 3,
        formatting: 2
      }
    };
  }

  /**
   * 分析每小时生产力
   */
  private analyzeHourlyProductivity(sessions: WritingSessionData[]): Record<number, number> {
    const hourlyStats: Record<number, { totalWords: number; totalTime: number }> = {};

    for (const session of sessions) {
      const hour = session.startTime.getHours();
      if (!hourlyStats[hour]) {
        hourlyStats[hour] = { totalWords: 0, totalTime: 0 };
      }
      
      const duration = session.endTime 
        ? (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60 * 60)
        : 0;
      
      hourlyStats[hour].totalWords += session.wordsWritten;
      hourlyStats[hour].totalTime += duration;
    }

    const hourlyProductivity: Record<number, number> = {};
    Object.entries(hourlyStats).forEach(([hour, stats]) => {
      hourlyProductivity[parseInt(hour)] = stats.totalTime > 0 
        ? stats.totalWords / stats.totalTime 
        : 0;
    });

    return hourlyProductivity;
  }

  /**
   * 计算写作速度
   */
  private calculateWritingVelocity(sessions: WritingSessionData[]): WritingVelocity {
    if (sessions.length === 0) {
      return {
        wordsPerHour: 0,
        wordsPerSession: 0,
        trend: 'stable',
        factors: []
      };
    }

    const totalWords = sessions.reduce((sum, s) => sum + s.wordsWritten, 0);
    const totalHours = sessions.reduce((sum, session) => {
      const duration = session.endTime 
        ? (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60 * 60)
        : 0;
      return sum + duration;
    }, 0);

    const wordsPerHour = totalHours > 0 ? Math.round(totalWords / totalHours) : 0;
    const wordsPerSession = Math.round(totalWords / sessions.length);

    // 分析趋势（简化版）
    const trend = sessions.length >= 3 ? this.analyzeTrend(sessions) : 'stable';

    return {
      wordsPerHour,
      wordsPerSession,
      trend,
      factors: []
    };
  }

  /**
   * 分析趋势
   */
  private analyzeTrend(sessions: WritingSessionData[]): 'increasing' | 'stable' | 'decreasing' {
    if (sessions.length < 3) return 'stable';

    const recentSessions = sessions.slice(-3);
    const olderSessions = sessions.slice(-6, -3);

    const recentAvg = recentSessions.reduce((sum, s) => sum + s.wordsWritten, 0) / recentSessions.length;
    const olderAvg = olderSessions.length > 0 
      ? olderSessions.reduce((sum, s) => sum + s.wordsWritten, 0) / olderSessions.length
      : recentAvg;

    const change = (recentAvg - olderAvg) / olderAvg;
    
    if (change > 0.1) return 'increasing';
    if (change < -0.1) return 'decreasing';
    return 'stable';
  }

  /**
   * 分析会话模式
   */
  private analyzeSessionPatterns(sessions: WritingSessionData[]): SessionPattern[] {
    const patterns: Record<string, {
      durations: number[];
      productivities: number[];
      count: number;
    }> = {};

    for (const session of sessions) {
      const hour = session.startTime.getHours();
      let timeOfDay: string;
      
      if (hour >= 6 && hour < 12) timeOfDay = 'morning';
      else if (hour >= 12 && hour < 18) timeOfDay = 'afternoon';
      else if (hour >= 18 && hour < 22) timeOfDay = 'evening';
      else timeOfDay = 'night';

      if (!patterns[timeOfDay]) {
        patterns[timeOfDay] = { durations: [], productivities: [], count: 0 };
      }

      const duration = session.endTime 
        ? (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60)
        : 0;

      patterns[timeOfDay].durations.push(duration);
      patterns[timeOfDay].productivities.push(session.productivity);
      patterns[timeOfDay].count++;
    }

    return Object.entries(patterns).map(([timeOfDay, data]) => ({
      timeOfDay,
      duration: data.durations.reduce((sum, d) => sum + d, 0) / data.durations.length,
      productivity: data.productivities.reduce((sum, p) => sum + p, 0) / data.productivities.length,
      frequency: data.count / sessions.length
    }));
  }

  /**
   * 获取里程碑
   */
  private async getMilestones(paperId: string): Promise<Milestone[]> {
    let milestones = this.milestones.get(paperId);
    
    if (!milestones && this.config.autoMilestones) {
      milestones = await this.generateAutoMilestones(paperId);
      this.milestones.set(paperId, milestones);
    }

    return milestones || [];
  }

  /**
   * 自动生成里程碑
   */
  private async generateAutoMilestones(paperId: string): Promise<Milestone[]> {
    const milestones: Milestone[] = [];
    const now = new Date();

    // 基础里程碑模板
    const milestoneTemplates = [
      {
        title: '完成论文大纲',
        description: '确定论文结构和各章节要点',
        daysFromNow: 7,
        importance: 'high' as const,
        requirements: ['确定研究问题', '设计论文结构', '制定写作计划']
      },
      {
        title: '完成初稿',
        description: '完成论文的第一稿',
        daysFromNow: 30,
        importance: 'critical' as const,
        requirements: ['完成所有章节', '达到目标字数的80%', '完成参考文献']
      },
      {
        title: '完成修订',
        description: '根据反馈完成论文修订',
        daysFromNow: 45,
        importance: 'high' as const,
        requirements: ['解决所有反馈问题', '优化论文结构', '提高语言质量']
      },
      {
        title: '最终定稿',
        description: '完成论文的最终版本',
        daysFromNow: 50,
        importance: 'critical' as const,
        requirements: ['完成所有修改', '格式检查', '最终校对']
      }
    ];

    milestoneTemplates.forEach((template, index) => {
      const targetDate = new Date(now.getTime() + template.daysFromNow * 24 * 60 * 60 * 1000);
      
      milestones.push({
        id: `milestone-${index + 1}`,
        title: template.title,
        description: template.description,
        targetDate,
        status: 'upcoming',
        importance: template.importance,
        requirements: template.requirements.map(req => ({
          description: req,
          isCompleted: false
        })),
        dependencies: index > 0 ? [`milestone-${index}`] : []
      });
    });

    return milestones;
  }

  /**
   * 分析生产力
   */
  private async analyzeProductivity(paper: Paper): Promise<ProductivityAnalysis> {
    // 简化实现
    return {
      overallScore: 75,
      trends: [],
      peakPerformance: {
        bestHours: [9, 10, 14],
        bestDays: ['Tuesday', 'Wednesday', 'Thursday'],
        bestConditions: ['安静环境', '充足睡眠', '明确目标'],
        averageWordsInPeakHours: 300
      },
      bottlenecks: [],
      recommendations: []
    };
  }

  /**
   * 生成预测
   */
  private async generatePredictions(paper: Paper): Promise<ProgressPrediction[]> {
    const predictions: ProgressPrediction[] = [];

    // 完成日期预测
    const completionPrediction = await this.predictCompletionDate(paper);
    predictions.push(completionPrediction);

    return predictions;
  }

  /**
   * 预测完成日期
   */
  private async predictCompletionDate(paper: Paper): Promise<ProgressPrediction> {
    const currentWordCount = paper.sections?.reduce((sum, s) => sum + s.content.split(' ').length, 0) || 0;
    const remainingWords = Math.max(0, this.config.targetWordCount - currentWordCount);
    
    // 基于历史写作速度预测
    const sessions = this.sessions.get(paper.id) || [];
    const avgWordsPerHour = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + s.wordsWritten, 0) / sessions.length * 2 // 每小时估算
      : 200; // 默认每小时200字

    const hoursNeeded = remainingWords / avgWordsPerHour;
    const daysNeeded = Math.ceil(hoursNeeded / 4); // 每天4小时写作

    const scenarios: PredictionScenario[] = [
      {
        name: 'optimistic',
        probability: 0.2,
        outcome: new Date(Date.now() + daysNeeded * 0.8 * 24 * 60 * 60 * 1000),
        assumptions: ['保持高效写作', '无重大修改', '无外部干扰']
      },
      {
        name: 'realistic',
        probability: 0.6,
        outcome: new Date(Date.now() + daysNeeded * 24 * 60 * 60 * 1000),
        assumptions: ['正常写作速度', '适度修改', '少量干扰']
      },
      {
        name: 'pessimistic',
        probability: 0.2,
        outcome: new Date(Date.now() + daysNeeded * 1.5 * 24 * 60 * 60 * 1000),
        assumptions: ['写作困难', '大量修改', '较多干扰']
      }
    ];

    return {
      type: 'completion_date',
      prediction: scenarios[1].outcome, // 现实预测
      confidence: 0.7,
      factors: [
        {
          factor: '当前进度',
          weight: 0.4,
          currentValue: (currentWordCount / this.config.targetWordCount) * 100,
          trend: 'positive'
        },
        {
          factor: '写作速度',
          weight: 0.3,
          currentValue: avgWordsPerHour,
          trend: 'stable'
        },
        {
          factor: '时间投入',
          weight: 0.3,
          currentValue: sessions.length,
          trend: 'stable'
        }
      ],
      scenarios
    };
  }

  /**
   * 生成建议
   */
  private async generateRecommendations(paper: Paper): Promise<ProgressRecommendation[]> {
    const recommendations: ProgressRecommendation[] = [];

    const currentWordCount = paper.sections?.reduce((sum, s) => sum + s.content.split(' ').length, 0) || 0;
    const completionPercentage = (currentWordCount / this.config.targetWordCount) * 100;

    // 基于完成度生成建议
    if (completionPercentage < 25) {
      recommendations.push({
        priority: 'high',
        category: 'content_development',
        title: '加快初稿写作',
        description: '当前进度较慢，建议增加写作时间投入',
        actions: [
          {
            action: '设定每日写作目标',
            description: '建议每天至少写作500字',
            priority: 1,
            estimatedTime: 120
          },
          {
            action: '创建写作计划',
            description: '制定详细的章节写作时间表',
            priority: 2,
            estimatedTime: 30
          }
        ],
        expectedBenefit: '提高写作效率，按时完成初稿',
        timeToImplement: 30
      });
    }

    if (completionPercentage > 50 && completionPercentage < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'quality_improvement',
        title: '关注内容质量',
        description: '已完成大部分内容，应该开始关注质量提升',
        actions: [
          {
            action: '进行内容自查',
            description: '检查论证逻辑和内容完整性',
            priority: 1,
            estimatedTime: 180
          },
          {
            action: '寻求反馈',
            description: '请导师或同学提供修改建议',
            priority: 2,
            estimatedTime: 60
          }
        ],
        expectedBenefit: '提高论文质量，减少后期大幅修改',
        timeToImplement: 60
      });
    }

    return recommendations;
  }

  /**
   * 估算完成时间
   */
  private async estimateTimeToCompletion(paper: Paper): Promise<number> {
    const currentWordCount = paper.sections?.reduce((sum, s) => sum + s.content.split(' ').length, 0) || 0;
    const remainingWords = Math.max(0, this.config.targetWordCount - currentWordCount);
    
    // 基于历史数据或默认速度
    const avgWordsPerHour = 200; // 默认每小时200字
    
    return Math.ceil(remainingWords / avgWordsPerHour);
  }

  /**
   * 计算质量分数
   */
  private async calculateQualityScore(paper: Paper): Promise<number> {
    // 基础质量评估
    let score = 70;
    
    const sections = paper.sections || [];
    if (sections.length > 0) {
      const avgSectionLength = sections.reduce((sum, s) => sum + s.content.length, 0) / sections.length;
      if (avgSectionLength > 500) score += 10;
      if (avgSectionLength > 1000) score += 5;
    }

    return Math.min(100, score);
  }

  /**
   * 记录写作会话
   */
  recordWritingSession(sessionData: WritingSessionData): void {
    const sessions = this.sessions.get(sessionData.paperId) || [];
    sessions.push(sessionData);
    this.sessions.set(sessionData.paperId, sessions);
  }

  /**
   * 更新里程碑状态
   */
  updateMilestone(paperId: string, milestoneId: string, updates: Partial<Milestone>): void {
    const milestones = this.milestones.get(paperId);
    if (milestones) {
      const milestone = milestones.find(m => m.id === milestoneId);
      if (milestone) {
        Object.assign(milestone, updates);
      }
    }
  }

  /**
   * 获取进度摘要
   */
  getProgressSummary(paper: Paper): {
    completion: number;
    timeSpent: number;
    wordsWritten: number;
    nextMilestone?: Milestone;
  } {
    const currentWordCount = paper.sections?.reduce((sum, s) => sum + s.content.split(' ').length, 0) || 0;
    const completion = Math.min(100, (currentWordCount / this.config.targetWordCount) * 100);
    
    const sessions = this.sessions.get(paper.id) || [];
    const timeSpent = sessions.reduce((sum, session) => {
      const duration = session.endTime 
        ? (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60)
        : 0;
      return sum + duration;
    }, 0);

    const milestones = this.milestones.get(paper.id) || [];
    const nextMilestone = milestones.find(m => m.status === 'upcoming');

    return {
      completion: Math.round(completion),
      timeSpent: Math.round(timeSpent),
      wordsWritten: currentWordCount,
      nextMilestone
    };
  }
}

/**
 * 创建默认的进度跟踪器
 */
export function createProgressTracker(
  glmClient: GLMClient,
  config: Partial<ProgressTrackingConfig> = {}
): ProgressTracker {
  const defaultConfig: ProgressTrackingConfig = {
    paperType: 'research-paper' as EnglishPaperType,
    academicLevel: 'master',
    targetWordCount: 8000,
    trackingGranularity: 'detailed',
    enableAIInsights: true,
    autoMilestones: true,
    reminderSettings: {
      enabled: true,
      milestoneReminders: true,
      deadlineReminders: true,
      productivityReminders: true,
      frequencyHours: 24
    },
    ...config
  };

  return new ProgressTracker(glmClient, defaultConfig);
}

// 默认导出
export default ProgressTracker;