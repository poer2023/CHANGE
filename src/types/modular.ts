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

// 智能模块管理系统扩展类型定义

export interface SmartModule extends PaperModule {
  aiScore: number; // AI质量评分 0-100
  relevanceScore: number; // 相关性评分 0-100
  coherenceScore: number; // 连贯性评分 0-100
  completionLevel: 'draft' | 'review' | 'complete';
  aiSuggestions: ModuleAISuggestion[];
  smartTags: SmartTag[];
  contextualData: ContextualData;
  learningInsights?: LearningInsight[];
}

export interface SmartTag {
  id: string;
  label: string;
  color: string;
  type: 'auto' | 'manual';
  confidence: number;
  source: 'ai' | 'user' | 'system';
}

export interface ContextualData {
  relatedConcepts: string[];
  keyTerms: string[];
  readingLevel: number;
  complexity: 'low' | 'medium' | 'high';
  domain: string[];
  citations: CitationReference[];
}

export interface CitationReference {
  id: string;
  title: string;
  authors: string[];
  year: number;
  type: 'journal' | 'book' | 'conference' | 'web';
  relevanceScore: number;
}

export interface LearningInsight {
  id: string;
  type: 'pattern' | 'improvement' | 'trend';
  title: string;
  description: string;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface ModuleRecommendation {
  id: string;
  moduleId: string;
  type: 'content' | 'structure' | 'style' | 'reference';
  title: string;
  description: string;
  rationale: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high';
  actionType: 'add' | 'modify' | 'remove' | 'reorder';
  preview?: string;
  estimatedImpact: number;
}

export interface DependencyRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'prerequisite' | 'reference' | 'continuation' | 'support';
  strength: number; // 0-1, dependency strength
  isAutoDetected: boolean;
  reasoning: string;
  status: 'active' | 'suggested' | 'broken';
}

export interface SmartModuleLibrary {
  categories: SmartTemplateCategory[];
  searchIndex: SearchIndex;
  userPreferences: UserPreferences;
  recentlyUsed: string[];
  favorites: string[];
}

export interface SmartTemplateCategory extends TemplateCategory {
  aiGenerated: boolean;
  usageCount: number;
  averageRating: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  prerequisites: string[];
  learningOutcomes: string[];
}

export interface SearchIndex {
  termFrequency: Map<string, number>;
  concepts: Map<string, string[]>;
  tags: Map<string, string[]>;
  lastUpdated: Date;
}

export interface UserPreferences {
  favoriteTemplates: string[];
  writingStyle: 'academic' | 'technical' | 'casual' | 'formal';
  complexityPreference: 'simple' | 'detailed' | 'comprehensive';
  aiAssistanceLevel: 'minimal' | 'moderate' | 'extensive';
  preferredModuleTypes: ModuleType[];
  customSettings: Record<string, any>;
}

export interface ProgressAnalytics {
  moduleId: string;
  writingVelocity: number; // words per minute
  editingRatio: number; // edits per word written
  consistencyScore: number;
  focusTime: number; // minutes spent actively writing
  breakPattern: number[]; // break times throughout the day
  productivityTrends: ProductivityTrend[];
}

export interface ProductivityTrend {
  date: Date;
  wordsWritten: number;
  timeSpent: number;
  qualityScore: number;
  moduleProgress: number;
}

export interface SmartModuleEditorState extends ModularEditorState {
  smartMode: boolean;
  aiAssistEnabled: boolean;
  recommendationsVisible: boolean;
  analyticsVisible: boolean;
  collaborationMode: 'solo' | 'review' | 'collaborative';
  focusMode: boolean;
  currentTheme: 'light' | 'dark' | 'auto';
  layoutPreference: 'sidebar' | 'floating' | 'bottom';
  notifications: EditorNotification[];
}

export interface EditorNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  action?: NotificationAction;
  autoHide: boolean;
  duration: number;
  createdAt: Date;
}

export interface NotificationAction {
  label: string;
  handler: () => void;
  style: 'primary' | 'secondary' | 'danger';
}

export interface ModuleOperationHistory {
  id: string;
  operation: 'create' | 'update' | 'delete' | 'move' | 'duplicate';
  moduleId: string;
  timestamp: Date;
  user: string;
  details: Record<string, any>;
  canUndo: boolean;
  canRedo: boolean;
}

export interface CollaborationData {
  activeUsers: CollaborationUser[];
  comments: ModuleComment[];
  changes: CollaborationChange[];
  permissions: CollaborationPermissions;
}

export interface CollaborationUser {
  id: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'reviewer' | 'viewer';
  isOnline: boolean;
  lastSeen: Date;
  currentModule?: string;
}

export interface CollaborationChange {
  id: string;
  userId: string;
  moduleId: string;
  type: 'content' | 'structure' | 'metadata';
  before: any;
  after: any;
  timestamp: Date;
  isApproved?: boolean;
  reviewerId?: string;
}

export interface CollaborationPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canAddModules: boolean;
  canManageStructure: boolean;
  canInviteUsers: boolean;
  canExport: boolean;
}

export interface SmartModuleAnalytics {
  overview: AnalyticsOverview;
  moduleMetrics: ModuleMetrics[];
  trends: AnalyticsTrend[];
  recommendations: AnalyticsRecommendation[];
  comparisons: AnalyticsComparison[];
}

export interface AnalyticsOverview {
  totalModules: number;
  completedModules: number;
  totalWordCount: number;
  averageQualityScore: number;
  productivityScore: number;
  estimatedTimeToCompletion: number;
}

export interface ModuleMetrics {
  moduleId: string;
  wordCount: number;
  qualityScore: number;
  timeSpent: number;
  revisionCount: number;
  aiInteractions: number;
  userEngagement: number;
}

export interface AnalyticsTrend {
  metric: string;
  timeframe: 'daily' | 'weekly' | 'monthly';
  data: TrendDataPoint[];
  direction: 'up' | 'down' | 'stable';
  significance: number;
}

export interface TrendDataPoint {
  date: Date;
  value: number;
  metadata?: Record<string, any>;
}

export interface AnalyticsRecommendation {
  id: string;
  category: 'productivity' | 'quality' | 'structure' | 'collaboration';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  actionItems: string[];
  expectedOutcome: string;
}

export interface AnalyticsComparison {
  metric: string;
  currentPeriod: ComparisonPeriod;
  previousPeriod: ComparisonPeriod;
  change: number;
  changeDirection: 'positive' | 'negative' | 'neutral';
}

export interface ComparisonPeriod {
  start: Date;
  end: Date;
  value: number;
  context: string;
}