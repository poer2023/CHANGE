import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface ReferencesResultCardProps {
  totalCount: number;
  isPreviewMode: boolean;
  onDownload: () => void;
  className?: string;
}

const ReferencesResultCard: React.FC<ReferencesResultCardProps> = ({
  totalCount,
  isPreviewMode,
  onDownload,
  className
}) => {
  const { t } = useTranslation();

  const references = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    name: `玉米 ${i + 1}`
  }));

  return (
    <Card className={cn("bg-white border-[#E7EAF3] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
            References 
            <X className="h-4 w-4 text-gray-400" />
            {totalCount}
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

      <CardContent className="pt-0">
        {/* References Grid */}
        <div className="grid grid-cols-3 gap-3">
          {references.map((ref) => (
            <div key={ref.id} className="flex flex-col items-center text-center">
              {/* PDF Icon */}
              <div className="w-10 h-12 mb-2 relative">
                <FileText className="w-full h-full text-red-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-10 bg-red-500 rounded-sm flex items-center justify-center">
                    <span className="text-xs font-bold text-white">PDF</span>
                  </div>
                </div>
              </div>
              
              {/* Reference Name */}
              <div className="text-xs text-gray-600">
                {ref.name}
              </div>
            </div>
          ))}
        </div>

        {/* Show more if needed */}
        {totalCount > 6 && (
          <div className="text-center mt-4">
            <div className="text-xs text-gray-500">
              + {totalCount - 6} more references
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferencesResultCard;