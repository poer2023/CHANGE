// Profile and Settings related types
export type Plan = 'Standard' | 'Pro';
export type DocStatus = 'draft' | 'generating' | 'ready' | 'gate1' | 'addon';
export type Addon = 'plagiarism' | 'aiCheck' | 'evidencePack' | 'latex' | 'defenseCard' | 'shareLink';

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  plan: Plan;
  avatar?: string;
  timezone: string;
  language: string;
  lastLoginAt: string;
  lastLoginIp?: string;
  lastLoginCity?: string;
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

export interface UserStats {
  totalWords: number;
  citationPassRate: number;
  exportCount: number;
}

export interface PendingDocument {
  id: string;
  title: string;
  wordCount: number;
  citationCount: number;
  status: DocStatus;
  lockedPrice?: number;
  expiresAt?: string;
  missingAddons?: Addon[];
}

export interface UserPreferences {
  defaultCitationFormat: 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'GB/T 7714';
  defaultLanguageLevel: '本科' | '研究生' | 'ESL' | '专业';
  defaultVerificationLevel: 'Basic' | 'Standard' | 'Pro';
  autoSave: boolean;
  enableShortcuts: boolean;
  evidencePackItems: {
    citationList: boolean;
    timeline: boolean;
    defenseCard: boolean;
  };
}

export interface NotificationSettings {
  inApp: {
    generationComplete: boolean;
    exportComplete: boolean;
    orderStatus: boolean;
    systemAnnouncement: boolean;
  };
  email: {
    generationComplete: boolean;
    exportComplete: boolean;
    orderStatus: boolean;
    systemAnnouncement: boolean;
    frequency: 'immediate' | 'daily' | 'off';
  };
}