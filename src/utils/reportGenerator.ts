/**
 * 洞察报告生成器
 * 自动生成写作质量报告和个性化改进建议
 */

import { Paper } from '../types';
import { AnalysisResult, WritingAnalyticsEngine } from './analyticsEngine';

export interface Report {
  id: string;
  title: string;
  generatedAt: Date;
  timeRange: {
    start: Date;
    end: Date;
    description: string;
  };
  summary: ReportSummary;
  sections: ReportSection[];
  recommendations: Recommendation[];
  metadata: ReportMetadata;
}

export interface ReportSummary {
  overallScore: number;
  keyFindings: string[];
  progressHighlights: string[];
  improvementAreas: string[];
  nextSteps: string[];
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'quality' | 'progress' | 'trends' | 'habits' | 'comparison';
  content: SectionContent;
  insights: string[];
  charts?: ChartDefinition[];
}

export interface SectionContent {
  text: string;
  data: any;
  analysis: string[];
  statistics: { [key: string]: number | string };
}

export interface Recommendation {
  id: string;
  category: 'immediate' | 'short-term' | 'long-term';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  rationale: string;
  actionSteps: ActionStep[];
  expectedOutcome: string;
  timeFrame: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  resources?: string[];
}

export interface ActionStep {
  step: number;
  action: string;
  timeEstimate: string;
  tools?: string[];
}

export interface ChartDefinition {
  type: 'line' | 'bar' | 'pie' | 'area';
  title: string;
  data: any;
  config: any;
}

export interface ReportMetadata {
  reportType: 'individual' | 'comparative' | 'comprehensive';
  paperCount: number;
  analysisDepth: 'basic' | 'detailed' | 'comprehensive';
  generationTime: number; // milliseconds
  version: string;
  author?: string;
}

export interface ReportGenerationOptions {
  paperIds?: string[];
  timeRange?: {
    start: Date;
    end: Date;
  };
  analysisDepth?: 'basic' | 'detailed' | 'comprehensive';
  includeCharts?: boolean;
  includeComparisons?: boolean;
  language?: 'zh' | 'en';
  format?: 'json' | 'markdown' | 'html' | 'pdf';
}

export class ReportGenerator {
  private papers: Paper[];
  private analyticsEngine: WritingAnalyticsEngine;

  constructor(papers: Paper[]) {
    this.papers = papers;
    this.analyticsEngine = new WritingAnalyticsEngine(papers);
  }

  /**
   * 生成完整的洞察报告
   */
  public async generateReport(options: ReportGenerationOptions = {}): Promise<Report> {
    const startTime = Date.now();
    
    // 设置默认选项
    const defaultOptions: Required<ReportGenerationOptions> = {
      paperIds: options.paperIds || this.papers.map(p => p.id),
      timeRange: options.timeRange || {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30天前
        end: new Date()
      },
      analysisDepth: options.analysisDepth || 'detailed',
      includeCharts: options.includeCharts ?? true,
      includeComparisons: options.includeComparisons ?? false,
      language: options.language || 'zh',
      format: options.format || 'json'
    };

    // 获取目标论文
    const targetPapers = this.papers.filter(p => 
      defaultOptions.paperIds.includes(p.id)
    );

    // 执行分析
    const analysisResults = await this.performAnalysis(targetPapers);

    // 生成报告
    const report: Report = {
      id: this.generateReportId(),
      title: this.generateReportTitle(targetPapers, defaultOptions),
      generatedAt: new Date(),
      timeRange: {
        start: defaultOptions.timeRange.start,
        end: defaultOptions.timeRange.end,
        description: this.formatTimeRange(defaultOptions.timeRange)
      },
      summary: this.generateSummary(analysisResults, targetPapers),
      sections: this.generateSections(analysisResults, targetPapers, defaultOptions),
      recommendations: this.generateRecommendations(analysisResults, targetPapers),
      metadata: {
        reportType: targetPapers.length === 1 ? 'individual' : 'comparative',
        paperCount: targetPapers.length,
        analysisDepth: defaultOptions.analysisDepth,
        generationTime: Date.now() - startTime,
        version: '1.0.0'
      }
    };

    return report;
  }

