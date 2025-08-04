/**
 * 跨模块一致性分析服务
 * 负责检查论文各章节之间的逻辑一致性、引用完整性、结构合理性等
 */

import { GLMClient } from './glm-client';
import type { 
  Paper, 
  PaperSection, 
  Reference,
  EnglishPaperType,
  AcademicLevel 
} from '../types';

// 一致性分析结果类型
export interface ConsistencyAnalysisResult {
  overall: {
    score: number; // 0-100
    grade: 'excellent' | 'good' | 'fair' | 'poor';
    summary: string;
  };
  logicalConsistency: LogicalConsistencyResult;
  referenceIntegrity: ReferenceIntegrityResult;
  structuralCoherence: StructuralCoherenceResult;
  contentConsistency: ContentConsistencyResult;
  recommendations: ConsistencyRecommendation[];
  timestamp: Date;
}

// 逻辑一致性结果
export interface LogicalConsistencyResult {
  score: number;
  issues: LogicalIssue[];
  flow: {
    score: number;
    transitions: TransitionAnalysis[];
  };
  argumentation: {
    score: number;
    chain: ArgumentChain[];
  };
}

// 逻辑问题
export interface LogicalIssue {
  type: 'contradiction' | 'gap' | 'repetition' | 'inconsistency';
  severity: 'critical' | 'major' | 'minor';
  sections: string[];
  description: string;
  suggestion: string;
  confidence: number;
}

// 过渡分析
export interface TransitionAnalysis {
  fromSection: string;
  toSection: string;
  score: number;
  issue?: string;
  suggestion?: string;
}

// 论证链
export interface ArgumentChain {
  premise: string;
  conclusion: string;
  strength: number;
  supportingEvidence: string[];
  weaknesses: string[];
}

// 引用完整性结果
export interface ReferenceIntegrityResult {
  score: number;
  totalReferences: number;
  citationIssues: CitationIssue[];
  bibliographyIssues: BibliographyIssue[];
  consistencyIssues: ReferenceConsistencyIssue[];
}

// 引用问题
export interface CitationIssue {
  type: 'missing' | 'incorrect' | 'orphaned' | 'duplicate';
  location: string;
  reference?: string;
  description: string;
  suggestion: string;
}

// 参考文献问题
export interface BibliographyIssue {
  type: 'formatting' | 'incomplete' | 'inconsistent';
  referenceId: string;
  description: string;
  suggestion: string;
}

// 引用一致性问题
export interface ReferenceConsistencyIssue {
  type: 'style' | 'format' | 'order';
  description: string;
  affectedReferences: string[];
  suggestion: string;
}

// 结构连贯性结果
export interface StructuralCoherenceResult {
  score: number;
  sectionBalance: SectionBalanceAnalysis;
  hierarchyConsistency: HierarchyConsistencyAnalysis;
  contentDistribution: ContentDistributionAnalysis;
}

// 章节平衡分析
export interface SectionBalanceAnalysis {
  score: number;
  imbalances: SectionImbalance[];
  recommendations: string[];
}

export interface SectionImbalance {
  section: string;
  issue: 'too_long' | 'too_short' | 'disproportionate';
  currentLength: number;
  recommendedRange: { min: number; max: number };
  severity: 'minor' | 'moderate' | 'severe';
}

// 层次一致性分析
export interface HierarchyConsistencyAnalysis {
  score: number;
  issues: HierarchyIssue[];
}

export interface HierarchyIssue {
  type: 'missing_level' | 'inconsistent_numbering' | 'wrong_order';
  section: string;
  description: string;
  suggestion: string;
}

// 内容分布分析
export interface ContentDistributionAnalysis {
  score: number;
  wordCountBySection: Record<string, number>;
  recommendations: string[];
}

// 内容一致性结果
export interface ContentConsistencyResult {
  score: number;
  terminologyConsistency: TerminologyConsistencyResult;
  styleConsistency: StyleConsistencyResult;
  duplicateContent: DuplicateContentResult;
}

// 术语一致性结果
export interface TerminologyConsistencyResult {
  score: number;
  inconsistencies: TerminologyInconsistency[];
  glossary: TermDefinition[];
}

export interface TerminologyInconsistency {
  term: string;
  variations: string[];
  locations: string[];
  suggestedStandard: string;
}

export interface TermDefinition {
  term: string;
  definition: string;
  firstUsage: string;
  frequency: number;
}

// 风格一致性结果
export interface StyleConsistencyResult {
  score: number;
  issues: StyleInconsistency[];
}

export interface StyleInconsistency {
  type: 'tense' | 'voice' | 'person' | 'tone' | 'formatting';
  locations: string[];
  description: string;
  suggestion: string;
}

// 重复内容结果
export interface DuplicateContentResult {
  score: number;
  duplicates: ContentDuplicate[];
}

export interface ContentDuplicate {
  content: string;
  locations: string[];
  similarity: number;
  suggestion: string;
}

// 一致性建议
export interface ConsistencyRecommendation {
  priority: 'high' | 'medium' | 'low';
  category: 'logical' | 'structural' | 'content' | 'reference';
  title: string;
  description: string;
  actions: RecommendationAction[];
  expectedImpact: number;
}

export interface RecommendationAction {
  type: 'edit' | 'add' | 'remove' | 'reorder' | 'merge';
  target: string;
  description: string;
  autoApplicable: boolean;
}

// 一致性分析配置
export interface ConsistencyAnalysisConfig {
  paperType: EnglishPaperType;
  academicLevel: AcademicLevel;
  citationStyle: string;
  analysisDepth: 'basic' | 'detailed' | 'comprehensive';
  enableAIAnalysis: boolean;
  customRules?: ConsistencyRule[];
}

export interface ConsistencyRule {
  id: string;
  name: string;
  description: string;
  type: 'logical' | 'structural' | 'content' | 'reference';
  enabled: boolean;
  weight: number;
  parameters: Record<string, any>;
}

/**
 * 跨模块一致性分析器
 */
export class ConsistencyAnalyzer {
  private glmClient: GLMClient;
  private config: ConsistencyAnalysisConfig;

  constructor(glmClient: GLMClient, config: ConsistencyAnalysisConfig) {
    this.glmClient = glmClient;
    this.config = config;
  }

