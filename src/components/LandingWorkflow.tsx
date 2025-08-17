import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FormInput, Brain, EditIcon, Download } from "lucide-react";

const steps = [
  {
    step: 1,
    icon: FormInput,
    title: "填写写作需求",
    description: "通过渐进式表单提供 Essay 类型、主题、字数、语气等要求",
    details: ["选择 Essay 类型（议论文、分析文等）", "输入主题和写作要求", "设置字数范围和目标读者"]
  },
  {
    step: 2,
    icon: Brain,
    title: "AI 生成初稿",
    description: "AI 根据你的需求自动生成结构化大纲和完整初稿",
    details: ["自动分析写作要求", "生成逻辑清晰的大纲", "创建各段落完整内容"]
  },
  {
    step: 3,
    icon: EditIcon,
    title: "智能优化编辑",
    description: "使用右侧 Agent 面板进行改写、扩写、校对等操作",
    details: ["选中文本进行针对性改写", "查看实时差异高亮预览", "应用或撤销每次修改"]
  },
  {
    step: 4,
    icon: Download,
    title: "导出完成",
    description: "将优化后的文稿导出为 Markdown 或 DOCX 格式",
    details: ["支持多种导出格式", "保持原有格式和引用", "随时下载备份"]
  }
];

const LandingWorkflow = () => {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            简单四步，完成写作
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            从想法到成品，让 AI 助你高效完成写作任务
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="border-border bg-card relative overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" className="text-xs">
                        第 {step.step} 步
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                  {step.description}
                </CardDescription>
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              {/* Step connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 w-8 h-px bg-border transform -translate-y-1/2" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingWorkflow;