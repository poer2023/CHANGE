/**
 * 智能模块化编辑器类型定义
 * 实现真正智能化的模块管理系统
 */

// 智能模块依赖类型
export type DependencyType = 'structural' | 'content' | 'reference' | 'style';

// 模块关系强度
export type RelationStrength = 'strong' | 'medium' | 'weak';

// AI建议类型
export type SuggestionType = 'content' | 'structure' | 'style' | 'reference' | 'flow';

// 模块状态
export type ModuleStatus = 'empty' | 'draft' | 'review' | 'completed' | 'archived';

// 智能模块依赖
export interface SmartDependency {
  id: string;
  targetModuleId: string;
  type: DependencyType;
  strength: RelationStrength;
  description: string;
  autoDetected: boolean;
  validation: {
    isValid: boolean;
    reason?: string;
    suggestion?: string;
  };
}

// AI上下文信息
export interface AIContext {
  documentType: string;
  subject: string;
  writingStyle: string;
  targetAudience: string;
  complexity: number; // 1-10
  previousModules: string[];
  relatedConcepts: string[];
}

// AI建议
export interface AISuggestion {
  id: string;
  type: SuggestionType;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionText: string;
  confidence: number; // 0-1
  reasoning: string;
  context: AIContext;
  autoApplicable: boolean;
  appliedAt?: Date;
}

// 智能模块内容块
export interface ContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'quote' | 'code' | 'table' | 'figure' | 'reference' | 'equation';
  content: any;
  position: number;
  aiGenerated: boolean;
  aiConfidence?: number;
  lastModified: Date;
  wordCount: number;
}

// 模块质量指标
export interface QualityMetrics {
  completeness: number; // 0-1
  clarity: number; // 0-1
  coherence: number; // 0-1
  academicRigor: number; // 0-1
  readability: number; // 0-1
  overallScore: number; // 0-1
  lastEvaluated: Date;
  suggestions: AISuggestion[];
}

// 写作进度指标
export interface ProgressMetrics {
  wordCount: number;
  targetWordCount: number;
  timeSpent: number; // minutes
  estimatedTimeRemaining: number; // minutes
  editingSessions: number;
  averageWordsPerSession: number;
  productivityScore: number; // 0-1
  lastUpdated: Date;
}

// 智能模块
export interface SmartModule {
  id: string;
  type: string;
  title: string;
  description: string;
  
  // 层次结构
  parentId?: string;
  children: string[];
  level: number;
  position: {
    order: number;
    path: string[];
  };
  
  // 内容
  blocks: ContentBlock[];
  status: ModuleStatus;
  
  // 智能依赖
  dependencies: SmartDependency[];
  dependents: string[]; // 依赖此模块的其他模块
  
  // AI增强
  aiContext: AIContext;
  suggestions: AISuggestion[];
  quality: QualityMetrics;
  progress: ProgressMetrics;
  
  // 协作
  collaboration: {
    authorId: string;
    contributors: string[];
    comments: Comment[];
    lastModifiedBy: string;
    lockedBy?: string;
  };
  
  // 元数据
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    tags: string[];
    category: string;
    importance: number; // 1-10
  };
}

// 模块模板
export interface ModuleTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // 模板结构
  structure: {
    suggestedBlocks: Partial<ContentBlock>[];
    estimatedWordCount: number;
    estimatedTime: number; // minutes
  };
  
  // AI提示
  aiPrompts: {
    contentGeneration: string;
    structureGuide: string;
    styleGuide: string;
  };
  
  // 使用统计
  usage: {
    useCount: number;
    successRate: number;
    averageQuality: number;
    lastUsed: Date;
  };
}

// 智能推荐
export interface SmartRecommendation {
  id: string;
  type: 'module' | 'template' | 'content' | 'structure';
  title: string;
  description: string;
  confidence: number; // 0-1
  reasoning: string;
  
  // 推荐数据
  data: {
    moduleId?: string;
    templateId?: string;
    suggestedContent?: string;
    suggestedPosition?: number;
  };
  
  // 上下文
  context: {
    currentModules: string[];
    userPreferences: any;
    documentContext: AIContext;
  };
  
  // 反馈
  feedback?: {
    accepted: boolean;
    rating: number; // 1-5
    comments: string;
    appliedAt: Date;
  };
}

// 模块关系图
export interface ModuleRelationship {
  sourceId: string;
  targetId: string;
  type: DependencyType;
  strength: RelationStrength;
  description: string;
  position: {
    x: number;
    y: number;
  };
}

// 智能文档
export interface SmartDocument {
  id: string;
  title: string;
  description: string;
  type: string;
  
  // 模块组织
  modules: SmartModule[];
  moduleOrder: string[];
  relationships: ModuleRelationship[];
  
  // 全局AI上下文
  globalContext: AIContext;
  
  // 文档级别指标
  globalMetrics: {
    totalWordCount: number;
    targetWordCount: number;
    overallQuality: QualityMetrics;
    completionRate: number; // 0-1
    estimatedCompletionTime: number; // minutes
  };
  
  // 设置
  settings: {
    autoSave: boolean;
    aiAssistanceLevel: 'minimal' | 'moderate' | 'aggressive';
    collaborationMode: boolean;
    templatePreferences: string[];
  };
  
  // 元数据
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    authorId: string;
    collaborators: string[];
    lastSavedAt: Date;
  };
}

// 用户行为数据
export interface UserBehaviorData {
  userId: string;
  writingStyle: {
    averageWordsPerSession: number;
    preferredModuleTypes: string[];
    writingSpeed: number; // words per minute
    editingIntensity: number; // edits per word
  };
  preferences: {
    interfaceLayout: string;
    aiAssistanceLevel: string;
    autoSaveInterval: number;
    preferredTemplates: string[];
  };
  patterns: {
    activeHours: number[];
    sessionDuration: number;
    breakPatterns: number[];
    productivityCurve: number[];
  };
  performance: {
    averageQualityScore: number;
    completionRate: number;
    improvementTrend: number[];
  };
}

// 智能编辑器状态
export interface SmartEditorState {
  // 当前文档
  currentDocument: SmartDocument | null;
  
  // 选中状态
  selectedModuleId: string | null;
  selectedBlockId: string | null;
  
  // 视图状态
  viewMode: 'modules' | 'outline' | 'dependencies' | 'full-text';
  sidebarCollapsed: boolean;
  showAISuggestions: boolean;
  
  // 编辑状态
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  lastSavedAt: Date | null;
  
  // AI状态
  aiProcessing: boolean;
  recommendationsLoading: boolean;
  qualityAnalyzing: boolean;
  
  // 用户数据
  userBehavior: UserBehaviorData;
  
  // 实时数据
  realTimeStats: {
    currentWordCount: number;
    todayWordCount: number;
    sessionStartTime: Date;
    keystrokeCount: number;
  };
}

// 事件类型
export interface SmartEditorEvent {
  type: string;
  moduleId?: string;
  blockId?: string;
  data?: any;
  timestamp: Date;
  userId: string;
}