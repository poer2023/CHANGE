// 论文类型智能识别与适配系统类型定义

import { ModuleType } from './modular';

// 学术层次定义
export type AcademicLevel = 'undergraduate' | 'master' | 'doctoral';

// 英语系10种论文类型
export type EnglishPaperType = 
  | 'literary-analysis'        // 文学分析论文
  | 'comparative-analysis'     // 比较分析论文
  | 'cultural-analysis'        // 文化分析论文
  | 'literature-review'        // 文献综述
  | 'critical-review'          // 批判性评述
  | 'empirical-research'       // 实证研究论文
  | 'case-study'              // 个案研究论文
  | 'discourse-analysis'       // 话语分析论文
  | 'theoretical-discussion'   // 理论探讨论文
  | 'dissertation-thesis';     // 学位论文

// 论文类型详细定义
export interface PaperTypeDefinition {
  id: EnglishPaperType;
  name: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  icon: string;
  color: string;
  academicLevels: AcademicLevel[];
  complexity: 'basic' | 'intermediate' | 'advanced';
  typicalWordCount: {
    undergraduate: { min: number; max: number };
    master: { min: number; max: number };
    doctoral: { min: number; max: number };
  };
  coreFeatures: string[];
  requiredSections: string[];
  optionalSections: string[];
  citationStyles: string[];
  keywords: string[];
  relatedTypes: EnglishPaperType[];
}

// 论文结构模板
export interface PaperStructureTemplate {
  id: string;
  paperType: EnglishPaperType;
  academicLevel: AcademicLevel;
  name: string;
  description: string;
  modules: PaperModuleTemplate[];
  metadata: TemplateMetadata;
}

// 模块模板定义
export interface PaperModuleTemplate {
  id: string;
  type: ModuleType;
  title: string;
  description: string;
  isRequired: boolean;
  order: number;
  estimatedWordCount: {
    min: number;
    max: number;
  };
  writingPrompts: string[];
  guidelines: string[];
  exampleContent?: string;
  dependencies: string[];
  subSections?: SubSectionTemplate[];
}

// 子章节模板
export interface SubSectionTemplate {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  order: number;
  writingPrompts: string[];
}

// 模板元数据
export interface TemplateMetadata {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // 预计完成时间（小时）
  tags: string[];
  lastUpdated: Date;
  version: string;
  author: string;
}

// 论文类型智能推荐
export interface PaperTypeRecommendation {
  paperType: EnglishPaperType;
  confidence: number; // 0-1
  reasons: string[];
  suggestedAcademicLevel: AcademicLevel;
  matchScore: number;
}

// 推荐算法输入参数
export interface RecommendationInput {
  title?: string;
  abstract?: string;
  keywords?: string[];
  academicLevel?: AcademicLevel;
  subject?: string;
  researchMethod?: string;
  targetLength?: number;
  existingContent?: string;
}

// 论文类型适配配置
export interface PaperTypeAdapterConfig {
  paperType: EnglishPaperType;
  academicLevel: AcademicLevel;
  customizations: {
    enabledModules: string[];
    moduleOrder: string[];
    additionalGuidelines: string[];
    citationStyle: string;
    formatPreferences: FormatPreferences;
  };
}

// 格式偏好设置
export interface FormatPreferences {
  fontSize: number;
  lineSpacing: number;
  marginSize: number;
  headerStyle: 'apa' | 'mla' | 'chicago' | 'ieee' | 'harvard';
  pageNumbering: boolean;
  tocGeneration: boolean;
  bibliographyFormat: string;
}

// 写作指导内容
export interface WritingGuidance {
  paperType: EnglishPaperType;
  academicLevel: AcademicLevel;
  moduleType: ModuleType;
  guidance: {
    overview: string;
    structure: string[];
    writingTips: string[];
    commonMistakes: string[];
    examples: WritingExample[];
  };
}

// 写作示例
export interface WritingExample {
  title: string;
  content: string;
  annotation: string;
  quality: 'good' | 'poor';
}

// AI 助手上下文
export interface PaperTypeContext {
  paperType: EnglishPaperType;
  academicLevel: AcademicLevel;
  currentModule?: string;
  completedModules: string[];
  totalProgress: number;
  userPreferences: UserPreferences;
  documentMetadata: DocumentMetadata;
}

// 用户偏好
export interface UserPreferences {
  preferredCitationStyle: string;
  writingStyle: 'formal' | 'semi-formal' | 'conversational';
  complexityLevel: 'simple' | 'moderate' | 'complex';
  feedbackFrequency: 'minimal' | 'moderate' | 'frequent';
  languageSupport: 'native' | 'esl';
}

// 文档元数据
export interface DocumentMetadata {
  wordCount: number;
  pageCount: number;
  lastModified: Date;
  version: string;
  collaborators: string[];
  reviewStatus: 'draft' | 'review' | 'final';
}

// 智能建议类型
export interface IntelligentSuggestion {
  id: string;
  type: 'structure' | 'content' | 'style' | 'citation' | 'methodology';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  suggestion: string;
  targetModule?: string;
  confidence: number;
  basedOn: string[];
  action?: SuggestionAction;
}

// 建议操作
export interface SuggestionAction {
  type: 'add' | 'modify' | 'remove' | 'reorder';
  targetId: string;
  data: any;
  preview?: string;
}

// 论文质量评估
export interface PaperQualityAssessment {
  paperType: EnglishPaperType;
  academicLevel: AcademicLevel;
  overall: {
    score: number; // 0-100
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    comments: string;
  };
  criteria: {
    structure: QualityCriterion;
    content: QualityCriterion;
    argumentation: QualityCriterion;
    language: QualityCriterion;
    formatting: QualityCriterion;
    citations: QualityCriterion;
  };
  improvements: ImprovementSuggestion[];
}

// 质量标准
export interface QualityCriterion {
  score: number;
  maxScore: number;
  feedback: string;
  suggestions: string[];
}

// 改进建议
export interface ImprovementSuggestion {
  area: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  specificActions: string[];
  estimatedImpact: number;
}

// 论文类型统计数据
export interface PaperTypeStatistics {
  paperType: EnglishPaperType;
  usage: {
    totalPapers: number;
    byAcademicLevel: Record<AcademicLevel, number>;
    completionRate: number;
    averageTime: number;
  };
  performance: {
    averageScore: number;
    commonIssues: string[];
    successFactors: string[];
  };
}

// 模块完成状态
export interface ModuleCompletionStatus {
  moduleId: string;
  paperType: EnglishPaperType;
  isCompleted: boolean;
  completionPercentage: number;
  lastModified: Date;
  wordCount: number;
  targetWordCount: number;
  issues: string[];
  suggestions: string[];
}

// 论文类型验证结果
export interface PaperTypeValidation {
  isValid: boolean;
  paperType: EnglishPaperType;
  academicLevel: AcademicLevel;
  issues: ValidationIssue[];
  completeness: number; // 0-1
  recommendations: string[];
}

// 验证问题
export interface ValidationIssue {
  type: 'missing' | 'incorrect' | 'incomplete' | 'format';
  severity: 'error' | 'warning' | 'info';
  module?: string;
  description: string;
  solution?: string;
}

// 导出接口
export interface PaperTypeExportConfig {
  format: 'pdf' | 'docx' | 'latex' | 'html';
  paperType: EnglishPaperType;
  academicLevel: AcademicLevel;
  includeComments: boolean;
  includeTrackedChanges: boolean;
  citationStyle: string;
  customStyles?: any;
}