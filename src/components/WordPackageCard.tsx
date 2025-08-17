import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Zap, Shield, Clock, Headphones } from "lucide-react"

export interface WordPackageCardProps {
  // 基本信息
  wordCount: number
  price: number
  originalPrice?: number
  currency?: string
  
  // 标签
  tag?: "HOT" | "BEST VALUE" | "POPULAR"
  isRecommended?: boolean
  
  // 权益列表 - 支持字符串数组或权益对象数组
  benefits: string[] | Array<{title: string, description?: string}>
  
  // 状态
  isSelected?: boolean
  isDisabled?: boolean
  
  // 交互
  onClick?: () => void
  
  // 样式
  className?: string
}

const tagConfig = {
  "HOT": {
    label: "HOT",
    className: "bg-red-500 text-white",
    icon: Zap
  },
  "BEST VALUE": {
    label: "BEST VALUE",
    className: "bg-green-500 text-white",
    icon: Star
  },
  "POPULAR": {
    label: "POPULAR",
    className: "bg-blue-500 text-white",
    icon: Star
  }
}

const benefitIcons = {
  "priority": Clock,
  "support": Headphones,
  "guarantee": Shield,
  "quality": Check,
  "default": Check
}

function getBenefitIcon(benefit: string | {title: string, description?: string}) {
  const benefitText = typeof benefit === 'string' ? benefit : benefit.title
  const lowerBenefit = benefitText.toLowerCase()
  if (lowerBenefit.includes("优先") || lowerBenefit.includes("priority")) return benefitIcons.priority
  if (lowerBenefit.includes("客服") || lowerBenefit.includes("support")) return benefitIcons.support
  if (lowerBenefit.includes("保障") || lowerBenefit.includes("guarantee")) return benefitIcons.guarantee
  if (lowerBenefit.includes("质量") || lowerBenefit.includes("quality")) return benefitIcons.quality
  return benefitIcons.default
}

export const WordPackageCard = React.forwardRef<
  HTMLDivElement,
  WordPackageCardProps
>(({
  wordCount,
  price,
  originalPrice,
  currency = "$",
  tag,
  isRecommended = false,
  benefits = [],
  isSelected = false,
  isDisabled = false,
  onClick,
  className,
  ...props
}, ref) => {
  // 计算每千字单价
  const pricePerThousand = (price / (wordCount / 1000)).toFixed(2)
  
  // 格式化字数显示
  const formatWordCount = (count: number) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万字`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K字`
    }
    return `${count}字`
  }

  const tagInfo = tag ? tagConfig[tag] : null
  const TagIcon = tagInfo?.icon

  return (
    <Card
      ref={ref}
      className={cn(
        // 基础样式
        "relative cursor-pointer rounded-2xl border-2 transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-0.5",
        
        // 选中状态
        isSelected && [
          "border-primary bg-primary/5",
          "shadow-lg shadow-primary/20"
        ],
        
        // 未选中状态
        !isSelected && "border-border hover:border-primary/50",
        
        // 推荐状态
        isRecommended && !isSelected && "border-amber-200 bg-amber-50/50",
        
        // 禁用状态
        isDisabled && [
          "cursor-not-allowed opacity-50",
          "hover:transform-none hover:shadow-none"
        ],
        
        className
      )}
      onClick={isDisabled ? undefined : onClick}
      {...props}
    >
      {/* 标签 */}
      {tagInfo && (
        <div className="absolute -top-3 left-6 z-10">
          <Badge 
            className={cn(
              "px-3 py-1 text-xs font-bold tracking-wide",
              tagInfo.className
            )}
          >
            {TagIcon && <TagIcon className="mr-1 h-3 w-3" />}
            {tagInfo.label}
          </Badge>
        </div>
      )}

      {/* 推荐标志 */}
      {isRecommended && !tag && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-white shadow-md">
            <Star className="h-4 w-4 fill-current" />
          </div>
        </div>
      )}

      <CardHeader className="pb-4 pt-8">
        {/* 字数 */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground">
            {formatWordCount(wordCount)}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            字数包
          </p>
        </div>

        {/* 价格 */}
        <div className="text-center mt-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-lg font-medium text-muted-foreground">
              {currency}
            </span>
            <span className="text-4xl font-bold text-foreground">
              {price}
            </span>
          </div>
          
          {/* 原价 */}
          {originalPrice && originalPrice > price && (
            <div className="mt-1">
              <span className="text-sm text-muted-foreground line-through">
                {currency}{originalPrice}
              </span>
            </div>
          )}
          
          {/* 单价 */}
          <p className="text-xs text-muted-foreground mt-2">
            {currency}{pricePerThousand}/千字
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* 权益列表 */}
        {benefits.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">
              包含权益
            </h4>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => {
                const IconComponent = getBenefitIcon(benefit)
                const benefitText = typeof benefit === 'string' ? benefit : benefit.title
                return (
                  <li key={index} className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full",
                      isSelected 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-green-100 text-green-600"
                    )}>
                      <IconComponent className="h-3 w-3" />
                    </div>
                    <span className="text-sm text-foreground">
                      {benefitText}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* 选中指示器 */}
        {isSelected && (
          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-primary/10 py-2">
            <Check className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              已选择此套餐
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

WordPackageCard.displayName = "WordPackageCard"

export default WordPackageCard