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
import { toast } from "@/hooks/use-toast";
import { ChevronDown, Edit2, Save, Trash2, X } from "lucide-react";

// 一个接近截图风格的渐进式表单（中文）
// 设计目标：简洁卡片 + 顶部进度，保存后自动进入下一步

type FormState = {
  assignmentType?: string;
  service?: string;
  level?: string;
  language?: string;
  size?: string;
  deadline?: string;
  addons?: string[];
  topic?: string;
  subject?: string;
  instruction?: string;
  sourcesStyle?: string;
};

const popularTypes = [
  "论文（任意类型）",
  "案例分析",
  "课程作业",
  "讨论帖",
  "研究报告",
];

const ProgressiveForm = () => {
  const [form, setForm] = useState<FormState>({
    assignmentType: undefined,
    service: undefined,
    level: undefined,
    language: undefined,
    size: "",
    deadline: "",
    addons: [],
    topic: "",
    subject: "",
    instruction: "",
    sourcesStyle: undefined,
  });

  const steps = useMemo(
    () => [
      { key: "service", label: "服务" },
      { key: "level", label: "学术等级" },
      { key: "language", label: "语言" },
      { key: "size", label: "篇幅" },
      { key: "deadline", label: "截止时间" },
      { key: "addons", label: "附加项" },
      { key: "topic", label: "题目" },
      { key: "subject", label: "学科" },
      { key: "instruction", label: "说明" },
      { key: "sourcesStyle", label: "来源与格式" },
    ],
    []
  );
  const [currentStep, setCurrentStep] = useState(0); // 0 表示“任务类型”卡片
  const totalSteps = 1 + steps.length; // 首步 + 其余步骤
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleSave = (targetKey?: keyof FormState) => {
    const getLabelByKey = (key: keyof FormState) =>
      key === "assignmentType" ? "任务类型" : steps.find((s) => s.key === key)?.label || "当前步骤";

    // 目标校验的字段
    const key: keyof FormState = targetKey
      ? targetKey
      : currentStep === 0
      ? "assignmentType"
      : (steps[currentStep - 1].key as keyof FormState);

    const currentLabel = getLabelByKey(key);

    const v = form[key];
    const isValid = Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim().length > 0 : !!v;

    if (!isValid) {
      toast({ title: "未完成", description: `请先填写${currentLabel}` });
      return;
    }

    toast({ title: "已保存", description: `${currentLabel} 已保存` });

    // 计算应前进到的步骤编号（0: 任务类型, 1: service, 2: level, ...）
    const stepNumber = key === "assignmentType" ? 0 : 1 + steps.findIndex((s) => s.key === key);

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
    if (Array.isArray(v)) return v.join("，");
    return v || "未填写";
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-3xl px-4 md:px-0">
        <header className="flex items-center justify-between mb-4 mt-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">订单 9722285</h2>
            <Badge variant="secondary">草稿</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-40 hidden sm:block">
              <Progress value={progress} />
            </div>
            <Button variant="secondary" size="sm" className="hidden sm:inline-flex">
              <Trash2 className="mr-2 h-4 w-4" /> 丢弃草稿
            </Button>
            <Button variant="secondary" size="icon" aria-label="关闭">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {currentStep === 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>任务类型</CardTitle>
              <CardDescription>请选择要完成的任务类型</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">选择</p>
                  <Select
                    value={form.assignmentType}
                    onValueChange={(v) => setForm((f) => ({ ...f, assignmentType: v }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="选择类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">常用</p>
                  <div className="flex flex-wrap gap-2">
                    {popularTypes.map((t) => (
                      <Button
                        key={t}
                        variant={form.assignmentType === t ? "default" : "secondary"}
                        size="sm"
                        onClick={() => setForm((f) => ({ ...f, assignmentType: t }))}
                      >
                        {t}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button onClick={() => handleSave("assignmentType")} className="px-6">
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
        <section aria-label="表单分节">
          {currentStep >= 1 && (
            <Accordion type="single" collapsible value={`item-${currentStep - 1}`}>
              {steps.slice(0, currentStep).map((s, i) => (
                <AccordionItem value={`item-${i}`} key={s.key} id={`section-${i}`}>
                  <AccordionTrigger className="px-4">
                    <div className="flex-1 text-left">
                      <div className="font-medium">{s.label}</div>
                      <div className="text-sm text-muted-foreground truncate">{summaryValue(s.key as keyof FormState)}</div>
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
                      {s.key === "service" && (
                        <Select
                          value={form.service}
                          onValueChange={(v) => setForm((f) => ({ ...f, service: v }))}
                        >
                          <SelectTrigger className="w-full"><SelectValue placeholder="选择服务" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="写作">写作</SelectItem>
                            <SelectItem value="校对">校对</SelectItem>
                            <SelectItem value="改写">改写</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      {s.key === "level" && (
                        <Select
                          value={form.level}
                          onValueChange={(v) => setForm((f) => ({ ...f, level: v }))}
                        >
                          <SelectTrigger className="w-full"><SelectValue placeholder="选择等级" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="高中">高中</SelectItem>
                            <SelectItem value="本科">本科</SelectItem>
                            <SelectItem value="硕士">硕士</SelectItem>
                            <SelectItem value="博士">博士</SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      {s.key === "language" && (
                        <Select
                          value={form.language}
                          onValueChange={(v) => setForm((f) => ({ ...f, language: v }))}
                        >
                          <SelectTrigger className="w-full"><SelectValue placeholder="选择语言" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="中文">中文</SelectItem>
                            <SelectItem value="英语（美式）">英语（美式）</SelectItem>
                            <SelectItem value="英语（英式）">英语（英式）</SelectItem>
                          </SelectContent>
                        </Select>
                      )}

                      {s.key === "size" && (
                        <Input
                          value={form.size || ""}
                          onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                          placeholder="请输入篇幅（例：6 页，双倍行距）"
                        />
                      )}

                      {s.key === "deadline" && (
                        <Input
                          value={form.deadline || ""}
                          onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                          placeholder="请输入截止时间"
                        />
                      )}

                      {s.key === "addons" && (
                        <Input
                          value={form.addons?.join(", ") || ""}
                          onChange={(e) => setForm((f) => ({ ...f, addons: e.target.value.split(/,\s*/).filter(Boolean) }))}
                          placeholder="以逗号分隔输入附加项"
                        />
                      )}

                      {s.key === "topic" && (
                        <Input
                          value={form.topic || ""}
                          onChange={(e) => setForm((f) => ({ ...f, topic: e.target.value }))}
                          placeholder="请输入题目"
                        />
                      )}

                      {s.key === "subject" && (
                        <Input
                          value={form.subject || ""}
                          onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                          placeholder="请输入学科"
                        />
                      )}

                      {s.key === "instruction" && (
                        <Textarea
                          value={form.instruction || ""}
                          onChange={(e) => setForm((f) => ({ ...f, instruction: e.target.value }))}
                          placeholder="填写详细说明"
                          className="min-h-28"
                        />
                      )}

                      {s.key === "sourcesStyle" && (
                        <Select
                          value={form.sourcesStyle}
                          onValueChange={(v) => setForm((f) => ({ ...f, sourcesStyle: v }))}
                        >
                          <SelectTrigger className="w-full"><SelectValue placeholder="选择引用格式" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="APA（含参考文献）">APA（含参考文献）</SelectItem>
                            <SelectItem value="MLA">MLA</SelectItem>
                            <SelectItem value="Chicago">Chicago</SelectItem>
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
      </div>
    </div>
  );
};

export default ProgressiveForm;
