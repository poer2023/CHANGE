import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ServiceType, calculateServiceCost, getVipLevel, applyVipDiscount, VipLevel } from '@/lib/pricing';

// 交易记录类型
export interface TransactionRecord {
  id: string;
  type: 'recharge' | 'usage' | 'bonus' | 'refund';
  serviceType?: ServiceType;
  amount: number; // 金额（元）
  wordCount: number; // 字数变动
  balance: number; // 交易后余额
  description: string;
  createdAt: Date;
  metadata?: {
    packageId?: string;
    paymentMethod?: string;
    essayId?: string;
    essayTitle?: string;
    originalAmount?: number; // 原价
    discountAmount?: number; // 折扣金额
    vipLevel?: number;
  };
}

// 用户余额信息
export interface CreditBalance {
  wordBalance: number; // 字数余额
  totalSpent: number; // 累计消费金额
  totalRecharged: number; // 累计充值金额
  vipLevel: VipLevel;
  lastUpdated: Date;
}

// 充值历史记录
export interface RechargeRecord {
  id: string;
  packageId: string;
  packageName: string;
  amount: number;
  wordCount: number;
  bonusWords: number;
  paymentMethod: string;
  status: 'pending' | 'success' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}

// 使用统计
export interface UsageStats {
  totalWords: number;
  totalAmount: number;
  serviceCounts: Record<ServiceType, { count: number; words: number; amount: number }>;
  monthlyStats: { month: string; words: number; amount: number }[];
}

interface CreditContextType {
  balance: CreditBalance;
  transactions: TransactionRecord[];
  rechargeHistory: RechargeRecord[];
  usageStats: UsageStats;
  isLoading: boolean;
  
  // 消费相关方法
  consumeCredits: (serviceType: ServiceType, wordCount: number, metadata?: any) => Promise<boolean>;
  
  // 充值相关方法
  recharge: (packageId: string, paymentMethod: string) => Promise<boolean>;
  
  // 查询方法
  getTransactionHistory: (type?: TransactionRecord['type'], startDate?: Date, endDate?: Date) => TransactionRecord[];
  getUsageByService: (serviceType: ServiceType) => { count: number; words: number; amount: number };
  
  // 工具方法
  canAfford: (serviceType: ServiceType, wordCount: number) => boolean;
  getEstimatedCost: (serviceType: ServiceType, wordCount: number) => number;
  getCost: (serviceType: ServiceType, wordCount: number) => number;
  getBalance: () => number;
  refreshBalance: () => Promise<void>;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

export const useCredit = () => {
  const context = useContext(CreditContext);
  if (context === undefined) {
    throw new Error('useCredit must be used within a CreditProvider');
  }
  return context;
};

// 模拟数据
const mockTransactions: TransactionRecord[] = [
  {
    id: '1',
    type: 'bonus',
    amount: 0,
    wordCount: 500,
    balance: 500,
    description: '新用户注册赠送',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    type: 'recharge',
    amount: 249,
    wordCount: 33000,
    balance: 33500,
    description: '标准套餐充值',
    createdAt: new Date('2024-01-02'),
    metadata: {
      packageId: 'standard',
      paymentMethod: '支付宝',
      originalAmount: 300,
      discountAmount: 51,
    },
  },
  {
    id: '3',
    type: 'usage',
    serviceType: 'essay_generation',
    amount: 12,
    wordCount: -1200,
    balance: 32300,
    description: 'AI论文生成',
    createdAt: new Date('2024-01-03'),
    metadata: {
      essayId: '1',
      essayTitle: 'AI与教育的未来发展',
    },
  },
  {
    id: '4',
    type: 'usage',
    serviceType: 'ai_chat',
    amount: 2.5,
    wordCount: -500,
    balance: 31800,
    description: 'AI对话咨询',
    createdAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    type: 'usage',
    serviceType: 'document_analysis',
    amount: 4,
    wordCount: -500,
    balance: 31300,
    description: '文档分析服务',
    createdAt: new Date('2024-01-05'),
  },
];

const mockRechargeHistory: RechargeRecord[] = [
  {
    id: '1',
    packageId: 'standard',
    packageName: '标准套餐',
    amount: 249,
    wordCount: 30000,
    bonusWords: 3000,
    paymentMethod: '支付宝',
    status: 'success',
    createdAt: new Date('2024-01-02'),
    completedAt: new Date('2024-01-02'),
  },
];

export const CreditProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState<CreditBalance>({
    wordBalance: 31300,
    totalSpent: 18.5,
    totalRecharged: 249,
    vipLevel: getVipLevel(249),
    lastUpdated: new Date(),
  });
  
