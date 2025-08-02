// 应用常量

export const APP_NAME = 'AI Paper Writer';
export const APP_VERSION = '1.0.0';

export const PAPER_STATUSES = {
  DRAFT: 'draft',
  WRITING: 'writing',
  REVIEWING: 'reviewing',
  COMPLETED: 'completed',
} as const;

export const TEMPLATE_CATEGORIES = {
  RESEARCH: 'research',
  REVIEW: 'review',
  THESIS: 'thesis',
  CONFERENCE: 'conference',
  JOURNAL: 'journal',
  CUSTOM: 'custom',
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

export const LOCAL_STORAGE_KEYS = {
  USER_SETTINGS: 'ai-paper-writer-settings',
  DRAFT_CONTENT: 'ai-paper-writer-draft',
  THEME: 'ai-paper-writer-theme',
} as const;

export const API_ENDPOINTS = {
  PAPERS: '/api/papers',
  USERS: '/api/users',
  TEMPLATES: '/api/templates',
  PROJECTS: '/api/projects',
  REFERENCES: '/api/references',
  AI_CHAT: '/api/ai/chat',
} as const;

export const DEFAULT_SETTINGS = {
  theme: THEMES.SYSTEM,
  language: 'en',
  autoSave: true,
  notifications: true,
  writingGoal: 500,
  defaultTemplate: null,
};

export const WRITING_GOALS = [
  { value: 250, label: '250 words/day' },
  { value: 500, label: '500 words/day' },
  { value: 750, label: '750 words/day' },
  { value: 1000, label: '1,000 words/day' },
  { value: 1500, label: '1,500 words/day' },
  { value: 2000, label: '2,000 words/day' },
];

export const KEYBOARD_SHORTCUTS = {
  SAVE: 'Ctrl+S',
  NEW_PAPER: 'Ctrl+N',
  BOLD: 'Ctrl+B',
  ITALIC: 'Ctrl+I',
  UNDO: 'Ctrl+Z',
  REDO: 'Ctrl+Y',
  FIND: 'Ctrl+F',
  REPLACE: 'Ctrl+H',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const SUPPORTED_FILE_TYPES = ['.pdf', '.doc', '.docx', '.txt', '.md'];

export const DEBOUNCE_DELAY = 300; // milliseconds
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds