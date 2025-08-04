// Agent 主要组件
export { default as AgentPanel } from './AgentPanel';
export { default as AgentRoleSwitcher } from './AgentRoleSwitcher';
export { default as ChatInterface } from './ChatInterface';
export { default as ChatMessage } from './ChatMessage';
export { default as QuickActionBar } from './QuickActionBar';
export { default as AgentSuggestionCard } from './AgentSuggestionCard';

// 专门的 Agent 组件（来自 Agents 子目录）
export { default as AcademicWritingExpert } from './Agents/AcademicWritingExpert';
export { default as ResearchAssistant } from './Agents/ResearchAssistant';
export { default as FormatExpert } from './Agents/FormatExpert';
export { default as ContentAdvisor } from './Agents/ContentAdvisor';

// 根目录中的独立 Agent 组件
export { default as AcademicWritingExpertStandalone } from './AcademicWritingExpert';
export { default as ResearchAssistantStandalone } from './ResearchAssistant';
export { default as FormatExpertStandalone } from './FormatExpert';

// Agent 数据和配置
export * from '../../data/agents';