  const [transactions, setTransactions] = useState<TransactionRecord[]>(mockTransactions);
  const [rechargeHistory, setRechargeHistory] = useState<RechargeRecord[]>(mockRechargeHistory);
  const [isLoading, setIsLoading] = useState(false);

  // 计算使用统计
  const usageStats: UsageStats = React.useMemo(() => {
    const usageTransactions = transactions.filter(t => t.type === 'usage');
    const totalWords = usageTransactions.reduce((sum, t) => sum + Math.abs(t.wordCount), 0);
    const totalAmount = usageTransactions.reduce((sum, t) => sum + t.amount, 0);
    
    const serviceCounts: Record<ServiceType, { count: number; words: number; amount: number }> = {
      essay_generation: { count: 0, words: 0, amount: 0 },
      ai_chat: { count: 0, words: 0, amount: 0 },
      document_analysis: { count: 0, words: 0, amount: 0 },
      translation: { count: 0, words: 0, amount: 0 },
      ai_detection: { count: 0, words: 0, amount: 0 },
      plagiarism_detection: { count: 0, words: 0, amount: 0 },
    };

    usageTransactions.forEach(t => {
      if (t.serviceType) {
        serviceCounts[t.serviceType].count++;
        serviceCounts[t.serviceType].words += Math.abs(t.wordCount);
        serviceCounts[t.serviceType].amount += t.amount;
      }
    });

    // 月度统计（简化版，实际应用中可能需要更复杂的逻辑）
    const monthlyStats = [
      { month: '2024-01', words: totalWords, amount: totalAmount },
    ];

    return {
      totalWords,
      totalAmount,
      serviceCounts,
      monthlyStats,
    };
  }, [transactions]);

