// 基础类型定义

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Paper {
  id: string;
  title: string;
  content: string;
  description?: string;
  type?: string;
  template?: string;
  abstract?: string;
  keywords: string[];
  status: PaperStatus;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  sections: PaperSection[];
  isFavorite?: boolean;
  isShared?: boolean;
  // Form data fields
  paperType?: string;
  field?: string;
  requirements?: string;
  format?: string;
  specialRequirements?: string;
  outlinePreference?: string;
  detailLevel?: string;
  citationStyle?: string;
}

export interface PaperSection {
  id: string;
  title: string;
  content: string;
  order: number;
  level: number; // 1 for main sections, 2 for subsections, etc.
}

export type PaperStatus = 'draft' | 'writing' | 'reviewing' | 'completed';

export interface AIAssistant {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  paperId?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  category: TemplateCategory;
  tags: string[];
  isPublic: boolean;
  authorId: string;
  createdAt: Date;
}

export type TemplateCategory = 
  | 'research' 
  | 'review' 
  | 'thesis' 
  | 'conference' 
  | 'journal' 
  | 'custom';

export interface Reference {
  id: string;
  title: string;
  authors: Author[];
  type: ReferenceType;
  year: number;
  doi?: string;
  url?: string;
  paperId: string;
  // Journal/Conference fields
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  // Book fields
  bookTitle?: string;
  editor?: Author[];
  edition?: string;
  chapterTitle?: string;
  // Conference fields
  conferenceName?: string;
  conferenceLocation?: string;
  conferenceDate?: string;
  // Thesis/Dissertation fields
  institution?: string;
  degree?: string;
  advisor?: string;
  // Web/Online fields
  accessDate?: Date;
  lastModified?: Date;
  // Additional metadata
  abstract?: string;
  keywords?: string[];
  language?: string;
  isbn?: string;
  issn?: string;
  pmid?: string;
  citationCount?: number;
  notes?: string;
  tags?: string[];
  isUsed?: boolean;
  usageCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Author {
  firstName: string;
  lastName: string;
  middleName?: string;
  suffix?: string;
  affiliation?: string;
  email?: string;
  orcid?: string;
}

export type ReferenceType = 
  | 'journal'
  | 'conference'
  | 'book'
  | 'bookChapter'
  | 'thesis'
  | 'dissertation'
  | 'techReport'
  | 'webpage'
  | 'preprint'
  | 'patent'
  | 'software'
  | 'dataset'
  | 'presentation'
  | 'newspaper'
  | 'magazine'
  | 'other';

export interface WritingSession {
  id: string;
  paperId: string;
  startTime: Date;
  endTime?: Date;
  wordsWritten: number;
  goal?: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  papers: Paper[];
  collaborators: string[];
  createdAt: Date;
  updatedAt: Date;
}

// API 响应类型
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// 表单类型
export interface CreatePaperForm {
  title: string;
  description?: string;
  type?: string;
  template?: string;
  templateId?: string;
  projectId?: string;
}

export interface UpdatePaperForm {
  title?: string;
  content?: string;
  abstract?: string;
  keywords?: string[];
}

// 组件属性类型
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// 路由类型
export interface RouteParams {
  id?: string;
  paperId?: string;
  projectId?: string;
}

// 搜索和过滤类型
export interface SearchFilters {
  query?: string;
  status?: PaperStatus;
  category?: TemplateCategory;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

// 设置类型
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  autoSave: boolean;
  notifications: boolean;
  writingGoal: number;
  defaultTemplate?: string;
}

// 统计类型
export interface WritingStats {
  totalWords: number;
  todayWords: number;
  weekWords: number;
  monthWords: number;
  completedPapers: number;
  activePapers: number;
  writingSessions: number;
  averageSessionLength: number;
}

// Agent 系统类型定义
export type AgentRole = 
  | 'academic-writing-expert'
  | 'research-assistant'
  | 'format-expert'
  | 'content-advisor';

export interface Agent {
  id: string;
  role: AgentRole;
  name: string;
  description: string;
  avatar: string;
  capabilities: string[];
  expertise: string[];
  isActive: boolean;
}

export interface AgentMessage extends ChatMessage {
  agentRole?: AgentRole;
  messageType: 'text' | 'suggestion' | 'action' | 'analysis';
  actions?: AgentAction[];
  suggestions?: AgentSuggestion[];
  metadata?: Record<string, any>;
}

export interface AgentAction {
  id: string;
  type: string;
  label: string;
  description: string;
  icon?: string;
  data?: Record<string, any>;
}

export interface AgentSuggestion {
  id: string;
  type: 'improvement' | 'correction' | 'enhancement' | 'warning';
  title: string;
  content: string;
  confidence: number;
  action?: AgentAction;
}

export interface AgentContext {
  currentPaper?: Paper;
  selectedText?: string;
  cursorPosition?: number;
  recentActions: string[];
  conversationHistory: AgentMessage[];
}

export interface AgentCapability {
  id: string;
  name: string;
  description: string;
  category: 'writing' | 'research' | 'formatting' | 'analysis';
  enabled: boolean;
}

export interface ChatSession {
  id: string;
  agentRole: AgentRole;
  title: string;
  messages: AgentMessage[];
  context: AgentContext;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  agentRole: AgentRole;
  description: string;
  category: 'search' | 'optimize' | 'check' | 'enhance' | 'analyze' | 'generate';
}

// UI 状态类型
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  createdAt: string;
}

