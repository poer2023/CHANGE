import { 
  User, 
  Activity, 
  Order, 
  Invoice, 
  Session, 
  InvoiceProfile, 
  ProfileStats, 
  Document, 
  NotificationSettings, 
  UserPreferences,
  Plan,
  DocStatus,
  Addon
} from '@/types/profile';

// Mock user data
export const mockUser: User = {
  id: 'user_123',
  name: 'Dr. Sarah Chen',
  email: 'sarah.chen@university.edu',
  emailVerified: true,
  plan: 'Pro',
  lastLoginAt: '2024-08-22T08:30:00Z',
  lastLoginIp: '192.168.1.100',
  lastLoginCity: 'San Francisco',
  avatar: 'https://ui-avatars.com/api/?name=Dr+Sarah+Chen&background=3b82f6&color=fff',
  timezone: 'America/Los_Angeles',
  language: 'en-US'
};

// Mock profile stats
export const mockProfileStats: ProfileStats = {
  totalWords: 125680,
  citationPassRate: 94.2,
  exportCount: 23
};

// Mock recent activities
export const mockActivities: Activity[] = [
  {
    id: 'act_1',
    ts: '2024-08-22T10:15:00Z',
    type: 'create',
    title: 'Created new document "Climate Change Analysis"',
    meta: '3,245 words'
  },
  {
    id: 'act_2',
    ts: '2024-08-21T16:30:00Z',
    type: 'unlock',
    title: 'Unlocked Gate1 verification for "Machine Learning Ethics"',
    meta: '$12.99'
  },
  {
    id: 'act_3',
    ts: '2024-08-21T14:22:00Z',
    type: 'export',
    title: 'Exported "Research Methodology" as PDF',
    meta: '8,567 words'
  },
  {
    id: 'act_4',
    ts: '2024-08-20T11:45:00Z',
    type: 'addon',
    title: 'Added Plagiarism Check to "Data Science Trends"',
    meta: '$4.99'
  },
  {
    id: 'act_5',
    ts: '2024-08-19T09:10:00Z',
    type: 'create',
    title: 'Created new document "Statistical Analysis"',
    meta: '2,134 words'
  }
];

// Mock documents for quick queues
export const mockGate1Documents: Document[] = [
  {
    id: 'doc_g1_1',
    title: 'Artificial Intelligence in Healthcare',
    wordCount: 4567,
    status: 'ready',
    createdAt: '2024-08-20T09:00:00Z',
    priceCountdown: 45, // 45 minutes remaining
    addons: []
  },
  {
    id: 'doc_g1_2',
    title: 'Sustainable Energy Solutions',
    wordCount: 3890,
    status: 'ready',
    createdAt: '2024-08-21T14:30:00Z',
    priceCountdown: 120, // 2 hours remaining
    addons: []
  },
  {
    id: 'doc_g1_3',
    title: 'Blockchain Technology Review',
    wordCount: 5234,
    status: 'ready',
    createdAt: '2024-08-22T08:15:00Z',
    priceCountdown: 180, // 3 hours remaining
    addons: []
  }
];

export const mockGate2Documents: Document[] = [
  {
    id: 'doc_g2_1',
    title: 'Quantum Computing Applications',
    wordCount: 6789,
    status: 'gate1',
    createdAt: '2024-08-18T10:00:00Z',
    addons: ['plagiarism', 'aiCheck']
  },
  {
    id: 'doc_g2_2',
    title: 'Cybersecurity Frameworks',
    wordCount: 4321,
    status: 'gate1',
    createdAt: '2024-08-19T16:45:00Z',
    addons: ['evidencePack', 'latex']
  },
  {
    id: 'doc_g2_3',
    title: 'Social Media Impact Study',
    wordCount: 5678,
    status: 'gate1',
    createdAt: '2024-08-20T13:20:00Z',
    addons: ['defenseCard', 'shareLink']
  }
];

