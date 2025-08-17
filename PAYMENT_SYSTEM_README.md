# 付费状态管理系统

本项目实现了一个完整的付费状态管理系统，包括信用额度管理、服务定价、VIP等级、充值功能等核心模块。

## 核心文件

### 1. 定价体系 (`src/lib/pricing.ts`)

**主要功能：**
- 定义服务类型和定价配置
- 字数套餐配置和VIP等级系统  
- 定价计算和格式化工具函数

**定价配置：**
- 论文生成：1元/100字
- AI对话：0.5元/100字  
- 文档分析：0.8元/100字
- 智能翻译：0.3元/100字

**套餐配置：**
- 入门套餐：1万字 ¥89
- 标准套餐：3万字 ¥249（最受欢迎）
- 专业套餐：8万字 ¥599
- 企业套餐：20万字 ¥1299
- 无限套餐：50万字 ¥2999

**VIP等级：**
- 普通用户：无折扣
- 青铜会员：累计消费¥100，享受5%折扣
- 白银会员：累计消费¥500，享受10%折扣  
- 黄金会员：累计消费¥1500，享受15%折扣
- 钻石会员：累计消费¥5000，享受20%折扣

### 2. 信用额度上下文 (`src/contexts/CreditContext.tsx`)

**主要功能：**
- 管理用户字数余额和消费记录
- 提供扣费、充值、余额查询等方法
- 使用localStorage进行数据持久化
- 新用户自动赠送500字

**核心接口：**
```typescript
interface CreditContextType {
  state: CreditState;
  consumeCredits: (serviceType: ServiceType, wordCount: number, description: string) => Promise<boolean>;
  addCredits: (rechargeRecord: Omit<RechargeRecord, 'id' | 'timestamp'>) => void;
  getBalance: () => number;
  canAfford: (serviceType: ServiceType, wordCount: number) => boolean;
  getCost: (serviceType: ServiceType, wordCount: number) => number;
  getConsumptionHistory: (limit?: number) => ConsumptionRecord[];
  getRechargeHistory: (limit?: number) => RechargeRecord[];
  getTotalSpending: () => number;
  getVipLevel: () => VipLevel;
  resetUserData: () => void;
}
```

### 3. 服务消费Hook (`src/hooks/useServiceConsumption.ts`)

**主要功能：**
- 封装不同服务类型的消费逻辑
- 提供余额检查和扣费操作
- 包含错误处理和用户提示

**服务专用Hook：**
- `useEssayGeneration` - 论文生成服务
- `useAIChat` - AI对话服务  
- `useDocumentAnalysis` - 文档分析服务
- `useTranslation` - 翻译服务

### 4. UI组件

#### 充值对话框 (`src/components/RechargeDialog.tsx`)
- 展示所有充值套餐
- 支持模拟支付流程
- 显示VIP折扣信息

#### 信用额度显示 (`src/components/CreditDisplay.tsx`)  
- 显示当前余额和VIP状态
- 展示消费和充值历史
- VIP进度条显示

#### 集成示例 (`src/components/AIChat.tsx`)
- 在AI聊天组件中集成付费系统
- 实时显示余额和预估消费
- 余额不足时显示充值提示

## 系统特点

### 1. 完整的状态管理
- 使用React Context进行全局状态管理
- localStorage持久化存储用户数据
- 支持消费记录和充值记录追踪

### 2. 灵活的定价体系
- 支持多种服务类型和定价
- VIP等级系统提供差异化折扣
- 套餐购买提供更优惠的单价

### 3. 良好的用户体验
- 实时余额检查和消费预估
- 友好的错误提示和引导
- 一键充值功能

### 4. 易于扩展
- 模块化设计，易于添加新的服务类型
- 支持动态定价配置
- Hook封装便于在不同组件中复用

## 使用方法

### 1. 基础设置
在`App.tsx`中包装CreditProvider：
```tsx
<AuthProvider>
  <CreditProvider>
    <YourApp />
  </CreditProvider>
</AuthProvider>
```

### 2. 消费字数
```tsx
const { consumeCredits, canAfford } = useCredit();

// 检查余额
if (canAfford('essay_generation', 1000)) {
  // 执行扣费
  const success = await consumeCredits('essay_generation', 1000, '生成论文');
  if (success) {
    // 继续业务逻辑
  }
}
```

### 3. 充值操作
```tsx
const { addCredits } = useCredit();

addCredits({
  packageId: 'standard',
  packageName: '标准套餐',
  wordsAdded: 30000,
  bonusWords: 3000,
  amount: 249,
  status: 'completed'
});
```

### 4. 显示余额
```tsx
const { getBalance, getVipLevel } = useCredit();

return (
  <div>
    <span>余额: {formatWordCount(getBalance())}</span>
    <span>VIP等级: {getVipLevel().name}</span>
  </div>
);
```

## 文件结构

```
src/
├── lib/
│   └── pricing.ts           # 定价体系配置
├── contexts/
│   └── CreditContext.tsx    # 信用额度上下文
├── hooks/
│   └── useServiceConsumption.ts  # 服务消费Hook
└── components/
    ├── CreditDisplay.tsx    # 信用额度显示
    ├── RechargeDialog.tsx   # 充值对话框
    └── AIChat.tsx          # AI聊天组件（集成示例）
```

## 数据模型

### 消费记录
```typescript
interface ConsumptionRecord {
  id: string;
  serviceType: ServiceType;
  wordCount: number;
  cost: number;
  timestamp: number;
  description: string;
  originalCost?: number;
  vipDiscount?: number;
}
```

### 充值记录
```typescript
interface RechargeRecord {
  id: string;
  packageId: string;
  packageName: string;
  wordsAdded: number;
  amount: number;
  timestamp: number;
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed';
  bonusWords?: number;
}
```

这个付费状态管理系统提供了完整的字数计费、VIP等级、充值管理功能，可以很容易地集成到各种AI服务中。