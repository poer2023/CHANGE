import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Segmented } from '@/components/ui/segmented';
import AutopilotInline from './AutopilotInline';
import Countdown from '@/components/shared/Countdown';
import { 
  Calculator, 
  Clock, 
  FileCheck, 
  TrendingUp, 
  Eye,
  Zap,
  ArrowRight,
  Loader2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

type WritingStep = 'topic' | 'research' | 'strategy' | 'outline';
type VerifyLevel = 'Basic' | 'Standard' | 'Pro';

interface OutcomePanelProps {
  step: WritingStep;
  lockedPrice?: { 
    value: number; 
    currency: 'CNY'; 
    expiresAt: number; 
  } | null;
  estimate: {
    priceRange: [number, number];
    etaMinutes: [number, number];
    citesRange: [number, number];
    verifyLevel: VerifyLevel;
  };
  metrics: {
    // Step1 (topic) - always available
    styleSamples?: number;
    
    // Step2 (research)
    sourcesHit?: number;
    verifiableRatio?: number;
    recent5yRatio?: number;
    
    // Step3 (strategy)
    thesisCandidates?: number;
    pickedStructure?: number;
    claimCount?: number;
    
    // Step4 (outline)
    outlineDepth?: number;
    sections?: number;
    perSectionCiteBalance?: number; // 0-100
  };
  addons: Array<'evidencePack' | 'defenseCard' | 'latex' | 'aiCheck' | 'plagiarism' | 'shareLink'>;
  autopilot?: {
    running: boolean;
    step: 'search' | 'strategy' | 'outline' | 'done' | 'error';
    progress: number;
    message?: string;
  };
  error?: string;
  onVerifyChange: (level: VerifyLevel) => void;
  onToggleAddon: (key: string, enabled: boolean) => void;
  onPreviewSample: () => void;
  onPayAndWrite: () => Promise<void>;
  onRetry?: () => void;
}

const OutcomePanel: React.FC<OutcomePanelProps> = ({
  step,
  lockedPrice,
  estimate,
  metrics,
  addons,
  autopilot,
  error,
  onVerifyChange,
  onToggleAddon,
  onPreviewSample,
  onPayAndWrite,
  onRetry
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

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

  const verifyOptions = [
    { value: 'Basic', label: 'Basic' },
    { value: 'Standard', label: 'Standard' },
    { value: 'Pro', label: 'Pro' }
  ];

  const addonConfig = {
    evidencePack: { label: '证据包', price: 15 },
    defenseCard: { label: '答辩卡', price: 25 },
    latex: { label: 'LaTeX导出', price: 10 },
    aiCheck: { label: 'AI检查', price: 20 },
    plagiarism: { label: '查重报告', price: 30 },
    shareLink: { label: '分享链接', price: 5 }
  };

  const handlePayAndWrite = async () => {
    setIsProcessing(true);
    try {
      await onPayAndWrite();
    } finally {
      setIsProcessing(false);
    }
  };

  const renderMetrics = () => {
    const metricCards = [];

    // Step-specific metrics
    if (step === 'topic' && metrics.styleSamples !== undefined) {
      metricCards.push(
        <div key="styleSamples" className="bg-gray-50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <FileCheck className="h-4 w-4 text-[#6E5BFF]" />
            <span className="text-xs font-medium text-gray-700">风格样本</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {metrics.styleSamples} 个文件
          </p>
          <p className="text-xs text-gray-600">已上传</p>
        </div>
      );
    }

    if (step === 'research') {
      if (metrics.sourcesHit !== undefined) {
        metricCards.push(
          <div key="sourcesHit" className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-[#6E5BFF]" />
              <span className="text-xs font-medium text-gray-700">命中文献</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {metrics.sourcesHit} 条
            </p>
            <p className="text-xs text-gray-600">相关度高</p>
          </div>
        );
      }
      
      if (metrics.verifiableRatio !== undefined) {
        metricCards.push(
          <div key="verifiableRatio" className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <FileCheck className="h-4 w-4 text-[#6E5BFF]" />
              <span className="text-xs font-medium text-gray-700">可核验率</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {Math.round(metrics.verifiableRatio)}%
            </p>
            <p className="text-xs text-gray-600">可溯源</p>
          </div>
        );
      }
    }

    if (step === 'strategy') {
      if (metrics.thesisCandidates !== undefined) {
        metricCards.push(
          <div key="thesisCandidates" className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-[#6E5BFF]" />
              <span className="text-xs font-medium text-gray-700">论点候选</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {metrics.thesisCandidates} 个
            </p>
            <p className="text-xs text-gray-600">待筛选</p>
          </div>
        );
      }
      
      if (metrics.claimCount !== undefined) {
        metricCards.push(
          <div key="claimCount" className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <FileCheck className="h-4 w-4 text-[#6E5BFF]" />
              <span className="text-xs font-medium text-gray-700">核心论证</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {metrics.claimCount} 条
            </p>
            <p className="text-xs text-gray-600">已确定</p>
          </div>
        );
      }
    }

    if (step === 'outline') {
      if (metrics.sections !== undefined) {
        metricCards.push(
          <div key="sections" className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-[#6E5BFF]" />
              <span className="text-xs font-medium text-gray-700">章节数量</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {metrics.sections} 个
            </p>
            <p className="text-xs text-gray-600">结构化</p>
          </div>
        );
      }
      
      if (metrics.perSectionCiteBalance !== undefined) {
        metricCards.push(
          <div key="citeBalance" className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <FileCheck className="h-4 w-4 text-[#6E5BFF]" />
              <span className="text-xs font-medium text-gray-700">引用均衡</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {Math.round(metrics.perSectionCiteBalance)}%
            </p>
            <p className="text-xs text-gray-600">分布度</p>
          </div>
        );
      }
    }

    // Always show citation range
    metricCards.push(
      <div key="citations" className="bg-gray-50 rounded-xl p-3">
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
    );

    // Always show ETA
    metricCards.push(
      <div key="eta" className="bg-gray-50 rounded-xl p-3">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4 text-[#6E5BFF]" />
          <span className="text-xs font-medium text-gray-700">预计时长</span>
        </div>
        <p className="text-sm font-semibold text-gray-900">
          {formatTimeRange(estimate.etaMinutes)}
        </p>
        <p className="text-xs text-gray-600">到可导出</p>
      </div>
    );

    return (
      <div className="grid grid-cols-2 gap-3">
        {metricCards}
      </div>
    );
  };

  return (
    <Card className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow duration-200 sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg font-semibold">
          <div className="w-2 h-2 rounded-full bg-[#6E5BFF]"></div>
          <Calculator className="h-5 w-5 text-[#6E5BFF]" />
          预计价值与价格
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 md:p-5 space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
              {onRetry && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className="ml-2 h-6 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  重试
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Autopilot Progress */}
        {autopilot?.running && (
          <AutopilotInline
            currentStep={autopilot.step}
            progress={autopilot.progress}
            message={autopilot.message}
          />
        )}

        {/* A. 价格与锁价 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              {lockedPrice ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#6E5BFF]">
                      {formatPrice(lockedPrice.value)}
                    </span>
                    <Badge className="bg-[#6E5BFF] text-white text-xs">锁定价格</Badge>
                  </div>
                  <Countdown 
                    expiresAt={new Date(lockedPrice.expiresAt).toISOString()} 
                    className="text-xs text-gray-600"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-2xl font-bold text-[#6E5BFF]">
                    {formatPriceRange(estimate.priceRange)}
                  </span>
                  <p className="text-xs text-gray-600">预估价格区间</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-700">核验等级</label>
              <Segmented
                options={verifyOptions}
                value={estimate.verifyLevel}
                onChange={(value) => onVerifyChange(value as VerifyLevel)}
                size="sm"
                className="w-fit"
              />
            </div>
          </div>
        </div>

        {/* B. 交付物清单 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#6E5BFF]" />
            交付物清单
          </h4>
          
          {/* 基础项目 */}
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
          </div>

          {/* 附加项目 */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <span className="text-xs font-medium text-gray-700">附加项目</span>
            {Object.entries(addonConfig).map(([key, config]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={addons.includes(key as any)}
                    onCheckedChange={(enabled) => onToggleAddon(key, enabled)}
                    size="sm"
                  />
                  <span className="text-sm text-gray-700">{config.label}</span>
                </div>
                <span className="text-xs text-gray-500">+¥{config.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* C. 质量预测指标 */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#6E5BFF]" />
            质量预测指标
          </h4>
          {renderMetrics()}
        </div>

        {/* D. 操作区 */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={onPreviewSample}
            className="w-full rounded-full border-[#6E5BFF] text-[#6E5BFF] hover:bg-[#6E5BFF] hover:text-white transition-all duration-200"
          >
            <Eye className="h-4 w-4 mr-2" />
            预览样例片段
          </Button>

          <Button
            type="button"
            onClick={handlePayAndWrite}
            disabled={isProcessing || autopilot?.running}
            className="w-full rounded-full bg-gradient-to-r from-[#6E5BFF] to-[#8B7FFF] hover:from-[#5B4FCC] hover:to-[#7A6FCC] text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                处理中...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                立即写作
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center leading-relaxed">
            此过程不收费。完成后进入结果页，<br />
            正文生成前需付费解锁。
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OutcomePanel;