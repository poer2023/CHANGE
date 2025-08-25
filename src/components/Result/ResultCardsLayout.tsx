import React from 'react';
import { cn } from '@/lib/utils';
import DocumentPreviewCard from './DocumentPreviewCard';
import ReferencesResultCard from './ReferencesResultCard';
import CueCardsResultCard from './CueCardsResultCard';
import DetectionRatesCard from './DetectionRatesCard';
import StatisticsResultCard from './StatisticsResultCard';
import PersonalVoiceResultCard from './PersonalVoiceResultCard';
import DownloadAllCard from './DownloadAllCard';

interface ResultCardsLayoutProps {
  isPreviewMode: boolean;
  docId: string;
  title?: string;
  badges?: string[];
  onDownloadAll: () => void;
  onUnlock: () => void;
  onDownloadReferences: () => void;
  onDownloadCueCards: () => void;
  className?: string;
}

const ResultCardsLayout: React.FC<ResultCardsLayoutProps> = ({
  isPreviewMode,
  docId,
  title = "Advanced Strategies for Academic Research Writing",
  badges = ["Research Paper", "Academic Writing", "6,540 words"],
  onDownloadAll,
  onUnlock,
  onDownloadReferences,
  onDownloadCueCards,
  className
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex gap-8">
        {/* Left Side - Document Preview */}
        <div className="flex-1">
          <DocumentPreviewCard 
            title={title}
            badges={badges}
            docId={docId}
            isPreviewMode={isPreviewMode}
            onUnlock={onUnlock}
            className="h-full"
          />
        </div>

        {/* Right Side - Feature Cards Grid */}
        <div className="flex-1 space-y-4">
          {/* Top Row - References and Cue Cards */}
          <div className="grid grid-cols-2 gap-4">
            <ReferencesResultCard 
              isPreviewMode={isPreviewMode}
              onDownload={onDownloadReferences}
            />
            <CueCardsResultCard 
              isPreviewMode={isPreviewMode}
              onDownload={onDownloadCueCards}
            />
          </div>

          {/* Middle Row - Detection Rates */}
          <DetectionRatesCard 
            isPreviewMode={isPreviewMode}
          />

          {/* Bottom Section - Statistics, Personal Voice, Download All */}
          <div className="grid grid-cols-2 gap-4">
            <StatisticsResultCard 
              isPreviewMode={isPreviewMode}
            />
            <PersonalVoiceResultCard 
              isPreviewMode={isPreviewMode}
            />
          </div>

          {/* Download All Button */}
          <DownloadAllCard 
            isPreviewMode={isPreviewMode}
            onDownloadAll={onDownloadAll}
            onUnlock={onUnlock}
          />
        </div>
      </div>
    </div>
  );
};

export default ResultCardsLayout;