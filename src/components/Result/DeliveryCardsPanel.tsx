import React from 'react';
import ProcessSummaryCard from './ProcessSummaryCard';
import CitationListCard from './CitationListCard';
import InterviewQACard from './InterviewQACard';
import { useWritingFlow } from '@/contexts/WritingFlowContext';

interface DeliveryCardsPanelProps {
  className?: string;
}

const DeliveryCardsPanel: React.FC<DeliveryCardsPanelProps> = ({ className = '' }) => {
  const { project } = useWritingFlow();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 写作过程摘要卡片 */}
      <ProcessSummaryCard project={project} />
      
      {/* 参考文献卡片 */}
      <CitationListCard 
        sources={project.sources || []} 
        citationStyle={project.topic?.citationStyle || 'APA'} 
      />
      
      {/* 面谈速答卡片 */}
      <InterviewQACard 
        thesis={project.strategy?.thesis}
        claims={project.strategy?.claims || []}
        sources={project.sources || []}
        topic={project.topic}
      />
    </div>
  );
};

export default DeliveryCardsPanel;