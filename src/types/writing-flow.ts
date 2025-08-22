// 写作流程相关的类型定义

export type CitationStyle = 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'GB/T 7714';
export type AssignmentType = 'paper' | 'report' | 'review' | 'comment';
export type SourceType = 'any' | 'papers' | 'books' | 'web' | 'datasets' | 'other';
export type NoteType = 'direct' | 'paraphrase' | 'summary';
export type ArgumentType = 'argumentative' | 'analytical' | 'comparative' | 'descriptive';
export type WritingStep = 'topic' | 'research' | 'strategy' | 'outline' | 'content';
export type VerificationLevel = 'Basic' | 'Standard' | 'Pro';

// 文件元数据
export interface FileMeta {
  id: string;
  name: string;
  size: number;
  type: string;
}

// 选题信息
export interface Topic {
  title: string;
  course?: string;
  assignmentType: AssignmentType;
  wordLimit: number;
  citationStyle: CitationStyle;
  languageLevel: 'undergrad' | 'postgrad' | 'esl' | 'pro';
  sources: SourceType[];
  sourceOther?: string;
  styleFiles: FileMeta[];
  extraRequirements?: string;
}

// 来源文献
export interface Source {
  id: string;
  title: string;
  authors: string[];
  year: number;
  publisher: string;
  url?: string;
  doi?: string;
  isbn?: string;
  pmid?: string;
  sourceType: SourceType;
  abstract?: string;
  selected: boolean;
  verified: boolean;
  addedAt: Date;
}

// 笔记和摘录
export interface Note {
  id: string;
  sourceId: string;
  content: string;
  originalText?: string;
  noteType: NoteType;
  pageNumber?: number;
  createdAt: Date;
  tags?: string[];
}

// 论点结构
export interface Claim {
  id: string;
  text: string;
  sourceIds: string[];
  counterArgument?: string;
  rebuttal?: string;
  order: number;
}

// 写作策略
export interface Strategy {
  thesis: string;
  claims: Claim[];
  argumentType: ArgumentType;
  approach: string;
  targetAudience?: string;
  createdAt: Date;
  updatedAt: Date;
}

// 大纲节点
export interface OutlineNode {
  id: string;
  title: string;
  goal: string;
  keyPoints: string[];
  sourceIds: string[];
  expectedWords: number;
  children: OutlineNode[];
  parentId?: string;
  order: number;
  completed: boolean;
}

// 变更记录
export interface ChangeLog {
  id: string;
  timestamp: Date;
  actor: 'user' | 'agent';
  action: string;
  description: string;
  metadata?: Record<string, any>;
}

// 写作内容
export interface Content {
  id: string;
  title: string;
  body: string;
  wordCount: number;
  citations: Citation[];
  bibliography: BibliographyItem[];
  lastModified: Date;
  version: number;
  changeHistory: ChangeLog[];
}

// 引用
export interface Citation {
  id: string;
  sourceId: string;
  position: number;
  pageNumber?: string;
  quotationType: 'direct' | 'indirect';
  formattedText: string;
}

// 参考文献条目
export interface BibliographyItem {
  id: string;
  sourceId: string;
  formattedText: string;
  style: CitationStyle;
}

// 风格对齐数据
export interface StyleMetrics {
  sentenceLength: number;
  lexicalVariety: number;
  burstiness: number;
  overallDistance: number;
  polishLevel: 'light' | 'medium' | 'strong';
}

// 定价估算
export interface PricingEstimation {
  basePrice: number;
  finalPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  tier: 'budget' | 'standard' | 'premium';
  estimatedCitations: {
    min: number;
    max: number;
  };
  verificationCoverage: number;
  estimatedTime: {
    min: number;
    max: number;
  };
  breakdown: {
    base: number;
    complexity: number;
    verification: number;
    resources: number;
    style: number;
  };
  deliverables: string[];
}

// 自动进度配置
export interface AutoProgressConfig {
  strictVerification: boolean;
  conservativeCitations: boolean;
  allowAlternativeResources: boolean;
}

// 自动进度状态
export interface AutoProgressState {
  isActive: boolean;
  currentStage: 'research' | 'strategy' | 'outline' | 'completed' | null;
  progress: number;
  stages: Array<{
    name: string;
    status: 'pending' | 'in_progress' | 'completed' | 'error';
    message?: string;
  }>;
  config?: AutoProgressConfig;
}

