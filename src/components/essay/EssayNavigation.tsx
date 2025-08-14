import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, List } from "lucide-react";
import type { EssaySection } from "@/pages/EssayEditor";

interface EssayNavigationProps {
  outline: string[];
  sections: EssaySection[];
  selectedSection: string | null;
  onSectionSelect: (sectionId: string | null) => void;
}

const EssayNavigation = ({ 
  outline, 
  sections, 
  selectedSection, 
  onSectionSelect 
}: EssayNavigationProps) => {
  return (
    <div className="space-y-4">
      {/* 文稿导航 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            文稿结构
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          <Button
            variant={selectedSection === null ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start text-left"
            onClick={() => onSectionSelect(null)}
          >
            整体预览
          </Button>
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={selectedSection === section.id ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start text-left"
              onClick={() => onSectionSelect(section.id)}
            >
              {section.order + 1}. {section.heading}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* 大纲预览 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <List className="h-4 w-4" />
            大纲
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {outline.map((item, index) => (
              <div 
                key={index}
                className="text-sm text-muted-foreground pl-2 border-l-2 border-muted"
              >
                {index + 1}. {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EssayNavigation;