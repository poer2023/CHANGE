import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Eye, FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

interface DocumentPreviewCardProps {
  title: string;
  badges: string[];
  docId: string;
  isPreviewMode: boolean;
  onUnlock: () => void;
  className?: string;
}

const DocumentPreviewCard: React.FC<DocumentPreviewCardProps> = ({
  title = "Document Preview",
  badges = [],
  docId = "",
  isPreviewMode,
  onUnlock,
  className
}) => {
  const { t } = useTranslation();

  const documentStructure = [
    {
      section: 'Introduction',
      description: 'Research background, problem statement and research objectives'
    },
    {
      section: 'Literature Review', 
      description: 'Research background, problem statement and research objectives'
    }
  ];

  return (
    <Card className={cn("bg-white border-[#E7EAF3] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[#6E5BFF] flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 leading-tight">
              {title}
            </h2>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {badges && badges.length > 0 ? badges.map((badge, index) => (
            <Badge 
              key={index} 
              className="bg-[#6E5BFF] text-white text-xs px-3 py-1 rounded-full hover:bg-[#5B4FCC]"
            >
              {badge}
            </Badge>
          )) : (
            <Badge className="bg-gray-400 text-white text-xs px-3 py-1 rounded-full">
              Document
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isPreviewMode ? (
          // Preview Mode
          <div className="space-y-4">
            <div className="text-center py-6">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-gray-900 mb-2">预览模式</h3>
              <p className="text-sm text-gray-600">
                当前为预览模式，内容概览，解锁后可查看完整内容。
              </p>
            </div>

            {/* Document Structure Preview */}
            <div className="space-y-3">
              {documentStructure.map((item, index) => (
                <div key={index} className="border border-dashed border-gray-300 rounded-lg p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {item.section}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded ml-3">
                      预览模式 - 内容概览
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center py-2">
                <div className="text-xs text-gray-400">更多内容请解锁查看</div>
              </div>
            </div>

            {/* Unlock Button */}
            <div className="pt-4">
              <Button 
                onClick={onUnlock}
                className="w-full h-12 rounded-xl bg-[#6E5BFF] hover:bg-[#5B4FCC] text-white font-medium text-base"
              >
                立即解锁
              </Button>
            </div>
          </div>
        ) : (
          // Full Content Mode
          <div className="space-y-4">
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Executive Summary</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                The integration of Artificial Intelligence (AI) within robotic systems represents a transformative advancement across numerous sectors, enhancing operational capabilities and fostering innovative applications. This case study scrutinizes the multifaceted implementation of AI in robotics...
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-6">Introduction and Background</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                The convergence of AI and robotics has fundamentally transformed how we approach automation, decision-making, and human-machine interaction across various industries...
              </p>
            </div>
          </div>
        )}

        {/* Document Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <span>创建时间: 2025/8/25</span>
            <span>格式: APA</span>
            <span>字数: ~1500</span>
          </div>
          <div>
            文档 ID: {docId.slice(0, 8)}...
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentPreviewCard;