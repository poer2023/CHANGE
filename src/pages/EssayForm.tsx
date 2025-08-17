import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, FileText, ArrowLeft } from "lucide-react";
import ProgressiveForm from "@/components/ProgressiveForm";
import SmartInputForm, { SmartInputData, AnalysisProgress } from "@/components/SmartInputForm";
import AnalysisResults from "@/components/AnalysisResults";
import SmartProgressiveForm from "@/components/SmartProgressiveForm";
import FormAnalyzer, { AnalysisResult, ExtractedFormData } from "@/components/FormAnalyzer";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

type FormMode = 'input' | 'analyzing' | 'results' | 'form';

const EssayForm = () => {
  const [mode, setMode] = useState<FormMode>('input');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedFormData>({});
  const [activeTab, setActiveTab] = useState<"smart" | "traditional">("smart");

  // 检查首页传来的输入数据
  useEffect(() => {
    const smartInputData = sessionStorage.getItem('smartInputData');
    if (smartInputData) {
      try {
        const data = JSON.parse(smartInputData);
        if (data.text || data.files?.length > 0) {
          // 自动开始智能分析
          setActiveTab("smart");
          // 延迟执行以确保handleAnalysisStart已定义
          setTimeout(() => {
            handleAnalysisStart({
              text: data.text,
              images: [] // 文件处理逻辑可以后续扩展
            });
          }, 100);
          // 清除sessionStorage中的数据
          sessionStorage.removeItem('smartInputData');
        }
      } catch (error) {
        console.error('Failed to parse smart input data:', error);
        sessionStorage.removeItem('smartInputData');
      }
    }
  }, []);

  const handleAnalysisStart = async (data: SmartInputData) => {
    setIsAnalyzing(true);
    setMode('analyzing');
    
    try {
      const analyzer = FormAnalyzer.getInstance();
      const result = await analyzer.analyzeContent(data, (progress) => {
        setAnalysisProgress(progress);
      });
      
      setAnalysisResult(result);
      setExtractedData(result.extractedData);
      setMode('form'); // 直接跳转到表单页面，跳过分析结果页面
    } catch (error) {
      console.error('Analysis failed:', error);
      // Handle error - maybe show error message and go back to input
      setMode('input');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDataEdit = (updatedData: ExtractedFormData) => {
    setExtractedData(updatedData);
  };

  const handleProceedToForm = (finalData: ExtractedFormData) => {
    setExtractedData(finalData);
    setMode('form');
  };

  const handleReanalyze = () => {
    setMode('input');
    setAnalysisResult(null);
    setExtractedData({});
    setAnalysisProgress(null);
  };

  const handleBackToInput = () => {
    setMode('input');
  };

  const renderSmartFormFlow = () => {
    switch (mode) {
      case 'input':
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">智能Essay生成器</h1>
              <p className="text-muted-foreground">
                粘贴您的作业要求或上传相关图片，AI将自动为您分析并填写表单
              </p>
            </div>
            
            <SmartInputForm
              onAnalysisStart={handleAnalysisStart}
              onAnalysisProgress={setAnalysisProgress}
              isAnalyzing={isAnalyzing}
            />
          </div>
        );
        
      case 'analyzing':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold">AI正在分析您的内容</h1>
              <p className="text-muted-foreground">
                请稍等，AI正在从您的内容中提取表单信息...
              </p>
            </div>
            
            <SmartInputForm
              onAnalysisStart={handleAnalysisStart}
              onAnalysisProgress={setAnalysisProgress}
              isAnalyzing={isAnalyzing}
              disabled={true}
            />
          </div>
        );
        
      case 'results':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">分析结果</h1>
                <p className="text-muted-foreground">
                  查看AI提取的信息，确认无误后继续填写表单
                </p>
              </div>
              <Button variant="outline" onClick={handleBackToInput}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回输入
              </Button>
            </div>
            
            {analysisResult && (
              <AnalysisResults
                analysisResult={analysisResult}
                onDataEdit={handleDataEdit}
                onProceed={handleProceedToForm}
                onReanalyze={handleReanalyze}
              />
            )}
          </div>
        );
        
      case 'form':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">完善表单信息</h1>
                <p className="text-muted-foreground">
                  基于AI分析结果，完善剩余的表单信息
                </p>
              </div>
              <Button variant="outline" onClick={handleBackToInput}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回输入
              </Button>
            </div>
            
            <SmartProgressiveForm
              extractedData={extractedData}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main className="min-h-screen bg-background">
          <div className="container max-w-5xl px-4 py-8">
            {/* 模式切换 */}
            <div className="mb-8">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "smart" | "traditional")}>
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                  <TabsTrigger value="smart" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    智能模式
                    <Badge variant="secondary" className="ml-1">推荐</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="traditional" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    传统模式
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="smart" className="mt-8">
                  {renderSmartFormFlow()}
                </TabsContent>

                <TabsContent value="traditional" className="mt-8">
                  <div className="space-y-6">
                    <div className="text-center space-y-2">
                      <h1 className="text-3xl font-bold">Essay生成器</h1>
                      <p className="text-muted-foreground">
                        逐步填写表单信息来生成您的Essay
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <ProgressiveForm />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default EssayForm;