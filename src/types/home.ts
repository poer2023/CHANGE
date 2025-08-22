// Types for Home page components and data

export type DocStatus = 'draft' | 'generating' | 'ready' | 'gate1' | 'addon';

export type Addon = 'plagiarism' | 'aiCheck' | 'evidencePack' | 'latex' | 'defenseCard' | 'shareLink';

export interface DocItem {
  id: string;
  title: string;
  words: number;
  cites: number;
  updatedAt: string; // ISO string
  status: DocStatus;
  missingAddons?: Addon[];
  lockExpireAt?: string; // ISO string for gate1 countdown
}

export interface HomeFilters {
  status: 'all' | DocStatus;
  search: string;
  sortBy: 'updatedAt' | 'title' | 'words' | 'cites';
  sortOrder: 'asc' | 'desc';
  view: 'table' | 'cards';
}

export interface TodoCounts {
  gate1: number;
  gate2: number;
  retry: number;
}

export interface QuickAction {
  id: 'new' | 'upload' | 'autopilot';
  title: string;
  description: string;
  icon: string;
  action: () => void;
}

// Menu items for sidebar
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  active?: boolean;
  badge?: string | number;
}

// User subscription plan
export type SubscriptionPlan = 'Free' | 'Standard' | 'Pro';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: SubscriptionPlan;
}

// Addon configuration for Gate2Dialog
export interface AddonConfig {
  name: string;
  description: string;
  icon: string;
  price: number;
  color: string;
  bgColor: string;
}