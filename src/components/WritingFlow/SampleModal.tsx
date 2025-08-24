import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  FileText, 
  CheckCircle, 
  Palette, 
  Download,
  AlertTriangle,
  Clock,
  ExternalLink
} from 'lucide-react';
import type { Step, OutcomeMetrics } from './OutcomePanelCard';

interface SampleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'draft' | 'verification' | 'style' | 'export';
  step: Step;
  metrics?: OutcomeMetrics;
}

const SampleModal: React.FC<SampleModalProps> = ({
  open,
  onOpenChange,
  type,
  step,
  metrics
}) => {
  const { t } = useTranslation();

  const getModalConfig = () => {
    switch (type) {
      case 'draft':
        return {
          icon: FileText,
          title: t('outcome.modal.draft.title'),
          content: renderDraftContent()
        };
      case 'verification':
        return {
          icon: CheckCircle,
          title: t('outcome.modal.verification.title'),
          content: renderVerificationContent()
        };
      case 'style':
        return {
          icon: Palette,
          title: t('outcome.modal.style.title'),
          content: renderStyleContent()
        };
      case 'export':
        return {
          icon: Download,
          title: t('outcome.modal.export.title'),
          content: renderExportContent()
        };
    }
  };

  const renderDraftContent = () => {
    return (
      <div className="space-y-4">
        <div className="bg-slate-50 p-4 rounded-lg relative">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-6xl font-bold text-slate-200 rotate-45 opacity-50">
              SAMPLE
            </div>
          </div>
          
          <div className="relative z-10 space-y-3">
            <h3 className="text-base font-semibold text-slate-900">
              {step === 'topic' 
                ? '现代教育技术在教学中的应用研究' 
                : '基于人工智能的个性化学习系统设计'
              }
            </h3>
            
            <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
              <p>
                <strong>摘要：</strong>随着信息技术的快速发展，现代教育技术在教学实践中发挥着越来越重要的作用。
                本研究通过文献分析和实证研究，探讨了现代教育技术对教学效果的影响机制。
              </p>
              
              {step !== 'topic' && (
                <>
                  <p>
                    <strong>1. 引言</strong>
                  </p>
                  <p>
                    教育技术的发展为传统教学模式带来了革命性变革。根据 Liu et al. (2023) 的研究，
                    个性化学习系统能够显著提高学生的学习效果和参与度。本研究旨在...
                  </p>
                  
                  <p>
                    <strong>2. 文献综述</strong>
                  </p>
                  <p>
                    近年来，关于教育技术应用的研究呈现快速增长趋势。Smith & Johnson (2022) 
                    指出，人工智能技术在教育领域的应用主要体现在以下几个方面：
                  </p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>智能辅导系统的个性化推荐</li>
                    <li>学习分析与评估反馈机制</li>
                    <li>自适应学习路径设计</li>
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
        
        <p className="text-xs text-slate-500 text-center">
          {t('outcome.modal.watermark_notice')}
        </p>
      </div>
    );
  };

  const renderVerificationContent = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-slate-900">
              {t('outcome.modal.verification.summary')}
            </span>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-sm text-green-800">
              ✅ 可验证引用：{metrics?.verifiableRatio || 95}% ({metrics?.sourcesHit || 12}/{Math.ceil((metrics?.sourcesHit || 12) / ((metrics?.verifiableRatio || 95) / 100))})
            </div>
            <div className="text-sm text-green-800">
              ✅ DOI/PMID 验证通过：{Math.floor((metrics?.sourcesHit || 12) * 0.8)} 条
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">
            {t('outcome.modal.verification.sample_citations')}
          </h4>
          
          <div className="space-y-2">
            <div className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">
                    Liu, J., Smith, A., & Chen, L. (2023)
                  </div>
                  <div className="text-sm text-slate-600">
                    Artificial Intelligence in Educational Technology: A Comprehensive Review
                  </div>
                  <div className="text-xs text-slate-500">
                    Educational Technology Research, 45(2), 123-145
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">DOI 验证</span>
                </div>
              </div>
            </div>
            
            <div className="border border-slate-200 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">
                    Johnson, M. K., & Brown, R. (2022)
                  </div>
                  <div className="text-sm text-slate-600">
                    Personalized Learning Systems: Implementation and Effectiveness
                  </div>
                  <div className="text-xs text-slate-500">
                    Journal of Computer-Assisted Learning, 38(4), 789-802
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-3">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-amber-600">待核实</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStyleContent = () => {
    const hasSamples = (metrics?.styleSamples || 0) > 0;
    
    return (
      <div className="space-y-4">
        {!hasSamples ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                {t('outcome.modal.style.no_samples')}
              </span>
            </div>
            <p className="text-sm text-amber-700">
              {t('outcome.modal.style.upload_suggestion')}
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {t('outcome.modal.style.samples_detected', { count: metrics.styleSamples })}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">
            {t('outcome.modal.style.comparison')}
          </h4>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-xs text-slate-600 font-medium mb-1">Before:</div>
              <div className="text-sm text-slate-800">
                传统的教学方法存在一些局限性，无法满足现代学生的多样化学习需求。
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-blue-600 font-medium mb-1">After (样本对齐):</div>
              <div className="text-sm text-slate-800">
                现代教育技术为传统教学模式带来了
                <mark className="bg-blue-200 px-1 py-0.5 rounded text-blue-900">革命性变革</mark>，
                能够有效满足学生
                <mark className="bg-blue-200 px-1 py-0.5 rounded text-blue-900">个性化学习需求</mark>。
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderExportContent = () => {
    return (
      <div className="space-y-4">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">
            {t('outcome.modal.export.timeline')}
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div className="text-sm text-slate-700">
                <span className="text-slate-500">10:32</span> 主题确认与需求分析
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div className="text-sm text-slate-700">
                <span className="text-slate-500">10:45</span> 文献检索与数据收集
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <div className="text-sm text-slate-700">
                <span className="text-slate-500">11:02</span> 研究策略制定
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <div className="text-sm text-slate-700">
                <span className="text-slate-500">11:15</span> 大纲结构生成
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">
            {t('outcome.modal.export.formats')}
          </h4>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="border border-slate-200 rounded-lg p-3 text-center">
              <FileText className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-xs font-medium text-slate-900">DOCX</div>
              <div className="text-xs text-slate-500">Word 格式</div>
            </div>
            <div className="border border-slate-200 rounded-lg p-3 text-center">
              <FileText className="w-6 h-6 text-red-600 mx-auto mb-1" />
              <div className="text-xs font-medium text-slate-900">PDF</div>
              <div className="text-xs text-slate-500">便携格式</div>
            </div>
            <div className="border border-slate-200 rounded-lg p-3 text-center">
              <FileText className="w-6 h-6 text-gray-600 mx-auto mb-1" />
              <div className="text-xs font-medium text-slate-900">Markdown</div>
              <div className="text-xs text-slate-500">纯文本</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Clock className="w-3 h-3" />
            {t('outcome.modal.export.retention')}
          </div>
        </div>
      </div>
    );
  };

  const config = getModalConfig();
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-[#6A5AF9]" />
            {config.title}
            <Badge variant="outline" className="text-xs text-green-600 border-green-200 ml-auto">
              {t('outcome.deliverables.included')}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {config.content}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SampleModal;