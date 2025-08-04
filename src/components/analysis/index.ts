// 内容分析组件导出
export { default as ContentAnalysisPanel } from './ContentAnalysisPanel';
export { default as QualityIndicator, getQualityDescription, getImprovementSuggestion } from './QualityIndicator';
export { default as SuggestionCard } from './SuggestionCard';
export { SuggestionList } from './SuggestionCard';

// 质量保证和进度管理组件导出
export { default as ConsistencyAnalysisPanel } from './ConsistencyAnalysisPanel';
export { default as ProgressTrackingPanel } from './ProgressTrackingPanel';
export { default as QualityAssessmentPanel } from './QualityAssessmentPanel';
export { default as CollaborationPanel } from './CollaborationPanel';

// 重新导出相关类型
export type {
  ContentAnalysisResult,
  ActionableInsight,
  AcademicStandardsResult,
  LanguageQualityResult,
  StructuralIntegrityResult,
  InnovationResult,
  ContentStatistics,
  CitationStyle,
  AnalysisSettings
} from '../../types';