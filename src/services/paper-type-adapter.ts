/**
 * 论文类型适配器 - 为不同类型论文提供专门的写作指导和规范
 */

import { Paper, PaperSection } from '../types';
import { WritingPreferences, PaperTypeConfig } from '../services/ai-writing-assistant';

// 论文类型枚举
export enum PaperType {
  RESEARCH = 'research',           // 研究论文
  THESIS = 'thesis',              // 学位论文
  REVIEW = 'review',              // 综述论文
  CONFERENCE = 'conference',      // 会议论文
  JOURNAL = 'journal',            // 期刊论文
  CASE_STUDY = 'case_study',      // 案例研究
  TECHNICAL = 'technical',        // 技术报告
  PROPOSAL = 'proposal',          // 研究提案
  DISSERTATION = 'dissertation',  // 博士论文
  REPORT = 'report'               // 研究报告
}

// 学科领域枚举
export enum AcademicField {
  COMPUTER_SCIENCE = 'computer_science',
  ENGINEERING = 'engineering',
  MEDICINE = 'medicine',
  PHYSICS = 'physics',
  CHEMISTRY = 'chemistry',
  BIOLOGY = 'biology',
  MATHEMATICS = 'mathematics',
  ECONOMICS = 'economics',
  PSYCHOLOGY = 'psychology',
  SOCIOLOGY = 'sociology',
  LITERATURE = 'literature',
  HISTORY = 'history',
  PHILOSOPHY = 'philosophy',
  LAW = 'law',
  EDUCATION = 'education',
  BUSINESS = 'business',
  OTHER = 'other'
}

// 写作指导规则
export interface WritingGuidanceRule {
  id: string;
  name: string;
  description: string;
  category: 'structure' | 'style' | 'content' | 'format' | 'citation';
  priority: 'high' | 'medium' | 'low';
  condition?: (context: WritingContext) => boolean;
  suggestion: string;
  examples?: string[];
}

// 写作上下文
export interface WritingContext {
  paperType: PaperType;
  field: AcademicField;
  currentSection?: string;
  wordCount: number;
  targetAudience: 'academic' | 'professional' | 'general';
  language: 'zh' | 'en';
}

// 章节模板
export interface SectionTemplate {
  name: string;
  description: string;
  required: boolean;
  minWords: number;
  maxWords: number;
  keyPoints: string[];
  structure: string[];
  examples: string[];
  tips: string[];
}

// 完整的论文类型配置
export interface CompletePaperTypeConfig extends PaperTypeConfig {
  field: AcademicField;
  targetAudience: string[];
  language: string[];
  complexity: 'basic' | 'intermediate' | 'advanced';
  sectionTemplates: Map<string, SectionTemplate>;
  writingRules: WritingGuidanceRule[];
  commonMistakes: string[];
  bestPractices: string[];
  evaluationCriteria: {
    [key: string]: {
      weight: number;
      description: string;
      metrics: string[];
    };
  };
}

/**
 * 论文类型适配器类
 */
export class PaperTypeAdapter {
  private configs: Map<string, CompletePaperTypeConfig> = new Map();
  private fieldSpecificRules: Map<AcademicField, WritingGuidanceRule[]> = new Map();

  constructor() {
    this.initializeConfigs();
    this.initializeFieldRules();
  }

  /**
   * 获取论文配置
   */
  getPaperConfig(paperType: PaperType, field?: AcademicField): CompletePaperTypeConfig | undefined {
    const key = field ? `${paperType}_${field}` : paperType;
    return this.configs.get(key) || this.configs.get(paperType);
  }

  /**
   * 获取写作指导
   */
  getWritingGuidance(context: WritingContext): WritingGuidanceRule[] {
    const config = this.getPaperConfig(context.paperType, context.field);
    if (!config) return [];

    const rules = [...config.writingRules];
    
    // 添加领域特定规则
    const fieldRules = this.fieldSpecificRules.get(context.field) || [];
    rules.push(...fieldRules);

    // 根据条件过滤规则
    return rules.filter(rule => !rule.condition || rule.condition(context))
                .sort((a, b) => {
                  const priorityOrder = { high: 3, medium: 2, low: 1 };
                  return priorityOrder[b.priority] - priorityOrder[a.priority];
                });
  }

  /**
   * 获取章节模板
   */
  getSectionTemplate(paperType: PaperType, sectionName: string, field?: AcademicField): SectionTemplate | undefined {
    const config = this.getPaperConfig(paperType, field);
    return config?.sectionTemplates.get(sectionName);
  }

  /**
   * 获取推荐的章节结构
   */
  getRecommendedStructure(paperType: PaperType, field?: AcademicField): string[] {
    const config = this.getPaperConfig(paperType, field);
    return config?.sections || [];
  }