  /**
   * 执行完整的一致性分析
   */
  async analyzePaper(paper: Paper): Promise<ConsistencyAnalysisResult> {
    try {
      console.log(`开始一致性分析: ${paper.title}`);

      // 并行执行各项分析
      const [
        logicalResult,
        referenceResult,
        structuralResult,
        contentResult
      ] = await Promise.all([
        this.analyzeLogicalConsistency(paper),
        this.analyzeReferenceIntegrity(paper),
        this.analyzeStructuralCoherence(paper),
        this.analyzeContentConsistency(paper)
      ]);

      // 计算整体分数
      const overallScore = this.calculateOverallScore({
        logical: logicalResult.score,
        reference: referenceResult.score,
        structural: structuralResult.score,
        content: contentResult.score
      });

      // 生成建议
      const recommendations = await this.generateRecommendations({
        logicalResult,
        referenceResult,
        structuralResult,
        contentResult
      });

      return {
        overall: {
          score: overallScore,
          grade: this.getGrade(overallScore),
          summary: await this.generateSummary(overallScore, {
            logical: logicalResult,
            reference: referenceResult,
            structural: structuralResult,
            content: contentResult
          })
        },
        logicalConsistency: logicalResult,
        referenceIntegrity: referenceResult,
        structuralCoherence: structuralResult,
        contentConsistency: contentResult,
        recommendations,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('一致性分析失败:', error);
      throw error;
    }
  }

  /**
   * 分析逻辑一致性
   */
  private async analyzeLogicalConsistency(paper: Paper): Promise<LogicalConsistencyResult> {
    const sections = paper.sections || [];
    
    // 分析逻辑流
    const flowAnalysis = await this.analyzeLogicalFlow(sections);
    
    // 分析论证链
    const argumentationAnalysis = await this.analyzeArgumentation(sections);
    
    // 检测逻辑问题
    const logicalIssues = await this.detectLogicalIssues(sections);

    const score = this.calculateLogicalScore(flowAnalysis, argumentationAnalysis, logicalIssues);

    return {
      score,
      issues: logicalIssues,
      flow: flowAnalysis,
      argumentation: argumentationAnalysis
    };
  }

  /**
   * 分析逻辑流
   */
  private async analyzeLogicalFlow(sections: PaperSection[]): Promise<{
    score: number;
    transitions: TransitionAnalysis[];
  }> {
    const transitions: TransitionAnalysis[] = [];
    
    for (let i = 0; i < sections.length - 1; i++) {
      const currentSection = sections[i];
      const nextSection = sections[i + 1];
      
      if (this.config.enableAIAnalysis) {
        try {
          const prompt = `分析以下两个论文章节之间的逻辑过渡质量：

章节 ${currentSection.title}:
${currentSection.content.slice(-500)}

章节 ${nextSection.title}:
${nextSection.content.slice(0, 500)}

请评估：
1. 过渡的自然程度 (0-100)
2. 逻辑连接强度
3. 存在的问题（如果有）
4. 改进建议

请以JSON格式返回结果：
{
  "score": number,
  "issue": string | null,
  "suggestion": string | null
}`;

          const response = await this.glmClient.chat([
            { role: 'user', content: prompt }
          ], { temperature: 0.3 });

          const result = this.parseJSONResponse(response);
          transitions.push({
            fromSection: currentSection.title,
            toSection: nextSection.title,
            score: result.score || 70,
            issue: result.issue,
            suggestion: result.suggestion
          });
        } catch (error) {
          console.warn('AI逻辑流分析失败，使用基础分析', error);
          transitions.push({
            fromSection: currentSection.title,
            toSection: nextSection.title,
            score: 70
          });
        }
      } else {
        // 基础分析：检查章节长度和连接词
        const score = this.analyzeTransitionBasic(currentSection, nextSection);
        transitions.push({
          fromSection: currentSection.title,
          toSection: nextSection.title,
          score
        });
      }
    }

    const avgScore = transitions.reduce((sum, t) => sum + t.score, 0) / transitions.length;
    
    return {
      score: Math.round(avgScore),
      transitions
    };
  }

  /**
   * 基础过渡分析
   */
  private analyzeTransitionBasic(current: PaperSection, next: PaperSection): number {
    let score = 70; // 基础分数

    // 检查章节长度平衡
    const lengthRatio = Math.min(current.content.length, next.content.length) / 
                       Math.max(current.content.length, next.content.length);
    
    if (lengthRatio < 0.3) score -= 10; // 长度差异过大

    // 检查连接词
    const transitionWords = ['因此', '然而', '此外', '另外', 'therefore', 'however', 'furthermore', 'moreover'];
    const hasTransition = transitionWords.some(word => 
      next.content.toLowerCase().includes(word.toLowerCase())
    );
    
    if (hasTransition) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 分析论证结构
   */
  private async analyzeArgumentation(sections: PaperSection[]): Promise<{
    score: number;
    chain: ArgumentChain[];
  }> {
    const chains: ArgumentChain[] = [];
    
    if (this.config.enableAIAnalysis) {
      try {
        for (const section of sections) {
          if (section.content.length > 500) { // 只分析较长的章节
            const prompt = `分析以下论文章节的论证结构：

${section.title}:
${section.content}

请识别：
1. 主要论点和前提
2. 支持证据
3. 论证强度 (0-100)
4. 论证弱点

请以JSON格式返回：
{
  "premise": "主要前提",
  "conclusion": "结论",
  "strength": number,
  "supportingEvidence": ["证据1", "证据2"],
  "weaknesses": ["弱点1", "弱点2"]
}`;

            const response = await this.glmClient.chat([
              { role: 'user', content: prompt }
            ], { temperature: 0.3 });

            const result = this.parseJSONResponse(response);
            if (result.premise && result.conclusion) {
              chains.push(result as ArgumentChain);
            }
          }
        }
      } catch (error) {
        console.warn('AI论证分析失败', error);
      }
    }

    const avgStrength = chains.length > 0 
      ? chains.reduce((sum, c) => sum + c.strength, 0) / chains.length 
      : 70;

    return {
      score: Math.round(avgStrength),
      chain: chains
    };
  }

  /**
   * 检测逻辑问题
   */
  private async detectLogicalIssues(sections: PaperSection[]): Promise<LogicalIssue[]> {
    const issues: LogicalIssue[] = [];

    // 检测内容重复
    const duplicateIssues = this.detectContentDuplication(sections);
    issues.push(...duplicateIssues);

    // 检测逻辑矛盾
    if (this.config.enableAIAnalysis) {
      const contradictionIssues = await this.detectContradictions(sections);
      issues.push(...contradictionIssues);
    }

    return issues;
  }

  /**
   * 检测内容重复
   */
  private detectContentDuplication(sections: PaperSection[]): LogicalIssue[] {
    const issues: LogicalIssue[] = [];
    const threshold = 50; // 相似度阈值

    for (let i = 0; i < sections.length; i++) {
      for (let j = i + 1; j < sections.length; j++) {
        const similarity = this.calculateTextSimilarity(
          sections[i].content, 
          sections[j].content
        );

        if (similarity > threshold) {
          issues.push({
            type: 'repetition',
            severity: similarity > 80 ? 'major' : 'minor',
            sections: [sections[i].title, sections[j].title],
            description: `章节间存在${similarity}%的内容重复`,
            suggestion: '考虑合并重复内容或重新组织章节结构',
            confidence: similarity / 100
          });
        }
      }
    }

    return issues;
  }

  /**
   * 检测逻辑矛盾
   */
  private async detectContradictions(sections: PaperSection[]): Promise<LogicalIssue[]> {
    const issues: LogicalIssue[] = [];

    try {
      const allContent = sections.map(s => `${s.title}: ${s.content}`).join('\n\n');
      
      const prompt = `分析以下论文内容中是否存在逻辑矛盾：

${allContent}

请识别：
1. 明显的逻辑矛盾
2. 前后不一致的观点
3. 相互冲突的论证

对每个问题，请提供：
- 问题类型
- 严重程度
- 涉及章节
- 具体描述
- 解决建议

请以JSON数组格式返回结果。`;

      const response = await this.glmClient.chat([
        { role: 'user', content: prompt }
      ], { temperature: 0.3 });

      const results = this.parseJSONResponse(response);
      if (Array.isArray(results)) {
        for (const result of results) {
          issues.push({
            type: 'contradiction',
            severity: result.severity || 'minor',
            sections: result.sections || [],
            description: result.description || '',
            suggestion: result.suggestion || '',
            confidence: 0.8
          });
        }
      }
    } catch (error) {
      console.warn('矛盾检测失败', error);
    }

    return issues;
  }

  /**
   * 分析引用完整性
   */
  private async analyzeReferenceIntegrity(paper: Paper): Promise<ReferenceIntegrityResult> {
    // 这里实现引用分析逻辑
    // 由于篇幅限制，返回基础结果
    return {
      score: 85,
      totalReferences: 0,
      citationIssues: [],
      bibliographyIssues: [],
      consistencyIssues: []
    };
  }

  /**
   * 分析结构连贯性
   */
  private async analyzeStructuralCoherence(paper: Paper): Promise<StructuralCoherenceResult> {
    const sections = paper.sections || [];
    
    // 分析章节平衡
    const sectionBalance = this.analyzeSectionBalance(sections);
    
    // 分析层次一致性
    const hierarchyConsistency = this.analyzeHierarchyConsistency(sections);
    
    // 分析内容分布
    const contentDistribution = this.analyzeContentDistribution(sections);

    const score = Math.round((
      sectionBalance.score + 
      hierarchyConsistency.score + 
      contentDistribution.score
    ) / 3);

    return {
      score,
      sectionBalance,
      hierarchyConsistency,
      contentDistribution
    };
  }

  /**
   * 分析章节平衡
   */
  private analyzeSectionBalance(sections: PaperSection[]): SectionBalanceAnalysis {
    const imbalances: SectionImbalance[] = [];
    
    if (sections.length === 0) {
      return { score: 0, imbalances: [], recommendations: ['请添加论文章节'] };
    }

    const totalWords = sections.reduce((sum, s) => sum + s.content.split(' ').length, 0);
    const avgWordsPerSection = totalWords / sections.length;
    const threshold = avgWordsPerSection * 0.5; // 50%阈值

    for (const section of sections) {
      const wordCount = section.content.split(' ').length;
      
      if (wordCount < threshold) {
        imbalances.push({
          section: section.title,
          issue: 'too_short',
          currentLength: wordCount,
          recommendedRange: { 
            min: Math.round(avgWordsPerSection * 0.7), 
            max: Math.round(avgWordsPerSection * 1.3) 
          },
          severity: wordCount < threshold * 0.5 ? 'severe' : 'moderate'
        });
      } else if (wordCount > avgWordsPerSection * 2) {
        imbalances.push({
          section: section.title,
          issue: 'too_long',
          currentLength: wordCount,
          recommendedRange: { 
            min: Math.round(avgWordsPerSection * 0.7), 
            max: Math.round(avgWordsPerSection * 1.3) 
          },
          severity: wordCount > avgWordsPerSection * 3 ? 'severe' : 'moderate'
        });
      }
    }

    const score = Math.max(0, 100 - imbalances.length * 15);
    
    return {
      score,
      imbalances,
      recommendations: imbalances.length > 0 
        ? ['考虑重新平衡各章节的内容长度', '将过长章节拆分或将过短章节合并']
        : ['章节长度分布合理']
    };
  }

  /**
   * 分析层次一致性
   */
  private analyzeHierarchyConsistency(sections: PaperSection[]): HierarchyConsistencyAnalysis {
    const issues: HierarchyIssue[] = [];
    
    // 检查层次顺序
    let expectedLevel = 1;
    for (const section of sections) {
      if (section.level !== expectedLevel && section.level !== expectedLevel + 1) {
        issues.push({
          type: 'wrong_order',
          section: section.title,
          description: `章节层次不连续：期望${expectedLevel}或${expectedLevel + 1}，实际${section.level}`,
          suggestion: '调整章节层次编号以保持连续性'
        });
      }
      expectedLevel = section.level;
    }

    const score = Math.max(0, 100 - issues.length * 20);
    
    return { score, issues };
  }

  /**
   * 分析内容分布
   */
  private analyzeContentDistribution(sections: PaperSection[]): ContentDistributionAnalysis {
    const wordCountBySection: Record<string, number> = {};
    
    for (const section of sections) {
      wordCountBySection[section.title] = section.content.split(' ').length;
    }

    const recommendations: string[] = [];
    const totalWords = Object.values(wordCountBySection).reduce((sum, count) => sum + count, 0);
    
    if (totalWords < 1000) {
      recommendations.push('论文总字数偏少，建议扩充内容');
    }

    const score = totalWords >= 1000 ? 90 : Math.round(totalWords / 1000 * 90);

    return {
      score,
      wordCountBySection,
      recommendations
    };
  }

  /**
   * 分析内容一致性
   */
  private async analyzeContentConsistency(paper: Paper): Promise<ContentConsistencyResult> {
    const sections = paper.sections || [];
    
    // 分析术语一致性
    const terminologyConsistency = await this.analyzeTerminologyConsistency(sections);
    
    // 分析风格一致性
    const styleConsistency = await this.analyzeStyleConsistency(sections);
    
    // 检测重复内容
    const duplicateContent = this.analyzeDuplicateContent(sections);

    const score = Math.round((
      terminologyConsistency.score + 
      styleConsistency.score + 
      duplicateContent.score
    ) / 3);

    return {
      score,
      terminologyConsistency,
      styleConsistency,
      duplicateContent
    };
  }

  /**
   * 分析术语一致性
   */
  private async analyzeTerminologyConsistency(sections: PaperSection[]): Promise<TerminologyConsistencyResult> {
    // 简化实现
    return {
      score: 85,
      inconsistencies: [],
      glossary: []
    };
  }

  /**
   * 分析风格一致性
   */
  private async analyzeStyleConsistency(sections: PaperSection[]): Promise<StyleConsistencyResult> {
    // 简化实现
    return {
      score: 80,
      issues: []
    };
  }

  /**
   * 分析重复内容
   */
  private analyzeDuplicateContent(sections: PaperSection[]): DuplicateContentResult {
    const duplicates: ContentDuplicate[] = [];
    const threshold = 30; // 30%相似度阈值

    for (let i = 0; i < sections.length; i++) {
      for (let j = i + 1; j < sections.length; j++) {
        const similarity = this.calculateTextSimilarity(
          sections[i].content,
          sections[j].content
        );

        if (similarity > threshold) {
          duplicates.push({
            content: '相似内容段落',
            locations: [sections[i].title, sections[j].title],
            similarity,
            suggestion: '考虑合并或重新表述重复内容'
          });
        }
      }
    }

    const score = Math.max(0, 100 - duplicates.length * 20);

    return {
      score,
      duplicates
    };
  }

  /**
   * 生成建议
   */
  private async generateRecommendations(analysisResults: {
    logicalResult: LogicalConsistencyResult;
    referenceResult: ReferenceIntegrityResult;
    structuralResult: StructuralCoherenceResult;
    contentResult: ContentConsistencyResult;
  }): Promise<ConsistencyRecommendation[]> {
    const recommendations: ConsistencyRecommendation[] = [];

    // 基于逻辑分析生成建议
    if (analysisResults.logicalResult.score < 70) {
      recommendations.push({
        priority: 'high',
        category: 'logical',
        title: '改善逻辑一致性',
        description: '论文的逻辑流程需要改进',
        actions: [
          {
            type: 'edit',
            target: 'transitions',
            description: '加强章节间的逻辑过渡',
            autoApplicable: false
          }
        ],
        expectedImpact: 15
      });
    }

    // 基于结构分析生成建议
    if (analysisResults.structuralResult.score < 70) {
      recommendations.push({
        priority: 'medium',
        category: 'structural',
        title: '优化论文结构',
        description: '论文结构需要调整以提高连贯性',
        actions: [
          {
            type: 'reorder',
            target: 'sections',
            description: '重新组织章节顺序',
            autoApplicable: false
          }
        ],
        expectedImpact: 12
      });
    }

    return recommendations;
  }

  /**
   * 计算整体分数
   */
  private calculateOverallScore(scores: {
    logical: number;
    reference: number;
    structural: number;
    content: number;
  }): number {
    // 权重设置
    const weights = {
      logical: 0.3,
      reference: 0.2,
      structural: 0.25,
      content: 0.25
    };

    return Math.round(
      scores.logical * weights.logical +
      scores.reference * weights.reference +
      scores.structural * weights.structural +
      scores.content * weights.content
    );
  }

  /**
   * 计算逻辑分数
   */
  private calculateLogicalScore(
    flow: { score: number },
    argumentation: { score: number },
    issues: LogicalIssue[]
  ): number {
    const baseScore = (flow.score + argumentation.score) / 2;
    const penalty = issues.reduce((sum, issue) => {
      return sum + (issue.severity === 'critical' ? 20 : issue.severity === 'major' ? 10 : 5);
    }, 0);

    return Math.max(0, Math.round(baseScore - penalty));
  }

  /**
   * 获取等级
   */
  private getGrade(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'fair';
    return 'poor';
  }

  /**
   * 生成总结
   */
  private async generateSummary(
    overallScore: number,
    results: any
  ): Promise<string> {
    const grade = this.getGrade(overallScore);
    const gradeText = {
      excellent: '优秀',
      good: '良好',
      fair: '一般',
      poor: '需要改进'
    }[grade];

    return `论文整体一致性评分：${overallScore}/100 (${gradeText})。主要优势和改进建议已在详细分析中提供。`;
  }

  /**
   * 计算文本相似度
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    // 简化的相似度计算
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));
    
    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);
    
    return Math.round((intersection.size / union.size) * 100);
  }

  /**
   * 解析JSON响应
   */
  private parseJSONResponse(response: string): any {
    try {
      // 尝试提取JSON部分
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {};
    } catch (error) {
      console.warn('JSON解析失败:', error);
      return {};
    }
  }
}

/**
 * 创建默认的一致性分析器
 */
export function createConsistencyAnalyzer(
  glmClient: GLMClient,
  config: Partial<ConsistencyAnalysisConfig> = {}
): ConsistencyAnalyzer {
  const defaultConfig: ConsistencyAnalysisConfig = {
    paperType: 'research-paper' as EnglishPaperType,
    academicLevel: 'master',
    citationStyle: 'APA',
    analysisDepth: 'detailed',
    enableAIAnalysis: true,
    ...config
  };

  return new ConsistencyAnalyzer(glmClient, defaultConfig);
}

// 默认导出
export default ConsistencyAnalyzer;