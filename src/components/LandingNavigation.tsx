import { Button } from "@/components/ui/button";
import { PenTool } from "lucide-react";
import { Link } from "react-router-dom";

const LandingNavigation = () => {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <PenTool className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">EssayAI</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            功能特性
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            使用流程
          </a>
          <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            关于我们
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            登录
          </Button>
          <Button asChild size="sm">
            <Link to="/essay-editor">开始写作</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavigation;