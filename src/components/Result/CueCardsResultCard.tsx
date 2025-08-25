import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface CueCardsResultCardProps {
  isPreviewMode: boolean;
  onDownload: () => void;
  className?: string;
}

const CueCardsResultCard: React.FC<CueCardsResultCardProps> = ({
  isPreviewMode,
  onDownload,
  className
}) => {
  const { t } = useTranslation();

  const cueCards = [
    {
      id: 1,
      question: "Why did you choose this topic?",
      answer: "Link to gap in existing research, practical significance, or personal academic interest.",
      category: "Research Background & Motivation"
    },
    {
      id: 2,
      question: "How does your study contribute to the field?",
      answer: "Highlight novelty (theoretical, methodological, or applied).",
      category: "Research Background & Motivation"
    },
    {
      id: 3,
      question: "Why did you select this method / dataset / sample size?",
      answer: "Show awareness of alternatives and justify your choice (efficiency, reliability, feasibility).",
      category: "Methodology"
    },
    {
      id: 4,
      question: "What are the limitations of your method?",
      answer: isPreviewMode ? "..." : "Acknowledge methodological constraints and their potential impact on findings.",
      category: "Methodology"
    }
  ];

  const visibleCards = isPreviewMode ? cueCards.slice(0, 3) : cueCards;

  return (
    <Card className={cn("bg-white border-[#E7EAF3] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900">
            Cue Cards
          </CardTitle>
          
          {!isPreviewMode && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownload}
              className="h-7 px-3 text-xs"
            >
              download
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Category 1: Research Background & Motivation */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">
            1. Research Background & Motivation
          </div>
          
          <div className="space-y-2">
            {visibleCards
              .filter(card => card.category === "Research Background & Motivation")
              .map((card) => (
                <div key={card.id} className="text-xs">
                  <div className="text-blue-600 font-medium mb-1">
                    Q: {card.question}
                  </div>
                  <div className="text-gray-600 mb-2">
                    A: {card.answer}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Category 2: Methodology */}
        <div>
          <div className="text-xs font-medium text-gray-700 mb-2">
            2. Methodology
          </div>
          
          <div className="space-y-2">
            {visibleCards
              .filter(card => card.category === "Methodology")
              .map((card) => (
                <div key={card.id} className="text-xs">
                  <div className="text-blue-600 font-medium mb-1">
                    Q: {card.question}
                  </div>
                  <div className="text-gray-600 mb-2">
                    A: {card.answer}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* More sections indicator */}
        {isPreviewMode && (
          <div className="text-xs text-gray-500 text-center py-2 border-t border-dashed border-gray-300">
            解锁查看更多问题...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CueCardsResultCard;