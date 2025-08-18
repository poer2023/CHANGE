import React, { useState, useId } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Infinity, 
  Headphones,
  CheckCircle,
  Loader2,
  CreditCard,
  Star
} from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { useCredit } from '@/contexts/CreditContext';

// 套餐配置
const PACKAGES = [
  {
    id: 'starter',
    title: 'Starter',
    words: '50k words',
    price: '$29',
    per: '$5.80 / 1k words',
    description: '入门体验，轻量使用',
    features: [
      '一次性购买字数不过期',
      '不限文档数量',
      '基础队列优先级',
      '邮件客服支持'
    ],
    variant: 'base',
    ctaColor: 'primary'
  },
  {
    id: 'popular',
    title: 'Popular',
    words: '120k words',
    price: '$49',
    per: '$4.08 / 1k words',
    description: '最受欢迎，性价比最佳',
    features: [
      '字数不过期',
      '不限文档数量',
      '高峰时段优先队列',
      '专属问题反馈通道'
    ],
    badge: 'HOT',
    variant: 'hot',
    ctaColor: 'hot'
  },
  {
    id: 'premium',
    title: 'Premium',
    words: '300k words',
    price: '$99',
    per: '$3.30 / 1k words',
    description: '高频用户，批量创作更省',
    features: [
      '字数不过期',
      '不限文档数量',
      '最高优先级队列',
      '新功能优先体验'
    ],
    variant: 'premium',
    ctaColor: 'green'
  }
];

// 优势说明配置
const BENEFITS = [
  {
    icon: Shield,
    title: '安全支付',
    note: 'SSL & SCA'
  },
  {
    icon: Infinity,
    title: '永不过期',
    note: '字数随用随扣'
  },
  {
    icon: Headphones,
    title: '优先客服',
    note: '7x24 邮件支持'
  }
];

interface PlanCardProps {
  title: string;
  words: string;
  price: string;
  per: string;
  features: string[];
  badge?: string;
  variant?: 'base' | 'hot' | 'premium';
  ctaColor?: 'primary' | 'hot' | 'green';
  description: string;
  onSelect: () => void;
  isSelected: boolean;
  isProcessing: boolean;
}

function PlanCard({ 
  title, 
  words, 
  price, 
  per, 
  features, 
  badge, 
  variant = 'base', 
  ctaColor = 'primary',
  description,
  onSelect,
  isSelected,
  isProcessing
}: PlanCardProps) {
  const gid = useId(); // 每张卡唯一的 gradient id
  const baseClasses = "relative rounded-2xl bg-white p-6 flex flex-col justify-between border border-slate-200 shadow-[0_6px_24px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)] min-h-[500px]";
  
  const variantClasses = {
    base: baseClasses,
    hot: `${baseClasses.replace('border border-slate-200', '')} plan-card hot`,
    premium: `${baseClasses} ring-1 ring-green-200`
  };

  const buttonClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    hot: "bg-gradient-to-r from-[#FF8A4C] to-[#FF4D8D] text-white",
    green: "bg-emerald-600 hover:bg-emerald-700 text-white"
  };

  return (
    <div className={variantClasses[variant]}>
      {badge === "HOT" && <div className="badge-hot">HOT</div>}
      
      {/* 流动细光边 */}
      {variant === 'hot' && (
        <svg
          className="hot-border"
          viewBox="0 0 100 100" 
          preserveAspectRatio="none" 
          aria-hidden="true"
        >
          {/* 1) 静态底轮廓：超细，低饱和 */}
          <rect 
            x="1" 
            y="1" 
            width="98" 
            height="98" 
            rx="8"
            fill="none" 
            stroke="rgba(99,102,241,.25)" 
            strokeWidth="1"
          />

          <defs>
            {/* 彩色渐变，提亮饱和度 */}
            <linearGradient 
              id={`hot-grad-${gid}`} 
              x1="0" 
              y1="0" 
              x2="100" 
              y2="0" 
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFC9A3"/>
              <stop offset="35%" stopColor="#FF77B4"/>
              <stop offset="65%" stopColor="#8B5CF6"/>
              <stop offset="100%" stopColor="#45E0FF"/>
            </linearGradient>

            {/* 柔光：让彩色段"发光" */}
            <filter id={`soft-glow-${gid}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.4" result="b"/>
              <feMerge>
                <feMergeNode in="b"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* 高光针：白色小光点，增强"闪"的感觉 */}
            <filter id={`glint-${gid}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="1.2"/>
              </feComponentTransfer>
            </filter>
          </defs>

          {/* 2) 主彩色细光带：1.6px，沿边流动 */}
          <rect
            className="hot-dash"
            x="1" 
            y="1" 
            width="98" 
            height="98" 
            rx="8"
            fill="none" 
            stroke={`url(#hot-grad-${gid})`} 
            strokeWidth="1.6" 
            pathLength={1000}
            filter={`url(#soft-glow-${gid})`}
          />

          {/* 3) 白色高光针：0.8px，更快一层，叠加更亮 */}
          <rect
            className="hot-glint"
            x="1" 
            y="1" 
            width="98" 
            height="98" 
            rx="8"
            fill="none" 
            stroke="#fff" 
            strokeWidth="0.8" 
            strokeOpacity="0.95"
            pathLength={1000}
            filter={`url(#glint-${gid})`}
          />
        </svg>
      )}

      <div className="flex-1">
        <header className="text-center space-y-1 mb-6">
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mb-4">{description}</p>
          <div className="text-5xl font-extrabold tracking-tight text-slate-900">{words}</div>
          <div className="text-sm uppercase tracking-wide text-slate-500">字数</div>
          <div className="mt-3 text-3xl font-bold">{price}</div>
          <div className="text-xs text-slate-500">{per}</div>
        </header>

        <hr className="my-5 border-slate-200" />

        <ul className="space-y-3 text-sm text-slate-700">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 mt-0.5 text-emerald-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <Button 
          className={`w-full h-11 rounded-xl ${buttonClasses[ctaColor]} font-medium transition-all duration-200`}
          onClick={onSelect}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              处理中...
            </>
          ) : (
            'Pay with Stripe'
          )}
        </Button>
        <p className="mt-2 text-center text-[11px] text-slate-400">
          Secure payment powered by Stripe
        </p>
      </div>
    </div>
  );
}

interface BenefitProps {
  icon: React.ElementType;
  title: string;
  note: string;
}

function Benefit({ icon: Icon, title, note }: BenefitProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-slate-500" />
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-slate-500">{note}</div>
      </div>
    </div>
  );
}

const TopUp: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { recharge } = useCredit();

  const handlePackageSelect = async (packageId: string) => {
    setSelectedPackage(packageId);
    setIsProcessing(true);

    try {
      const pkg = PACKAGES.find(p => p.id === packageId);
      if (!pkg) return;

      // 模拟支付处理
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = await recharge(packageId, 'Stripe');
      
      if (success) {
        toast({
          title: "充值成功",
          description: `已成功充值${pkg.words}字数`,
        });
      } else {
        toast({
          title: "充值失败",
          description: "支付失败，请重试",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "充值失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setSelectedPackage(null);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="mx-auto max-w-[1120px] px-4 py-10">
            {/* 页面标题 */}
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold text-slate-900 mb-3">Word Credits</h1>
              <p className="text-slate-500 text-lg">Choose the plan that fits your workload</p>
            </header>

            {/* 三卡布局 */}
            <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 mb-12">
              {PACKAGES.map((pkg) => (
                <PlanCard
                  key={pkg.id}
                  title={pkg.title}
                  words={pkg.words}
                  price={pkg.price}
                  per={pkg.per}
                  features={pkg.features}
                  badge={pkg.badge}
                  variant={pkg.variant as any}
                  ctaColor={pkg.ctaColor as any}
                  description={pkg.description}
                  onSelect={() => handlePackageSelect(pkg.id)}
                  isSelected={selectedPackage === pkg.id}
                  isProcessing={isProcessing && selectedPackage === pkg.id}
                />
              ))}
            </div>

            {/* 优势说明条 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl bg-slate-50 p-6 border border-slate-200">
              {BENEFITS.map((benefit, index) => (
                <Benefit
                  key={index}
                  icon={benefit.icon}
                  title={benefit.title}
                  note={benefit.note}
                />
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TopUp;