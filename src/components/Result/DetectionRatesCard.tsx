import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface DetectionRatesCardProps {
  aiDetectionRate?: number;
  plagiarismRate?: number;
  isPreviewMode: boolean;
  className?: string;
}

const DetectionRatesCard: React.FC<DetectionRatesCardProps> = ({
  aiDetectionRate = 12,
  plagiarismRate = 24,
  isPreviewMode,
  className
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {/* AI Detection Rate Card */}
      <Card className="bg-white border-[#E7EAF3] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
        <CardContent className="p-4 text-center">
          <div className="text-sm font-medium text-gray-700 mb-2">
            AI detection rate
          </div>
          
          <div className="mb-2">
            {isPreviewMode ? (
              <div className="flex items-center justify-center h-12">
                <Eye className="h-8 w-8 text-gray-400" />
              </div>
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {aiDetectionRate}%
              </div>
            )}
          </div>

          {!isPreviewMode && (
            <div className="text-xs text-gray-500">
              基于主流检测工具评估
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plagiarism Rate Card */}
      <Card className="bg-white border-[#E7EAF3] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
        <CardContent className="p-4 text-center">
          <div className="text-sm font-medium text-gray-700 mb-2">
            plagiarism rate
          </div>
          
          <div className="mb-2">
            {isPreviewMode ? (
              <div className="flex items-center justify-center h-12">
                <Eye className="h-8 w-8 text-gray-400" />
              </div>
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                {plagiarismRate}%
              </div>
            )}
          </div>

          {!isPreviewMode && (
            <div className="text-xs text-gray-500">
              与已发表文献相似度
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DetectionRatesCard;