  /**
   * 验证论文结构
   */
  validatePaperStructure(paper: Paper): {
    isValid: boolean;
    missingRequired: string[];
    suggestions: string[];
    warnings: string[];
  } {
    const config = this.getPaperConfig(paper.paperType as PaperType, paper.field as AcademicField);
    
    if (!config) {
      return {
        isValid: false,
        missingRequired: [],
        suggestions: ['未找到对应的论文类型配置'],
        warnings: []
      };
    }

    const existingSections = paper.sections.map(s => s.title);
    const requiredSections = config.requirements.requiredSections;
    const missingRequired = requiredSections.filter(section => !existingSections.includes(section));

    const suggestions: string[] = [];
    const warnings: string[] = [];

    // 检查字数要求
    if (paper.wordCount < config.requirements.minWords) {
      warnings.push(`论文字数过少，建议至少${config.requirements.minWords}字`);
    } else if (paper.wordCount > config.requirements.maxWords) {
      warnings.push(`论文字数过多，建议不超过${config.requirements.maxWords}字`);
    }

    // 检查章节完整性
    for (const section of config.sections) {
      if (!existingSections.includes(section)) {
        suggestions.push(`建议添加"${section}"章节`);
      }
    }

    return {
      isValid: missingRequired.length === 0,
      missingRequired,
      suggestions,
      warnings
    };
  }

  /**
   * 获取写作建议
   */
  getWritingSuggestions(context: WritingContext, currentText: string): string[] {
    const guidance = this.getWritingGuidance(context);
    const suggestions: string[] = [];

    // 基于规则生成建议
    for (const rule of guidance.slice(0, 5)) { // 限制建议数量
      suggestions.push(rule.suggestion);
    }

    // 基于当前文本分析
    if (currentText) {
      const textAnalysis = this.analyzeText(currentText, context);
      suggestions.push(...textAnalysis);
    }

    return suggestions;
  }

  /**
   * 获取常见错误提醒
   */
  getCommonMistakes(paperType: PaperType, field?: AcademicField): string[] {
    const config = this.getPaperConfig(paperType, field);
    return config?.commonMistakes || [];
  }

  /**
   * 获取最佳实践
   */
  getBestPractices(paperType: PaperType, field?: AcademicField): string[] {
    const config = this.getPaperConfig(paperType, field);
    return config?.bestPractices || [];
  }