// Mock orders
export const mockOrders: Order[] = [
  {
    id: 'order_1',
    createdAt: '2024-08-21T16:30:00Z',
    type: 'gate1',
    title: 'Gate1 Verification - Machine Learning Ethics',
    amount: 12.99,
    status: 'paid',
    invoiceId: 'inv_001'
  },
  {
    id: 'order_2',
    createdAt: '2024-08-20T11:45:00Z',
    type: 'addon',
    title: 'Plagiarism Check - Data Science Trends',
    amount: 4.99,
    status: 'paid',
    invoiceId: 'inv_002'
  },
  {
    id: 'order_3',
    createdAt: '2024-08-19T14:20:00Z',
    type: 'addon',
    title: 'Evidence Pack - Statistical Analysis',
    amount: 9.99,
    status: 'paid',
    invoiceId: 'inv_003'
  },
  {
    id: 'order_4',
    createdAt: '2024-08-18T09:15:00Z',
    type: 'gate1',
    title: 'Gate1 Verification - Research Methods',
    amount: 12.99,
    status: 'refunded',
    invoiceId: 'inv_004'
  }
];

// Mock invoices
export const mockInvoices: Invoice[] = [
  {
    id: 'inv_001',
    month: '2024-08',
    amount: 27.97,
    tax: 2.52,
    status: 'issued',
    url: '/api/invoices/inv_001.pdf'
  },
  {
    id: 'inv_002',
    month: '2024-07',
    amount: 45.95,
    tax: 4.14,
    status: 'issued',
    url: '/api/invoices/inv_002.pdf'
  },
  {
    id: 'inv_003',
    month: '2024-06',
    amount: 22.98,
    tax: 2.07,
    status: 'pending'
  }
];

// Mock sessions
export const mockSessions: Session[] = [
  {
    id: 'session_1',
    device: 'MacBook Pro',
    agent: 'Chrome 127.0.0.0',
    city: 'San Francisco',
    ip: '192.168.1.100',
    lastActiveAt: '2024-08-22T10:30:00Z',
    current: true
  },
  {
    id: 'session_2',
    device: 'iPhone 15',
    agent: 'Safari 17.0',
    city: 'San Francisco',
    ip: '10.0.0.1',
    lastActiveAt: '2024-08-21T18:45:00Z'
  },
  {
    id: 'session_3',
    device: 'Windows PC',
    agent: 'Firefox 118.0',
    city: 'Berkeley',
    ip: '192.168.2.50',
    lastActiveAt: '2024-08-20T14:20:00Z'
  }
];

// Mock invoice profile
export const mockInvoiceProfile: InvoiceProfile = {
  type: 'personal',
  title: 'Dr. Sarah Chen',
  address: '123 University Ave, San Francisco, CA',
  phone: '+1 (555) 123-4567',
  zip: '94102'
};

// Mock notification settings
export const mockNotificationSettings: NotificationSettings = {
  inApp: {
    documentReady: true,
    systemUpdates: true,
    promotions: false
  },
  email: {
    documentReady: true,
    weeklyDigest: true,
    promotions: false,
    frequency: 'immediate'
  }
};

// Mock user preferences
export const mockUserPreferences: UserPreferences = {
  citationFormat: 'APA',
  defaultLanguageLevel: 'native',
  defaultVerificationLevel: 'standard',
  autoSave: true,
  keyboardShortcuts: true,
  evidencePackItems: {
    originalSources: true,
    citationAnalysis: true,
    plagiarismReport: false,
    aiDetection: true
  }
};

// Helper functions for generating mock data
export const getAddonLabel = (addon: Addon): string => {
  const labels: Record<Addon, string> = {
    plagiarism: 'Plagiarism Check',
    aiCheck: 'AI Detection',
    evidencePack: 'Evidence Pack',
    latex: 'LaTeX Export',
    defenseCard: 'Defense Card',
    shareLink: 'Share Link'
  };
  return labels[addon];
};

export const getAddonPrice = (addon: Addon): number => {
  const prices: Record<Addon, number> = {
    plagiarism: 4.99,
    aiCheck: 3.99,
    evidencePack: 9.99,
    latex: 2.99,
    defenseCard: 7.99,
    shareLink: 1.99
  };
  return prices[addon];
};

export const getStatusColor = (status: DocStatus): string => {
  const colors: Record<DocStatus, string> = {
    draft: 'bg-gray-100 text-gray-800',
    generating: 'bg-indigo-100 text-indigo-800',
    ready: 'bg-green-100 text-green-800',
    gate1: 'bg-amber-100 text-amber-800',
    addon: 'bg-rose-100 text-rose-800'
  };
  return colors[status];
};

export const getStatusLabel = (status: DocStatus): string => {
  const labels: Record<DocStatus, string> = {
    draft: 'Draft',
    generating: 'Generating',
    ready: 'Ready',
    gate1: 'Gate1 Unlocked',
    addon: 'Addon Available'
  };
  return labels[status];
};

export const formatCountdown = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  } else {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};