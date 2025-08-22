import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Sparkles, Upload, FileText, Bot, Send } from "lucide-react";
import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDropzone } from "react-dropzone";
import LoginDialog from "./LoginDialog";

const LandingHero = () => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { isAuthenticated } = useAuth();

  const handleStartWriting = () => {
    if (isAuthenticated) {
      // 已登录用户直接跳转到表单页面
      window.location.href = "/writing-flow";
    } else {
      // 未登录用户打开登录弹窗
      setShowLoginDialog(true);
    }
  };

  const handleLoginSuccess = () => {
    // 登录成功后跳转到表单页面
    window.location.href = "/form";
  };

  // 处理文件上传
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type.startsWith('image/') || file.type === 'application/pdf'
    );
    setUploadedFiles(prev => [...prev, ...imageFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
      'application/pdf': ['.pdf']
    },
    noClick: true,
    noKeyboard: true
  });

  // 处理发送（智能写作）
  const handleSend = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    
    // 将输入内容传递到智能模式
    if (textInput.trim() || uploadedFiles.length > 0) {
      // 存储输入数据到sessionStorage，供智能模式使用
      sessionStorage.setItem('smartInputData', JSON.stringify({
        text: textInput.trim(),
        files: uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type }))
      }));
    }
    window.location.href = "/form";
  };

  // 处理AI检测
  const handleAIDetection = () => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    window.location.href = "/detect/ai";
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <>
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

          {/* 智能输入区域 */}
          <div className="max-w-3xl mx-auto mb-8">
            <div 
              {...getRootProps()} 
              className={`relative bg-white rounded-2xl border-2 border-dashed p-6 transition-all duration-300 ${
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/20 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              
              <div className="relative">
                <Textarea
                  placeholder="输入要求开始写作... (Ctrl+Enter 发送)"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-32 border-0 text-lg resize-none focus-visible:ring-0 shadow-none bg-transparent placeholder:text-muted-foreground/60"
                />
                
                {/* 上传和发送按钮区域 */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                  >
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => (document.querySelector('input[type="file"]') as HTMLInputElement)?.click()}
                  >
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleSend}
                    disabled={!textInput.trim() && uploadedFiles.length === 0}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* 已上传文件显示 */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      <FileText className="h-3 w-3" />
                      <span>{file.name}</span>
                      <button
                        onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                        className="text-primary hover:text-primary/70"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 拖拽提示 */}
              {isDragActive && (
                <div className="absolute inset-0 bg-primary/5 border-2 border-primary border-dashed rounded-2xl flex items-center justify-center">
                  <div className="text-primary font-medium">释放文件到此处...</div>
                </div>
              )}
            </div>

          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="text-lg px-8" onClick={handleStartWriting}>
              立即开始写作
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8"
              onClick={handleAIDetection}
            >
              <Bot className="mr-2 h-5 w-5" />
              AI 检测
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

      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default LandingHero;