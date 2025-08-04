/**
 * AI写作助手组件索引 - 统一导出所有AI写作助手相关组件
 */

// 主要AI写作助手面板
export { default as AIWritingAssistantPanel } from './AIWritingAssistantPanel';

// 建议操作面板
export { 
  default as SuggestionActionPanel,
  SuggestionNotification,
  type SuggestionAction,
  type SuggestionActionResult
} from './SuggestionActionPanel';

// 组件类型导出
export type {
  // 来自AIWritingAssistantPanel的类型
} from './AIWritingAssistantPanel';

export type {
  // 来自SuggestionActionPanel的类型
} from './SuggestionActionPanel';