  /**
   * 生成个性化改进建议
   */
  public generatePersonalizedSuggestions(
    analysisResult: AnalysisResult,
    userProfile?: UserProfile
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // 基于质量分析的建议
    if (analysisResult.qualityScore.overall < 70) {
      recommendations.push({
        id: 'quality-improvement',
        category: 'immediate',
        priority: 'high',
        title: '提升整体写作质量',
        description: '当前写作质量有较大提升空间，建议从基础结构和内容质量入手。',
        rationale: `您的综合质量评分为${analysisResult.qualityScore.overall}分，低于良好水平(70分)。`,
        actionSteps: [
          {
            step: 1,
            action: '重新审视论文大纲，确保逻辑结构清晰',
            timeEstimate: '2-3小时',
            tools: ['思维导图工具', '大纲模板']
          },
          {
            step: 2,
            action: '逐章节检查内容完整性和深度',
            timeEstimate: '4-6小时',
            tools: ['内容检查清单']
          },
          {
            step: 3,
            action: '进行语言润色和格式规范化',
            timeEstimate: '2-4小时',
            tools: ['语法检查工具', '格式模板']
          }
        ],
        expectedOutcome: '质量评分提升至75分以上，论文结构更加清晰，内容更加充实。',
        timeFrame: '1-2周',
        difficulty: 'moderate',
        resources: ['写作指南', '同行评议', '导师反馈']
      });
    }

    // 基于进度的建议
    if (analysisResult.progressMetrics.completionRate < 50) {
      recommendations.push({
        id: 'progress-acceleration',
        category: 'immediate',
        priority: 'critical',
        title: '加速写作进度',
        description: '当前完成进度较慢，需要调整写作策略和时间安排。',
        rationale: `完成率仅为${analysisResult.progressMetrics.completionRate.toFixed(1)}%，需要提升写作效率。`,
        actionSteps: [
          {
            step: 1,
            action: '制定详细的每日写作计划',
            timeEstimate: '1小时',
            tools: ['时间管理应用', '写作进度表']
          },
          {
            step: 2,
            action: '设定具体的字数和时间目标',
            timeEstimate: '30分钟',
            tools: ['目标设定模板']
          },
          {
            step: 3,
            action: '消除写作环境中的干扰因素',
            timeEstimate: '1小时',
            tools: ['专注应用', '环境优化清单']
          }
        ],
        expectedOutcome: '每日写作效率提升30%，按时完成目标。',
        timeFrame: '1周内见效',
        difficulty: 'easy',
        resources: ['番茄工作法', '写作社群支持']
      });
    }

    // 基于习惯的建议
    if (analysisResult.writingHabits.averageSessionLength < 60) {
      recommendations.push({
        id: 'session-optimization',
        category: 'short-term',
        priority: 'medium',
        title: '优化写作会话时长',
        description: '当前写作会话时间较短，建议延长单次写作时间以提高效率。',
        rationale: `平均写作时长仅为${analysisResult.writingHabits.averageSessionLength}分钟，难以进入深度工作状态。`,
        actionSteps: [
          {
            step: 1,
            action: '逐步延长写作时间，从当前时长开始每周增加15分钟',
            timeEstimate: '每次写作',
            tools: ['计时器', '进度追踪']
          },
          {
            step: 2,
            action: '在写作前进行5分钟的专注练习',
            timeEstimate: '5分钟',
            tools: ['冥想应用', '专注训练']
          }
        ],
        expectedOutcome: '单次写作时长达到90分钟以上，进入深度工作状态。',
        timeFrame: '3-4周',
        difficulty: 'moderate'
      });
    }

    return this.prioritizeRecommendations(recommendations);
  }

  /**
   * 导出报告为不同格式
   */
  public async exportReport(report: Report, format: 'markdown' | 'html' | 'json' = 'json'): Promise<string> {
    switch (format) {
      case 'markdown':
        return this.exportToMarkdown(report);
      case 'html':
        return this.exportToHTML(report);
      case 'json':
      default:
        return JSON.stringify(report, null, 2);
    }
  }

  // ========== 私有方法 ==========

  private async performAnalysis(papers: Paper[]): Promise<AnalysisResult> {
    // 这里可以并行执行多种分析
    return this.analyticsEngine.analyzeWriting(papers.length === 1 ? papers[0].id : undefined);
  }

  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateReportTitle(papers: Paper[], options: Required<ReportGenerationOptions>): string {
    if (papers.length === 1) {
      return `《${papers[0].title}》写作分析报告`;
    } else if (papers.length <= 3) {
      return `多篇论文对比分析报告`;
    } else {
      return `写作表现综合分析报告`;
    }
  }

  private formatTimeRange(timeRange: { start: Date; end: Date }): string {
    const start = timeRange.start.toLocaleDateString('zh-CN');
    const end = timeRange.end.toLocaleDateString('zh-CN');
    return `${start} 至 ${end}`;
  }

  private generateSummary(analysisResult: AnalysisResult, papers: Paper[]): ReportSummary {
    const overallScore = analysisResult.qualityScore.overall;
    
    const keyFindings: string[] = [];
    const progressHighlights: string[] = [];
    const improvementAreas: string[] = [];
    const nextSteps: string[] = [];

    // 关键发现
    if (overallScore >= 85) {
      keyFindings.push('写作质量优秀，展现出良好的学术写作能力');
    } else if (overallScore >= 70) {
      keyFindings.push('写作质量良好，具备基本的学术规范');
    } else {
      keyFindings.push('写作质量有较大提升空间，需要重点关注');
    }

    if (analysisResult.progressMetrics.completionRate >= 80) {
      progressHighlights.push('写作进度良好，按计划推进');
    } else if (analysisResult.progressMetrics.completionRate >= 50) {
      progressHighlights.push('写作进度中等，需要适当加速');
    } else {
      progressHighlights.push('写作进度较慢，建议调整计划');
    }

    // 改进领域
    const breakdown = analysisResult.qualityScore.breakdown;
    if (breakdown.structure < 70) improvementAreas.push('论文结构需要优化');
    if (breakdown.content < 70) improvementAreas.push('内容深度有待提升');
    if (breakdown.style < 70) improvementAreas.push('写作风格需要改进');
    if (breakdown.formatting < 70) improvementAreas.push('格式规范需要完善');

    // 下一步行动
    nextSteps.push('根据具体建议制定改进计划');
    nextSteps.push('设定阶段性目标和检查点');
    nextSteps.push('寻求专业反馈和指导');

    return {
      overallScore,
      keyFindings,
      progressHighlights,
      improvementAreas,
      nextSteps
    };
  }

  private generateSections(
    analysisResult: AnalysisResult,
    papers: Paper[],
    options: Required<ReportGenerationOptions>
  ): ReportSection[] {
    const sections: ReportSection[] = [];

    // 质量分析章节
    sections.push({
      id: 'quality-analysis',
      title: '写作质量分析',
      type: 'quality',
      content: {
        text: this.generateQualityAnalysisText(analysisResult.qualityScore),
        data: analysisResult.qualityScore,
        analysis: [
          `综合质量评分：${analysisResult.qualityScore.overall}分`,
          `结构完整性：${analysisResult.qualityScore.breakdown.structure}分`,
          `内容质量：${analysisResult.qualityScore.breakdown.content}分`,
          `写作风格：${analysisResult.qualityScore.breakdown.style}分`
        ],
        statistics: {
          '总体评分': analysisResult.qualityScore.overall,
          '结构评分': analysisResult.qualityScore.breakdown.structure,
          '内容评分': analysisResult.qualityScore.breakdown.content,
          '风格评分': analysisResult.qualityScore.breakdown.style
        }
      },
      insights: this.generateQualityInsights(analysisResult.qualityScore),
      charts: options.includeCharts ? [{
        type: 'bar',
        title: '质量维度评分',
        data: this.formatQualityChartData(analysisResult.qualityScore),
        config: { height: 300, showValues: true }
      }] : undefined
    });

    // 进度分析章节
    sections.push({
      id: 'progress-analysis',
      title: '写作进度分析',
      type: 'progress',
      content: {
        text: this.generateProgressAnalysisText(analysisResult.progressMetrics),
        data: analysisResult.progressMetrics,
        analysis: [
          `完成率：${analysisResult.progressMetrics.completionRate.toFixed(1)}%`,
          `当前字数：${analysisResult.progressMetrics.wordCount.current.toLocaleString()}`,
          `目标字数：${analysisResult.progressMetrics.wordCount.target.toLocaleString()}`,
          `平均效率：${analysisResult.progressMetrics.timeMetrics.efficiency}字/分钟`
        ],
        statistics: {
          '完成率': `${analysisResult.progressMetrics.completionRate.toFixed(1)}%`,
          '当前字数': analysisResult.progressMetrics.wordCount.current,
          '目标字数': analysisResult.progressMetrics.wordCount.target,
          '写作效率': `${analysisResult.progressMetrics.timeMetrics.efficiency}字/分钟`
        }
      },
      insights: this.generateProgressInsights(analysisResult.progressMetrics)
    });

    // 趋势分析章节
    sections.push({
      id: 'trend-analysis',
      title: '写作趋势分析',
      type: 'trends',
      content: {
        text: this.generateTrendAnalysisText(analysisResult.trendAnalysis),
        data: analysisResult.trendAnalysis,
        analysis: [
          `生产力趋势：${analysisResult.trendAnalysis.productivityTrend > 0 ? '上升' : '下降'}${Math.abs(analysisResult.trendAnalysis.productivityTrend).toFixed(1)}%`,
          `质量趋势：${analysisResult.trendAnalysis.qualityTrend > 0 ? '改善' : '下降'}${Math.abs(analysisResult.trendAnalysis.qualityTrend).toFixed(1)}%`,
          `一致性得分：${analysisResult.trendAnalysis.consistencyScore.toFixed(1)}%`
        ],
        statistics: {
          '生产力趋势': `${analysisResult.trendAnalysis.productivityTrend.toFixed(1)}%`,
          '质量趋势': `${analysisResult.trendAnalysis.qualityTrend.toFixed(1)}%`,
          '一致性': `${analysisResult.trendAnalysis.consistencyScore.toFixed(1)}%`
        }
      },
      insights: this.generateTrendInsights(analysisResult.trendAnalysis)
    });

    return sections;
  }

  private generateRecommendations(analysisResult: AnalysisResult, papers: Paper[]): Recommendation[] {
    return this.generatePersonalizedSuggestions(analysisResult);
  }

  private generateQualityAnalysisText(qualityScore: any): string {
    const score = qualityScore.overall;
    
    if (score >= 85) {
      return '您的写作质量表现优秀，在结构完整性、内容深度、写作风格等方面都达到了较高水平。建议继续保持这种高质量的写作标准，并可以考虑向更高的学术目标挑战。';
    } else if (score >= 70) {
      return '您的写作质量处于良好水平，基本掌握了学术写作的核心要素。虽然整体表现不错，但仍有提升空间，特别是在一些细节方面可以进一步完善。';
    } else if (score >= 50) {
      return '您的写作质量处于中等水平，在某些方面表现较好，但在其他方面需要重点改进。建议系统性地提升写作技能，从结构规划到内容展开都需要更多关注。';
    } else {
      return '您的写作质量有较大提升空间，建议从基础开始系统性地改进。重点关注论文结构设计、内容组织和语言表达，循序渐进地提升写作水平。';
    }
  }

  private generateProgressAnalysisText(progressMetrics: any): string {
    const completionRate = progressMetrics.completionRate;
    
    if (completionRate >= 80) {
      return '您的写作进度非常理想，按照当前的节奏，能够如期或提前完成写作目标。保持现有的写作习惯和效率，同时注意质量的维持。';
    } else if (completionRate >= 50) {
      return '您的写作进度处于正常范围内，但建议适当加快节奏以确保按时完成。可以考虑增加每日写作时间或提高写作效率。';
    } else {
      return '您的写作进度相对较慢，需要重新评估和调整写作计划。建议分析导致进度缓慢的原因，制定更加具体和可执行的写作策略。';
    }
  }

  private generateTrendAnalysisText(trendAnalysis: any): string {
    const productivityTrend = trendAnalysis.productivityTrend;
    const consistencyScore = trendAnalysis.consistencyScore;
    
    let text = '';
    
    if (productivityTrend > 10) {
      text += '您的写作效率呈现明显上升趋势，说明您正在找到适合的写作节奏和方法。';
    } else if (productivityTrend > 0) {
      text += '您的写作效率有轻微提升，整体发展方向积极。';
    } else {
      text += '您的写作效率有所下降，建议分析原因并调整策略。';
    }
    
    if (consistencyScore >= 80) {
      text += '您的写作一致性很好，表现出良好的写作习惯。';
    } else if (consistencyScore >= 60) {
      text += '您的写作一致性中等，可以进一步提升规律性。';
    } else {
      text += '您的写作一致性较低，建议建立更加规律的写作习惯。';
    }
    
    return text;
  }

  private generateQualityInsights(qualityScore: any): string[] {
    const insights: string[] = [];
    const breakdown = qualityScore.breakdown;
    
    // 找出最强和最弱的维度
    const dimensions = Object.entries(breakdown) as [string, number][];
    const sorted = dimensions.sort((a, b) => b[1] - a[1]);
    const strongest = sorted[0];
    const weakest = sorted[sorted.length - 1];
    
    const dimensionNames: { [key: string]: string } = {
      structure: '结构完整性',
      content: '内容质量',
      style: '写作风格',
      formatting: '格式规范',
      vocabulary: '词汇丰富度',
      coherence: '连贯性'
    };
    
    insights.push(`您在${dimensionNames[strongest[0]]}方面表现最好（${strongest[1]}分）`);
    insights.push(`${dimensionNames[weakest[0]]}是主要的改进空间（${weakest[1]}分）`);
    
    if (qualityScore.overall >= 80) {
      insights.push('整体质量优秀，可以考虑投稿或答辩');
    } else if (qualityScore.overall >= 60) {
      insights.push('质量良好，建议进一步完善后提交');
    } else {
      insights.push('建议进行大幅修改后再次评估');
    }
    
    return insights;
  }

  private generateProgressInsights(progressMetrics: any): string[] {
    const insights: string[] = [];
    
    if (progressMetrics.timeMetrics.efficiency < 20) {
      insights.push('写作效率偏低，建议优化写作环境和方法');
    } else if (progressMetrics.timeMetrics.efficiency > 40) {
      insights.push('写作效率很高，注意保持质量平衡');
    }
    
    if (progressMetrics.wordCount.dailyAverage > 1000) {
      insights.push('日均产出很高，保持这种良好势头');
    } else if (progressMetrics.wordCount.dailyAverage < 300) {
      insights.push('日均产出较低，建议增加写作时间');
    }
    
    return insights;
  }

  private generateTrendInsights(trendAnalysis: any): string[] {
    const insights: string[] = [];
    
    if (trendAnalysis.productivityTrend > 15) {
      insights.push('生产力显著提升，当前策略效果很好');
    } else if (trendAnalysis.productivityTrend < -10) {
      insights.push('生产力下降明显，需要调整写作策略');
    }
    
    if (trendAnalysis.consistencyScore > 80) {
      insights.push('写作习惯非常规律，有利于长期发展');
    } else if (trendAnalysis.consistencyScore < 50) {
      insights.push('写作习惯不够规律，建议建立固定时间表');
    }
    
    return insights;
  }

  private formatQualityChartData(qualityScore: any): any {
    return Object.entries(qualityScore.breakdown).map(([key, value]) => ({
      label: this.translateDimension(key),
      value: value as number
    }));
  }

  private translateDimension(key: string): string {
    const translations: { [key: string]: string } = {
      structure: '结构',
      content: '内容',
      style: '风格',
      formatting: '格式',
      vocabulary: '词汇',
      coherence: '连贯性'
    };
    return translations[key] || key;
  }