// 项目元数据
export interface ProjectMetadata {
  createdAt: Date;
  updatedAt: Date;
  sessionTime: number;
  searchKeywords: string[];
  citationActions: Array<{
    type: 'insert' | 'replace';
    sourceId: string;
    position: number;
    timestamp: Date;
  }>;
  agentCommands: Array<{
    command: string;
    timestamp: Date;
    success: boolean;
  }>;
  manualEditCount: number;
  exportVersion: number;
  userId?: string;
  pricingEstimation?: PricingEstimation;
  autoProgressState?: AutoProgressState;
}

// 写作项目（完整数据结构）
export interface WritingProject {
  id: string;
  userId: string;
  topic: Topic;
  sources: Source[];
  notes: Note[];
  strategy?: Strategy;
  outline: OutlineNode[];
  content?: Content;
  styleMetrics?: StyleMetrics;
  metadata: ProjectMetadata;
  currentStep: WritingStep;
  completedSteps: WritingStep[];
  status: 'draft' | 'in_progress' | 'completed';
}

// 导出配置
export interface ExportConfig {
  includeComments: boolean;
  includeMetadata: boolean;
  format: 'docx' | 'pdf' | 'latex' | 'markdown';
  citationStyle: CitationStyle;
}

// Agent 命令
export interface AgentCommand {
  id: string;
  text: string;
  timestamp: Date;
  type: 'structural' | 'formatting' | 'citation' | 'style' | 'chart';
  parameters?: Record<string, any>;
  result?: string;
  success: boolean;
  undoable: boolean;
}

// 文档生成配置
export interface DocumentExport {
  summaryPdf: boolean;
  sourcesCsv: boolean;
  vivaQaPdf: boolean;
  includeTimeline: boolean;
  includeChangeHistory: boolean;
}

// 步骤验证结果
export interface StepValidation {
  step: WritingStep;
  isValid: boolean;
  warnings: string[];
  errors: string[];
  completionPercentage: number;
}

// 搜索结果
export interface SearchResult {
  id: string;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  url?: string;
  source: string;
  relevanceScore: number;
  verified: boolean;
}

// Document Data for ContentStep
export interface DocumentData {
  docTitle: string;
  createdAt: string;
  style: CitationStyle;
  sections: Section[];
  references: Reference[];
}

// Section for content generation
export interface Section {
  id: string;
  level: 2 | 3;
  title: string;
  html: string;
  state: 'queued' | 'generating' | 'done' | 'error';
  citations: Citation[];
  expectedCitations?: number;
}

// Reference structure
export interface Reference {
  id: string;
  title: string;
  authors: string[];
  year?: number;
  venue?: string;
  doi?: string;
  url?: string;
  abstract?: string;
  pages?: string;
  volume?: string;
  issue?: string;
  publisher?: string;
  sourceType: 'paper' | 'book' | 'web' | 'dataset' | 'report';
  pdfUrl?: string;
  thumbnail?: string;
  fileSize?: string;
  lastAccessed?: string;
  citationCount?: number;
  tags?: string[];
}

// Deliverables system types
export type DeliverableState = 'idle' | 'generating' | 'ready' | 'error' | 'missing-deps';

export interface QualityScore {
  name: '结构完整度' | '引用规范' | '语言一致性' | '可证据化';
  value: number;
}

export interface TimelineEvent {
  label: string;
  timestamp: string;
  actor: 'user' | 'agent';
  description?: string;
}

export interface AssetItem {
  id: string;
  name: string;
  type: 'img' | 'table' | 'chart';
  thumbnail: string;
  url: string;
  description?: string;
}

export interface Deliverables {
  quality: {
    scores: QualityScore[];
    overall: number;
    state: DeliverableState;
    recommendations?: string[];
  };
  processPdf: {
    url?: string;
    state: DeliverableState;
    lastGenerated?: string;
  };
  refs: {
    total: number;
    target: number;
    byType: Record<'paper' | 'book' | 'web' | 'dataset' | 'report', number>;
    csv?: string;
    bib?: string;
    ris?: string;
    state: DeliverableState;
  };
  timeline: {
    events: TimelineEvent[];
    auditJson?: string;
    state: DeliverableState;
  };
  viva: {
    pdf?: string;
    state: DeliverableState;
    lastGenerated?: string;
  };
  assets: {
    items: AssetItem[];
    zipUrl?: string;
    state: DeliverableState;
  };
  share: {
    url?: string;
    qrCode?: string;
    expiresAt?: string;
    state: DeliverableState;
  };
  bundle: {
    zipUrl?: string;
    progress: number;
    state: DeliverableState;
    manifest?: string[];
    lastGenerated?: string;
  };
}