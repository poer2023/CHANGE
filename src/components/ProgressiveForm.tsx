import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ChevronDown, Edit2, Save, Trash2, X, FileText } from "lucide-react";

type FormState = {
  // Step A: 任务定义
  essayType?: string;
  topic?: string;
  language?: string;
  wordRange?: string;
  audience?: string;
  
  // Step B: 约束与素材
  thesis?: string;
  structure?: string;
  citationStyle?: string;
  materials?: string;
  
  // Step C: 质量选项
  factCheck?: string;
  useTemplate?: boolean;
  modelSource?: string;
};

const essayTypes = [
  "Argumentative Essay",
  "Analytical Essay", 
  "Compare & Contrast",
  "申请文书",
  "学术评论",
  "研究报告",
];

const audiences = [
  "学术读者",
  "招生官",
  "一般读者",
  "专业同行",
];

const citationStyles = [
  "APA",
  "MLA", 
  "Chicago",
  "GB/T 7714",
];

const modelSources = [
  "本地 (Ollama)",
  "云端 (OpenAI)",
  "云端 (Anthropic)",
];

const structureOptions = [
  "5段式",
  "自由结构",
  "对比式",
  "论证式",
];

const factCheckOptions = [
  "轻",
  "中",
  "严格",
];

const ProgressiveForm = () => {
  const [form, setForm] = useState<FormState>({
    essayType: undefined,
    topic: "",
    language: "中文",
    wordRange: "",
    audience: undefined,
    thesis: "",
    structure: "5段式",
    citationStyle: undefined,
    materials: "",
    factCheck: "轻",
    useTemplate: false,
    modelSource: "本地 (Ollama)",
  });

  const steps = useMemo(
    () => [
      // Step A: 任务定义
      { key: "topic", label: "主题/Prompt", required: true },
      { key: "language", label: "语言", required: true },
      { key: "wordRange", label: "字数范围", required: true },
      { key: "audience", label: "读者与语气", required: true },
      
      // Step B: 约束与素材 (可选)
      { key: "thesis", label: "论点/Thesis", required: false },
      { key: "structure", label: "段落结构", required: false },
      { key: "citationStyle", label: "引用风格", required: false },
      { key: "materials", label: "素材", required: false },
      
      // Step C: 质量选项
      { key: "factCheck", label: "事实性检查", required: false },
      { key: "useTemplate", label: "可复用模板", required: false },
      { key: "modelSource", label: "模型来源", required: false },
    ],
    []
  );
  
  const [currentStep, setCurrentStep] = useState(0); // 0 表示"Essay类型"卡片
  const totalSteps = 1 + steps.length; // 首步 + 其余步骤
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleSave = (targetKey?: keyof FormState) => {
    const getLabelByKey = (key: keyof FormState) =>
      key === "essayType" ? "Essay类型" : steps.find((s) => s.key === key)?.label || "当前步骤";

    // 目标校验的字段
    const key: keyof FormState = targetKey
      ? targetKey
      : currentStep === 0
      ? "essayType"
      : (steps[currentStep - 1].key as keyof FormState);

    const currentLabel = getLabelByKey(key);
    const stepInfo = steps.find(s => s.key === key);

    const v = form[key];
    const isValid = Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim().length > 0 : !!v;

    // 跳过可选字段的校验
    if (!isValid && (key === "essayType" || stepInfo?.required)) {
      toast({ title: "未完成", description: `请先填写${currentLabel}` });
      return;
    }

    toast({ title: "已保存", description: `${currentLabel} 已保存` });

    // 计算应前进到的步骤编号（0: Essay类型, 1+: steps中的项目）
    const stepNumber = key === "essayType" ? 0 : 1 + steps.findIndex((s) => s.key === key);

    // 仅当保存的是当前步骤时前进；否则保持当前步骤
    if (currentStep === stepNumber) {
      const nextStep = Math.min(currentStep + 1, totalSteps - 1);
      setCurrentStep(nextStep);

      if (nextStep >= 1) {
        const nextId = `section-${nextStep - 1}`;
        setTimeout(() => {
          document.getElementById(nextId)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50);
      }
    }
  };
  
  const summaryValue = (key: keyof FormState) => {
    const v = form[key];
    if (typeof v === "boolean") return v ? "是" : "否";
    if (Array.isArray(v)) return v.join("，");
    return v || "未填写";
  };

  const handleGenerate = () => {
    // 检查必填字段
    const requiredFields = [
      { key: "essayType", label: "Essay类型" },
      ...steps.filter(s => s.required)
    ];
    
    for (const field of requiredFields) {
      const value = form[field.key as keyof FormState];
      const isValid = typeof value === "string" ? value.trim().length > 0 : !!value;
      if (!isValid) {
        toast({ 
          title: "信息不完整", 
          description: `请填写必填项：${field.label}` 
        });
        return;
      }
    }
    
    toast({ 
      title: "开始生成", 
      description: "正在生成您的Essay，请稍候..." 
    });
    
    // TODO: 实际的生成逻辑
    setTimeout(() => {
      window.location.href = '/essay-editor';
    }, 2000);
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl px-4 md:px-0">
        <header className="flex items-center justify-between mb-4 mt-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">Essay 生成器</h2>
            <Badge variant="secondary">配置中</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-40 hidden sm:block">
              <Progress value={progress} />
            </div>
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
              <Trash2 className="mr-2 h-4 w-4" /> 重置
            </Button>
            <Button variant="secondary" size="icon" aria-label="关闭">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Step A: Essay 类型选择 */}
        {currentStep === 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Essay 类型</CardTitle>
              <CardDescription>选择您要写作的Essay类型</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">选择类型</p>
                  <Select
                    value={form.essayType}
                    onValueChange={(v) => setForm((f) => ({ ...f, essayType: v }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择Essay类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {essayTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">常用类型</p>
                  <div className="flex flex-wrap gap-2">
                    {essayTypes.map((t) => (
                      <Button
                        key={t}
                        variant={form.essayType === t ? "default" : "secondary"}
                        size="sm"
                        onClick={() => setForm((f) => ({ ...f, essayType: t }))}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button onClick={() => handleSave("essayType")} className="px-6">
                    <Save className="mr-2 h-4 w-4" /> 保存
                  </Button>
                  <Button variant="secondary" size="icon" aria-label="更多">
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 已完成的Essay类型展示 */}
        {currentStep > 0 && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Essay类型</h3>
                  <p className="text-sm text-muted-foreground">{summaryValue("essayType")}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentStep(0)}
                >
                  <Edit2 className="mr-2 h-4 w-4" /> 修改
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 渐进式步骤 */}
        <section aria-label="表单分节">
          {currentStep >= 1 && (
            <Accordion type="single" collapsible value={`item-${currentStep - 1}`}>
              {steps.slice(0, currentStep).map((s, i) => (
                <AccordionItem value={`item-${i}`} key={s.key} id={`section-${i}`}>
                  <AccordionTrigger className="px-4">
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{s.label}</div>
                        {s.required && <span className="text-destructive">*</span>}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {summaryValue(s.key as keyof FormState)}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="ml-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        const el = document.getElementById(`section-${i}`);
                        el?.scrollIntoView({ behavior: "smooth", block: "center" });
                        setCurrentStep(i + 1);
                      }}
                    >
                      <Edit2 className="mr-2 h-4 w-4" /> 编辑
                    </Button>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-4 pb-4">
                      {s.key === "topic" && (
                        <Textarea
                          value={form.topic || ""}
                          onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                          placeholder="请输入Essay主题或Prompt..."
                          className="min-h-24"
                        />
                      )}

                      {s.key === "language" && (
                        <Select
                          value={form.language}
                          onValueChange={(v) => setForm((f) => ({ ...f, language: v }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="选择语言" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="中文">中文</SelectItem>
                            <SelectItem value="英语（美式）">英语（美式）</SelectItem>
                            <SelectItem value="英语（英式）">英语（英式）</SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      {s.key === "wordRange" && (
                        <Input
                          value={form.wordRange || ""}
                          onChange={(e) => setForm((f) => ({ ...f, wordRange: e.target.value }))}
                          placeholder="例：800-1200字 或 1000-1500词"
                        />
                      )}

                      {s.key === "audience" && (
                        <Select
                          value={form.audience}
                          onValueChange={(v) => setForm((f) => ({ ...f, audience: v }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="选择目标读者" />
                          </SelectTrigger>
                          <SelectContent>
                            {audiences.map((audience) => (
                              <SelectItem key={audience} value={audience}>
                                {audience}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {s.key === "thesis" && (
                        <Textarea
                          value={form.thesis || ""}
                          onChange={(e) => setForm((f) => ({ ...f, thesis: e.target.value }))}
                          placeholder="输入您的论点，留空则由AI生成候选论点..."
                          className="min-h-20"
                        />
                      )}

                      {s.key === "structure" && (
                        <Select
                          value={form.structure}
                          onValueChange={(v) => setForm((f) => ({ ...f, structure: v }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="选择段落结构" />
                          </SelectTrigger>
                          <SelectContent>
                            {structureOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {s.key === "citationStyle" && (
                        <Select
                          value={form.citationStyle}
                          onValueChange={(v) => setForm((f) => ({ ...f, citationStyle: v }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="选择引用格式" />
                          </SelectTrigger>
                          <SelectContent>
                            {citationStyles.map((style) => (
                              <SelectItem key={style} value={style}>
                                {style}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {s.key === "materials" && (
                        <Textarea
                          value={form.materials || ""}
                          onChange={(e) => setForm((f) => ({ ...f, materials: e.target.value }))}
                          placeholder="粘贴相关素材、参考文献或上传文档内容..."
                          className="min-h-32"
                        />
                      )}

                      {s.key === "factCheck" && (
                        <Select
                          value={form.factCheck}
                          onValueChange={(v) => setForm((f) => ({ ...f, factCheck: v }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="选择检查级别" />
                          </SelectTrigger>
                          <SelectContent>
                            {factCheckOptions.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option} - {option === "轻" ? "基础检查" : option === "中" ? "逻辑自洽检查" : "严格事实验证"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {s.key === "useTemplate" && (
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="use-template"
                            checked={form.useTemplate}
                            onCheckedChange={(checked) => setForm((f) => ({ ...f, useTemplate: checked }))}
                          />
                          <Label htmlFor="use-template">
                            启用可复用模板（保存结构供后续使用）
                          </Label>
                        </div>
                      )}

                      {s.key === "modelSource" && (
                        <Select
                          value={form.modelSource}
                          onValueChange={(v) => setForm((f) => ({ ...f, modelSource: v }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="选择模型来源" />
                          </SelectTrigger>
                          <SelectContent>
                            {modelSources.map((source) => (
                              <SelectItem key={source} value={source}>
                                {source}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      <Separator className="my-4" />
                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleSave(s.key as keyof FormState)} className="px-6">
                          <Save className="mr-2 h-4 w-4" /> 保存该项
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setCurrentStep((s) => Math.max(s - 1, 0))}
                        >
                          上一步
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleSave(s.key as keyof FormState)}
                        >
                          下一步
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </section>

        {/* 生成按钮 */}
        {currentStep >= totalSteps - 1 && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">准备生成Essay</h3>
                  <p className="text-muted-foreground">
                    所有信息已收集完毕，点击生成开始创建您的Essay初稿
                  </p>
                </div>
                <Button onClick={handleGenerate} size="lg" className="px-8">
                  <FileText className="mr-2 h-5 w-5" />
                  生成Essay初稿
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProgressiveForm;