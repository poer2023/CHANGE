import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const LandingHero = () => {
  return (
    <section className="py-20 px-4 text-center bg-gradient-to-b from-muted/30 to-background">
      <div className="container max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-2 bg-accent px-3 py-1 rounded-full text-sm text-accent-foreground">
            <Sparkles className="h-4 w-4" />
            AI 驱动的智能写作助手
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          一键生成高质量
          <br />
          <span className="text-primary">Essay 初稿</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          通过渐进式表单收集写作意图，AI 自动生成结构化大纲与完整初稿。
          支持实时改写、扩写、校对，让写作变得简单高效。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/essay-editor">
              立即开始写作
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            观看演示
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-3xl font-bold text-primary mb-2">5分钟</div>
            <div className="text-muted-foreground">完成表单获得初稿</div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-primary mb-2">4种工具</div>
            <div className="text-muted-foreground">改写、扩写、校对、引用</div>
          </div>
          <div className="p-6">
            <div className="text-3xl font-bold text-primary mb-2">多格式</div>
            <div className="text-muted-foreground">支持 Markdown、DOCX 导出</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;