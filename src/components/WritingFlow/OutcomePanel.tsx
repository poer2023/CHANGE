import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AutopilotInline from './AutopilotInline';
import Countdown from '@/components/shared/Countdown';
import CardWrapper from '@/components/shared/CardWrapper';
import { 
  Calculator, 
  Clock, 
  FileCheck, 
  TrendingUp, 
  Eye,
  Zap,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Target,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

type WritingStep = 'topic' | 'research' | 'strategy' | 'outline';
type VerifyLevel = 'Basic' | 'Standard' | 'Pro';
type Addon = 'evidencePack' | 'defenseCard' | 'latex' | 'aiCheck' | 'plagiarism' | 'shareLink';

interface OutcomeMetrics {
  // Step-specific metrics
  sourcesHit?: number;
  verifiableRatio?: number; 
  recent5yRatio?: number;
  thesisCandidates?: number;
  pickedStructure?: number;
  claimCount?: number;
  outlineDepth?: number;
  sections?: number;
  perSectionCiteBalance?: number;
  styleSamples?: number;
}

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
  metrics?: OutcomeMetrics;
  addons: Addon[];
  autopilot?: {
    running: boolean;
    step: 'search' | 'strategy' | 'outline' | 'done' | 'error';
    progress: number;
    message?: string;
  };
  error?: string;
  onVerifyChange: (level: VerifyLevel) => void;
  onToggleAddon: (key: Addon, enabled: boolean) => void;
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
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatTimeRange = (minutes: [number, number]): string => {
    const [min, max] = minutes;
    if (max < 60) {
      return t('outcome.time.minutes', { min, max });
    } else {
      const minHours = Math.round(min / 60 * 10) / 10;
      const maxHours = Math.round(max / 60 * 10) / 10;
      return t('outcome.time.hours', { min: minHours, max: maxHours });
    }
  };

  const addonConfig = {
    evidencePack: { label: t('outcome.addons.evidence_pack'), price: 15 },
    defenseCard: { label: t('outcome.addons.defense_card'), price: 25 },
    latex: { label: t('outcome.addons.latex'), price: 10 },
    aiCheck: { label: t('outcome.addons.ai_check'), price: 20 },
    plagiarism: { label: t('outcome.addons.plagiarism'), price: 30 },
    shareLink: { label: t('outcome.addons.share_link'), price: 5 }
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
    if (step === 'topic' && metrics?.styleSamples !== undefined) {
      metricCards.push(
        <div key="styleSamples" className="bg-transparent p-2">
          <div className="flex items-center gap-2 mb-1">
            <FileCheck className="h-4 w-4 text-[#6A5AF9]" />
            <span className="text-xs font-medium text-slate-700">{t('outcome.metrics.style_samples')}</span>
          </div>
          <p className="text-lg font-semibold text-slate-900">
            {metrics.styleSamples}
          </p>
          <p className="text-xs text-slate-600">{metrics.styleSamples}{t('outcome.metrics.style_samples_desc')}</p>
        </div>
      );
    }

    if (step === 'research') {
      if (metrics?.sourcesHit !== undefined) {
        metricCards.push(
          <div key="sourcesHit" className="bg-transparent p-2">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-[#6A5AF9]" />
              <span className="text-xs font-medium text-slate-700">{t('outcome.metrics.sources_hit')}</span>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {metrics.sourcesHit}
            </p>
            <p className="text-xs text-slate-600">{metrics.sourcesHit}{t('outcome.metrics.sources_hit_desc')}</p>
          </div>
        );
      }
      
      if (metrics?.verifiableRatio !== undefined) {
        metricCards.push(
          <div key="verifiableRatio" className="bg-transparent p-2">
            <div className="flex items-center gap-2 mb-1">
              <FileCheck className="h-4 w-4 text-[#6A5AF9]" />
              <span className="text-xs font-medium text-slate-700">{t('outcome.metrics.verifiable')}</span>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {Math.round(metrics.verifiableRatio)}%
            </p>
            <p className="text-xs text-slate-600">{Math.round(metrics.verifiableRatio)}%{t('outcome.metrics.verifiable_desc')}</p>
          </div>
        );
      }
      
      if (metrics?.recent5yRatio !== undefined) {
        metricCards.push(
          <div key="recent5yRatio" className="bg-transparent p-2">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-[#6A5AF9]" />
              <span className="text-xs font-medium text-slate-700">{t('outcome.metrics.recent_5y')}</span>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {Math.round(metrics.recent5yRatio)}%
            </p>
            <p className="text-xs text-slate-600">{Math.round(metrics.recent5yRatio)}%{t('outcome.metrics.recent_5y_desc')}</p>
          </div>
        );
      }
    }

    if (step === 'strategy') {
      if (metrics?.thesisCandidates !== undefined) {
        metricCards.push(
          <div key="thesisCandidates" className="bg-transparent p-2">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-[#6A5AF9]" />
              <span className="text-xs font-medium text-slate-700">{t('outcome.metrics.thesis_candidates')}</span>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {metrics.thesisCandidates}
            </p>
            <p className="text-xs text-slate-600">{metrics.thesisCandidates}{t('outcome.metrics.thesis_candidates_desc')}</p>
          </div>
        );
      }
      
      if (metrics?.pickedStructure !== undefined) {
        metricCards.push(
          <div key="pickedStructure" className="bg-transparent p-2">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="h-4 w-4 text-[#6A5AF9]" />
              <span className="text-xs font-medium text-slate-700">{t('outcome.metrics.picked_structure')}</span>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {metrics.pickedStructure}
            </p>
            <p className="text-xs text-slate-600">{metrics.pickedStructure}{t('outcome.metrics.picked_structure_desc')}</p>
          </div>
        );
      }
      
      if (metrics?.claimCount !== undefined) {
        metricCards.push(
          <div key="claimCount" className="bg-transparent p-2">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-[#6A5AF9]" />
              <span className="text-xs font-medium text-slate-700">{t('outcome.metrics.claim_count')}</span>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {metrics.claimCount}
            </p>
            <p className="text-xs text-slate-600">{metrics.claimCount}{t('outcome.metrics.claim_count_desc')}</p>
          </div>
        );
      }
    }

    if (step === 'outline') {
      if (metrics?.outlineDepth !== undefined) {
        metricCards.push(
          <div key="outlineDepth" className="bg-transparent p-2">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-[#6A5AF9]" />
              <span className="text-xs font-medium text-slate-700">{t('outcome.metrics.outline_depth')}</span>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {metrics.outlineDepth}
            </p>
            <p className="text-xs text-slate-600">{metrics.outlineDepth}{t('outcome.metrics.outline_depth_desc')}</p>
          </div>
        );
      }
      
      if (metrics?.sections !== undefined) {
        metricCards.push(
          <div key="sections" className="bg-transparent p-2">
            <div className="flex items-center gap-2 mb-1">
              <FileCheck className="h-4 w-4 text-[#6A5AF9]" />
              <span className="text-xs font-medium text-slate-700">{t('outcome.metrics.sections')}</span>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {metrics.sections}
            </p>
            <p className="text-xs text-slate-600">{metrics.sections}{t('outcome.metrics.sections_desc')}</p>
          </div>
        );
      }
      
      if (metrics?.perSectionCiteBalance !== undefined) {
        metricCards.push(
          <div key="citeBalance" className="bg-transparent p-2">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="h-4 w-4 text-[#6A5AF9]" />
              <span className="text-xs font-medium text-slate-700">{t('outcome.metrics.citation_balance')}</span>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {Math.round(metrics.perSectionCiteBalance)}%
            </p>
            <p className="text-xs text-slate-600">{Math.round(metrics.perSectionCiteBalance)}%{t('outcome.metrics.citation_balance_desc')}</p>
          </div>
        );
      }
    }

    // Always show citation range and ETA
    metricCards.push(
      <div key="citations" className="bg-transparent p-2">
        <div className="flex items-center gap-2 mb-1">
          <FileCheck className="h-4 w-4 text-[#6A5AF9]" />
          <span className="text-xs font-medium text-slate-700">{t('outcome.metrics.expected_citations')}</span>
        </div>
        <p className="text-lg font-semibold text-slate-900">
          {estimate.citesRange[0]}–{estimate.citesRange[1]}
        </p>
        <p className="text-xs text-slate-600">
          {t('outcome.metrics.expected_citations_desc', { rate: estimate.verifyLevel === 'Pro' ? '100' : estimate.verifyLevel === 'Standard' ? '95' : '85' })}
        </p>
      </div>
    );

    metricCards.push(
      <div key="eta" className="bg-transparent p-2">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4 text-[#6A5AF9]" />
          <span className="text-xs font-medium text-slate-700">{t('outcome.metrics.estimated_time')}</span>
        </div>
        <p className="text-lg font-semibold text-slate-900">
          {formatTimeRange(estimate.etaMinutes)}
        </p>
        <p className="text-xs text-slate-600">{t('outcome.metrics.eta')}</p>
      </div>
    );

    return (
      <div className="grid grid-cols-2 gap-3">
        {metricCards}
      </div>
    );
  };

  return (
    <CardWrapper className="space-y-4 md:space-y-5">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
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
                {t('outcome.buttons.retry')}
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Autopilot Progress */}
      {autopilot?.running && (
        <div className="pb-4">
          <AutopilotInline
            currentStep={autopilot.step}
            progress={autopilot.progress}
            message={autopilot.message}
            variant="ghost"
          />
        </div>
      )}

      {/* A. 价格与锁价 */}
      <div className="border-t border-slate-200/70 pt-4 first:border-t-0 first:pt-0">
        <div className="flex items-start justify-between">
          <div>
            {lockedPrice ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[15px] font-semibold text-slate-900">
                    {t('outcome.price.locked', { price: lockedPrice.value })}
                  </span>
                  <Badge className="bg-slate-100 text-slate-700 text-xs">{t('outcome.price.locked_badge')}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Countdown 
                    expiresAt={new Date(lockedPrice.expiresAt).toISOString()} 
                    className="text-sm text-slate-600"
                  />
                  <button className="text-xs text-[#6A5AF9] underline hover:text-[#5A4ACF]">
                    {t('outcome.price.relock')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-[15px] font-semibold text-slate-900">
                  {t('outcome.price.estimated', { min: estimate.priceRange[0], max: estimate.priceRange[1] })}
                </span>
                <p className="text-sm text-slate-600">
                  {t('outcome.price.eta', { time: formatTimeRange(estimate.etaMinutes) })}
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <label className="text-xs text-slate-600">{t('outcome.verification.level')}</label>
            {lockedPrice ? (
              <div className="text-sm font-medium text-slate-700">{estimate.verifyLevel}</div>
            ) : (
              <ToggleGroup
                type="single"
                value={estimate.verifyLevel}
                onValueChange={(value) => value && onVerifyChange(value as VerifyLevel)}
                className="bg-transparent border border-slate-200 rounded-xl p-1"
              >
                <ToggleGroupItem value="Basic" className="text-xs">{t('outcome.verification.basic')}</ToggleGroupItem>
                <ToggleGroupItem value="Standard" className="text-xs">{t('outcome.verification.standard')}</ToggleGroupItem>
                <ToggleGroupItem value="Pro" className="text-xs">{t('outcome.verification.pro')}</ToggleGroupItem>
              </ToggleGroup>
            )}
          </div>
        </div>
      </div>

      {/* B. 交付物清单 */}
      <div className="border-t border-slate-200/70 pt-4">
        <div className="space-y-0 divide-y divide-slate-200/70">
          {/* 固定包含 */}
          <div className="flex items-center justify-between py-2 first:pt-0">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-slate-700">{t('outcome.deliverables.draft')}</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-slate-700">{t('outcome.deliverables.citation_verification')}</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-slate-700">{t('outcome.deliverables.style_alignment')}</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-slate-700">{t('outcome.deliverables.process_tracking')}</span>
            </div>
          </div>
          
          {/* 附加项 */}
          {Object.entries(addonConfig).map(([key, config]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Switch
                  checked={addons.includes(key as Addon)}
                  onCheckedChange={(enabled) => onToggleAddon(key as Addon, enabled)}
                  size="sm"
                />
                <span className="text-sm text-slate-700">{config.label}</span>
              </div>
              <span className="text-xs text-slate-600">+¥{config.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* C. 质量预测指标 */}
      <div className="border-t border-slate-200/70 pt-4">
        {renderMetrics()}
      </div>

      {/* D. 操作区 */}
      <div className="border-t border-slate-200/70 pt-4 space-y-2">
        <Button
          type="button"
          onClick={handlePayAndWrite}
          disabled={isProcessing || autopilot?.running}
          className="w-full rounded-xl h-10 bg-[#6A5AF9] hover:bg-[#5A4ACF] text-white"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t('outcome.buttons.processing')}
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              {t('outcome.buttons.pay_and_write')}
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={onPreviewSample}
          className="w-full rounded-xl h-10"
        >
          <Eye className="h-4 w-4 mr-2" />
          {t('outcome.buttons.preview_sample')}
        </Button>

        <p className="text-xs text-slate-600 text-center leading-relaxed">
          {t('outcome.disclaimer')}
        </p>
      </div>
    </CardWrapper>
  );
};

export default OutcomePanel;