  /**
   * 初始化配置
   */
  private initializeConfigs(): void {
    // 研究论文配置
    this.configs.set(PaperType.RESEARCH, {
      type: 'research',
      field: AcademicField.OTHER,
      sections: ['摘要', '引言', '文献综述', '方法论', '结果', '讨论', '结论', '参考文献'],
      requirements: {
        minWords: 5000,
        maxWords: 15000,
        citationStyle: 'APA',
        requiredSections: ['摘要', '引言', '方法论', '结果', '讨论', '结论']
      },
      writingGuidelines: {
        tone: '客观、严谨',
        perspective: '第三人称',
        structure: '逻辑严密、层次分明',
        keyPoints: ['问题陈述', '研究方法', '数据分析', '结论验证']
      },
      templates: {},
      targetAudience: ['academic'],
      language: ['zh', 'en'],
      complexity: 'intermediate',
      sectionTemplates: new Map([
        ['摘要', {
          name: '摘要',
          description: '简明扼要地概括研究的目的、方法、结果和结论',
          required: true,
          minWords: 200,
          maxWords: 400,
          keyPoints: ['研究背景', '研究目的', '方法概述', '主要发现', '结论意义'],
          structure: ['背景陈述', '问题提出', '方法简介', '结果概述', '结论总结'],
          examples: ['本研究旨在...', '采用...方法', '研究发现...', '结果表明...'],
          tips: ['避免使用第一人称', '不要包含详细数据', '突出创新点']
        }],
        ['引言', {
          name: '引言',
          description: '介绍研究背景、问题陈述和研究目标',
          required: true,
          minWords: 800,
          maxWords: 1500,
          keyPoints: ['研究背景', '问题陈述', '研究目标', '研究意义', '论文结构'],
          structure: ['研究背景', '文献回顾', '研究空白', '研究问题', '研究目标', '论文结构'],
          examples: ['随着...的发展', '然而，现有研究...', '因此，本研究...'],
          tips: ['从宏观到微观逐步聚焦', '明确研究的创新性', '逻辑层次清晰']
        }]
      ]),
      writingRules: this.getResearchPaperRules(),
      commonMistakes: [
        '方法论描述不够详细',
        '结果与讨论混淆',
        '引用格式不统一',
        '数据分析不够深入',
        '结论过于绝对'
      ],
      bestPractices: [
        '使用客观的语言表达',
        '确保数据的可重现性',
        '充分讨论局限性',
        '与相关研究进行对比',
        '突出研究的贡献'
      ],
      evaluationCriteria: {
        novelty: { weight: 0.25, description: '研究的新颖性', metrics: ['创新程度', '原创性', '突破性'] },
        methodology: { weight: 0.25, description: '方法的严谨性', metrics: ['方法合理性', '实验设计', '数据质量'] },
        analysis: { weight: 0.25, description: '分析的深度', metrics: ['分析严谨性', '结果解释', '讨论深度'] },
        writing: { weight: 0.25, description: '写作质量', metrics: ['逻辑性', '清晰度', '语言质量'] }
      }
    });

    // 学位论文配置
    this.configs.set(PaperType.THESIS, {
      type: 'thesis',
      field: AcademicField.OTHER,
      sections: ['摘要', '目录', '引言', '文献综述', '理论基础', '研究设计', '实证分析', '结论', '参考文献', '致谢'],
      requirements: {
        minWords: 20000,
        maxWords: 80000,
        citationStyle: 'APA',
        requiredSections: ['摘要', '引言', '文献综述', '研究设计', '实证分析', '结论']
      },
      writingGuidelines: {
        tone: '学术、正式',
        perspective: '第一人称和第三人称结合',
        structure: '完整的研究体系',
        keyPoints: ['研究意义', '理论贡献', '实践价值', '创新点']
      },
      templates: {},
      targetAudience: ['academic'],
      language: ['zh', 'en'],
      complexity: 'advanced',
      sectionTemplates: new Map(),
      writingRules: this.getThesisRules(),
      commonMistakes: [
        '理论基础薄弱',
        '研究方法单一',
        '缺乏深度分析',
        '结论与研究问题不匹配',
        '文献综述不够全面'
      ],
      bestPractices: [
        '建立完整的理论框架',
        '采用多元化研究方法',
        '进行深入的数据分析',
        '充分论证研究贡献',
        '保持学术诚信'
      ],
      evaluationCriteria: {
        theoretical: { weight: 0.3, description: '理论贡献', metrics: ['理论创新', '理论深度', '理论应用'] },
        empirical: { weight: 0.3, description: '实证研究', metrics: ['数据质量', '分析方法', '结果可信度'] },
        practical: { weight: 0.2, description: '实践价值', metrics: ['应用前景', '实用性', '社会意义'] },
        academic: { weight: 0.2, description: '学术规范', metrics: ['写作质量', '引用规范', '逻辑严谨'] }
      }
    });

    // 综述论文配置
    this.configs.set(PaperType.REVIEW, {
      type: 'review',
      field: AcademicField.OTHER,
      sections: ['摘要', '引言', '主体综述', '总结与展望', '参考文献'],
      requirements: {
        minWords: 8000,
        maxWords: 25000,
        citationStyle: 'APA',
        requiredSections: ['摘要', '引言', '主体综述', '总结与展望']
      },
      writingGuidelines: {
        tone: '综合、分析性',
        perspective: '第三人称',
        structure: '主题式或时间式组织',
        keyPoints: ['文献梳理', '观点对比', '发展趋势', '研究空白']
      },
      templates: {},
      targetAudience: ['academic'],
      language: ['zh', 'en'],
      complexity: 'intermediate',
      sectionTemplates: new Map(),
      writingRules: this.getReviewPaperRules(),
      commonMistakes: [
        '文献覆盖不全面',
        '缺乏批判性分析',
        '观点罗列而非综合',
        '未指出研究空白',
        '展望过于模糊'
      ],
      bestPractices: [
        '系统性文献搜索',
        '批判性文献分析',
        '主题化组织内容',
        '识别研究趋势',
        '提出研究建议'
      ],
      evaluationCriteria: {
        comprehensiveness: { weight: 0.3, description: '全面性', metrics: ['文献覆盖', '内容完整', '视角多元'] },
        analysis: { weight: 0.3, description: '分析深度', metrics: ['批判思维', '综合能力', '洞察力'] },
        organization: { weight: 0.2, description: '组织结构', metrics: ['逻辑性', '条理性', '连贯性'] },
        contribution: { weight: 0.2, description: '学术贡献', metrics: ['新见解', '研究方向', '实用价值'] }
      }
    });
  }

