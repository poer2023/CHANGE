import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Upload,
  Zap,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickStartCardsProps {
  onNewDocument: () => void;
  onUploadResources: () => void;
  onAutopilotMode: () => void;
}

interface QuickStartCard {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  variant: 'default' | 'primary' | 'secondary';
}

const QuickStartCards: React.FC<QuickStartCardsProps> = ({
  onNewDocument,
  onUploadResources,
  onAutopilotMode
}) => {
  const cards: QuickStartCard[] = [
    {
      id: 'new',
      title: '新建文稿',
      description: '从空白页面开始，按步骤完成学术写作',
      icon: Plus,
      action: onNewDocument,
      variant: 'default'
    },
    {
      id: 'upload',
      title: '上传资料',
      description: 'PDF/DOCX/图片，自动抽取要求与参考',
      icon: Upload,
      action: onUploadResources,
      variant: 'secondary'
    },
    {
      id: 'autopilot',
      title: '粘贴要求→一键AI完成',
      description: '直达Step1并弹出自动推进确认',
      icon: Zap,
      action: onAutopilotMode,
      variant: 'primary'
    }
  ];


  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-h2 text-text">
          快速开始
        </h2>
        <p className="text-body text-text-muted mt-1">
          选择您的创作方式
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          
          return (
            <Card
              key={card.id}
              className="group relative overflow-hidden cursor-pointer bg-surface border-[hsl(var(--border))] hover:border-[color-mix(in_oklab,hsl(var(--brand-500))_25%,hsl(var(--border)))]"
              onClick={card.action}
            >
              {/* Gradient top accent line */}
              <div className="h-0.5 bg-brand-gradient" />
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    {/* Icon container with subtle highlight */}
                    <div className="size-10 rounded-full bg-surface-alt border border-[hsl(var(--border))] flex items-center justify-center flex-shrink-0 relative">
                      <div className="absolute inset-[1px] rounded-full bg-gradient-to-br from-white/12 to-transparent" />
                      <Icon className="size-5 text-text-muted relative z-10" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <h3 className="text-base font-semibold text-text leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-body text-text-muted">
                        {card.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Arrow icon */}
                  <div className="flex-shrink-0 ml-2">
                    <ArrowRight className="size-4 text-text-muted group-hover:text-brand-500 transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default QuickStartCards;