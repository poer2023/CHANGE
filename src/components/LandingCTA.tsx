import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Heart, FileText, BarChart3, Users } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import LoginDialog from "./LoginDialog";
import { useNavigate } from "react-router-dom";

const LandingCTA = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleStartWriting = () => {
    if (isAuthenticated) {
      // 已登录用户直接跳转到表单页面
      window.location.href = "/form";
    } else {
      // 未登录用户打开登录弹窗
      setShowLoginDialog(true);
    }
  };

  const handleLoginSuccess = () => {
    // 登录成功后跳转到表单页面
    window.location.href = "/form";
  };
  return (
    <>
      <section className="py-20 px-4 bg-primary/5">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            准备开始你的写作之旅？
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            立即体验 AI 驱动的智能写作助手，让写作变得更加简单高效
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="text-lg px-8" onClick={handleStartWriting}>
              开始免费体验
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              <Github className="mr-2 h-5 w-5" />
              查看源码
            </Button>
          </div>

          {/* 交付体验演示区域 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-12 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">✨ 交付体验演示</h3>
            <p className="text-sm text-gray-600 mb-6">体验完整的Essay交付流程和专业服务</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex flex-col h-auto py-3"
                onClick={() => navigate('/writing-status')}
              >
                <FileText className="w-5 h-5 mb-1 text-blue-500" />
                <span className="text-xs">写作状态</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex flex-col h-auto py-3"
                onClick={() => navigate('/delivery-complete')}
              >
                <ArrowRight className="w-5 h-5 mb-1 text-green-500" />
                <span className="text-xs">交付完成</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex flex-col h-auto py-3"
                onClick={() => navigate('/quality-report')}
              >
                <BarChart3 className="w-5 h-5 mb-1 text-purple-500" />
                <span className="text-xs">质量报告</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex flex-col h-auto py-3"
                onClick={() => navigate('/customer-service')}
              >
                <Users className="w-5 h-5 mb-1 text-orange-500" />
                <span className="text-xs">客户服务</span>
              </Button>
            </div>
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

      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default LandingCTA;