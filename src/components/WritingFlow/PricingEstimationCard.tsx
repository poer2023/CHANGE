import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Clock, 
  FileCheck, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  Zap,
  Eye,
  ArrowRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  calculateWritingFlowPrice, 
  formatPrice, 
  formatPriceRange, 
  formatTimeRange, 
  getTierInfo,
  type VerificationLevel 
} from '@/lib/writingFlowPricing';
import { AssignmentType, CitationStyle, SourceType } from '@/types/writing-flow';

interface PricingEstimationCardProps {
  wordCount: number;
  languageLevel: 'undergrad' | 'postgrad' | 'esl' | 'pro';
  citationStyle: CitationStyle;
  assignmentType: AssignmentType;
  sources: SourceType[];
  hasStyleSamples: boolean;
  title?: string;
  courseName?: string;
  onVerificationLevelChange?: (level: VerificationLevel) => void;
  onSkipToStep4?: () => void;
  onShowPreview?: () => void;
  className?: string;
}

const PricingEstimationCard: React.FC<PricingEstimationCardProps> = ({
  wordCount,
  languageLevel,
  citationStyle,
  assignmentType,
  sources,
  hasStyleSamples,
  title,
  courseName,
  onVerificationLevelChange,
  onSkipToStep4,
  onShowPreview,
  className
}) => {
  const [verificationLevel, setVerificationLevel] = useState<VerificationLevel>('Standard');
  const [showBreakdown, setShowBreakdown] = useState(false);

  const estimation = useMemo(() => {
    if (wordCount <= 0) return null;
    
    try {
      return calculateWritingFlowPrice({
        wordCount,
        languageLevel,
        citationStyle,
        assignmentType,
        sources,
        hasStyleSamples,
        title,
        courseName,
        verificationLevel
      });
    } catch (error) {
      console.error('Pricing calculation error:', error);
      return null;
    }
  }, [
    wordCount,
    languageLevel,
    citationStyle,
    assignmentType,
    sources,
    hasStyleSamples,
    title,
    courseName,
    verificationLevel
  ]);

  const handleVerificationChange = (level: VerificationLevel) => {
    setVerificationLevel(level);
    onVerificationLevelChange?.(level);
  };

  const tierInfo = estimation ? getTierInfo(estimation.tier) : null;

  return (
    <div className={cn("w-[360px] space-y-4", className)}>
      <Card className="bg-white border-[#EEF0F4] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)] sticky top-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <div className="w-2 h-2 rounded-full bg-[#6E5BFF]"></div>
            <Calculator className="h-5 w-5 text-[#6E5BFF]" />
            预估报价
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Price Display */}
          {estimation ? (
            <>
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-[#6E5BFF]">
                    {formatPrice(estimation.finalPrice)}
                  </span>
                  {tierInfo && (
                    <Badge className={cn("text-xs", tierInfo.color, tierInfo.bgColor)}>
                      {tierInfo.label}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  区间: {formatPriceRange(estimation.priceRange.min, estimation.priceRange.max)}
                </p>
              </div>

              {/* Verification Level Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">核验等级</label>
                <Select value={verificationLevel} onValueChange={handleVerificationChange}>
                  <SelectTrigger className="rounded-xl border-[#EEF0F4] focus:border-[#6E5BFF]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic - 基础核验</SelectItem>
                    <SelectItem value="Standard">Standard - 标准核验</SelectItem>
                    <SelectItem value="Pro">Pro - 专业核验</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FileCheck className="h-4 w-4 text-[#6E5BFF]" />
                    <span className="text-xs font-medium text-gray-700">预计引用</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {estimation.estimatedCitations.min}–{estimation.estimatedCitations.max} 条
                  </p>
                  <p className="text-xs text-gray-600">核验 {estimation.verificationCoverage}%</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-[#6E5BFF]" />
                    <span className="text-xs font-medium text-gray-700">预计时长</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatTimeRange(estimation.estimatedTime.min, estimation.estimatedTime.max)}
                  </p>
                  <p className="text-xs text-gray-600">到可导出</p>
                </div>
              </div>

              {/* Deliverables */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#6E5BFF]" />
                  预计可得
                </h4>
                <div className="space-y-2">
                  {estimation.deliverables.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#6E5BFF] mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Breakdown Toggle */}
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-[#6E5BFF] transition-colors"
              >
                <span>费用构成详情</span>
                {showBreakdown ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {/* Breakdown Details */}
              {showBreakdown && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">基础费用</span>
                    <span className="font-medium">{formatPrice(estimation.breakdown.base)}</span>
                  </div>
                  {estimation.breakdown.complexity > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">复杂度调整</span>
                      <span className="font-medium">+{formatPrice(estimation.breakdown.complexity)}</span>
                    </div>
                  )}
                  {estimation.breakdown.verification > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">核验等级</span>
                      <span className="font-medium">+{formatPrice(estimation.breakdown.verification)}</span>
                    </div>
                  )}
                  {estimation.breakdown.resources > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">资源类型</span>
                      <span className="font-medium">+{formatPrice(estimation.breakdown.resources)}</span>
                    </div>
                  )}
                  {estimation.breakdown.style > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">风格对齐</span>
                      <span className="font-medium">+{formatPrice(estimation.breakdown.style)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-100">
                    <span>总计</span>
                    <span className="text-[#6E5BFF]">{formatPrice(estimation.finalPrice)}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                {onShowPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onShowPreview}
                    className="w-full rounded-full border-[#6E5BFF] text-[#6E5BFF] hover:bg-[#6E5BFF] hover:text-white transition-all duration-200"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    查看样例片段
                  </Button>
                )}

                {onSkipToStep4 && (
                  <Button
                    type="button"
                    onClick={onSkipToStep4}
                    className="w-full rounded-full bg-gradient-to-r from-[#6E5BFF] to-[#8B7FFF] hover:from-[#5B4FCC] hover:to-[#7A6FCC] text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    一键跳过 2-4 步
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                到 Step4 才会"锁定报价"<br />
                真正付费在开始生成前
              </p>
            </>
          ) : (
            /* No Data State */
            <div className="text-center py-8 space-y-3">
              <Calculator className="h-12 w-12 text-gray-300 mx-auto" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">等待表单完善</h4>
                <p className="text-xs text-gray-600">
                  填写字数要求后即可查看报价估算
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingEstimationCard;