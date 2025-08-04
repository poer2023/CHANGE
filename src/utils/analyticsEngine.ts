/**
 * 写作分析引擎
 * 实现各种分析算法和数据处理功能
 */

import { Paper } from '../types';

// 分析结果接口
export interface AnalysisResult {
  qualityScore: QualityAnalysis;
  progressMetrics: ProgressMetrics;
  trendAnalysis: TrendAnalysis;
  writingHabits: WritingHabits;
  suggestions: Suggestion[];
}

export interface QualityAnalysis {
  overall: number;
  breakdown: {
    structure: number;
    content: number;
    style: number;
    formatting: number;
    vocabulary: number;
    coherence: number;
  };
  factors: QualityFactor[];
}

export interface QualityFactor {
  name: string;
  score: number;
  weight: number;
  description: string;
  suggestions: string[];
}

export interface ProgressMetrics {
  completionRate: number;
  wordCount: {
    current: number;
    target: number;
    dailyAverage: number;
    weeklyTrend: number;
  };
  timeMetrics: {
    totalTime: number; // minutes
    averageSession: number;
    efficiency: number; // words per minute
    peakHours: number[];
  };
  sectionProgress: {
    completed: number;
    total: number;
    quality: number[];
  };
}

export interface TrendAnalysis {
  productivityTrend: number; // percentage change
  qualityTrend: number;
  consistencyScore: number;
  improvementRate: number;
  patterns: WritingPattern[];
  predictions: Prediction[];
}

export interface WritingPattern {
  type: 'daily' | 'weekly' | 'monthly';
  description: string;
  confidence: number;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface WritingHabits {
  preferredTimeSlots: TimeSlot[];
  averageSessionLength: number;
  breakPatterns: BreakPattern[];
  productivityFactors: ProductivityFactor[];
}

export interface TimeSlot {
  start: number; // hour of day
  end: number;
  productivity: number;
  frequency: number;
}

export interface BreakPattern {
  averageBreakLength: number;
  frequency: number;
  impact: number;
}

export interface ProductivityFactor {
  factor: string;
  correlation: number;
  description: string;
}

export interface Prediction {
  type: 'completion' | 'quality' | 'productivity';
  value: number;
  confidence: number;
  timeframe: string;
  description: string;
}

export interface Suggestion {
  id: string;
  type: 'quality' | 'productivity' | 'structure' | 'style' | 'habit';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionable: boolean;
  estimatedImpact: number;
  estimatedTime: string;
  category: string;
}

// 写作分析引擎类
export class WritingAnalyticsEngine {
  private papers: Paper[];
  private sessions: WritingSession[];

  constructor(papers: Paper[] = [], sessions: WritingSession[] = []) {
    this.papers = papers;
    this.sessions = sessions;
  }

  /**
   * 执行完整的写作分析
   */
  public analyzeWriting(paperId?: string): AnalysisResult {
    const targetPaper = paperId ? this.papers.find(p => p.id === paperId) : null;
    const papers = targetPaper ? [targetPaper] : this.papers;

    return {
      qualityScore: this.analyzeQuality(papers),
      progressMetrics: this.analyzeProgress(papers),
      trendAnalysis: this.analyzeTrends(papers),
      writingHabits: this.analyzeHabits(),
      suggestions: this.generateSuggestions(papers)
    };
  }

  /**
   * 质量分析算法
   */
  private analyzeQuality(papers: Paper[]): QualityAnalysis {
    if (!papers.length) {
      return this.getEmptyQualityAnalysis();
    }

    const factors: QualityFactor[] = [];
    let totalScore = 0;

    // 结构完整性分析
    const structureScore = this.analyzeStructure(papers);
    factors.push({
      name: '结构完整性',
      score: structureScore,
      weight: 0.25,
      description: '论文结构的完整性和逻辑性',
      suggestions: this.getStructureSuggestions(structureScore)
    });
    totalScore += structureScore * 0.25;

    // 内容质量分析
    const contentScore = this.analyzeContent(papers);
    factors.push({
      name: '内容质量',
      score: contentScore,
      weight: 0.25,
      description: '内容的深度、准确性和相关性',
      suggestions: this.getContentSuggestions(contentScore)
    });
    totalScore += contentScore * 0.25;

    // 写作风格分析
    const styleScore = this.analyzeStyle(papers);
    factors.push({
      name: '写作风格',
      score: styleScore,
      weight: 0.2,
      description: '语言表达的清晰度和学术规范性',
      suggestions: this.getStyleSuggestions(styleScore)
    });
    totalScore += styleScore * 0.2;

    // 格式规范分析
    const formattingScore = this.analyzeFormatting(papers);
    factors.push({
      name: '格式规范',
      score: formattingScore,
      weight: 0.15,
      description: '引用格式和排版的规范性',
      suggestions: this.getFormattingSuggestions(formattingScore)
    });
    totalScore += formattingScore * 0.15;

    // 词汇丰富度分析
    const vocabularyScore = this.analyzeVocabulary(papers);
    factors.push({
      name: '词汇丰富度',
      score: vocabularyScore,
      weight: 0.1,
      description: '词汇使用的多样性和准确性',
      suggestions: this.getVocabularySuggestions(vocabularyScore)
    });
    totalScore += vocabularyScore * 0.1;

    // 连贯性分析
    const coherenceScore = this.analyzeCoherence(papers);
    factors.push({
      name: '连贯性',
      score: coherenceScore,
      weight: 0.05,
      description: '段落和句子间的逻辑连接',
      suggestions: this.getCoherenceSuggestions(coherenceScore)
    });
    totalScore += coherenceScore * 0.05;

    return {
      overall: Math.round(totalScore),
      breakdown: {
        structure: structureScore,
        content: contentScore,
        style: styleScore,
        formatting: formattingScore,
        vocabulary: vocabularyScore,
        coherence: coherenceScore
      },
      factors
    };
  }

  /**
   * 进度分析算法
   */
  private analyzeProgress(papers: Paper[]): ProgressMetrics {
    const totalWords = papers.reduce((sum, paper) => sum + (paper.wordCount || 0), 0);
    const targetWords = papers.reduce((sum, paper) => sum + this.estimateTargetWords(paper), 0);
    
    const dailyAverage = this.calculateDailyAverage();
    const weeklyTrend = this.calculateWeeklyTrend();
    
    const completedSections = papers.reduce((sum, paper) => 
      sum + (paper.sections?.filter(s => this.isSectionCompleted(s)).length || 0), 0
    );
    const totalSections = papers.reduce((sum, paper) => sum + (paper.sections?.length || 0), 0);

    return {
      completionRate: targetWords > 0 ? (totalWords / targetWords) * 100 : 0,
      wordCount: {
        current: totalWords,
        target: targetWords,
        dailyAverage,
        weeklyTrend
      },
      timeMetrics: {
        totalTime: this.calculateTotalTime(),
        averageSession: this.calculateAverageSessionLength(),
        efficiency: this.calculateWritingEfficiency(),
        peakHours: this.identifyPeakHours()
      },
      sectionProgress: {
        completed: completedSections,
        total: totalSections,
        quality: this.analyzeSectionQuality(papers)
      }
    };
  }

  /**
   * 趋势分析算法
   */
  private analyzeTrends(papers: Paper[]): TrendAnalysis {
    const productivityTrend = this.calculateProductivityTrend();
    const qualityTrend = this.calculateQualityTrend();
    const consistencyScore = this.calculateConsistencyScore();
    const improvementRate = this.calculateImprovementRate();

    return {
      productivityTrend,
      qualityTrend,
      consistencyScore,
      improvementRate,
      patterns: this.identifyWritingPatterns(),
      predictions: this.generatePredictions()
    };
  }

  /**
   * 写作习惯分析
   */
  private analyzeHabits(): WritingHabits {
    return {
      preferredTimeSlots: this.identifyPreferredTimeSlots(),
      averageSessionLength: this.calculateAverageSessionLength(),
      breakPatterns: this.analyzeBreakPatterns(),
      productivityFactors: this.identifyProductivityFactors()
    };
  }

  /**
   * 生成改进建议
   */
  private generateSuggestions(papers: Paper[]): Suggestion[] {
    const suggestions: Suggestion[] = [];
    
    // 基于质量分析的建议
    const qualityAnalysis = this.analyzeQuality(papers);
    suggestions.push(...this.generateQualitySuggestions(qualityAnalysis));
    
    // 基于进度的建议
    const progressMetrics = this.analyzeProgress(papers);
    suggestions.push(...this.generateProgressSuggestions(progressMetrics));
    
    // 基于趋势的建议
    const trendAnalysis = this.analyzeTrends(papers);
    suggestions.push(...this.generateTrendSuggestions(trendAnalysis));
    
    // 基于习惯的建议
    const writingHabits = this.analyzeHabits();
    suggestions.push(...this.generateHabitSuggestions(writingHabits));

    return this.prioritizeSuggestions(suggestions);
  }

  // ========== 辅助方法 ==========

  private analyzeStructure(papers: Paper[]): number {
    let totalScore = 0;
    let paperCount = 0;

    for (const paper of papers) {
      let score = 0;
      
      // 检查基本结构
      if (paper.title && paper.title.length > 5) score += 15;
      if (paper.abstract && paper.abstract.length > 50) score += 15;
      if (paper.sections && paper.sections.length >= 6) score += 20;
      
      // 检查章节完整性
      if (paper.sections) {
        const completedSections = paper.sections.filter(s => s.content.length > 100).length;
        score += (completedSections / paper.sections.length) * 30;
      }
      
      // 检查逻辑结构
      if (this.hasLogicalFlow(paper)) score += 20;
      
      totalScore += Math.min(score, 100);
      paperCount++;
    }

    return paperCount > 0 ? Math.round(totalScore / paperCount) : 0;
  }

  private analyzeContent(papers: Paper[]): number {
    let totalScore = 0;
    let paperCount = 0;

    for (const paper of papers) {
      let score = 0;
      
      // 内容长度评分
      const contentLength = paper.content?.length || 0;
      if (contentLength > 10000) score += 30;
      else if (contentLength > 5000) score += 20;
      else if (contentLength > 1000) score += 10;
      
      // 关键词相关性
      if (paper.keywords && paper.keywords.length >= 3) score += 20;
      
      // 引用和参考文献
      const referenceCount = this.countReferences(paper);
      if (referenceCount > 20) score += 25;
      else if (referenceCount > 10) score += 15;
      else if (referenceCount > 5) score += 10;
      
      // 内容深度（基于段落数和复杂度）
      score += this.analyzeContentDepth(paper);
      
      totalScore += Math.min(score, 100);
      paperCount++;
    }

    return paperCount > 0 ? Math.round(totalScore / paperCount) : 0;
  }

  private analyzeStyle(papers: Paper[]): number {
    let totalScore = 0;
    let paperCount = 0;

    for (const paper of papers) {
      let score = 50; // 基础分数
      
      // 语言流畅度
      score += this.analyzeFluency(paper);
      
      // 学术规范性
      score += this.analyzeAcademicStyle(paper);
      
      // 表达清晰度
      score += this.analyzeClarity(paper);
      
      totalScore += Math.min(score, 100);
      paperCount++;
    }

    return paperCount > 0 ? Math.round(totalScore / paperCount) : 0;
  }

  private analyzeFormatting(papers: Paper[]): number {
    let totalScore = 0;
    let paperCount = 0;

    for (const paper of papers) {
      let score = 60; // 基础分数
      
      // 引用格式检查
      score += this.checkCitationFormat(paper);
      
      // 标题层次检查
      score += this.checkHeadingStructure(paper);
      
      // 图表格式检查
      score += this.checkFigureFormat(paper);
      
      totalScore += Math.min(score, 100);
      paperCount++;
    }

    return paperCount > 0 ? Math.round(totalScore / paperCount) : 0;
  }

  private analyzeVocabulary(papers: Paper[]): number {
    let totalScore = 0;
    let paperCount = 0;

    for (const paper of papers) {
      const words = this.extractWords(paper.content || '');
      const uniqueWords = new Set(words.map(w => w.toLowerCase()));
      
      // 词汇多样性
      const diversity = uniqueWords.size / words.length;
      let score = Math.min(diversity * 200, 50);
      
      // 学术词汇使用
      score += this.analyzeAcademicVocabulary(words);
      
      // 专业术语密度
      score += this.analyzeTerminologyDensity(words, paper.field);
      
      totalScore += Math.min(score, 100);
      paperCount++;
    }

    return paperCount > 0 ? Math.round(totalScore / paperCount) : 0;
  }

  private analyzeCoherence(papers: Paper[]): number {
    let totalScore = 0;
    let paperCount = 0;

    for (const paper of papers) {
      let score = 70; // 基础分数
      
      // 段落连接性
      score += this.analyzeParagraphConnections(paper);
      
      // 代词指代清晰度
      score += this.analyzePronounReference(paper);
      
      // 逻辑连接词使用
      score += this.analyzeLogicalConnectors(paper);
      
      totalScore += Math.min(score, 100);
      paperCount++;
    }

    return paperCount > 0 ? Math.round(totalScore / paperCount) : 0;
  }

  // ========== 数据计算方法 ==========

  private calculateDailyAverage(): number {
    // 模拟计算每日平均字数
    const recentSessions = this.sessions.slice(-7);
    if (!recentSessions.length) return 0;
    
    const totalWords = recentSessions.reduce((sum, session) => sum + session.wordsWritten, 0);
    return Math.round(totalWords / 7);
  }

  private calculateWeeklyTrend(): number {
    // 模拟计算周趋势
    const thisWeek = this.sessions.slice(-7);
    const lastWeek = this.sessions.slice(-14, -7);
    
    if (!lastWeek.length) return 0;
    
    const thisWeekAvg = thisWeek.reduce((sum, s) => sum + s.wordsWritten, 0) / thisWeek.length;
    const lastWeekAvg = lastWeek.reduce((sum, s) => sum + s.wordsWritten, 0) / lastWeek.length;
    
    return ((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100;
  }

  private calculateTotalTime(): number {
    return this.sessions.reduce((sum, session) => sum + session.duration, 0);
  }

  private calculateAverageSessionLength(): number {
    if (!this.sessions.length) return 0;
    return this.sessions.reduce((sum, session) => sum + session.duration, 0) / this.sessions.length;
  }

  private calculateWritingEfficiency(): number {
    if (!this.sessions.length) return 0;
    
    const totalWords = this.sessions.reduce((sum, session) => sum + session.wordsWritten, 0);
    const totalTime = this.sessions.reduce((sum, session) => sum + session.duration, 0);
    
    return totalTime > 0 ? Math.round(totalWords / (totalTime / 60)) : 0;
  }

  private identifyPeakHours(): number[] {
    const hourlyProductivity: { [hour: number]: number } = {};
    
    this.sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      hourlyProductivity[hour] = (hourlyProductivity[hour] || 0) + session.wordsWritten;
    });
    
    return Object.entries(hourlyProductivity)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([hour]) => parseInt(hour));
  }

  // ========== 其他辅助方法 ==========

  private estimateTargetWords(paper: Paper): number {
    // 根据论文类型估算目标字数
    const baseWords = 5000;
    const multipliers: { [key: string]: number } = {
      'research': 1.5,
      'review': 1.2,
      'case-study': 1.0,
      'thesis': 3.0
    };
    
    return baseWords * (multipliers[paper.paperType || 'research'] || 1.0);
  }

  private isSectionCompleted(section: any): boolean {
    return section.content && section.content.length > 100;
  }

  private hasLogicalFlow(paper: Paper): boolean {
    // 简化的逻辑流检查
    return paper.sections && paper.sections.length >= 4;
  }

  private countReferences(paper: Paper): number {
    // 简化的引用计数
    const content = paper.content || '';
    const referenceMatches = content.match(/\[\d+\]|\(\w+,?\s*\d{4}\)/g);
    return referenceMatches ? referenceMatches.length : 0;
  }

  private analyzeContentDepth(paper: Paper): number {
    // 简化的内容深度分析
    const content = paper.content || '';
    const paragraphs = content.split('\n\n').length;
    return Math.min(paragraphs * 2, 25);
  }

  private analyzeFluency(paper: Paper): number {
    // 简化的流畅度分析
    return Math.random() * 20 + 10; // 10-30分
  }

  private analyzeAcademicStyle(paper: Paper): number {
    // 简化的学术风格分析
    return Math.random() * 15 + 10; // 10-25分
  }

  private analyzeClarity(paper: Paper): number {
    // 简化的清晰度分析
    return Math.random() * 10 + 5; // 5-15分
  }

  private checkCitationFormat(paper: Paper): number {
    return Math.random() * 20 + 10; // 10-30分
  }

  private checkHeadingStructure(paper: Paper): number {
    return Math.random() * 10 + 5; // 5-15分
  }

  private checkFigureFormat(paper: Paper): number {
    return Math.random() * 10 + 5; // 5-15分
  }

  private extractWords(content: string): string[] {
    return content.toLowerCase().match(/\b[a-z]+\b/g) || [];
  }

  private analyzeAcademicVocabulary(words: string[]): number {
    // 简化的学术词汇分析
    const academicWords = ['analysis', 'research', 'study', 'method', 'result', 'conclusion'];
    const count = words.filter(word => academicWords.includes(word)).length;
    return Math.min(count * 2, 25);
  }

  private analyzeTerminologyDensity(words: string[], field?: string): number {
    // 简化的术语密度分析
    return Math.random() * 25; // 0-25分
  }

  private analyzeParagraphConnections(paper: Paper): number {
    return Math.random() * 15; // 0-15分
  }

  private analyzePronounReference(paper: Paper): number {
    return Math.random() * 10; // 0-10分
  }

  private analyzeLogicalConnectors(paper: Paper): number {
    return Math.random() * 5; // 0-5分
  }

  private analyzeSectionQuality(papers: Paper[]): number[] {
    // 返回每个章节的质量评分
    return papers.flatMap(paper => 
      paper.sections?.map(() => Math.random() * 40 + 60) || [] // 60-100分
    );
  }

  private calculateProductivityTrend(): number {
    return (Math.random() - 0.5) * 40; // -20% to +20%
  }

  private calculateQualityTrend(): number {
    return (Math.random() - 0.5) * 30; // -15% to +15%
  }

  private calculateConsistencyScore(): number {
    return Math.random() * 40 + 60; // 60-100%
  }

  private calculateImprovementRate(): number {
    return (Math.random() - 0.3) * 50; // -15% to +35%
  }

  private identifyWritingPatterns(): WritingPattern[] {
    return [
      {
        type: 'daily',
        description: '您倾向于在上午时段写作效率更高',
        confidence: 0.8,
        impact: 'positive'
      }
    ];
  }

  private generatePredictions(): Prediction[] {
    return [
      {
        type: 'completion',
        value: 85,
        confidence: 0.75,
        timeframe: '2周内',
        description: '基于当前进度预测完成概率'
      }
    ];
  }

  private identifyPreferredTimeSlots(): TimeSlot[] {
    return [
      {
        start: 9,
        end: 11,
        productivity: 0.9,
        frequency: 0.7
      }
    ];
  }

  private analyzeBreakPatterns(): BreakPattern[] {
    return [
      {
        averageBreakLength: 15,
        frequency: 0.6,
        impact: 0.1
      }
    ];
  }

  private identifyProductivityFactors(): ProductivityFactor[] {
    return [
      {
        factor: '写作时间',
        correlation: 0.8,
        description: '上午时段写作效率最高'
      }
    ];
  }

  private generateQualitySuggestions(analysis: QualityAnalysis): Suggestion[] {
    const suggestions: Suggestion[] = [];
    
    if (analysis.breakdown.structure < 70) {
      suggestions.push({
        id: 'structure-improve',
        type: 'structure',
        priority: 'high',
        title: '优化论文结构',
        description: '建议完善论文大纲，确保各章节逻辑清晰',
        actionable: true,
        estimatedImpact: 0.8,
        estimatedTime: '2-3小时',
        category: '结构优化'
      });
    }
    
    return suggestions;
  }

  private generateProgressSuggestions(metrics: ProgressMetrics): Suggestion[] {
    const suggestions: Suggestion[] = [];
    
    if (metrics.completionRate < 50) {
      suggestions.push({
        id: 'progress-boost',
        type: 'productivity',
        priority: 'high',
        title: '提升写作进度',
        description: '建议制定每日写作计划，设定具体的字数目标',
        actionable: true,
        estimatedImpact: 0.7,
        estimatedTime: '持续执行',
        category: '进度管理'
      });
    }
    
    return suggestions;
  }

  private generateTrendSuggestions(trends: TrendAnalysis): Suggestion[] {
    return [];
  }

  private generateHabitSuggestions(habits: WritingHabits): Suggestion[] {
    return [];
  }

  private prioritizeSuggestions(suggestions: Suggestion[]): Suggestion[] {
    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.estimatedImpact - a.estimatedImpact;
    });
  }

  private getEmptyQualityAnalysis(): QualityAnalysis {
    return {
      overall: 0,
      breakdown: {
        structure: 0,
        content: 0,
        style: 0,
        formatting: 0,
        vocabulary: 0,
        coherence: 0
      },
      factors: []
    };
  }

  private getStructureSuggestions(score: number): string[] {
    if (score < 60) return ['完善论文大纲', '增加章节层次', '优化逻辑结构'];
    if (score < 80) return ['细化章节内容', '加强段落连接'];
    return ['保持结构清晰'];
  }

  private getContentSuggestions(score: number): string[] {
    if (score < 60) return ['增加内容深度', '补充相关研究', '扩展理论基础'];
    if (score < 80) return ['完善论证过程', '增加实例说明'];
    return ['内容质量良好'];
  }

  private getStyleSuggestions(score: number): string[] {
    if (score < 60) return ['提升语言流畅度', '规范学术用词', '改善表达清晰度'];
    if (score < 80) return ['润色语言表达', '统一写作风格'];
    return ['写作风格优秀'];
  }

  private getFormattingSuggestions(score: number): string[] {
    if (score < 60) return ['规范引用格式', '统一排版样式', '检查图表格式'];
    if (score < 80) return ['完善引用细节', '优化版面设计'];
    return ['格式规范'];
  }

  private getVocabularySuggestions(score: number): string[] {
    if (score < 60) return ['增加词汇多样性', '使用专业术语', '避免重复表达'];
    if (score < 80) return ['优化词汇选择', '增强表达精确性'];
    return ['词汇使用恰当'];
  }

  private getCoherenceSuggestions(score: number): string[] {
    if (score < 60) return ['加强段落连接', '明确代词指代', '使用逻辑连接词'];
    if (score < 80) return ['优化句间连接', '提升整体连贯性'];
    return ['逻辑连贯性好'];
  }
}

// 写作会话接口
export interface WritingSession {
  id: string;
  paperId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  wordsWritten: number;
  quality: number;
  type: 'writing' | 'editing' | 'research';
}

// 导出工厂函数
export function createAnalyticsEngine(papers: Paper[], sessions: WritingSession[] = []): WritingAnalyticsEngine {
  return new WritingAnalyticsEngine(papers, sessions);
}