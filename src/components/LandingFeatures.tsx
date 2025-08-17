import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Edit3, Eye, Download, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "智能大纲生成",
    description: "根据你的主题和要求，AI 自动生成结构化大纲和各段要点，为写作提供清晰框架。"
  },
  {
    icon: Edit3,
    title: "实时改写优化",
    description: "选中任意段落进行改写，支持清晰度、语气、简洁度等多种优化模式。"
  },
  {
    icon: Eye,
    title: "可视化变更",
    description: "所有修改以差异高亮显示，支持预览、应用或撤销，让每次改动都清晰可见。"
  },
  {
    icon: Download,
    title: "多格式导出",
    description: "支持 Markdown 和 DOCX 格式导出，兼容各种学术和商业写作场景。"
  },
  {
    icon: Zap,
    title: "操作流追踪",
    description: "完整记录每次 AI 操作，包括工具使用、耗时、效果，支持历史版本回退。"
  },
  {
    icon: Shield,
    title: "本地优先",
    description: "支持本地 LLM 模型，数据安全可控，也可选择云端 API 获得更强性能。"
  }
];

const LandingFeatures = () => {
  return (
    <section id="features" className="py-20 px-4 bg-muted/20">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            强大功能特性
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            集成多种 AI 工具，为你的写作提供全方位支持
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-card hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-lg w-fit">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;