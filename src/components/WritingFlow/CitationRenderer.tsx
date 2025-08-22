import React from 'react';
import CitationPopover from './CitationPopover';
import { Citation, Reference } from '@/types/writing-flow';

interface CitationRendererProps {
  html: string;
  citations: Citation[];
  references: Reference[];
  onCitationClick?: (citation: Citation) => void;
}

const CitationRenderer: React.FC<CitationRendererProps> = ({
  html,
  citations,
  references,
  onCitationClick
}) => {
  // Parse HTML and replace citation markers with interactive components
  const renderWithCitations = (content: string): React.ReactNode => {
    // Simple citation pattern: [1], [2], etc.
    const citationPattern = /\[(\d+)\]/g;
    const parts = content.split(citationPattern);
    
    const result: React.ReactNode[] = [];
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      
      if (i % 2 === 0) {
        // Regular text
        if (part) {
          result.push(
            <span key={i} dangerouslySetInnerHTML={{ __html: part }} />
          );
        }
      } else {
        // Citation number
        const citationIndex = parseInt(part) - 1;
        const citation = citations[citationIndex];
        const reference = references.find(ref => ref.id === citation?.sourceId);
        
        if (citation && reference) {
          result.push(
            <CitationPopover
              key={i}
              citation={citation}
              reference={reference}
            >
              <button
                className="inline-block text-[#6E5BFF] hover:text-[#6E5BFF]/80 hover:bg-[#6E5BFF]/5 rounded px-1 transition-colors cursor-pointer text-sm font-medium align-super"
                onClick={() => onCitationClick?.(citation)}
              >
                [{part}]
              </button>
            </CitationPopover>
          );
        } else {
          // Fallback for missing citation/reference
          result.push(
            <span key={i} className="text-red-500 text-sm align-super">
              [{part}]
            </span>
          );
        }
      }
    }
    
    return result;
  };

  return (
    <div className="prose max-w-none text-[#2A3241] leading-relaxed">
      {renderWithCitations(html)}
    </div>
  );
};

export default CitationRenderer;