export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  activeModal: string | null;
  notifications: Notification[];
  loading: {
    global: boolean;
    paper: boolean;
    agent: boolean;
  };
}

// GLM-4.5 API 类型定义
export interface GLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GLMChatRequest {
  model: string;
  messages: GLMMessage[];
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stop?: string[];
}

export interface GLMChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: GLMChoice[];
  usage?: GLMUsage;
}

export interface GLMChoice {
  index: number;
  message: GLMMessage;
  finish_reason: string | null;
}

export interface GLMUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface GLMStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: GLMStreamChoice[];
}

export interface GLMStreamChoice {
  index: number;
  delta: {
    role?: string;
    content?: string;
  };
  finish_reason: string | null;
}

export interface GLMError {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

export interface GLMClientConfig {
  apiKey: string;
  baseURL?: string;
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  rateLimit?: number;
  enableCache?: boolean;
  cacheTimeout?: number;
  enableErrorReporting?: boolean;
  maxErrorLogs?: number;
  enablePerformanceMonitoring?: boolean;
}

export interface StreamingResponse {
  content: string;
  isComplete: boolean;
  error?: string;
}

export interface AIServiceOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  onStream?: (chunk: string) => void;
  onComplete?: (content: string) => void;
  onError?: (error: string) => void;
}

// GLM 客户端状态类型
export interface GLMClientStatus {
  isConfigured: boolean;
  rateLimitStatus: {
    current: number;
    limit: number;
    resetTime: number;
  };
  cacheStatus: {
    size: number;
    enabled: boolean;
  };
  errorLogs: GLMErrorLog[];
  performanceMetrics: GLMPerformanceMetrics;
}

export interface GLMErrorLog {
  error: string;
  timestamp: number;
  context: Record<string, any>;
}

export interface GLMPerformanceMetrics {
  averageLatency: number;
  requestCount: number;
  errorRate: number;
}

export interface GLMPerformanceEntry {
  endpoint: string;
  duration: number;
  timestamp: number;
}

// 网络连接状态类型
export interface ConnectionStatus {
  success: boolean;
  latency: number;
  model?: string;
  error?: string;
}

// 环境配置验证类型
export interface EnvironmentConfig {
  glmApiKey?: string;
  glmBaseUrl?: string;
  glmTimeout?: number;
  glmMaxRetries?: number;
  glmRetryDelay?: number;
  glmRateLimit?: number;
  glmEnableCache?: boolean;
  glmCacheDuration?: number;
  glmEnableErrorReporting?: boolean;
  glmMaxErrorLogs?: number;
  glmEnablePerformanceMonitoring?: boolean;
  debugMode?: boolean;
  useMockData?: boolean;
}

// 内容分析相关类型
export interface ContentAnalysis {
  id: string;
  paperId: string;
  result: ContentAnalysisResult;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentAnalysisResult {
  overall: {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    summary: string;
  };
  academics: AcademicStandardsResult;
  language: LanguageQualityResult;
  structure: StructuralIntegrityResult;
  innovation: InnovationResult;
  statistics: ContentStatistics;
  actionableInsights: ActionableInsight[];
  timestamp: Date;
}

export interface AcademicStandardsResult {
  score: number;
  issues: AcademicIssue[];
  recommendations: string[];
}

export interface AcademicIssue {
  type: 'citation' | 'format' | 'structure' | 'terminology';
  severity: 'low' | 'medium' | 'high';
  position: { start: number; end: number };
  message: string;
  suggestion?: string;
}

export interface LanguageQualityResult {
  score: number;
  grammar: {
    score: number;
    errors: GrammarError[];
  };
  spelling: {
    score: number;
    errors: SpellingError[];
  };
  style: {
    score: number;
    suggestions: StyleSuggestion[];
  };
  readability: {
    score: number;
    level: 'elementary' | 'middle-school' | 'high-school' | 'college' | 'graduate';
    metrics: ReadabilityMetrics;
  };
}

export interface GrammarError {
  position: { start: number; end: number };
  message: string;
  suggestion: string;
  type: 'syntax' | 'tense' | 'agreement' | 'punctuation';
}

export interface SpellingError {
  position: { start: number; end: number };
  word: string;
  suggestions: string[];
}

export interface StyleSuggestion {
  position: { start: number; end: number };
  message: string;
  suggestion: string;
  type: 'clarity' | 'conciseness' | 'formality' | 'vocabulary';
}

export interface ReadabilityMetrics {
  averageSentenceLength: number;
  averageWordsPerSentence: number;
  complexWords: number;
  fleschKincaidGrade: number;
  fleschReadingEase: number;
}

export interface StructuralIntegrityResult {
  score: number;
  sections: SectionAnalysis[];
  flow: {
    score: number;
    issues: FlowIssue[];
  };
  coherence: {
    score: number;
    suggestions: string[];
  };
}

export interface SectionAnalysis {
  title: string;
  wordCount: number;
  isComplete: boolean;
  issues: string[];
  suggestions: string[];
}

export interface FlowIssue {
  section: string;
  type: 'transition' | 'logic' | 'repetition';
  message: string;
  suggestion: string;
}

export interface InnovationResult {
  score: number;
  novelty: {
    score: number;
    aspects: NoveltyAspect[];
  };
  contribution: {
    score: number;
    analysis: string;
  };
  originality: {
    score: number;
    similarityChecks: SimilarityCheck[];
  };
}

export interface NoveltyAspect {
  aspect: string;
  score: number;
  description: string;
}

export interface SimilarityCheck {
  source: string;
  similarity: number;
  matchedText: string;
}

export interface ContentStatistics {
  wordCount: number;
  characterCount: number;
  paragraphCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  keywordDensity: KeywordDensity[];
}

export interface KeywordDensity {
  keyword: string;
  count: number;
  density: number;
}

export interface ActionableInsight {
  priority: 'high' | 'medium' | 'low';
  category: 'improvement' | 'correction' | 'enhancement';
  title: string;
  description: string;
  action: string;
  estimatedImpact: number;
}

// 引用格式类型
export type CitationStyle = 
  | 'APA'        // American Psychological Association
  | 'MLA'        // Modern Language Association
  | 'Chicago'    // Chicago Manual of Style
  | 'IEEE'       // Institute of Electrical and Electronics Engineers
  | 'Harvard'    // Harvard referencing system
  | 'Vancouver'  // Vancouver system (medical journals)
  | 'AMA'        // American Medical Association
  | 'ASA'        // American Sociological Association
  | 'APSA'       // American Political Science Association
  | 'CSE'        // Council of Science Editors
  | 'GB7714'     // 中国国家标准
  | 'Custom';    // Custom style

// 文献管理相关类型
export interface ReferenceCollection {
  id: string;
  name: string;
  description?: string;
  references: Reference[];
  isShared: boolean;
  ownerId: string;
  collaborators: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CitationInText {
  id: string;
  referenceId: string;
  position: {
    start: number;
    end: number;
  };
  type: 'parenthetical' | 'narrative' | 'footnote';
  customText?: string;
  pageNumbers?: string;
  chapter?: string;
  suppressAuthor?: boolean;
  suppressYear?: boolean;
  prefix?: string;
  suffix?: string;
}

export interface Bibliography {
  id: string;
  paperId: string;
  style: CitationStyle;
  entries: BibliographyEntry[];
  settings: BibliographySettings;
  generatedAt: Date;
}

export interface BibliographyEntry {
  referenceId: string;
  formattedText: string;
  sortKey: string;
  order: number;
}

export interface BibliographySettings {
  sortBy: 'author' | 'year' | 'title' | 'type' | 'citation-order';
  groupByType: boolean;
  includeAbstract: boolean;
  includeDOI: boolean;
  includeURL: boolean;
  hangingIndent: boolean;
  lineSpacing: number;
  fontSize: number;
}

export interface ReferenceImport {
  source: 'bibtex' | 'endnote' | 'ris' | 'csv' | 'zotero' | 'mendeley';
  content: string;
  filename?: string;
  encoding?: string;
}

export interface ReferenceExport {
  format: 'bibtex' | 'endnote' | 'ris' | 'csv' | 'word' | 'pdf';
  references: Reference[];
  options: ExportOptions;
}

export interface ExportOptions {
  includeAbstract?: boolean;
  includeNotes?: boolean;
  includeTags?: boolean;
  sortBy?: string;
  groupBy?: string;
  template?: string;
}

export interface ReferenceSearchQuery {
  query?: string;
  type?: ReferenceType[];
  authors?: string[];
  year?: {
    from?: number;
    to?: number;
  };
  journal?: string;
  tags?: string[];
  isUsed?: boolean;
  hasAbstract?: boolean;
  hasDOI?: boolean;
  sortBy?: 'relevance' | 'year' | 'title' | 'author' | 'citationCount';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ReferenceSearchResult {
  references: Reference[];
  total: number;
  facets: {
    types: { type: ReferenceType; count: number }[];
    years: { year: number; count: number }[];
    journals: { journal: string; count: number }[];
    authors: { author: string; count: number }[];
  };
  suggestions: string[];
}

// 学术搜索API相关类型
export interface AcademicSearchQuery {
  query: string;
  source: 'crossref' | 'pubmed' | 'arxiv' | 'google-scholar' | 'semantic-scholar';
  maxResults?: number;
  year?: {
    from?: number;
    to?: number;
  };
  fieldOfStudy?: string[];
  publicationType?: string[];
}

export interface AcademicSearchResult {
  id: string;
  title: string;
  authors: Author[];
  abstract?: string;
  year?: number;
  journal?: string;
  venue?: string;
  doi?: string;
  url?: string;
  citationCount?: number;
  source: string;
  relevanceScore?: number;
  isOpenAccess?: boolean;
}

// 引用完整性检查
export interface CitationIntegrityCheck {
  paperId: string;
  issues: CitationIssue[];
  statistics: {
    totalCitations: number;
    orphanedCitations: number;
    duplicateReferences: number;
    missingFields: number;
    formattingErrors: number;
  };
  checkedAt: Date;
}

export interface CitationIssue {
  id: string;
  type: 'orphaned-citation' | 'missing-reference' | 'duplicate-reference' | 'missing-field' | 'format-error';
  severity: 'error' | 'warning' | 'info';
  message: string;
  position?: {
    start: number;
    end: number;
  };
  referenceId?: string;
  suggestions: string[];
  autoFixable: boolean;
}

// 引用推荐
export interface CitationRecommendation {
  reference: AcademicSearchResult;
  relevanceScore: number;
  reason: string;
  context: {
    similarPapers: string[];
    commonKeywords: string[];
    citationPatterns: string[];
  };
}

// 内容分析设置
export interface AnalysisSettings {
  citationStyle: CitationStyle;
  enableRealTimeAnalysis: boolean;
  enableCache: boolean;
  autoAnalyze: boolean;
  showQuickResults: boolean;
  analysisDepth: 'basic' | 'detailed' | 'comprehensive';
  glmApiKey?: string;
}

// 文献管理设置
export interface ReferenceManagerSettings {
  defaultCitationStyle: CitationStyle;
  defaultReferenceType: ReferenceType;
  autoSyncWithEditor: boolean;
  enableDuplicateDetection: boolean;
  enableAutoFormat: boolean;
  showAbstractInList: boolean;
  groupReferencesByType: boolean;
  enableRealTimeSearch: boolean;
  backupToCloud: boolean;
  defaultExportFormat: 'bibtex' | 'endnote' | 'ris';
  academicSearchSources: string[];
  maxSearchResults: number;
  cacheSearchResults: boolean;
  enableCitationRecommendations: boolean;
}

// 分析历史
export interface AnalysisHistory {
  id: string;
  paperId: string;
  version: string;
  analysisResult: ContentAnalysisResult;
  settings: AnalysisSettings;
  createdAt: Date;
}

// Re-export modular types
export * from './modular';

// Re-export form types
export * from './form';

// Re-export paper types
export * from './paper-types';

// Re-export document types
export * from './document';