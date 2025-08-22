export type Plan = 'Standard' | 'Pro';
export type DocStatus = 'draft' | 'generating' | 'ready' | 'gate1' | 'addon';
export type Addon = 'plagiarism' | 'aiCheck' | 'evidencePack' | 'latex' | 'defenseCard' | 'shareLink';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  plan: Plan;
  lastLoginAt: string;
  lastLoginIp?: string;
  lastLoginCity?: string;
  avatar?: string;
  timezone?: string;
  language?: string;
}

export interface Activity {
  id: string;
  ts: string;
  type: 'create' | 'unlock' | 'export' | 'addon' | 'error';
  title: string;
  meta?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  type: 'gate1' | 'addon';
  title: string;
  amount: number;
  status: 'paid' | 'refunded' | 'failed';
  invoiceId?: string;
}

export interface Invoice {
  id: string;
  month: string;
  amount: number;
  tax: number;
  status: 'issued' | 'pending';
  url?: string;
}

export interface Session {
  id: string;
  device: string;
  agent: string;
  city?: string;
  ip?: string;
  lastActiveAt: string;
  current?: boolean;
}

export interface InvoiceProfile {
  type: 'personal' | 'company';
  title: string;
  taxId?: string;
  address?: string;
  phone?: string;
  zip?: string;
}

export interface ProfileStats {
  totalWords: number;
  citationPassRate: number;
  exportCount: number;
}

export interface Document {
  id: string;
  title: string;
  wordCount: number;
  status: DocStatus;
  createdAt: string;
  priceCountdown?: number; // minutes remaining
  addons: Addon[];
}

export interface NotificationSettings {
  inApp: {
    documentReady: boolean;
    systemUpdates: boolean;
    promotions: boolean;
  };
  email: {
    documentReady: boolean;
    weeklyDigest: boolean;
    promotions: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
  };
}

export interface UserPreferences {
  citationFormat: 'APA' | 'MLA' | 'Chicago' | 'Harvard';
  defaultLanguageLevel: 'native' | 'advanced' | 'intermediate';
  defaultVerificationLevel: 'basic' | 'standard' | 'comprehensive';
  autoSave: boolean;
  keyboardShortcuts: boolean;
  evidencePackItems: {
    originalSources: boolean;
    citationAnalysis: boolean;
    plagiarismReport: boolean;
    aiDetection: boolean;
  };
}