import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import type { Step, OutcomeMetrics, VerifyLevel } from './OutcomePanelCard';

interface ValueMetricProps {
  step: Step;
  metrics?: OutcomeMetrics;
  estimate: {
    citesRange: [number, number];
    verifyLevel: VerifyLevel;
  };
}

interface MetricItemProps {
  value: string | number;
  label: string;
  className?: string;
}

const MetricItem: React.FC<MetricItemProps> = ({ value, label, className }) => (
  <div className="rounded-lg bg-[#F7F9FC] border border-[#E7EAF3] py-2 px-3">
    <div className="text-base font-semibold text-slate-900">
      {value}
    </div>
    <div className="text-xs text-slate-500 leading-tight">
      {label}
    </div>
  </div>
);

const ValueMetric: React.FC<ValueMetricProps> = ({
  step,
  metrics,
  estimate
}) => {
  const { t } = useTranslation();

  const getMetrics = () => {
    const metricItems = [];

    // Step 1: Topic - Show style samples and cite range
    if (step === 'topic') {
      metricItems.push({
        value: metrics?.styleSamples || 0,
        label: t('outcome.metrics.style_samples')
      });
      
      metricItems.push({
        value: `${estimate.citesRange[0]}-${estimate.citesRange[1]}`,
        label: t('outcome.metrics.citations')
      });
    }

    // Step 2: Research - Add sources hit and verifiable ratio
    if (step === 'research') {
      metricItems.push({
        value: metrics?.sourcesHit || 12,
        label: t('outcome.metrics.sources_hit')
      });
      
      metricItems.push({
        value: `${metrics?.verifiableRatio || 95}%`,
        label: t('outcome.metrics.verifiable')
      });

      if (metrics?.styleSamples) {
        metricItems.push({
          value: metrics.styleSamples,
          label: t('outcome.metrics.style_samples')
        });
      }

      metricItems.push({
        value: `${estimate.citesRange[0]}-${estimate.citesRange[1]}`,
        label: t('outcome.metrics.citations')
      });
    }

    // Step 3: Strategy - Show strategy metrics
    if (step === 'strategy') {
      if (metrics?.thesisCandidates) {
        metricItems.push({
          value: metrics.thesisCandidates,
          label: t('outcome.metrics.thesis_candidates')
        });
      }

      if (metrics?.claimCount) {
        metricItems.push({
          value: metrics.claimCount,
          label: t('outcome.metrics.claim_count')
        });
      }

      metricItems.push({
        value: metrics?.sourcesHit || 12,
        label: t('outcome.metrics.sources_hit')
      });
      
      metricItems.push({
        value: `${metrics?.verifiableRatio || 95}%`,
        label: t('outcome.metrics.verifiable')
      });
    }

    // Step 4: Outline - Show outline depth and sections
    if (step === 'outline') {
      if (metrics?.outlineDepth) {
        metricItems.push({
          value: metrics.outlineDepth,
          label: t('outcome.metrics.outline_depth')
        });
      }

      if (metrics?.sections) {
        metricItems.push({
          value: metrics.sections,
          label: t('outcome.metrics.sections')
        });
      }

      metricItems.push({
        value: metrics?.sourcesHit || 12,
        label: t('outcome.metrics.sources_hit')
      });
      
      metricItems.push({
        value: `${metrics?.verifiableRatio || 95}%`,
        label: t('outcome.metrics.verifiable')
      });
    }

    // Ensure we always show exactly 4 metrics for grid layout
    while (metricItems.length < 4) {
      metricItems.push({
        value: '—',
        label: t('outcome.metrics.pending')
      });
    }

    // Take only first 4 metrics
    return metricItems.slice(0, 4);
  };

  const metrics4 = getMetrics();

  return (
    <div className="grid grid-cols-4 gap-2">
      {metrics4.map((metric, index) => (
        <MetricItem
          key={index}
          value={metric.value}
          label={metric.label}
        />
      ))}
    </div>
  );
};

export default ValueMetric;