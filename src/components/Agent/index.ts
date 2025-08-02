// Agent 主要组件
export { default as AgentPanel } from './AgentPanel';
export { default as AgentRoleSwitcher } from './AgentRoleSwitcher';
export { default as ChatInterface } from './ChatInterface';
export { default as ChatMessage } from './ChatMessage';
export { default as QuickActionBar } from './QuickActionBar';
export { default as AgentSuggestionCard } from './AgentSuggestionCard';

// 专门的 Agent 组件
export { default as AcademicWritingExpert } from './Agents/AcademicWritingExpert';
export { default as ResearchAssistant } from './Agents/ResearchAssistant';
export { default as FormatExpert } from './Agents/FormatExpert';
export { default as ContentAdvisor } from './Agents/ContentAdvisor';

// Agent 数据和配置
export * from '../../data/agents';