  private prioritizeRecommendations(recommendations: Recommendation[]): Recommendation[] {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const categoryOrder = { immediate: 3, 'short-term': 2, 'long-term': 1 };
    
    return recommendations.sort((a, b) => {
      // 首先按优先级排序
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // 然后按类别排序
      return categoryOrder[b.category] - categoryOrder[a.category];
    });
  }

  private async exportToMarkdown(report: Report): Promise<string> {
    let markdown = `# ${report.title}\n\n`;
    markdown += `**生成时间**: ${report.generatedAt.toLocaleString('zh-CN')}\n`;
    markdown += `**时间范围**: ${report.timeRange.description}\n\n`;
    
    // 摘要
    markdown += `## 报告摘要\n\n`;
    markdown += `**综合评分**: ${report.summary.overallScore}分\n\n`;
    
    markdown += `### 关键发现\n`;
    report.summary.keyFindings.forEach(finding => {
      markdown += `- ${finding}\n`;
    });
    
    markdown += `\n### 改进领域\n`;
    report.summary.improvementAreas.forEach(area => {
      markdown += `- ${area}\n`;
    });
    
    // 详细分析
    markdown += `\n## 详细分析\n\n`;
    
    report.sections.forEach(section => {
      markdown += `### ${section.title}\n\n`;
      markdown += `${section.content.text}\n\n`;
      
      if (section.insights.length > 0) {
        markdown += `**洞察要点**:\n`;
        section.insights.forEach(insight => {
          markdown += `- ${insight}\n`;
        });
        markdown += `\n`;
      }
    });
    
    // 建议
    markdown += `## 改进建议\n\n`;
    
    const categorizedRecommendations = {
      immediate: report.recommendations.filter(r => r.category === 'immediate'),
      'short-term': report.recommendations.filter(r => r.category === 'short-term'),
      'long-term': report.recommendations.filter(r => r.category === 'long-term')
    };
    
    Object.entries(categorizedRecommendations).forEach(([category, recs]) => {
      if (recs.length === 0) return;
      
      const categoryName = category === 'immediate' ? '立即行动' : 
                          category === 'short-term' ? '短期目标' : '长期规划';
      
      markdown += `### ${categoryName}\n\n`;
      
      recs.forEach((rec, index) => {
        markdown += `#### ${index + 1}. ${rec.title}\n\n`;
        markdown += `**优先级**: ${rec.priority}\n`;
        markdown += `**难度**: ${rec.difficulty}\n`;
        markdown += `**时间框架**: ${rec.timeFrame}\n\n`;
        markdown += `${rec.description}\n\n`;
        
        if (rec.actionSteps.length > 0) {
          markdown += `**行动步骤**:\n`;
          rec.actionSteps.forEach(step => {
            markdown += `${step.step}. ${step.action} (预计${step.timeEstimate})\n`;
          });
          markdown += `\n`;
        }
        
        markdown += `**预期结果**: ${rec.expectedOutcome}\n\n`;
      });
    });
    
    return markdown;
  }

  private async exportToHTML(report: Report): Promise<string> {
    // 简化的HTML导出实现
    const markdown = await this.exportToMarkdown(report);
    
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #333; }
        .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .recommendation { border-left: 4px solid #007bff; padding-left: 16px; margin: 16px 0; }
        .high-priority { border-left-color: #dc3545; }
        .medium-priority { border-left-color: #ffc107; }
        .low-priority { border-left-color: #28a745; }
    </style>
</head>
<body>
    <pre>${markdown.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;
  }
}

// 用户画像接口（用于个性化建议）
export interface UserProfile {
  writingExperience: 'beginner' | 'intermediate' | 'advanced';
  academicLevel: 'undergraduate' | 'graduate' | 'phd' | 'professional';
  researchField: string;
  preferredWorkingHours: number[];
  goals: string[];
  challenges: string[];
}

// 导出工厂函数
export function createReportGenerator(papers: Paper[]): ReportGenerator {
  return new ReportGenerator(papers);
}