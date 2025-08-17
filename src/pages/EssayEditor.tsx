import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Download, Settings, FileText, Eye, Coins, ChevronDown, Search, Shield } from "lucide-react";
import EssayNavigation from "@/components/essay/EssayNavigation";
import EssayContent from "@/components/essay/EssayContent";
import ChatPanel from "@/components/ChatPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Database, MessageCircle } from "lucide-react";
import KnowledgeLibrarySidebar from "@/components/KnowledgeLibrarySidebar";
import AIChat from "@/components/AIChat";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { historyData, getArticleById } from "@/data/historyData";
import type { Article } from "@/data/historyData";
import { useCredit } from "@/contexts/CreditContext";
import RechargeDialog from "@/components/RechargeDialog";

export type EssaySection = {
  id: string;
  heading: string;
  content: string;
  order: number;
};


export type EssayData = {
  id: string;
  title: string;
  status: "idea" | "outline" | "draft" | "review" | "polished";
  outline: string[];
  sections: EssaySection[];
  metadata: {
    type: string;
    language: string;
    wordRange: string;
    audience: string;
  };
};

// 转换历史文章到Essay格式
const convertArticleToEssay = (article: Article): EssayData => {
  const sections: EssaySection[] = article.content.map((paragraph, index) => ({
    id: `section-${index}`,
    heading: paragraph.type === 'heading' ? paragraph.content : `段落 ${index + 1}`,
    content: paragraph.type === 'heading' ? '' : paragraph.content,
    order: index
  }));

  return {
    id: article.id,
    title: article.title,
    status: article.status === 'completed' ? 'polished' : 
            article.status === 'in-progress' ? 'draft' : 'idea',
    outline: article.outline || [],
    sections,
    metadata: {
      type: article.metadata.type,
      language: article.metadata.language,
      wordRange: `${article.metadata.wordCount}字`,
      audience: article.metadata.targetAudience
    }
  };
};

// 默认Essay数据
const getDefaultEssay = (): EssayData => ({
  id: "essay-001",
  title: "AI与教育的未来发展",
  status: "draft",
  outline: ["引言", "AI在教育中的现状", "技术优势与挑战", "未来发展方向", "结论"],
  sections: [
    {
      id: "intro",
      heading: "引言",
      content: "人工智能技术的快速发展正在深刻改变着教育领域。从个性化学习到智能辅导，AI技术为教育带来了前所未有的机遇。本文将探讨AI在教育中的应用现状、面临的挑战以及未来的发展方向。",
      order: 0
    },
    {
      id: "current",
      heading: "AI在教育中的现状",
      content: "当前，AI技术在教育领域的应用主要集中在几个方面：自适应学习平台能够根据学生的学习进度和能力调整教学内容；智能评测系统可以快速准确地评估学生的学习成果；虚拟助教为学生提供24小时的学习支持。这些应用已经在全球范围内得到了广泛的实践。",
      order: 1
    },
    {
      id: "challenges",
      heading: "技术优势与挑战",
      content: "AI技术的优势在于其能够处理大量数据，提供个性化的学习体验，并且不受时间和地点的限制。然而，这一技术也面临着诸多挑战：数据隐私和安全问题、算法偏见、教师角色的重新定义以及技术依赖性等。这些挑战需要教育工作者、技术开发者和政策制定者共同努力来解决。",
      order: 2
    },
    {
      id: "future",
      heading: "未来发展方向",
      content: "展望未来，AI在教育中的应用将更加深入和广泛。我们可以预期看到更加智能的学习环境、更精准的能力评估、更有效的教学方法。同时，人机协作将成为新的教学模式，教师的作用将从知识传授者转变为学习引导者和情感支持者。",
      order: 3
    },
    {
      id: "conclusion",
      heading: "结论",
      content: "AI技术为教育发展带来了巨大的潜力，但也需要我们谨慎应对其中的挑战。只有在确保技术服务于教育本质的前提下，我们才能真正实现AI与教育的良性发展，为学习者创造更好的教育体验。",
      order: 4
    }
  ],
  metadata: {
    type: "学术评论",
    language: "中文",
    wordRange: "800-1200字",
    audience: "学术读者"
  }
});

const EssayEditor = () => {
  const { toast } = useToast();
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { getBalance, canAfford, consumeCredits, getCost } = useCredit();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [pendingExport, setPendingExport] = useState<{ format: "markdown" | "docx"; wordCount: number } | null>(null);
  
  // 从历史记录或sessionStorage获取文章数据并初始化essay
  const [essay, setEssay] = useState<EssayData>(() => {
    // 如果有articleId，从历史记录加载
    if (articleId) {
      const article = getArticleById(articleId);
      if (article) {
        return convertArticleToEssay(article);
      } else {
        // 文章不存在，跳转到历史记录页面
        toast({
          title: "文章未找到",
          description: "请选择一个有效的文章进行编辑",
          variant: "destructive"
        });
        navigate('/history');
        return getDefaultEssay();
      }
    }
    
    // 检查表单数据
    const formData = sessionStorage.getItem('essayFormData');
    if (formData) {
      const parsed = JSON.parse(formData);
      return {
        id: `essay-${Date.now()}`,
        title: parsed.title || "新Essay",
        status: "outline" as const,
        outline: ["引言", "主体段落", "结论"],
        sections: [{
          id: "generating",
          heading: "正在生成中...",
          content: `正在基于您的要求生成Essay内容...\n\n生成参数：\n- 主题：${parsed.title}\n- 类型：${parsed.type}\n- 语言：${parsed.language}\n- 字数范围：${parsed.wordRange}`,
          order: 0
        }],
        metadata: {
          type: parsed.type || "学术论文",
          language: parsed.language || "中文",
          wordRange: parsed.wordRange || "800-1200字",
          audience: parsed.audience || "学术读者"
        }
      };
    }
    
    // 返回默认数据
    return getDefaultEssay();
  });
  
  // 模拟AI生成过程
  useEffect(() => {
    const formData = sessionStorage.getItem('essayFormData');
    if (formData && essay.sections[0]?.id === "generating") {
      const parsed = JSON.parse(formData);
      
      // 5秒后开始生成内容
      setTimeout(() => {
        setEssay(prev => ({
          ...prev,
          status: "draft",
          outline: ["引言", "主体论述", "结论与展望"],
          sections: [
            {
              id: "intro",
              heading: "引言",
              content: `${parsed.title}是当今学术界关注的重要议题。随着社会的快速发展和技术的不断进步，这一领域的研究显得尤为重要。本文将从多个角度深入探讨这一主题，分析其现状、挑战与未来发展方向。`,
              order: 0
            },
            {
              id: "body",
              heading: "主体论述",
              content: `在深入分析${parsed.title}的过程中，我们发现该领域存在着多层次的复杂性。首先，从理论层面来看，现有的研究框架为我们提供了坚实的基础。其次，实践层面的发展也为理论研究提供了丰富的案例和数据支持。通过综合分析，我们可以更好地理解这一领域的核心问题和发展趋势。`,
              order: 1
            },
            {
              id: "conclusion",
              heading: "结论与展望",
              content: `通过对${parsed.title}的深入研究，我们得出了一些重要结论。未来的研究应该继续关注理论与实践的结合，推动该领域的健康发展。同时，跨学科的合作也将为这一领域带来新的机遇和挑战。`,
              order: 2
            }
          ]
        }));
        
        // 清除表单数据
        sessionStorage.removeItem('essayFormData');
        
        toast({
          title: "生成完成",
          description: "Essay已成功生成，您可以使用右侧AI助手进行进一步编辑"
        });
      }, 5000);
    }
  }, [toast, essay.sections]);

  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");


  // 计算当前文章字数
  const calculateWordCount = () => {
    return essay.sections.reduce((total, section) => {
      return total + section.content.length;
    }, 0);
  };

  // 估算功能所需字数
  const estimateCredits = (wordCount: number, action: string) => {
    // 返回实际需要消费的字数
    return getCost('document_analysis', wordCount);
  };

  // 检查余额是否足够
  const checkBalance = (requiredCredits: number) => {
    return canAfford('document_analysis', requiredCredits);
  };
  
  const handleExport = (format: "markdown" | "docx") => {
    const wordCount = calculateWordCount();
    const requiredCredits = estimateCredits(wordCount, 'export');
    
    // 检查余额
    if (!checkBalance(requiredCredits)) {
      setPendingExport({ format, wordCount });
      setPaymentModalOpen(true);
      return;
    }
    
    // 执行导出
    proceedWithExport(format, requiredCredits, wordCount);
  };
  
  const proceedWithExport = (format: "markdown" | "docx", requiredCredits: number, wordCount: number) => {
    // 扣除积分 - 使用document_analysis作为服务类型
    const success = consumeCredits(
      'document_analysis',
      wordCount,
      `导出${format.toUpperCase()}：${essay.title}`
    );
    
    if (!success) {
      toast({
        title: "导出失败",
        description: "积分扣除失败，请重试",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "导出中",
      description: `消费${requiredCredits}积分，正在导出为 ${format.toUpperCase()} 格式...`
    });
    
    // TODO: 实际的导出逻辑
    setTimeout(() => {
      toast({
        title: "导出完成",
        description: `Essay已成功导出为 ${format.toUpperCase()} 格式`
      });
    }, 2000);
  };
  
  const handlePaymentSuccess = () => {
    if (pendingExport) {
      const requiredCredits = estimateCredits(pendingExport.wordCount, 'export');
      proceedWithExport(pendingExport.format, requiredCredits, pendingExport.wordCount);
      setPendingExport(null);
    }
  };

  // 处理AI检测
  const handleAIDetection = () => {
    navigate('/ai-detection');
  };

  // 处理抄袭检测
  const handlePlagiarismDetection = () => {
    navigate('/plagiarism-detection');
  };


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="h-screen bg-background flex flex-col overflow-hidden">
          {/* 顶部状态栏 */}
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-semibold">{essay.title}</h1>
                  <Badge variant="secondary">
                    {essay.status === "draft" ? "草稿" : essay.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  {/* 导出下拉菜单 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        导出
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleExport("markdown")}>
                        <FileText className="mr-2 h-4 w-4" />
                        导出 MD ({Math.round(getCost('document_analysis', calculateWordCount()))}字)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("docx")}>
                        <FileText className="mr-2 h-4 w-4" />
                        导出 DOCX ({Math.round(getCost('document_analysis', calculateWordCount()))}字)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* AI检测按钮 */}
                  <Button variant="outline" size="sm" onClick={handleAIDetection}>
                    <Shield className="mr-2 h-4 w-4" />
                    AI检测
                  </Button>

                  {/* 抄袭检测按钮 */}
                  <Button variant="outline" size="sm" onClick={handlePlagiarismDetection}>
                    <Search className="mr-2 h-4 w-4" />
                    抄袭检测
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* 主要内容区域 */}
          <div className="flex-1 flex gap-6 px-4 py-6 overflow-hidden">
            {/* 左侧导航 */}
            <div className="w-64 flex-shrink-0">
              <EssayNavigation 
                outline={essay.outline}
                sections={essay.sections}
                selectedSection={selectedSection}
                onSectionSelect={setSelectedSection}
              />
            </div>

            {/* 中间文稿区域 */}
            <div className="flex-1 overflow-hidden">
              <EssayContent 
                essay={essay}
                operations={[]}
                selectedSection={selectedSection}
                onTextSelect={setSelectedText}
                onSectionSelect={setSelectedSection}
              />
            </div>

            {/* 右侧助手面板 */}
            <div className="w-96 flex-shrink-0">
              <Card className="h-full">
                <Tabs defaultValue="chat" className="h-full flex flex-col">
                  <div className="p-4 border-b">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="chat" className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        AI助手
                      </TabsTrigger>
                      <TabsTrigger value="knowledge" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        知识库
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <TabsContent value="chat" className="h-full m-0 p-4 data-[state=active]:flex data-[state=active]:flex-col">
                      <AIChat className="h-full" />
                    </TabsContent>

                    <TabsContent value="knowledge" className="h-full m-0 p-4 data-[state=active]:flex data-[state=active]:flex-col">
                      <KnowledgeLibrarySidebar />
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>
            </div>
          </div>
          
          {/* 付费弹窗 */}
          <RechargeDialog
            open={paymentModalOpen}
            onOpenChange={setPaymentModalOpen}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default EssayEditor;