  /**
   * 初始化领域特定规则
   */
  private initializeFieldRules(): void {
    // 计算机科学领域规则
    this.fieldSpecificRules.set(AcademicField.COMPUTER_SCIENCE, [
      {
        id: 'cs_algorithm_description',
        name: '算法描述规范',
        description: '算法描述应当清晰、准确、可重现',
        category: 'content',
        priority: 'high',
        suggestion: '使用伪代码或流程图详细描述算法步骤，包括时间复杂度和空间复杂度分析'
      },
      {
        id: 'cs_experiment_setup',
        name: '实验环境描述',
        description: '详细描述实验环境和参数设置',
        category: 'content',
        priority: 'high',
        suggestion: '包括硬件配置、软件版本、数据集信息、超参数设置等'
      }
    ]);

    // 医学领域规则
    this.fieldSpecificRules.set(AcademicField.MEDICINE, [
      {
        id: 'med_ethical_approval',
        name: '伦理审查',
        description: '涉及人体研究必须获得伦理委员会批准',
        category: 'content',
        priority: 'high',
        suggestion: '在方法部分明确说明伦理审查情况和知情同意程序'
      },
      {
        id: 'med_statistical_analysis',
        name: '统计分析规范',
        description: '使用恰当的统计方法和显著性水平',
        category: 'content',
        priority: 'high',
        suggestion: '详细描述统计方法，报告置信区间和p值，考虑多重比较校正'
      }
    ]);
  }

  /**
   * 获取研究论文规则
   */
  private getResearchPaperRules(): WritingGuidanceRule[] {
    return [
      {
        id: 'research_objective_clarity',
        name: '研究目标清晰性',
        description: '研究目标应当明确、具体、可测量',
        category: 'content',
        priority: 'high',
        suggestion: '在引言部分明确陈述研究问题和假设，确保目标具体可测量'
      },
      {
        id: 'research_methodology_detail',
        name: '方法论详细描述',
        description: '方法描述应当详细到可重现的程度',
        category: 'content',
        priority: 'high',
        suggestion: '详细描述研究设计、数据收集、分析方法，确保研究可重现'
      },
      {
        id: 'research_result_objective',
        name: '结果客观呈现',
        description: '结果部分应客观呈现数据，避免主观解释',
        category: 'style',
        priority: 'medium',
        suggestion: '使用数据、图表客观呈现结果，将解释放在讨论部分'
      }
    ];
  }

  /**
   * 获取学位论文规则
   */
  private getThesisRules(): WritingGuidanceRule[] {
    return [
      {
        id: 'thesis_theoretical_framework',
        name: '理论框架构建',
        description: '建立完整的理论框架支撑研究',
        category: 'structure',
        priority: 'high',
        suggestion: '在理论基础部分构建完整的概念框架，明确变量关系'
      },
      {
        id: 'thesis_contribution_highlight',
        name: '贡献突出',
        description: '明确突出研究的理论和实践贡献',
        category: 'content',
        priority: 'high',
        suggestion: '在结论部分明确总结理论贡献、实践价值和政策建议'
      }
    ];
  }

  /**
   * 获取综述论文规则
   */
  private getReviewPaperRules(): WritingGuidanceRule[] {
    return [
      {
        id: 'review_systematic_approach',
        name: '系统性文献搜索',
        description: '采用系统性方法进行文献搜索和筛选',
        category: 'content',
        priority: 'high',
        suggestion: '明确搜索策略、数据库、关键词、纳入排除标准'
      },
      {
        id: 'review_critical_analysis',
        name: '批判性分析',
        description: '对文献进行批判性分析而非简单罗列',
        category: 'content',
        priority: 'high',
        suggestion: '比较不同观点，分析研究局限性，识别研究空白'
      }
    ];
  }

  /**
   * 分析文本
   */
  private analyzeText(text: string, context: WritingContext): string[] {
    const suggestions: string[] = [];
    
    // 简单的文本分析
    const sentences = text.split(/[.!?。！？]/).filter(s => s.trim());
    const avgSentenceLength = text.length / sentences.length;
    
    if (avgSentenceLength > 50) {
      suggestions.push('句子较长，建议适当分解以提高可读性');
    }
    
    if (avgSentenceLength < 15) {
      suggestions.push('句子较短，可以适当合并以增强表达力');
    }
    
    // 检查被动语态（简化检查）
    if (text.includes('被') && context.paperType === PaperType.RESEARCH) {
      suggestions.push('研究论文建议多使用主动语态，使表达更直接有力');
    }
    
    return suggestions;
  }
}

// 创建默认实例
export const paperTypeAdapter = new PaperTypeAdapter();

// 便捷函数
export const getPaperGuidance = (paper: Paper): WritingGuidanceRule[] => {
  const context: WritingContext = {
    paperType: paper.paperType as PaperType || PaperType.RESEARCH,
    field: paper.field as AcademicField || AcademicField.OTHER,
    wordCount: paper.wordCount,
    targetAudience: 'academic',
    language: 'zh'
  };
  
  return paperTypeAdapter.getWritingGuidance(context);
};

export const validatePaper = (paper: Paper) => {
  return paperTypeAdapter.validatePaperStructure(paper);
};

export default PaperTypeAdapter;