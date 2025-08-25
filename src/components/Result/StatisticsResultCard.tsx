import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, Image } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface StatisticsResultCardProps {
  graphsTablesCount?: number;
  picturesCount?: number;
  isPreviewMode: boolean;
  className?: string;
}

const StatisticsResultCard: React.FC<StatisticsResultCardProps> = ({
  graphsTablesCount = 4,
  picturesCount = 2,
  isPreviewMode,
  className
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      {/* Graphs & Tables Card */}
      <Card className="bg-white border-[#E7EAF3] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
        <CardContent className="p-4 text-center">
          <div className="text-sm font-medium text-gray-700 mb-3">
            Graphs &Tables
          </div>
          
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {graphsTablesCount}
            </div>
          </div>

          {!isPreviewMode && (
            <div className="text-xs text-gray-500">
              图表和表格统计
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pictures Card */}
      <Card className="bg-white border-[#E7EAF3] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
        <CardContent className="p-4 text-center">
          <div className="text-sm font-medium text-gray-700 mb-3">
            Pictures
          </div>
          
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mr-3">
              <Image className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {picturesCount}
            </div>
          </div>

          {!isPreviewMode && (
            <div className="text-xs text-gray-500">
              配图和图像数量
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsResultCard;