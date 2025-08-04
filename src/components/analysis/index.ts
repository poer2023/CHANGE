// 内容分析组件导出
export { default as ContentAnalysisPanel } from './ContentAnalysisPanel';
export { default as QualityIndicator, getQualityDescription, getImprovementSuggestion } from './QualityIndicator';
export { default as SuggestionCard, SuggestionList } from './SuggestionCard';

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