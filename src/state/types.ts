// Global state types for the writing flow application

export type Level = 'UG' | 'PG' | 'ESL' | 'Pro';
export type Format = 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'GBT';
export type VerifyLevel = 'Basic' | 'Standard' | 'Pro';

export interface Step1Inputs {
  title: string;
  assignmentType: 'paper' | 'report' | 'review' | 'commentary';
  wordCount: number; // 300–20000
  format: Format;
  level: Level;
  resources: Array<'paper' | 'book' | 'web' | 'dataset' | 'other'>;
  styleSamples: Array<{ id: string; name: string; size: number }>;
  notes: string;
}

export interface Estimate {
  priceRange: [number, number]; // 预估价区间
  citesRange: [number, number]; // 预计引用条数
  etaMinutes: [number, number]; // 预计分钟
  verifyLevel: VerifyLevel;
  assumptions: string[]; // 用于"费用构成与假设"
  updatedAt: number;
}

export interface AutopilotStats {
  hits: number;
  verified: number;
  sections: number;
}

export interface AutopilotLog {
  ts: number;
  msg: string;
  level: 'info' | 'warn' | 'error';
}

export interface Autopilot {
  running: boolean;
  step: 'idle' | 'search' | 'strategy' | 'outline' | 'done' | 'error';
  progress: number; // 0-100
  stats: AutopilotStats;
  canPause: boolean;
  minimized: boolean;
  logs: AutopilotLog[];
  taskId?: string;
  config?: {
    verifyLevel: VerifyLevel;
    allowPreprint: boolean;
    useStyle: boolean;
  };
}

export interface PayLocks {
  lockedPrice?: {
    value: number;
    currency: 'CNY';
    expiresAt: number;
  };
  gate1Ready: boolean; // /result 首进是否弹闸1
  previewMode: boolean; // 未付费时 true
}

export interface ResultState {
  docId?: string;
  generation: 'idle' | 'starting' | 'streaming' | 'ready' | 'error';
  exportPending: boolean;
  streamId?: string;
}

export interface AppState {
  step1: Step1Inputs;
  estimate: Estimate;
  autopilot: Autopilot;
  pay: PayLocks;
  result: ResultState;
}

export type Action =
  | { type: 'STEP1_UPDATE'; payload: Partial<Step1Inputs> }
  | { type: 'ESTIMATE_SET'; payload: Estimate }
  | { type: 'AUTOPILOT_START'; payload: { verifyLevel: VerifyLevel; allowPreprint: boolean; useStyle: boolean; taskId?: string } }
  | { type: 'AUTOPILOT_PROGRESS'; payload: Partial<Autopilot> }
  | { type: 'AUTOPILOT_DONE'; payload?: { docId: string } }
  | { type: 'AUTOPILOT_ERROR'; payload: string }
  | { type: 'AUTOPILOT_MINIMIZE'; payload: boolean }
  | { type: 'AUTOPILOT_PAUSE' }
  | { type: 'AUTOPILOT_RESUME' }
  | { type: 'AUTOPILOT_STOP' }
  | { type: 'LOCK_PRICE_SET'; payload: { value: number; expiresAt: number } }
  | { type: 'PAY_GATE1_READY'; payload: boolean }
  | { type: 'PREVIEW_MODE_SET'; payload: boolean }
  | { type: 'RESULT_SET_ID'; payload: { docId: string } }
  | { type: 'GENERATION_STATE'; payload: ResultState['generation'] }
  | { type: 'GENERATION_START'; payload: { streamId: string } }
  | { type: 'RESET_STATE' }
  | { type: 'LOAD_PERSISTED_STATE'; payload: Partial<AppState> };

// Event tracking types
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: number;
}

// API response types
export interface EstimateResponse {
  priceRange: [number, number];
  citesRange: [number, number];
  etaMinutes: [number, number];
  assumptions: string[];
}

export interface AutopilotStartResponse {
  taskId: string;
}

export interface AutopilotStreamData {
  step: 'search' | 'strategy' | 'outline' | 'done' | 'error';
  progress: number;
  stats?: AutopilotStats;
  docId?: string;
  message?: string;
}

export interface PaymentIntentResponse {
  paymentIntentId: string;
  payUrl?: string;
}

export interface PaymentConfirmResponse {
  status: 'succeeded' | 'failed';
}

export interface GenerationStartResponse {
  streamId: string;
}

export interface GenerationStreamData {
  blockId: string;
  delta: string;
  cites?: Array<{ key: string; source: string }>;
  done?: boolean;
  error?: string;
}

export interface ExportResponse {
  url?: string;
  link?: string;
}

// Utility types for component props
export interface EstimateCardProps {
  estimate: Estimate;
  onVerifyLevelChange: (v: VerifyLevel) => void;
  onPreviewSample: () => void;
  onAutopilotClick: () => void;
}

export interface AutopilotBannerProps {
  state: Autopilot;
  onMinimize: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export interface Gate1ModalProps {
  open: boolean;
  price: { value: number; currency: 'CNY'; expiresAt: number };
  benefits: string[];
  onPreviewOnly: () => void;
  onUnlock: () => Promise<void>;
}

export interface Gate2DialogProps {
  open: boolean;
  missingAddons: Array<'plagiarism' | 'aiCheck' | 'evidencePack' | 'latex' | 'defenseCard' | 'shareLink'>;
  onBuyAndExport: (addons: string[]) => Promise<void>;
  onCancel: () => void;
}

export interface DeckTabsProps {
  disabled: boolean; // 预览模式下 true
  docId: string;
}