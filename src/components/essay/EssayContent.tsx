import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit3 } from "lucide-react";
import type { EssayData, EssaySection } from "@/pages/EssayEditor";

interface EssayContentProps {
  essay: EssayData;
  operations: any[];
  selectedSection: string | null;
  onTextSelect: (text: string) => void;
  onSectionSelect: (sectionId: string) => void;
}

const EssayContent = ({ 
  essay, 
  operations, 
  selectedSection, 
  onTextSelect,
  onSectionSelect 
}: EssayContentProps) => {
  const [selectedText, setSelectedText] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim() || "";
      setSelectedText(selectedText);
      onTextSelect(selectedText);
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("keyup", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("keyup", handleSelection);
    };
  }, [onTextSelect]);

  const getPendingOperationsForSection = (sectionId: string) => {
    return operations.filter(op => 
      op.status === "proposed_diff" && 
      (op.input.includes(sectionId) || selectedSection === sectionId)
    );
  };

  const renderSectionContent = (section: EssaySection) => {
    const pendingOps = getPendingOperationsForSection(section.id);
    
    return (
      <div key={section.id} className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-xl font-semibold">{section.heading}</h2>
          {pendingOps.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {pendingOps.length} 个待处理更改
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSectionSelect(section.id)}
            className="ml-auto"
          >
            <Edit3 className="h-3 w-3 mr-1" />
            编辑
          </Button>
        </div>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-base leading-relaxed text-foreground">
            {section.content}
          </p>
        </div>

        {/* 显示pending的diff */}
        {pendingOps.map(op => (
          <div key={op.id} className="mt-4 p-4 border border-orange-200 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {op.tool} - 待确认
              </Badge>
            </div>
            
            {op.diff && (
              <div className="space-y-2">
                {op.diff.removed.map((text, i) => (
                  <div key={`removed-${i}`} className="p-2 bg-red-100 text-red-800 rounded">
                    <span className="text-xs font-mono">- </span>
                    {text}
                  </div>
                ))}
                {op.diff.added.map((text, i) => (
                  <div key={`added-${i}`} className="p-2 bg-green-100 text-green-800 rounded">
                    <span className="text-xs font-mono">+ </span>
                    {text}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderFullEssay = () => {
    return (
      <div className="space-y-8">
        {/* 标题和元信息 */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-bold mb-4">{essay.title}</h1>
          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <span>类型: {essay.metadata.type}</span>
            <span>语言: {essay.metadata.language}</span>
            <span>字数: {essay.metadata.wordRange}</span>
            <span>读者: {essay.metadata.audience}</span>
          </div>
        </div>

        {/* 文稿内容 */}
        {essay.sections
          .sort((a, b) => a.order - b.order)
          .map(renderSectionContent)
        }
      </div>
    );
  };

  const renderSingleSection = () => {
    const section = essay.sections.find(s => s.id === selectedSection);
    if (!section) return null;

    return (
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSectionSelect(null)}
          >
            <Eye className="h-4 w-4 mr-2" />
            查看全文
          </Button>
          <Badge variant="outline">
            编辑模式: {section.heading}
          </Badge>
        </div>
        
        {renderSectionContent(section)}
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-6" ref={contentRef}>
        {selectedSection ? renderSingleSection() : renderFullEssay()}
        
        {/* 选中文本提示 */}
        {selectedText && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
              <span className="text-sm">
                已选中 {selectedText.length} 个字符
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EssayContent;