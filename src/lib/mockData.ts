import { 
  User, 
  Activity, 
  Order, 
  Invoice, 
  Session, 
  InvoiceProfile, 
  UserStats, 
  PendingDocument, 
  UserPreferences, 
  NotificationSettings 
} from './types';

// Mock user data
export const mockUser: User = {
  id: 'user_12345',
  name: '张学友',
  email: 'zhang.xueyou@example.com',
  emailVerified: true,
  plan: 'Standard',
  avatar: '',
  timezone: 'Asia/Shanghai',
  language: 'zh-CN',
  lastLoginAt: '2024-01-15T10:30:00Z',
  lastLoginIp: '192.168.1.100',
  lastLoginCity: '上海'
};

// Mock user stats
export const mockUserStats: UserStats = {
  totalWords: 45280,
  citationPassRate: 89.5,
  exportCount: 23
};

// Mock activities generator
export const generateMockActivities = (count: number = 5): Activity[] => {
  const activityTypes = ['create', 'unlock', 'export', 'addon', 'error'] as const;
  const titles = {
    create: ['创建新文档《人工智能发展趋势研究》', '创建新文档《区块链技术应用》', '创建新文档《机器学习算法分析》'],
    unlock: ['解锁生成《数据挖掘技术研究》', '解锁生成《云计算架构设计》', '解锁生成《网络安全防护》'],
    export: ['导出PDF《深度学习应用》', '导出DOCX《算法优化研究》', '导出LaTeX《系统架构分析》'],
    addon: ['购买抄袭检测服务', '购买AI检测服务', '购买证据包服务'],
    error: ['生成失败：网络超时', '导出失败：格式错误', '验证失败：引用格式']
  };

  return Array.from({ length: count }, (_, i) => {
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const typeTitle = titles[type];
    const title = typeTitle[Math.floor(Math.random() * typeTitle.length)];
    
    return {
      id: `activity_${Date.now()}_${i}`,
      ts: new Date(Date.now() - i * 3600000 * Math.random() * 24).toISOString(),
      type,
      title,
      meta: type === 'create' ? '3500字' : type === 'unlock' ? '¥199' : type === 'export' ? '2.3MB' : undefined
    };
  });
};

// Mock orders generator
export const generateMockOrders = (count: number = 12): Order[] => {
  const orderTypes = ['gate1', 'addon'] as const;
  const gate1Titles = ['解锁生成《人工智能研究》', '解锁生成《区块链应用》', '解锁生成《机器学习》'];
  const addonTitles = ['抄袭检测服务', 'AI检测服务', '证据包服务', 'LaTeX格式', '答辩卡', '分享链接'];
  
  return Array.from({ length: count }, (_, i) => {
    const type = orderTypes[Math.floor(Math.random() * orderTypes.length)];
    const titles = type === 'gate1' ? gate1Titles : addonTitles;
    const title = titles[Math.floor(Math.random() * titles.length)];
    const amount = type === 'gate1' ? 199 + Math.floor(Math.random() * 100) : 19 + Math.floor(Math.random() * 40);
    
    return {
      id: `order_${Date.now()}_${i}`,
      createdAt: new Date(Date.now() - i * 86400000 * Math.random() * 30).toISOString(),
      type,
      title,
      amount,
      status: Math.random() > 0.1 ? 'paid' : Math.random() > 0.5 ? 'refunded' : 'failed',
      invoiceId: Math.random() > 0.3 ? `inv_${Date.now()}_${i}` : undefined
    };
  });
};

// Mock invoices generator
export const generateMockInvoices = (count: number = 8): Invoice[] => {
  const months = ['2024-01', '2023-12', '2023-11', '2023-10', '2023-09', '2023-08', '2023-07', '2023-06'];
  
  return Array.from({ length: count }, (_, i) => {
    const amount = 200 + Math.floor(Math.random() * 500);
    const tax = Math.round(amount * 0.06);
    
    return {
      id: `inv_${Date.now()}_${i}`,
      month: months[i] || `2023-${String(12 - i).padStart(2, '0')}`,
      amount,
      tax,
      status: Math.random() > 0.2 ? 'issued' : 'pending',
      url: Math.random() > 0.2 ? `https://example.com/invoice/${i}.pdf` : undefined
    };
  });
};

// Mock sessions generator
export const generateMockSessions = (count: number = 5): Session[] => {
  const devices = ['MacBook Pro', 'iPhone 12', 'Windows Desktop', 'iPad Air', 'Android Phone'];
  const agents = ['Chrome 120.0', 'Safari 17.1', 'Firefox 121.0', 'Edge 120.0', 'Mobile Safari'];
  const cities = ['上海', '北京', '深圳', '杭州', '广州'];
  const ips = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '192.168.0.200', '10.1.1.10'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `session_${Date.now()}_${i}`,
    device: devices[i % devices.length],
    agent: agents[i % agents.length],
    city: cities[i % cities.length],
    ip: ips[i % ips.length],
    lastActiveAt: new Date(Date.now() - i * 3600000 * Math.random() * 48).toISOString(),
    current: i === 0
  }));
};

// Mock pending documents
export const generateMockPendingDocs = (): { gate1: PendingDocument[], gate2: PendingDocument[] } => {
  const gate1Docs: PendingDocument[] = [
    {
      id: 'doc_gate1_1',
      title: '人工智能伦理问题研究',
      wordCount: 4500,
      citationCount: 25,
      status: 'gate1',
      lockedPrice: 199,
      expiresAt: new Date(Date.now() + 25 * 60000).toISOString()
    },
    {
      id: 'doc_gate1_2', 
      title: '区块链技术在金融领域的应用',
      wordCount: 3800,
      citationCount: 18,
      status: 'gate1',
      lockedPrice: 179,
      expiresAt: new Date(Date.now() + 15 * 60000).toISOString()
    },
    {
      id: 'doc_gate1_3',
      title: '机器学习算法优化研究',
      wordCount: 5200,
      citationCount: 32,
      status: 'gate1',
      lockedPrice: 229,
      expiresAt: new Date(Date.now() + 8 * 60000).toISOString()
    }
  ];

  const gate2Docs: PendingDocument[] = [
    {
      id: 'doc_gate2_1',
      title: '深度学习在图像识别中的应用',
      wordCount: 4200,
      citationCount: 28,
      status: 'addon',
      missingAddons: ['plagiarism', 'aiCheck']
    },
    {
      id: 'doc_gate2_2',
      title: '云计算安全架构设计',
      wordCount: 3900,
      citationCount: 22,
      status: 'addon', 
      missingAddons: ['evidencePack', 'latex']
    },
    {
      id: 'doc_gate2_3',
      title: '物联网技术发展趋势分析',
      wordCount: 4800,
      citationCount: 30,
      status: 'addon',
      missingAddons: ['defenseCard']
    }
  ];

  return { gate1: gate1Docs, gate2: gate2Docs };
};

// Mock invoice profile
export const mockInvoiceProfile: InvoiceProfile = {
  type: 'personal',
  title: '张学友',
  address: '上海市浦东新区张江高科技园区',
  phone: '13800138000',
  zip: '201203'
};

// Mock user preferences
export const mockUserPreferences: UserPreferences = {
  defaultCitationFormat: 'APA',
  defaultLanguageLevel: '研究生',
  defaultVerificationLevel: 'Standard',
  autoSave: true,
  enableShortcuts: true,
  evidencePackItems: {
    citationList: true,
    timeline: true,
    defenseCard: false
  }
};

// Mock notification settings
export const mockNotificationSettings: NotificationSettings = {
  inApp: {
    generationComplete: true,
    exportComplete: true,
    orderStatus: true,
    systemAnnouncement: true
  },
  email: {
    generationComplete: true,
    exportComplete: false,
    orderStatus: true,
    systemAnnouncement: false,
    frequency: 'immediate'
  }
};