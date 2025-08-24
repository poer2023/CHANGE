import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Eye, 
  FileText, 
  CheckCircle, 
  Palette, 
  Download,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Step, OutcomeMetrics } from './OutcomePanelCard';

interface DeliverableCardProps {
  type: 'draft' | 'verification' | 'style' | 'export';
  step: Step;
  metrics?: OutcomeMetrics;
  onPreview: () => void;
}

const DeliverableCard: React.FC<DeliverableCardProps> = ({
  type,
  step,
  metrics,
  onPreview
}) => {
  const { t } = useTranslation();

  const getCardConfig = () => {
    switch (type) {
      case 'draft':
        return {
          icon: FileText,
          title: t('outcome.deliverables.draft.title'),
          content: renderDraftContent()
        };
      case 'verification':
        return {
          icon: CheckCircle,
          title: t('outcome.deliverables.verification.title'),
          content: renderVerificationContent()
        };
      case 'style':
        return {
          icon: Palette,
          title: t('outcome.deliverables.style.title'),
          content: renderStyleContent()
        };
      case 'export':
        return {
          icon: Download,
          title: t('outcome.deliverables.export.title'),
          content: renderExportContent()
        };
    }
  };

  const renderDraftContent = () => {
    if (step === 'topic') {
      return (
        <div className="space-y-1">
          <p className="text-xs text-slate-600 leading-relaxed">
            基于您的主题"<span className="font-medium">{metrics?.styleSamples ? '学术写作样本分析' : '现代教育技术研究'}</span>"生成结构化初稿...
          </p>
          <div className="text-xs text-slate-400 font-mono bg-slate-50 p-1 rounded">
            <span className="opacity-60">SAMPLE</span>
          </div>
        </div>
      );
    }
    
    if (step === 'research' || step === 'strategy' || step === 'outline') {
      return (
        <div className="space-y-1">
          <p className="text-xs text-slate-700 font-medium">
            引言: 现代教育技术的发展趋势
          </p>
          <div className="text-xs text-slate-600">
            • 技术驱动的个性化学习
            • 人工智能在教育中的应用
            • 远程教育模式的创新
          </div>
        </div>
      );
    }

    return null;
  };

  const renderVerificationContent = () => {
    if (step === 'topic') {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span className="text-slate-600">引用核验准备中</span>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="text-xs text-slate-700">
          <div className="font-medium">Liu, J. et al. (2023)</div>
          <div className="text-slate-500">Educational Technology Review</div>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          <span className="text-xs text-green-600">DOI 验证通过</span>
        </div>
        {step === 'research' && (
          <div className="text-xs text-slate-500">
            可验证比例 {metrics?.verifiableRatio || 95}%
          </div>
        )}
      </div>
    );
  };

  const renderStyleContent = () => {
    const hasSamples = (metrics?.styleSamples || 0) > 0;
    
    if (!hasSamples) {
      return (
        <div className="space-y-1">
          <div className="text-xs text-slate-500">
            Before: 传统的教学方法
          </div>
          <div className="text-xs text-amber-600">
            上传样本可降低风格偏移
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <div className="text-xs text-slate-500">
          Before: 传统的教学方法存在局限性
        </div>
        <div className="text-xs text-slate-700">
          After: <mark className="bg-blue-100 px-1">现代教育技术为传统教学模式</mark>带来了革命性变革
        </div>
      </div>
    );
  };

  const renderExportContent = () => {
    return (
      <div className="space-y-2">
        <div className="text-xs text-slate-600">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-1 h-1 rounded-full bg-blue-500"></div>
            <span>10:32 主题确认</span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <div className="w-1 h-1 rounded-full bg-green-500"></div>
            <span>10:45 文献检索完成</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 rounded-full bg-purple-500"></div>
            <span>11:02 大纲生成</span>
          </div>
        </div>
        <div className="flex gap-1">
          <Badge variant="secondary" className="text-xs px-1 py-0">DOCX</Badge>
          <Badge variant="secondary" className="text-xs px-1 py-0">PDF</Badge>
          <Badge variant="secondary" className="text-xs px-1 py-0">MD</Badge>
        </div>
      </div>
    );
  };

  const config = getCardConfig();
  const Icon = config.icon;

  return (
    <div className="group rounded-xl border border-[#E7EAF3] bg-white p-3 hover:shadow-sm transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <Badge variant="outline" className="text-xs text-green-600 border-green-200">
          {t('outcome.deliverables.included')}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreview}
          className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
        >
          <Eye className="h-3 w-3" />
        </Button>
      </div>

      {/* Icon & Title */}
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-[#6A5AF9]" />
        <span className="text-xs font-medium text-slate-700">
          {config.title}
        </span>
      </div>

      {/* Content */}
      <div className="min-h-[60px]">
        {config.content}
      </div>
    </div>
  );
};

export default DeliverableCard;