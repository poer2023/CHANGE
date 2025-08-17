import React, { useState } from "react";
import { Smartphone, CreditCard, Wallet, QrCode } from "lucide-react";
import OrderSummary, { PaymentMethod } from "./OrderSummary";
import { CREDIT_PACKAGES } from "@/lib/pricing";

// 示例支付方式配置
const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "wechat",
    name: "微信支付",
    icon: <Smartphone className="h-4 w-4 text-green-500" />,
    description: "安全快捷，支持微信余额和银行卡",
    enabled: true,
  },
  {
    id: "alipay",
    name: "支付宝",
    icon: <Wallet className="h-4 w-4 text-blue-500" />,
    description: "蚂蚁金服提供技术支持",
    enabled: true,
  },
  {
    id: "credit_card",
    name: "银行卡支付",
    icon: <CreditCard className="h-4 w-4 text-gray-600" />,
    description: "支持各大银行信用卡和储蓄卡",
    enabled: true,
  },
  {
    id: "digital_currency",
    name: "数字货币",
    icon: <QrCode className="h-4 w-4 text-orange-500" />,
    description: "支持比特币、以太坊等主流币种",
    enabled: false,
  },
];

const OrderSummaryExample: React.FC = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("wechat");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");

  // 使用标准套餐作为示例
  const selectedPackage = CREDIT_PACKAGES.find(pkg => pkg.id === "standard")!;

  const handlePayment = async () => {
    setError("");
    setIsProcessing(true);
    
    try {
      // 模拟支付处理
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 模拟随机成功/失败
      if (Math.random() > 0.8) {
        throw new Error("支付失败，请稍后重试");
      }
      
      console.log("支付成功！");
      alert("支付成功！");
    } catch (err) {
      setError(err instanceof Error ? err.message : "支付失败");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            OrderSummary 组件示例
          </h1>
          <p className="text-gray-600">
            演示订单摘要和付款按钮组件的各种功能和状态
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 基础版本 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">基础版本</h2>
            <OrderSummary
              selectedPackage={selectedPackage}
              paymentMethods={PAYMENT_METHODS}
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentMethodChange={setSelectedPaymentMethod}
              onPayment={handlePayment}
              isProcessing={isProcessing}
              error={error}
            />
          </div>

          {/* VIP用户版本 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">VIP用户版本</h2>
            <OrderSummary
              selectedPackage={selectedPackage}
              paymentMethods={PAYMENT_METHODS}
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentMethodChange={setSelectedPaymentMethod}
              onPayment={handlePayment}
              isProcessing={isProcessing}
              error={error}
              vipDiscountRate={15}
            />
          </div>

          {/* 新用户版本 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">新用户版本</h2>
            <OrderSummary
              selectedPackage={selectedPackage}
              paymentMethods={PAYMENT_METHODS}
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentMethodChange={setSelectedPaymentMethod}
              onPayment={handlePayment}
              isProcessing={isProcessing}
              error={error}
              showNewUserDiscount={true}
            />
          </div>

          {/* VIP新用户版本 */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">VIP新用户版本</h2>
            <OrderSummary
              selectedPackage={selectedPackage}
              paymentMethods={PAYMENT_METHODS}
              selectedPaymentMethod={selectedPaymentMethod}
              onPaymentMethodChange={setSelectedPaymentMethod}
              onPayment={handlePayment}
              isProcessing={isProcessing}
              error={error}
              vipDiscountRate={20}
              showNewUserDiscount={true}
            />
          </div>
        </div>

        {/* 状态控制面板 */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">状态控制</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setError("")}
              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              清除错误
            </button>
            <button
              onClick={() => setError("网络连接失败，请检查网络设置")}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              模拟错误
            </button>
            <button
              onClick={() => setIsProcessing(!isProcessing)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              切换处理状态
            </button>
          </div>
        </div>

        {/* 功能说明 */}
        <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">组件功能特点</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ 卡片式布局，信息层次清晰</li>
            <li>✅ 金额数字使用等宽字体（font-mono）</li>
            <li>✅ 付款按钮醒目，支持禁用和加载状态</li>
            <li>✅ 优惠金额用绿色突出显示</li>
            <li>✅ 防重复点击保护</li>
            <li>✅ 错误状态显示</li>
            <li>✅ 支持VIP折扣和新用户优惠</li>
            <li>✅ 多种支付方式选择</li>
            <li>✅ 完整的TypeScript支持</li>
            <li>✅ 使用shadcn/ui组件</li>
            <li>✅ 响应式设计</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryExample;