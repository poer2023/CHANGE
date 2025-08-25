import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface PersonalVoiceResultCardProps {
  isPreviewMode: boolean;
  className?: string;
}

const PersonalVoiceResultCard: React.FC<PersonalVoiceResultCardProps> = ({
  isPreviewMode,
  className
}) => {
  const { t } = useTranslation();

  const voiceAnalysis = [
    { label: "Concise and Direct", description: "语言简洁，不绕弯子" },
    { label: "Structured and Logical", description: "结构清晰逻辑" },  
    { label: "Precise and Objective", description: "注重用词精确"  }
  ];

  return (
    <Card className={cn("bg-white border-[#E7EAF3] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-900">
          Personal Voice
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        {isPreviewMode ? (
          // Preview Mode - Show eye icon
          <div className="flex items-center justify-center py-8">
            <Eye className="h-12 w-12 text-gray-400" />
          </div>
        ) : (
          // Full Mode - Show voice analysis
          <div className="space-y-3">
            {voiceAnalysis.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="text-sm font-medium text-gray-900">
                  {item.label}
                </div>
                <div className="text-xs text-gray-600">
                  {item.description}
                </div>
                {index < voiceAnalysis.length - 1 && (
                  <div className="border-b border-gray-100 pt-2" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalVoiceResultCard;