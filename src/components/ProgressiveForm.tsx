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
  // Step 1: Essay Type
  essayType?: string;
  
  // Step 2: Topic
  topic?: string;
  
  // Step 3: Essay Length
  essayLength?: string;
  lengthType?: string;
  
  // Step 4: Essay Level
  essayLevel?: string;
  
  // Step 5: Citation Style
  citationStyle?: string;
  
  // Optional fields (moved to later)
  language?: string;
  audience?: string;
  thesis?: string;
  structure?: string;
  materials?: string;
  factCheck?: string;
  useTemplate?: boolean;
  modelSource?: string;
};

const essayTypes = [
  { value: "Standard Academic Essay", label: "Standard Academic Essay", description: "标准学术论文，常见于大多数课程中，结构规范、内容客观，重点展示对学术主题的理解、分析与研究。" },
  { value: "Argumentative Essay", label: "Argumentative Essay", description: "论证型论文，提出明确立场，通过逻辑推理和证据支持观点，同时反驳反方观点。" },
  { value: "Analytical Essay", label: "Analytical Essay", description: "分析型论文，深入分析某一主题、现象或文本，关注\"如何\"与\"为什么\"，而非仅仅描述事实。" },
  { value: "Critical Essay", label: "Critical Essay", description: "批评性论文，评估他人观点、理论或文本，结合自身立场进行深入讨论与评价。" },
  { value: "Compare & Contrast Essay", label: "Compare & Contrast Essay", description: "对比论文，对两个或多个对象的异同进行比较，常用于理论、事件或文学作品之间的比较分析。" },
  { value: "Personal Statement / Admission Essay", label: "Personal Statement / Admission Essay", description: "个人陈述 / 入学申请文书，用于申请学校或职位，侧重个人经历、动机和未来目标，语言更主观。" },
  { value: "Literary Analysis Essay", label: "Literary Analysis Essay", description: "文学分析论文，分析文学作品中的主题、结构、角色或语言风格，展示文学理解与批评能力。" },
  { value: "Research Paper", label: "Research Paper", description: "研究论文，基于文献资料和数据展开自主研究，提出问题、方法、发现和结论，体现科研能力。" },
  { value: "Research Review (Literature Review)", label: "Research Review (Literature Review)", description: "文献综述，总结、评估某一领域已有研究成果，识别研究空白，常作为研究论文的前置部分。" },
  { value: "Discussion Post", label: "Discussion Post", description: "课堂讨论帖，在线学习中常见，需就特定主题撰写简短、逻辑清晰的观点发表，鼓励互动。" },
  { value: "PPT Presentation with Speaker Notes", label: "PPT Presentation with Speaker Notes", description: "演示型作业，提交带有讲解文字的PPT，展示调研结果、论文结构或课程内容，注重视觉与语言结合。" },
  { value: "Homework (Any Type)", label: "Homework (Any Type)", description: "家庭作业，课程中的常规作业任务，类型多样，可为短文、分析题、反思日志等。" },
  { value: "Case Study", label: "Case Study", description: "案例分析，针对具体案例（如企业、事件、政策等）进行深入分析，提出问题与解决方案。" },
  { value: "Assignment", label: "Assignment", description: "课程作业总称，泛指老师布置的所有书面任务，可涵盖论文、报告、问题集等多种形式。" },
  { value: "Annotated Bibliography", label: "Annotated Bibliography", description: "文献注释，对一组文献进行简要总结与评价，说明其与研究主题的关联及其价值。" },
  { value: "Article Review", label: "Article Review", description: "文章评论，对学术文章进行总结与评析，评估其研究价值、方法合理性和结果可靠性。" },
  { value: "Article Writing", label: "Article Writing", description: "文章撰写，撰写新闻、评论、博客等非学术类文本，考察表达、组织与受众意识能力。" },
  { value: "Book / Movie Review", label: "Book / Movie Review", description: "书籍/电影评论，分析和评价特定书籍或电影的内容、主题与表现形式，常结合批评观点。" },
  { value: "Business Plan", label: "Business Plan", description: "商业计划书，详细阐述创业项目的商业模式、市场策略、财务预测等，面向投资人或导师。" },
  { value: "Business Proposal", label: "Business Proposal", description: "商业提案，针对某一商业需求提出解决方案，重点在说服客户或上级采纳计划。" },
];

const essayLevels = [
  "高中",
  "本科", 
  "学士",
  "硕士",
  "博士"
];

const lengthTypes = [
  "字",
  "词",
  "页"
];

const citationStyles = [
  { value: "APA", label: "APA", description: "常用于心理学、教育学和社会科学领域，强调作者与出版日期" },
  { value: "MLA", label: "MLA", description: "常用于文学、语言学和人文学科，突出作者与页面信息" },
  { value: "Chicago", label: "Chicago", description: "广泛用于历史和一些社会科学，提供两种注释方式（脚注/尾注或作者-日期）" },
  { value: "Harvard", label: "Harvard", description: "作者-日期制的常见引用格式，广泛用于自然科学与社会科学" },
  { value: "ASA", label: "ASA", description: "社会学专用格式，强调作者和年份，适用于 analytical essay、research review 中的社会议题分析" },
  { value: "AMA", label: "AMA", description: "医学与健康科学常用，采用顺序编码，适合临床和科研引用" },
];

const audiences = [
  "学术读者",
  "招生官",
  "一般读者",
  "专业同行",
];

const factCheckOptions = ["轻", "中", "严格"];
const modelSources = ["本地 (Ollama)", "云端 (OpenAI)", "云端 (Anthropic)"];

const ProgressiveForm = () => {
  const [form, setForm] = useState<FormState>({
    essayType: undefined,
    topic: "",
    essayLength: "",
    lengthType: "字",
    essayLevel: undefined,
    citationStyle: undefined,
    language: "中文",
    audience: undefined,
    thesis: "",
    structure: "5段式",
    materials: "",
    factCheck: "轻",
    useTemplate: false,
    modelSource: "本地 (Ollama)",
  });

  const steps = useMemo(
    () => [
      // Required core steps
      { key: "topic", label: "Essay题目", required: true },
      { key: "essayLength", label: "Essay Length", required: true },
      { key: "essayLevel", label: "Essay Level", required: true },
      { key: "citationStyle", label: "Citation Style", required: true },
      
      // Optional advanced settings
      { key: "language", label: "语言", required: false },
      { key: "structure", label: "段落结构", required: false },
      { key: "materials", label: "补充信息", required: false },
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
    
    // 生成Essay数据并传递给编辑器
    const essayData = {
      title: form.topic || "新Essay",
      type: form.essayType,
      length: form.essayLength,
      lengthType: form.lengthType,
      level: form.essayLevel,
      citationStyle: form.citationStyle,
      language: form.language,
      audience: form.audience,
      thesis: form.thesis,
      structure: form.structure,
      materials: form.materials,
      factCheck: form.factCheck,
      useTemplate: form.useTemplate,
      modelSource: form.modelSource,
      timestamp: new Date().toISOString()
    };
    
    // 将数据存储到sessionStorage传递给编辑器
    sessionStorage.setItem('essayFormData', JSON.stringify(essayData));
    
    setTimeout(() => {
      window.location.href = '/essay-editor';
    }, 2000);
  };

  return (
    <div className="w-full flex">
      <div className="flex-1 max-w-3xl px-4 md:px-0">
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
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.essayType && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {essayTypes.find(t => t.value === form.essayType)?.description}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">常用类型</p>
                  <div className="flex flex-wrap gap-2">
                    {essayTypes.slice(0, 6).map((t) => (
                      <Button
                        key={t.value}
                        variant={form.essayType === t.value ? "default" : "secondary"}
                        size="sm"
                        onClick={() => setForm((f) => ({ ...f, essayType: t.value }))}
                      >
                        {t.label}
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
                        <Input
                          value={form.topic || ""}
                          onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                          placeholder="请输入Essay题目..."
                          className="w-full"
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

                      {s.key === "essayLength" && (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <Input
                              value={form.essayLength || ""}
                              onChange={(e) => setForm((f) => ({ ...f, essayLength: e.target.value }))}
                              placeholder="例：800-1200 或 1000"
                              className="flex-1"
                            />
                            <Select
                              value={form.lengthType}
                              onValueChange={(v) => setForm((f) => ({ ...f, lengthType: v }))}
                            >
                              <SelectTrigger className="w-20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {lengthTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      )}

                      {s.key === "essayLevel" && (
                        <Select
                          value={form.essayLevel}
                          onValueChange={(v) => setForm((f) => ({ ...f, essayLevel: v }))}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="选择学术水平" />
                          </SelectTrigger>
                          <SelectContent>
                            {essayLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {s.key === "citationStyle" && (
                        <div className="space-y-3">
                          <Select
                            value={form.citationStyle}
                            onValueChange={(v) => setForm((f) => ({ ...f, citationStyle: v }))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="选择引用格式" />
                            </SelectTrigger>
                            <SelectContent>
                              {citationStyles.map((style) => (
                                <SelectItem key={style.value} value={style.value}>
                                  {style.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {form.citationStyle && (
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {citationStyles.find(s => s.value === form.citationStyle)?.description}
                            </p>
                          )}
                        </div>
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
                            <SelectItem value="5段式">5段式</SelectItem>
                            <SelectItem value="自由结构">自由结构</SelectItem>
                            <SelectItem value="对比式">对比式</SelectItem>
                            <SelectItem value="论证式">论证式</SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                       {s.key === "materials" && (
                         <Textarea
                           value={form.materials || ""}
                           onChange={(e) => setForm((f) => ({ ...f, materials: e.target.value }))}
                           placeholder="请输入补充信息，如参考文献、素材、特殊要求等..."
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