/**
 * Services - 统一导出所有服务模块
 */

// API客户端服务
export { default as GLMClient, createGLMClient, defaultGLMClient } from './glm-client';

// API健康监控服务
export { 
  default as APIHealthMonitor, 
  defaultHealthMonitor,
  EnvironmentValidator 
} from './api-health-monitor';

// 配置管理服务
export { 
  default as ConfigManager, 
  defaultConfigManager,
  configUtils 
} from './config-manager';

// 内容分析服务
export { 
  default as ContentAnalyzer, 
  contentAnalyzer,
  analyzePaper,
  quickQualityCheck 
} from './content-analyzer';

// AI写作助手服务
export {
  AIWritingAssistant,
  createAIWritingAssistant,
  RealTimeWritingCollaborator,
  createRealTimeCollaborator,
  PaperTypeAdapter,
  paperTypeAdapter,
  getPaperGuidance,
  validatePaper,
  ModeProcessorFactory,
  createAIWritingAssistantSystem,
  createDefaultAIWritingSystem,
  AIWritingAssistantUtils,
  AIWritingAssistantPresets,
  PaperType,
  AcademicField
} from './ai-writing-assistant-system';

// 论文类型相关服务
export { PaperTypeService } from './paper-type-service';
export { ModuleStructureGenerator } from './module-structure-generator';
export { PaperStyleManager, PAPER_TYPE_STYLES, PAPER_FORMAT_CONFIGS } from './paper-style-config';

// 论文模板系统服务
export { 
  PaperTemplateService, 
  paperTemplateService, 
  TemplateUtils 
} from './paper-templates';
export { 
  IntegratedPaperTemplateManager, 
  integratedPaperTemplateManager, 
  PaperTemplateUtils 
} from './paper-template-manager';
export { ComprehensivePaperTemplateService } from './paper-templates-extended';
export { completePaperTemplateService } from './paper-templates-complete';

// 类型导出
export type {
  HealthCheckResult,
  FallbackOptions
} from './api-health-monitor';

export type {
  ConfigChangeEvent,
  ConfigMonitorOptions
} from './config-manager';

// 质量保证和进度管理服务
export { 
  default as ConsistencyAnalyzer, 
  createConsistencyAnalyzer 
} from './consistency-analyzer';
export { 
  default as ProgressTracker, 
  createProgressTracker 
} from './progress-tracker';

export type {
  ConsistencyAnalysisResult,
  LogicalConsistencyResult,
  ReferenceIntegrityResult,
  StructuralCoherenceResult,
  ContentConsistencyResult,
  ConsistencyRecommendation,
  ConsistencyAnalysisConfig
} from './consistency-analyzer';

export type {
  ProgressTrackingResult,
  OverallProgress,
  SectionProgress,
  TimeAnalysis,
  Milestone,
  ProductivityAnalysis,
  ProgressPrediction,
  ProgressRecommendation,
  ProgressTrackingConfig,
  WritingSessionData
} from './progress-tracker';

// 引用和参考文献管理服务
export { 
  ReferenceManager, 
  createReferenceManager,
  ReferenceType,
  CitationStyle,
  DEFAULT_CITATION_STYLES,
  REFERENCE_TYPE_LABELS
} from './reference-manager';

export type {
  Reference,
  Citation,
  FormattedCitation,
  SearchResult,
  DuplicationResult,
  CitationStatistics
} from './reference-manager';