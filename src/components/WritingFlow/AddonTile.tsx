import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  FileText,
  Shield,
  Code,
  Bot,
  Search,
  Share2,
  FileCheck,
  MessageSquare,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Addon } from './OutcomePanelCard';

interface AddonTileProps {
  type: Addon;
  selected: boolean;
  onToggle: (selected: boolean) => void;
}

const AddonTile: React.FC<AddonTileProps> = ({
  type,
  selected,
  onToggle
}) => {
  const { t } = useTranslation();

  const getAddonConfig = () => {
    switch (type) {
      case 'evidencePack':
        return {
          icon: FileText,
          title: t('outcome.addons.evidence_pack.title'),
          price: 15,
          preview: (
            <div className="space-y-1">
              <div className="text-xs text-slate-600 font-mono">
                📄 timeline.json
              </div>
              <div className="text-xs text-slate-600 font-mono">
                📊 citations.csv
              </div>
              <div className="text-xs text-slate-600 font-mono">
                📋 qa.pdf
              </div>
            </div>
          )
        };
      case 'defenseCard':
        return {
          icon: MessageSquare,
          title: t('outcome.addons.defense_card.title'),
          price: 25,
          preview: (
            <div className="space-y-1">
              <div className="text-xs text-slate-700 font-medium">Q: 如何确保研究的可靠性？</div>
              <div className="text-xs text-slate-600">A: 通过多重验证机制...</div>
              <div className="text-xs text-slate-500">+ 2 more Q&As</div>
            </div>
          )
        };
      case 'latex':
        return {
          icon: Code,
          title: t('outcome.addons.latex.title'),
          price: 10,
          preview: (
            <div className="space-y-1">
              <div className="bg-slate-50 p-2 rounded text-xs font-mono text-slate-600">
                {`\\documentclass{article}
\\title{Research Paper}`}
              </div>
              <div className="flex gap-1">
                <Badge variant="secondary" className="text-xs px-1">.tex</Badge>
                <Badge variant="secondary" className="text-xs px-1">.pdf</Badge>
              </div>
            </div>
          )
        };
      case 'aiCheck':
        return {
          icon: Bot,
          title: t('outcome.addons.ai_check.title'),
          price: 20,
          preview: (
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <FileCheck className="w-3 h-3 text-green-500" />
                <span className="text-xs text-slate-600">出具检测报告 PDF</span>
              </div>
              <div className="text-xs text-slate-500">
                降低误伤提示
              </div>
            </div>
          )
        };
      case 'plagiarism':
        return {
          icon: Search,
          title: t('outcome.addons.plagiarism.title'),
          price: 30,
          preview: (
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <FileCheck className="w-3 h-3 text-green-500" />
                <span className="text-xs text-slate-600">出具查重报告 PDF</span>
              </div>
              <div className="text-xs text-slate-500">
                支持多数据库对比
              </div>
            </div>
          )
        };
      case 'shareLink':
        return {
          icon: Share2,
          title: t('outcome.addons.share_link.title'),
          price: 5,
          preview: (
            <div className="space-y-1">
              <div className="text-xs text-slate-600 font-mono bg-slate-50 p-1 rounded">
                https://paper.ai/s/abc123
              </div>
              <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                <div className="w-6 h-6 bg-black/5 rounded"></div>
              </div>
            </div>
          )
        };
    }
  };

  const config = getAddonConfig();
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "group rounded-xl border p-3 hover:shadow-sm cursor-pointer transition-all duration-200",
        "relative",
        selected 
          ? "border-[#6A5AF9] bg-[#F7F9FF]" 
          : "border-[#E7EAF3] bg-white hover:border-[#D1D8E7]"
      )}
      onClick={() => onToggle(!selected)}
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle(!selected);
        }
      }}
    >
      {/* Price Badge */}
      <div className="absolute top-2 right-2">
        <Badge 
          variant="secondary" 
          className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600"
        >
          +¥{config.price}
        </Badge>
      </div>

      {/* Icon & Title */}
      <div className="flex items-center gap-2 mb-2 pr-12">
        <Icon className={cn(
          "h-4 w-4",
          selected ? "text-[#6A5AF9]" : "text-slate-500"
        )} />
        <span className={cn(
          "text-xs font-medium",
          selected ? "text-[#6A5AF9]" : "text-slate-700"
        )}>
          {config.title}
        </span>
      </div>

      {/* Preview Content */}
      <div className="min-h-[60px]">
        {config.preview}
      </div>

      {/* Selected Indicator */}
      {selected && (
        <div className="absolute inset-0 rounded-xl border-2 border-[#6A5AF9] pointer-events-none opacity-50"></div>
      )}
    </div>
  );
};

export default AddonTile;