// 基础类型定义

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Paper {
  id: string;
  title: string;
  content: string;
  abstract?: string;
  keywords: string[];
  status: PaperStatus;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  sections: PaperSection[];
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
  authors: string[];
  journal?: string;
  year: number;
  doi?: string;
  url?: string;
  paperId: string;
}

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

// Re-export modular types
export * from './modular';