// 文档上传和处理相关类型定义

export interface SupportedFileType {
  extension: string;
  name: string;
  maxSize: number; // 字节
  icon: string;
}

export type ProcessingStatus = 'uploading' | 'processing' | 'completed' | 'error';

export interface DocumentUpload {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string; // MIME type
  status: ProcessingStatus;
  progress?: number; // 0-100
  uploadedAt: Date;
  processedAt?: Date;
  result?: DocumentProcessingResult;
  error?: string;
}

export interface DocumentProcessingResult {
  // 基础信息
  metadata: DocumentMetadata;
  
  // 内容信息
  content: DocumentContent;
  
  // 统计信息
  statistics: DocumentStatistics;
  
  // 分析结果
  overall: {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    summary: string;
  };
  
  academics: AcademicAnalysis;
  language: LanguageAnalysis;
  structure: StructureAnalysis;
  innovation: InnovationAnalysis;
  
  // 改进建议
  suggestions: DocumentSuggestion[];
  
  // 处理时间戳
  processedAt: Date;
}

export interface DocumentMetadata {
  title?: string;
  author?: string;
  createdDate?: Date;
  modifiedDate?: Date;
  subject?: string;
  keywords?: string[];
  language?: string;
  pageCount?: number;
  hasImages?: boolean;
  hasTables?: boolean;
  hasCharts?: boolean;
  citations?: CitationInfo[];
}

export interface DocumentContent {
  text: string;
  sections: DocumentSection[];
  abstract?: string;
  introduction?: string;
  conclusion?: string;
  references?: string[];
  footnotes?: string[];
  images?: ImageInfo[];
  tables?: TableInfo[];
}

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
  level: number; // 1=主标题, 2=二级标题, etc.
  order: number;
  wordCount: number;
  startPosition: number;
  endPosition: number;
}

export interface DocumentStatistics {
  wordCount: number;
  characterCount: number;
  characterCountNoSpaces: number;
  paragraphCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  averageSentencesPerParagraph: number;
  readingTimeMinutes: number;
  languageComplexity: 'simple' | 'moderate' | 'complex';
  vocabularyDiversity: number; // 0-1
  formalityScore: number; // 0-100
}

export interface AcademicAnalysis {
  score: number; // 0-100
  citationFormat: {
    score: number;
    style?: 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'Harvard' | 'Mixed' | 'Unknown';
    issues: CitationIssue[];
  };
  structure: {
    score: number;
    hasAbstract: boolean;
    hasIntroduction: boolean;
    hasMethodology: boolean;
    hasResults: boolean;
    hasDiscussion: boolean;
    hasConclusion: boolean;
    hasReferences: boolean;
    missingSection: string[];
  };
  terminology: {
    score: number;
    academicTerms: number;
    fieldSpecificTerms: string[];
    inconsistentTerms: string[];
  };
  recommendations: string[];
}

export interface CitationIssue {
  type: 'format' | 'missing' | 'incomplete' | 'inconsistent';
  severity: 'low' | 'medium' | 'high';
  position: { start: number; end: number };
  message: string;
  suggestion?: string;
}

export interface CitationInfo {
  text: string;
  position: { start: number; end: number };
  type: 'in-text' | 'footnote' | 'endnote';
  isValid: boolean;
  issues?: string[];
}

export interface LanguageAnalysis {
  score: number; // 0-100
  grammar: {
    score: number;
    errors: GrammarIssue[];
    commonMistakes: string[];
  };
  style: {
    score: number;
    clarity: number;
    conciseness: number;
    formality: number;
    consistency: number;
    suggestions: StyleSuggestion[];
  };
  readability: {
    score: number;
    level: 'elementary' | 'middle-school' | 'high-school' | 'college' | 'graduate';
    fleschKincaidGrade: number;
    fleschReadingEase: number;
    averageWordsPerSentence: number;
  };
  vocabulary: {
    score: number;
    diversity: number;
    complexity: number;
    academicWords: number;
    repeatWords: string[];
    suggestions: string[];
  };
}

export interface GrammarIssue {
  type: 'spelling' | 'grammar' | 'punctuation' | 'syntax';
  severity: 'low' | 'medium' | 'high';
  position: { start: number; end: number };
  text: string;
  message: string;
  suggestions: string[];
}

export interface StyleSuggestion {
  type: 'clarity' | 'conciseness' | 'formality' | 'word-choice' | 'sentence-structure';
  position: { start: number; end: number };
  text: string;
  message: string;
  suggestion: string;
  impact: 'low' | 'medium' | 'high';
}

export interface StructureAnalysis {
  score: number; // 0-100
  organization: {
    score: number;
    logicalFlow: number;
    sectionBalance: number;
    transitionQuality: number;
    issues: StructureIssue[];
  };
  coherence: {
    score: number;
    topicConsistency: number;
    argumentFlow: number;
    evidenceSupport: number;
    suggestions: string[];
  };
  sections: SectionAnalysis[];
}

export interface StructureIssue {
  type: 'flow' | 'balance' | 'transition' | 'logic' | 'missing';
  severity: 'low' | 'medium' | 'high';
  section?: string;
  message: string;
  suggestion: string;
}

export interface SectionAnalysis {
  title: string;
  wordCount: number;
  paragraphCount: number;
  isWellDeveloped: boolean;
  purpose: string;
  issues: string[];
  suggestions: string[];
}

export interface InnovationAnalysis {
  score: number; // 0-100
  novelty: {
    score: number;
    originalIdeas: number;
    uniqueApproach: boolean;
    creativeElements: string[];
  };
  contribution: {
    score: number;
    theoreticalContribution: number;
    practicalContribution: number;
    methodologicalContribution: number;
    significance: 'low' | 'medium' | 'high';
  };
  originality: {
    score: number;
    similarityLevel: number;
    potentialPlagiarism: boolean;
    overlappingConcepts: string[];
  };
}

export interface DocumentSuggestion {
  id: string;
  type: 'improvement' | 'correction' | 'enhancement' | 'addition';
  priority: 'high' | 'medium' | 'low';
  category: 'academic' | 'language' | 'structure' | 'innovation' | 'formatting';
  title: string;
  description: string;
  action: string;
  estimatedImpact: number; // 0-100
  estimatedEffort: 'low' | 'medium' | 'high';
  section?: string;
  position?: { start: number; end: number };
}

export interface ImageInfo {
  id: string;
  alt?: string;
  caption?: string;
  position: number;
  size: { width: number; height: number };
  format: string;
}

export interface TableInfo {
  id: string;
  caption?: string;
  position: number;
  rows: number;
  columns: number;
  headers: string[];
  data?: string[][];
}

// 文档比较相关类型
export interface DocumentComparison {
  sourceId: string;
  targetId: string;
  similarity: number;
  differences: DocumentDifference[];
  summary: ComparisonSummary;
  createdAt: Date;
}

export interface DocumentDifference {
  type: 'addition' | 'deletion' | 'modification';
  section: string;
  position: { start: number; end: number };
  oldText?: string;
  newText?: string;
  significance: 'low' | 'medium' | 'high';
}

export interface ComparisonSummary {
  overallSimilarity: number;
  structuralSimilarity: number;
  contentSimilarity: number;
  styleSimilarity: number;
  majorChanges: string[];
  recommendations: string[];
}

// 文档导出类型
export interface DocumentExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'markdown' | 'txt';
  includeAnalysis: boolean;
  includeSuggestions: boolean;
  includeComments: boolean;
  template?: string;
  styling?: ExportStyling;
}

export interface ExportStyling {
  fontSize: number;
  fontFamily: string;
  lineSpacing: number;
  margins: { top: number; right: number; bottom: number; left: number };
  headerFooter: boolean;
  watermark?: string;
}

// 批量处理类型
export interface BatchProcessingJob {
  id: string;
  files: DocumentUpload[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  results: DocumentProcessingResult[];
  errors: string[];
}

export interface ProcessingSettings {
  analysisDepth: 'basic' | 'standard' | 'comprehensive';
  enableGrammarCheck: boolean;
  enableStyleCheck: boolean;
  enablePlagiarismCheck: boolean;
  citationStyle: 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'Harvard';
  language: 'en' | 'zh' | 'auto';
  customRules?: ProcessingRule[];
}

export interface ProcessingRule {
  id: string;
  name: string;
  description: string;
  type: 'grammar' | 'style' | 'structure' | 'academic';
  enabled: boolean;
  severity: 'low' | 'medium' | 'high';
  pattern?: string;
  message: string;
  suggestion?: string;
}