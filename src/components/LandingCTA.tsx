import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const LandingCTA = () => {
  return (
    <section className="py-20 px-4 bg-primary/5">
      <div className="container max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
          准备开始你的写作之旅？
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          立即体验 AI 驱动的智能写作助手，让写作变得更加简单高效
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button asChild size="lg" className="text-lg px-8">
            <Link to="/essay-editor">
              开始免费体验
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            <Github className="mr-2 h-5 w-5" />
            查看源码
          </Button>
        </div>
        
        <div className="border-t border-border pt-8">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by EssayAI Team</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingCTA;