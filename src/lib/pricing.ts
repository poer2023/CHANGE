// 定价体系和套餐配置

export type ServiceType = 'essay_generation' | 'ai_chat' | 'document_analysis' | 'translation' | 'ai_detection' | 'plagiarism_detection';

export interface PricingConfig {
  type: ServiceType;
  name: string;
  pricePerHundredWords: number; // 每100字的价格（元）
  description: string;
}

export interface CreditPackage {
  id: string;
  name: string;
  words: number;
  originalPrice: number;
  salePrice: number;
  discount: number; // 折扣百分比
  isPopular?: boolean;
  bonusWords?: number; // 赠送字数
  description: string;
}

export interface NewUserBenefit {
  welcomeWords: number;
  description: string;
}

// 基础服务定价配置
export const PRICING_CONFIG: Record<ServiceType, PricingConfig> = {
  essay_generation: {
    type: 'essay_generation',
    name: '论文生成',
    pricePerHundredWords: 1.0, // 1元/100字
    description: 'AI智能论文生成服务'
  },
  ai_chat: {
    type: 'ai_chat',
    name: 'AI对话',
    pricePerHundredWords: 0.5, // 0.5元/100字
    description: '智能对话咨询服务'
  },
  document_analysis: {
    type: 'document_analysis',
    name: '文档分析',
    pricePerHundredWords: 0.8, // 0.8元/100字
    description: '文档智能分析服务'
  },
  translation: {
    type: 'translation',
    name: '智能翻译',
    pricePerHundredWords: 0.3, // 0.3元/100字
    description: '多语言智能翻译'
  },
  ai_detection: {
    type: 'ai_detection',
    name: 'AI检测',
    pricePerHundredWords: 0.6, // 0.6元/100字
    description: 'AI生成内容检测服务'
  },
  plagiarism_detection: {
    type: 'plagiarism_detection',
    name: '抄袭检测',
    pricePerHundredWords: 0.8, // 0.8元/100字
    description: '文档原创性检测服务'
  }
};

// 字数套餐配置
export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'starter',
    name: '入门套餐',
    words: 10000, // 1万字
    originalPrice: 100,
    salePrice: 89,
    discount: 11,
    description: '适合轻度使用用户'
  },
  {
    id: 'standard',
    name: '标准套餐',
    words: 30000, // 3万字
    originalPrice: 300,
    salePrice: 249,
    discount: 17,
    bonusWords: 3000,
    isPopular: true,
    description: '最受欢迎，适合日常使用'
  },
  {
    id: 'professional',
    name: '专业套餐',
    words: 80000, // 8万字
    originalPrice: 800,
    salePrice: 599,
    discount: 25,
    bonusWords: 12000,
    description: '适合专业用户和机构'
  },
  {
    id: 'enterprise',
    name: '企业套餐',
    words: 200000, // 20万字
    originalPrice: 2000,
    salePrice: 1299,
    discount: 35,
    bonusWords: 40000,
    description: '企业级用户首选'
  },
  {
    id: 'ultimate',
    name: '无限套餐',
    words: 500000, // 50万字
    originalPrice: 5000,
    salePrice: 2999,
    discount: 40,
    bonusWords: 100000,
    description: '超大容量，性价比最高'
  }
];

// 新用户福利
export const NEW_USER_BENEFIT: NewUserBenefit = {
  welcomeWords: 500, // 新用户赠送500字
  description: '新用户注册即享500字免费体验'
};

// 工具函数：计算服务费用
export function calculateServiceCost(serviceType: ServiceType, wordCount: number): number {
  const config = PRICING_CONFIG[serviceType];
  if (!config) {
    throw new Error(`Unknown service type: ${serviceType}`);
  }
  
  // 向上取整到100字
  const hundredWordUnits = Math.ceil(wordCount / 100);
  return hundredWordUnits * config.pricePerHundredWords;
}

// 工具函数：格式化价格显示
export function formatPrice(price: number): string {
  return `¥${price.toFixed(2)}`;
}

// 工具函数：格式化字数显示
export function formatWordCount(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万字`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k字`;
  }
  return `${count}字`;
}

// 工具函数：获取套餐的实际字数（包含赠送）
export function getTotalWords(packageData: CreditPackage): number {
  return packageData.words + (packageData.bonusWords || 0);
}

// 工具函数：计算每字价格
export function getPricePerWord(packageData: CreditPackage): number {
  const totalWords = getTotalWords(packageData);
  return packageData.salePrice / totalWords;
}

// 常量：最小充值金额和字数
export const MIN_RECHARGE_AMOUNT = 10; // 最小充值10元
export const MIN_WORD_BALANCE = 0; // 最小字数余额

// 常量：VIP等级配置
export interface VipLevel {
  level: number;
  name: string;
  requiredSpending: number; // 累计消费金额
  discount: number; // 折扣百分比
  benefits: string[];
}

export const VIP_LEVELS: VipLevel[] = [
  {
    level: 0,
    name: '普通用户',
    requiredSpending: 0,
    discount: 0,
    benefits: []
  },
  {
    level: 1,
    name: '青铜会员',
    requiredSpending: 100,
    discount: 5,
    benefits: ['5%折扣', '优先客服']
  },
  {
    level: 2,
    name: '白银会员',
    requiredSpending: 500,
    discount: 10,
    benefits: ['10%折扣', '专属客服', '每月赠送100字']
  },
  {
    level: 3,
    name: '黄金会员',
    requiredSpending: 1500,
    discount: 15,
    benefits: ['15%折扣', '专属客服', '每月赠送500字', '新功能抢先体验']
  },
  {
    level: 4,
    name: '钻石会员',
    requiredSpending: 5000,
    discount: 20,
    benefits: ['20%折扣', '专属客服', '每月赠送1000字', '新功能抢先体验', '定制化服务']
  }
];

// 工具函数：根据累计消费获取VIP等级
export function getVipLevel(totalSpending: number): VipLevel {
  let currentLevel = VIP_LEVELS[0];
  
  for (const level of VIP_LEVELS) {
    if (totalSpending >= level.requiredSpending) {
      currentLevel = level;
    } else {
      break;
    }
  }
  
  return currentLevel;
}

// 工具函数：应用VIP折扣
export function applyVipDiscount(originalPrice: number, vipLevel: VipLevel): number {
  if (vipLevel.discount === 0) return originalPrice;
  return originalPrice * (1 - vipLevel.discount / 100);
}