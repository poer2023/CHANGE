import React, { useState } from "react"
import WordPackageCard from "./WordPackageCard"

// 示例数据
const packageData = [
  {
    id: 1,
    wordCount: 5000,
    price: 29,
    originalPrice: 39,
    tag: "HOT" as const,
    benefits: [
      "24小时内完成",
      "专业编辑服务", 
      "免费修改2次",
      "质量保障"
    ]
  },
  {
    id: 2,
    wordCount: 10000,
    price: 49,
    originalPrice: 69,
    tag: "BEST VALUE" as const,
    isRecommended: true,
    benefits: [
      "48小时内完成",
      "高级编辑服务",
      "免费修改3次", 
      "优先客服支持",
      "格式调整服务"
    ]
  },
  {
    id: 3,
    wordCount: 20000,
    price: 89,
    tag: "POPULAR" as const,
    benefits: [
      "72小时内完成",
      "专家级编辑服务",
      "免费修改5次",
      "VIP客服支持",
      "免费格式调整",
      "赠送查重报告"
    ]
  }
]

export default function WordPackageCardExample() {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          选择字数套餐
        </h2>
        <p className="text-muted-foreground">
          根据您的需求选择合适的字数包，享受专业的编辑服务
        </p>
      </div>

      {/* 响应式网格布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {packageData.map((pkg) => (
          <WordPackageCard
            key={pkg.id}
            wordCount={pkg.wordCount}
            price={pkg.price}
            originalPrice={pkg.originalPrice}
            tag={pkg.tag}
            isRecommended={pkg.isRecommended}
            benefits={pkg.benefits}
            isSelected={selectedPackage === pkg.id}
            onClick={() => setSelectedPackage(pkg.id)}
            className="w-full"
          />
        ))}
      </div>

      {/* 选择结果显示 */}
      {selectedPackage && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-lg bg-green-100 px-4 py-2 text-green-800">
            <span className="font-medium">
              已选择: {packageData.find(p => p.id === selectedPackage)?.wordCount}字套餐
            </span>
          </div>
        </div>
      )}
    </div>
  )
}