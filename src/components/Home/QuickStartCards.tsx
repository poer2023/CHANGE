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
import { useTranslation } from '@/hooks/useTranslation';

interface QuickStartCardsProps {
  onNewDocument: () => void;
  onUploadResources: () => void;
  onAutopilotMode: () => void;
}

interface QuickStartCard {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  variant: 'default' | 'primary' | 'secondary';
}

const QuickStartCards: React.FC<QuickStartCardsProps> = ({
  onNewDocument,
  onUploadResources,
  onAutopilotMode
}) => {
  const { t } = useTranslation();
  
  const cards: QuickStartCard[] = [
    {
      id: 'new',
      titleKey: 'quickstart.new_document.title',
      descriptionKey: 'quickstart.new_document.description',
      icon: Plus,
      action: onNewDocument,
      variant: 'default'
    },
    {
      id: 'upload',
      titleKey: 'quickstart.upload_resources.title',
      descriptionKey: 'quickstart.upload_resources.description',
      icon: Upload,
      action: onUploadResources,
      variant: 'secondary'
    },
    {
      id: 'autopilot',
      titleKey: 'quickstart.autopilot.title',
      descriptionKey: 'quickstart.autopilot.description',
      icon: Zap,
      action: onAutopilotMode,
      variant: 'primary'
    }
  ];


  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-h2 text-text">
          {t('quickstart.title')}
        </h2>
        <p className="text-body text-text-muted mt-1">
          {t('quickstart.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          
          return (
            <Card
              key={card.id}
              className={cn(
                "group relative overflow-hidden cursor-pointer bg-surface border-[hsl(var(--border))] hover:border-[color-mix(in_oklab,hsl(var(--brand-500))_25%,hsl(var(--border)))]",
                card.id === 'new' && "border border-brand-500 shadow-[0_0_0_1px_hsl(var(--brand-500)),0_0_12px_hsl(var(--brand-500)/.3)]"
              )}
              onClick={card.action}
            >
              
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
                        {t(card.titleKey)}
                      </h3>
                      <p className="text-body text-text-muted">
                        {t(card.descriptionKey)}
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