  // 消费字数
  const consumeCredits = useCallback(async (serviceType: ServiceType, wordCount: number, metadata?: any): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 计算费用
      const cost = getEstimatedCost(serviceType, wordCount);
      
      // 检查余额
      if (balance.wordBalance < wordCount) {
        setIsLoading(false);
        return false;
      }
      
      // 创建消费记录
      const newTransaction: TransactionRecord = {
        id: Date.now().toString(),
        type: 'usage',
        serviceType,
        amount: cost,
        wordCount: -wordCount,
        balance: balance.wordBalance - wordCount,
        description: `${serviceType === 'essay_generation' ? 'AI论文生成' : 
                      serviceType === 'ai_chat' ? 'AI对话咨询' :
                      serviceType === 'document_analysis' ? '文档分析服务' : '智能翻译服务'}`,
        createdAt: new Date(),
        metadata,
      };
      
      // 更新状态
      setTransactions(prev => [newTransaction, ...prev]);
      setBalance(prev => ({
        ...prev,
        wordBalance: prev.wordBalance - wordCount,
        totalSpent: prev.totalSpent + cost,
        vipLevel: getVipLevel(prev.totalSpent + cost),
        lastUpdated: new Date(),
      }));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('消费失败:', error);
      setIsLoading(false);
      return false;
    }
  }, [balance.wordBalance]);

  // 充值
  const recharge = useCallback(async (packageId: string, paymentMethod: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // 模拟支付过程
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 这里应该调用实际的支付API
      // 模拟成功的充值
      const mockPackageData = {
        standard: { name: '标准套餐', amount: 249, words: 30000, bonus: 3000 },
        professional: { name: '专业套餐', amount: 599, words: 80000, bonus: 12000 },
      }[packageId] || { name: '未知套餐', amount: 0, words: 0, bonus: 0 };
      
      const totalWords = mockPackageData.words + mockPackageData.bonus;
      
      // 创建充值记录
      const newRecharge: RechargeRecord = {
        id: Date.now().toString(),
        packageId,
        packageName: mockPackageData.name,
        amount: mockPackageData.amount,
        wordCount: mockPackageData.words,
        bonusWords: mockPackageData.bonus,
        paymentMethod,
        status: 'success',
        createdAt: new Date(),
        completedAt: new Date(),
      };
      
      // 创建交易记录
      const newTransaction: TransactionRecord = {
        id: Date.now().toString(),
        type: 'recharge',
        amount: mockPackageData.amount,
        wordCount: totalWords,
        balance: balance.wordBalance + totalWords,
        description: `${mockPackageData.name}充值`,
        createdAt: new Date(),
        metadata: {
          packageId,
          paymentMethod,
          originalAmount: mockPackageData.amount,
        },
      };
      
      // 更新状态
      setRechargeHistory(prev => [newRecharge, ...prev]);
      setTransactions(prev => [newTransaction, ...prev]);
      setBalance(prev => ({
        ...prev,
        wordBalance: prev.wordBalance + totalWords,
        totalRecharged: prev.totalRecharged + mockPackageData.amount,
        vipLevel: getVipLevel(prev.totalRecharged + mockPackageData.amount),
        lastUpdated: new Date(),
      }));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('充值失败:', error);
      setIsLoading(false);
      return false;
    }
  }, [balance]);

  // 获取交易历史
  const getTransactionHistory = useCallback((type?: TransactionRecord['type'], startDate?: Date, endDate?: Date): TransactionRecord[] => {
    let filtered = transactions;
    
    if (type) {
      filtered = filtered.filter(t => t.type === type);
    }
    
    if (startDate) {
      filtered = filtered.filter(t => t.createdAt >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(t => t.createdAt <= endDate);
    }
    
    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [transactions]);

  // 获取特定服务的使用情况
  const getUsageByService = useCallback((serviceType: ServiceType) => {
    return usageStats.serviceCounts[serviceType];
  }, [usageStats]);

  // 检查是否有足够余额
  const canAfford = useCallback((serviceType: ServiceType, wordCount: number): boolean => {
    return balance.wordBalance >= wordCount;
  }, [balance.wordBalance]);

  // 获取预估费用
  const getEstimatedCost = useCallback((serviceType: ServiceType, wordCount: number): number => {
    const baseCost = calculateServiceCost(serviceType, wordCount);
    return applyVipDiscount(baseCost, balance.vipLevel);
  }, [balance.vipLevel]);

  // 获取当前余额
  const getBalance = useCallback((): number => {
    return balance.wordBalance;
  }, [balance.wordBalance]);

  // getCost 别名方法，保持向后兼容
  const getCost = useCallback((serviceType: ServiceType, wordCount: number): number => {
    return getEstimatedCost(serviceType, wordCount);
  }, [getEstimatedCost]);

  // 刷新余额
  const refreshBalance = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 这里应该从服务器获取最新的余额信息
      // 现在只是更新时间戳
      setBalance(prev => ({
        ...prev,
        lastUpdated: new Date(),
      }));
    } catch (error) {
      console.error('刷新余额失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    balance,
    transactions,
    rechargeHistory,
    usageStats,
    isLoading,
    consumeCredits,
    recharge,
    getTransactionHistory,
    getUsageByService,
    canAfford,
    getEstimatedCost,
    getCost,
    getBalance,
    refreshBalance,
  };

  return (
    <CreditContext.Provider value={value}>
      {children}
    </CreditContext.Provider>
  );
};