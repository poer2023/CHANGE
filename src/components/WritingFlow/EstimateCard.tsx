import React, { useState } from 'react';
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
  ArrowRight,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EstimateCardProps, VerifyLevel } from '@/state/types';

const EstimateCard: React.FC<EstimateCardProps> = ({
  estimate,
  onVerifyLevelChange,
  onPreviewSample,
  onAutopilotClick
}) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatPrice = (price: number): string => `¥${price}`;
  const formatPriceRange = (range: [number, number]): string => 
    `${formatPrice(range[0])}-${formatPrice(range[1])}`;

  const formatTimeRange = (minutes: [number, number]): string => {
    const [min, max] = minutes;
    if (max < 60) {
      return `${min}-${max}分钟`;
    } else {
      const minHours = Math.round(min / 60 * 10) / 10;
      const maxHours = Math.round(max / 60 * 10) / 10;
      return `${minHours}-${maxHours}小时`;
    }
  };

  const getTierInfo = (priceRange: [number, number]) => {
    const avgPrice = (priceRange[0] + priceRange[1]) / 2;
    if (avgPrice < 50) {
      return { label: '经济型', color: 'text-green-600', bgColor: 'bg-green-50' };
    } else if (avgPrice < 150) {
      return { label: '标准型', color: 'text-blue-600', bgColor: 'bg-blue-50' };
    } else {
      return { label: '专业型', color: 'text-purple-600', bgColor: 'bg-purple-50' };
    }
  };

  const hasValidEstimate = estimate.updatedAt > 0 && estimate.priceRange[0] > 0;
  const tierInfo = hasValidEstimate ? getTierInfo(estimate.priceRange) : null;

  const handleVerifyLevelChange = (level: VerifyLevel) => {
    setIsUpdating(true);
    onVerifyLevelChange(level);
    
    // Simulate loading state
    setTimeout(() => setIsUpdating(false), 800);
  };

  return (
    <div className="w-full lg:w-[360px] lg:flex-shrink-0">
      <Card className="bg-white border-[#EEF0F4] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)] sticky top-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-lg font-semibold">
            <div className="w-2 h-2 rounded-full bg-[#6E5BFF]"></div>
            <Calculator className="h-5 w-5 text-[#6E5BFF]" />
            预计价值与价格
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {hasValidEstimate ? (
            <>
              {/* Price Display */}
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  {isUpdating ? (
                    <div className="flex items-center gap-2 text-2xl font-bold text-gray-400">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      更新中...
                    </div>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-[#6E5BFF]">
                        {formatPriceRange(estimate.priceRange)}
                      </span>
                      {tierInfo && (
                        <Badge className={cn("text-xs", tierInfo.color, tierInfo.bgColor)}>
                          {tierInfo.label}
                        </Badge>
                      )}
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  预估价格区间
                </p>
              </div>

              {/* Verification Level Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">核验等级</label>
                <Select value={estimate.verifyLevel} onValueChange={handleVerifyLevelChange}>
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
                    {estimate.citesRange[0]}–{estimate.citesRange[1]} 条
                  </p>
                  <p className="text-xs text-gray-600">
                    核验 {estimate.verifyLevel === 'Pro' ? '100' : estimate.verifyLevel === 'Standard' ? '95' : '85'}%
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-[#6E5BFF]" />
                    <span className="text-xs font-medium text-gray-700">预计时长</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatTimeRange(estimate.etaMinutes)}
                  </p>
                  <p className="text-xs text-gray-600">到可导出</p>
                </div>
              </div>

              {/* Deliverables - 预计可得 */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#6E5BFF]" />
                  预计可得
                </h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6E5BFF] mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">完整初稿 + 结构化大纲</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6E5BFF] mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">
                      {estimate.verifyLevel === 'Pro' ? '深度' : 
                       estimate.verifyLevel === 'Standard' ? '标准' : '基础'}引用核验
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6E5BFF] mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">个性化风格对齐</span>
                  </div>
                  {estimate.verifyLevel === 'Pro' && (
                    <>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#6E5BFF] mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">专业润色建议</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#6E5BFF] mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700">格式标准化检查</span>
                      </div>
                    </>
                  )}
                  {estimate.verifyLevel === 'Standard' && (
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#6E5BFF] mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">基础润色建议</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cost Breakdown Toggle */}
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-[#6E5BFF] transition-colors"
              >
                <span>费用构成与假设</span>
                {showBreakdown ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {/* Breakdown Details */}
              {showBreakdown && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>基于以下假设进行估算：</p>
                    {estimate.assumptions.map((assumption, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{assumption}</span>
                      </div>
                    ))}
                    {estimate.assumptions.length === 0 && (
                      <p>使用标准定价模型</p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPreviewSample}
                  className="w-full rounded-full border-[#6E5BFF] text-[#6E5BFF] hover:bg-[#6E5BFF] hover:text-white transition-all duration-200"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  查看样例片段
                </Button>

                <Button
                  type="button"
                  onClick={onAutopilotClick}
                  className="w-full rounded-full bg-gradient-to-r from-[#6E5BFF] to-[#8B7FFF] hover:from-[#5B4FCC] hover:to-[#7A6FCC] text-white transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  一键 AI 完成
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                此过程不收费。完成后进入结果页，<br />
                正文生成前需付费解锁。
              </p>
            </>
          ) : (
            /* No Data State */
            <div className="text-center py-8 space-y-3">
              <Calculator className="h-12 w-12 text-gray-300 mx-auto" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">等待表单完善</h4>
                <p className="text-xs text-gray-600">
                  填写基本信息后即可查看价格估算
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EstimateCard;