// 模块化编辑系统类型定义

export interface PaperModule {
  id: string;
  type: ModuleType;
  title: string;
  content: string;
  order: number;
  isCollapsed: boolean;
  isCompleted: boolean;
  wordCount: number;
  progress: number; // 0-100
  dependencies: string[]; // 依赖的模块ID
  template?: ModuleTemplate;
  metadata: ModuleMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export type ModuleType = 
  | 'abstract'
  | 'introduction'
  | 'literature-review'
  | 'methodology'
  | 'results'
  | 'discussion'
  | 'conclusion'
  | 'references'
  | 'appendix'
  | 'custom';

export interface ModuleTemplate {
  id: string;
  name: string;
  description: string;
  structure: ModuleStructure[];
  prompts: string[];
  guidelines: string[];
  wordCountTarget?: {
    min: number;
    max: number;
  };
}

export interface ModuleStructure {
  id: string;
  title: string;
  description: string;
  isRequired: boolean;
  order: number;
}

export interface ModuleMetadata {
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; // minutes
  lastModified: Date;
  revisionCount: number;
  notes: string[];
}

export interface ModuleDependency {
  sourceId: string;
  targetId: string;
  type: 'content' | 'reference' | 'order';
  description: string;
}

export interface ModuleAISuggestion {
  id: string;
  moduleId: string;
  type: 'structure' | 'content' | 'style' | 'consistency';
  title: string;
  description: string;
  suggestion: string;
  confidence: number;
  isApplied: boolean;
  createdAt: Date;
}

export interface ModularEditorState {
  modules: PaperModule[];
  selectedModuleId: string | null;
  draggedModule: PaperModule | null;
  showTemplateLibrary: boolean;
  showDependencyView: boolean;
  bulkSelection: string[];
  viewMode: 'card' | 'list' | 'outline';
  sidebarTab: 'structure' | 'properties' | 'ai' | 'templates' | 'ai-agent' | 'ai-assistant' | 'suggestions' | 'smart-templates';
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  modules: ModuleTemplate[];
  icon: string;
  color: string;
}

export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  wordCount: number;
  targetWordCount: number;
  percentage: number;
  milestones: ProgressMilestone[];
}

export interface ProgressMilestone {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface ModuleValidation {
  moduleId: string;
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  type: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  location?: {
    start: number;
    end: number;
  };
}

export interface ValidationWarning {
  type: string;
  message: string;
  suggestion?: string;
}

export interface CrossReference {
  id: string;
  sourceModuleId: string;
  targetModuleId: string;
  type: 'citation' | 'figure' | 'table' | 'section';
  text: string;
  isValid: boolean;
}

export interface ModuleBatchOperation {
  type: 'copy' | 'delete' | 'reorder' | 'template-apply';
  moduleIds: string[];
  data?: any;
}

export interface ModuleComment {
  id: string;
  moduleId: string;
  text: string;
  author: string;
  createdAt: Date;
  isResolved: boolean;
  replies: ModuleComment[];
}

export interface ModuleVersion {
  id: string;
  moduleId: string;
  content: string;
  version: number;
  createdAt: Date;
  description?: string;
}