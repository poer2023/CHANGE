# OrderSummary 订单摘要组件

## 概述

`OrderSummary` 是一个功能完整的订单摘要和付款按钮组件，专为字数套餐购买场景设计。

## 功能特点

- ✅ **卡片式布局**：信息层次清晰，用户体验友好
- ✅ **金额显示**：使用等宽字体（`font-mono`）确保数字对齐
- ✅ **支付按钮**：醒目设计，支持禁用和加载状态
- ✅ **优惠显示**：优惠金额用绿色突出显示
- ✅ **防重复点击**：内置防重复提交保护
- ✅ **错误处理**：完善的错误状态显示
- ✅ **多重优惠**：支持VIP折扣和新用户优惠叠加
- ✅ **支付方式**：灵活的支付方式选择机制
- ✅ **TypeScript**：完整的类型定义和支持
- ✅ **shadcn/ui**：基于现代UI组件库构建

## 基础用法

```tsx
import OrderSummary from "@/components/OrderSummary";
import { CREDIT_PACKAGES } from "@/lib/pricing";

const paymentMethods = [
  {
    id: "wechat",
    name: "微信支付",
    icon: <Smartphone className="h-4 w-4 text-green-500" />,
    description: "安全快捷，支持微信余额和银行卡",
    enabled: true,
  },
  // ... 更多支付方式
];

function PaymentPage() {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("wechat");
  
  const handlePayment = async () => {
    // 处理支付逻辑
  };

  return (
    <OrderSummary
      selectedPackage={CREDIT_PACKAGES[1]} // 选择标准套餐
      paymentMethods={paymentMethods}
      selectedPaymentMethod={selectedPaymentMethod}
      onPaymentMethodChange={setSelectedPaymentMethod}
      onPayment={handlePayment}
    />
  );
}
```

## Props 属性

### 必需属性

| 属性 | 类型 | 描述 |
|------|------|------|
| `selectedPackage` | `CreditPackage` | 选中的套餐信息 |
| `paymentMethods` | `PaymentMethod[]` | 支付方式列表 |
| `selectedPaymentMethod` | `string` | 选中的支付方式ID |
| `onPaymentMethodChange` | `(methodId: string) => void` | 支付方式选择回调 |
| `onPayment` | `() => Promise<void>` | 支付按钮点击回调 |

### 可选属性

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `isProcessing` | `boolean` | `false` | 是否正在处理支付 |
| `error` | `string` | - | 错误信息 |
| `disabled` | `boolean` | `false` | 是否禁用支付按钮 |
| `className` | `string` | - | 自定义样式类名 |
| `vipDiscountRate` | `number` | `0` | VIP折扣率 (0-100) |
| `showNewUserDiscount` | `boolean` | `false` | 是否显示新用户优惠 |

## 类型定义

### PaymentMethod

```tsx
interface PaymentMethod {
  id: string;                    // 支付方式唯一标识
  name: string;                  // 支付方式名称
  icon: React.ReactNode;         // 支付方式图标
  description: string;           // 支付方式描述
  enabled: boolean;              // 是否可用
}
```

### CreditPackage

```tsx
interface CreditPackage {
  id: string;                    // 套餐ID
  name: string;                  // 套餐名称
  words: number;                 // 基础字数
  originalPrice: number;         // 原价
  salePrice: number;             // 售价
  discount: number;              // 折扣百分比
  isPopular?: boolean;           // 是否热门
  bonusWords?: number;           // 赠送字数
  description: string;           // 套餐描述
}
```

## 高级用法

### VIP用户专享折扣

```tsx
<OrderSummary
  selectedPackage={selectedPackage}
  paymentMethods={paymentMethods}
  selectedPaymentMethod={selectedPaymentMethod}
  onPaymentMethodChange={setSelectedPaymentMethod}
  onPayment={handlePayment}
  vipDiscountRate={15} // VIP用户享受15%折扣
/>
```

### 新用户专享优惠

```tsx
<OrderSummary
  selectedPackage={selectedPackage}
  paymentMethods={paymentMethods}
  selectedPaymentMethod={selectedPaymentMethod}
  onPaymentMethodChange={setSelectedPaymentMethod}
  onPayment={handlePayment}
  showNewUserDiscount={true} // 新用户享受额外9折
/>
```

### 多重优惠叠加

```tsx
<OrderSummary
  selectedPackage={selectedPackage}
  paymentMethods={paymentMethods}
  selectedPaymentMethod={selectedPaymentMethod}
  onPaymentMethodChange={setSelectedPaymentMethod}
  onPayment={handlePayment}
  vipDiscountRate={20}        // VIP 20%折扣
  showNewUserDiscount={true}  // 新用户9折
  // 两种优惠可以叠加使用
/>
```

### 错误处理

```tsx
const [error, setError] = useState<string>("");

const handlePayment = async () => {
  try {
    setError(""); // 清除之前的错误
    await processPayment();
  } catch (err) {
    setError(err.message || "支付失败，请稍后重试");
  }
};

<OrderSummary
  // ... 其他props
  error={error}
  onPayment={handlePayment}
/>
```

## 样式定制

组件使用 Tailwind CSS 和 shadcn/ui，支持通过 `className` 属性进行样式定制：

```tsx
<OrderSummary
  className="max-w-lg mx-auto shadow-xl"
  // ... 其他props
/>
```

## 依赖组件

- `Card`, `CardContent`, `CardDescription`, `CardFooter`, `CardHeader`, `CardTitle` from "@/components/ui/card"
- `Button` from "@/components/ui/button"
- `Badge` from "@/components/ui/badge"
- `Separator` from "@/components/ui/separator"
- `Alert`, `AlertDescription` from "@/components/ui/alert"
- Lucide React icons

## 相关工具函数

- `formatPrice` - 格式化价格显示
- `formatWordCount` - 格式化字数显示
- `getTotalWords` - 获取总字数（包含赠送）
- `getPricePerWord` - 计算每字价格

## 示例代码

完整的使用示例请参考 `OrderSummaryExample.tsx` 文件。