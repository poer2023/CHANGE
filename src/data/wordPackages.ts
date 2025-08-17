// 字数包充值数据结构
// 现代化的字数包套餐配置

export type PackageTag = 'HOT' | 'BEST_VALUE' | 'NEW' | 'LIMITED';

export interface WordPackageBenefit {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface WordPackage {
  id: string;
  name: string;
  words: number; // 字数
  price: number; // 价格（元）
  originalPrice?: number; // 原价（如有折扣）
  pricePerThousandWords: number; // 每千字单价（元）
  benefits: WordPackageBenefit[]; // 权益列表
  tags: PackageTag[]; // 标签
  isRecommended: boolean; // 是否推荐
  isPopular?: boolean; // 是否热门
  description?: string; // 套餐描述
  validityPeriod?: string; // 有效期
  priority?: number; // 排序优先级
}

// 通用权益配置
export const COMMON_BENEFITS: WordPackageBenefit[] = [
  {
    id: 'no_expiry',
    title: '一次性购买字数不过期',
    description: '购买后字数永久有效，无时间限制',
    icon: '♾️'
  },
  {
    id: 'unlimited_docs',
    title: '不限文档数量',
    description: '可用于处理任意数量的文档',
    icon: '📄'
  },
  {
    id: 'priority_queue',
    title: '峰值时段优先队列',
    description: '在系统繁忙时享受优先处理权',
    icon: '⚡'
  },
  {
    id: 'premium_support',
    title: '专属客服支持',
    description: '享受专业的一对一客服服务',
    icon: '👥'
  },
  {
    id: 'early_access',
    title: '新功能抢先体验',
    description: '优先体验平台最新功能和特性',
    icon: '🚀'
  }
];

// 字数包套餐配置
export const WORD_PACKAGES: WordPackage[] = [
  {
    id: 'starter_5k',
    name: 'Starter',
    words: 5000,
    price: 29,
    pricePerThousandWords: 5.8,
    benefits: [
      COMMON_BENEFITS[0], // 不过期
      COMMON_BENEFITS[1], // 不限文档
    ],
    tags: [],
    isRecommended: false,
    description: 'Perfect for getting started',
    validityPeriod: '永久有效',
    priority: 1
  },
  {
    id: 'popular_10k',
    name: 'Popular',
    words: 10000,
    price: 49,
    pricePerThousandWords: 4.9,
    benefits: [
      COMMON_BENEFITS[0], // 不过期
      COMMON_BENEFITS[1], // 不限文档
      COMMON_BENEFITS[2], // 优先队列
    ],
    tags: ['HOT'],
    isRecommended: true,
    isPopular: true,
    description: 'Most popular choice',
    validityPeriod: '永久有效',
    priority: 2
  },
  {
    id: 'premium_50k',
    name: 'Premium',
    words: 50000,
    price: 99,
    pricePerThousandWords: 1.98,
    benefits: [
      COMMON_BENEFITS[0], // 不过期
      COMMON_BENEFITS[1], // 不限文档
      COMMON_BENEFITS[2], // 优先队列
      COMMON_BENEFITS[3], // 专属客服
      COMMON_BENEFITS[4]  // 新功能抢先体验
    ],
    tags: ['BEST_VALUE'],
    isRecommended: true,
    description: 'Best value for heavy users',
    validityPeriod: '永久有效',
    priority: 3
  }
];

// 工具函数：根据ID获取套餐
export function getPackageById(id: string): WordPackage | undefined {
  return WORD_PACKAGES.find(pkg => pkg.id === id);
}

// 工具函数：获取推荐套餐
export function getRecommendedPackages(): WordPackage[] {
  return WORD_PACKAGES.filter(pkg => pkg.isRecommended);
}

// 工具函数：获取热门套餐
export function getPopularPackage(): WordPackage | undefined {
  return WORD_PACKAGES.find(pkg => pkg.isPopular);
}

// 工具函数：计算折扣百分比
export function getDiscountPercentage(pkg: WordPackage): number {
  if (!pkg.originalPrice) return 0;
  return Math.round((1 - pkg.price / pkg.originalPrice) * 100);
}

// 工具函数：格式化字数显示
export function formatWordCount(words: number): string {
  if (words >= 10000) {
    return `${(words / 10000).toFixed(0)}万`;
  }
  if (words >= 1000) {
    return `${(words / 1000).toFixed(0)}k`;
  }
  return words.toString();
}

// 工具函数：格式化价格显示
export function formatPrice(price: number): string {
  return `$${price}`;
}

// 工具函数：格式化每千字单价
export function formatPricePerThousand(price: number): string {
  return `$${price.toFixed(2)}/1k words`;
}

// 工具函数：按价格排序套餐
export function sortPackagesByPrice(ascending = true): WordPackage[] {
  return [...WORD_PACKAGES].sort((a, b) => 
    ascending ? a.price - b.price : b.price - a.price
  );
}

// 工具函数：按字数排序套餐
export function sortPackagesByWords(ascending = true): WordPackage[] {
  return [...WORD_PACKAGES].sort((a, b) => 
    ascending ? a.words - b.words : b.words - a.words
  );
}

// 工具函数：获取标签显示文本
export function getTagDisplayText(tag: PackageTag): string {
  const tagMap: Record<PackageTag, string> = {
    'HOT': '热门',
    'BEST_VALUE': '超值',
    'NEW': '新品',
    'LIMITED': '限时'
  };
  return tagMap[tag] || tag;
}

// 工具函数：获取标签样式类名
export function getTagClassName(tag: PackageTag): string {
  const classMap: Record<PackageTag, string> = {
    'HOT': 'bg-red-100 text-red-800 border-red-200',
    'BEST_VALUE': 'bg-green-100 text-green-800 border-green-200',
    'NEW': 'bg-blue-100 text-blue-800 border-blue-200',
    'LIMITED': 'bg-purple-100 text-purple-800 border-purple-200'
  };
  return classMap[tag] || 'bg-gray-100 text-gray-800 border-gray-200';
}

// 常量：最小和最大套餐
export const MIN_PACKAGE = WORD_PACKAGES[0];
export const MAX_PACKAGE = WORD_PACKAGES[WORD_PACKAGES.length - 1];

// 常量：套餐统计
export const PACKAGE_STATS = {
  totalPackages: WORD_PACKAGES.length,
  recommendedCount: WORD_PACKAGES.filter(pkg => pkg.isRecommended).length,
  priceRange: {
    min: Math.min(...WORD_PACKAGES.map(pkg => pkg.price)),
    max: Math.max(...WORD_PACKAGES.map(pkg => pkg.price))
  },
  wordRange: {
    min: Math.min(...WORD_PACKAGES.map(pkg => pkg.words)),
    max: Math.max(...WORD_PACKAGES.map(pkg => pkg.words))
  }
};