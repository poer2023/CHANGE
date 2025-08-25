import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface DownloadAllCardProps {
  isPreviewMode: boolean;
  onDownloadAll: () => void;
  onUnlock: () => void;
  className?: string;
}

const DownloadAllCard: React.FC<DownloadAllCardProps> = ({
  isPreviewMode,
  onDownloadAll,
  onUnlock,
  className
}) => {
  const { t } = useTranslation();

  return (
    <div className={cn("", className)}>
      <Button 
        onClick={isPreviewMode ? onUnlock : onDownloadAll}
        className="w-full h-12 rounded-xl bg-[#6E5BFF] hover:bg-[#5B4FCC] text-white font-medium text-base"
      >
        {isPreviewMode ? '立即解锁' : 'Download All'}
      </Button>
    </div>
  );
};

export default DownloadAllCard;