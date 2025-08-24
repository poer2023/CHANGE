import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CardWrapper from '@/components/shared/CardWrapper';
import DeliverableCard from './DeliverableCard';
import AddonTile from './AddonTile';
import ValueMetric from './ValueMetric';
import PricingBlock from './PricingBlock';
import SampleModal from './SampleModal';
import { useTranslation } from '@/hooks/useTranslation';
import { Eye, Zap } from 'lucide-react';

export type Step = 'topic' | 'research' | 'strategy' | 'outline';
export type VerifyLevel = 'Basic' | 'Standard' | 'Pro';
export type Addon = 'evidencePack' | 'defenseCard' | 'latex' | 'aiCheck' | 'plagiarism' | 'shareLink';

export interface OutcomeMetrics {
  // topic
  styleSamples?: number;
  // research
  sourcesHit?: number;
  verifiableRatio?: number;
  recent5yRatio?: number;
  // strategy
  thesisCandidates?: number;
  pickedStructure?: number;
  claimCount?: number;
  // outline
  outlineDepth?: number;
  sections?: number;
  perSectionCiteBalance?: number;
}

export interface OutcomePanelProps {
  step: Step;
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
  onToggleAddon: (key: Addon, on: boolean) => void;
  onVerifyChange: (level: VerifyLevel) => void;
  onPreviewMore: () => void;
  onPayAndWrite: () => Promise<void>;
}

const OutcomePanelCard: React.FC<OutcomePanelProps> = ({
  step,
  lockedPrice,
  estimate,
  metrics,
  addons,
  onToggleAddon,
  onVerifyChange,
  onPreviewMore,
  onPayAndWrite
}) => {
  const { t } = useTranslation();
  const [sampleModalOpen, setSampleModalOpen] = useState(false);
  const [sampleModalType, setSampleModalType] = useState<'draft' | 'verification' | 'style' | 'export'>('draft');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePreviewSample = (type: 'draft' | 'verification' | 'style' | 'export') => {
    setSampleModalType(type);
    setSampleModalOpen(true);
    // Track event
    console.log('deliverable_preview_open', { type });
  };

  const handleToggleAddon = (key: Addon, on: boolean) => {
    onToggleAddon(key, on);
    console.log('addon_toggle', { key, on });
  };

  const handleVerifyChange = (level: VerifyLevel) => {
    onVerifyChange(level);
    console.log('verify_change', { level });
  };

  const handlePayAndWrite = async () => {
    console.log('gate1_open');
    setIsProcessing(true);
    try {
      await onPayAndWrite();
      console.log('gate1_pay_success');
      console.log('autopilot_start');
    } catch (error) {
      console.log('autopilot_error', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <CardWrapper className="space-y-4 md:space-y-5">
        {/* A. Deliverable Gallery - 交付物预览墙 */}
        <section>
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('outcome.deliverables.title')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <DeliverableCard
              type="draft"
              step={step}
              metrics={metrics}
              onPreview={() => handlePreviewSample('draft')}
            />
            <DeliverableCard
              type="verification"
              step={step}
              metrics={metrics}
              onPreview={() => handlePreviewSample('verification')}
            />
            <DeliverableCard
              type="style"
              step={step}
              metrics={metrics}
              onPreview={() => handlePreviewSample('style')}
            />
            <DeliverableCard
              type="export"
              step={step}
              metrics={metrics}
              onPreview={() => handlePreviewSample('export')}
            />
          </div>
        </section>

        <Separator />

        {/* B. Addons Tiles - 附加项磁贴 */}
        <section>
          <h3 className="text-sm font-medium text-slate-700 mb-3">
            {t('outcome.addons.title')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(['evidencePack', 'defenseCard', 'latex', 'aiCheck', 'plagiarism', 'shareLink'] as Addon[]).map((addon) => (
              <AddonTile
                key={addon}
                type={addon}
                selected={addons.includes(addon)}
                onToggle={(selected) => handleToggleAddon(addon, selected)}
              />
            ))}
          </div>
        </section>

        <Separator />

        {/* C. Value Strip - 价值指标条 */}
        <section>
          <ValueMetric 
            step={step} 
            metrics={metrics} 
            estimate={estimate} 
          />
        </section>

        <Separator />

        {/* D. Pricing Block - 价格与时间 */}
        <section>
          <PricingBlock
            lockedPrice={lockedPrice}
            estimate={estimate}
            addons={addons}
            onVerifyChange={handleVerifyChange}
          />
        </section>

        <Separator />

        {/* E. Action Bar - 操作区 */}
        <section className="space-y-2">
          <Button
            onClick={handlePayAndWrite}
            disabled={isProcessing}
            className="w-full h-10 rounded-xl bg-[#6A5AF9] hover:bg-[#5A4ACF] text-white font-medium"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                {t('outcome.buttons.processing')}
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                {t('outcome.buttons.pay_and_write')}
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            onClick={onPreviewMore}
            className="w-full h-10 rounded-xl"
          >
            <Eye className="w-4 h-4 mr-2" />
            {t('outcome.buttons.preview_more')}
          </Button>
        </section>
      </CardWrapper>

      {/* Sample Modal */}
      <SampleModal
        open={sampleModalOpen}
        onOpenChange={setSampleModalOpen}
        type={sampleModalType}
        step={step}
        metrics={metrics}
      />
    </>
  );
};

export default OutcomePanelCard;