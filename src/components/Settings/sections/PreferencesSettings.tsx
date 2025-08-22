import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';
import { toast } from 'sonner';
import { UserPreferences } from '@/lib/types';
import { mockUserPreferences } from '@/lib/mockData';

const PreferencesSettings: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(mockUserPreferences);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: API call to save preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('偏好设置已保存');
    } catch (error) {
      toast.error('保存失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const citationFormats = [
    { value: 'APA', label: 'APA (American Psychological Association)' },
    { value: 'MLA', label: 'MLA (Modern Language Association)' },
    { value: 'Chicago', label: 'Chicago/Turabian' },
    { value: 'IEEE', label: 'IEEE (Institute of Electrical and Electronics Engineers)' },
    { value: 'GB/T 7714', label: 'GB/T 7714 (中国国家标准)' }
  ];

  const languageLevels = [
    { value: '本科', label: '本科 (Undergraduate)' },
    { value: '研究生', label: '研究生 (Graduate)' },
    { value: 'ESL', label: 'ESL (English as Second Language)' },
    { value: '专业', label: '专业 (Professional)' }
  ];

  const verificationLevels = [
    { value: 'Basic', label: '基础', description: '基本引用检查' },
    { value: 'Standard', label: '标准', description: '全面引用核验' },
    { value: 'Pro', label: '专业', description: '深度学术验证' }
  ];

  return (
    <div className="space-y-6">
      {/* 默认设置 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold">默认设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 默认引用格式 */}
          <div className="space-y-3">
            <Label>默认引用格式</Label>
            <RadioGroup
              value={preferences.defaultCitationFormat}
              onValueChange={(value: any) => 
                setPreferences({...preferences, defaultCitationFormat: value})
              }
              className="space-y-2"
            >
              {citationFormats.map((format) => (
                <div key={format.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={format.value} id={format.value} />
                  <Label htmlFor={format.value} className="text-sm">
                    {format.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* 默认语言水平 */}
          <div className="space-y-2">
            <Label htmlFor="language-level">默认语言水平</Label>
            <Select 
              value={preferences.defaultLanguageLevel} 
              onValueChange={(value: any) => 
                setPreferences({...preferences, defaultLanguageLevel: value})
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* 默认核验等级 */}
          <div className="space-y-3">
            <Label>默认核验等级</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {verificationLevels.map((level) => (
                <div
                  key={level.value}
                  className={`p-3 border rounded-xl cursor-pointer transition-all ${
                    preferences.defaultVerificationLevel === level.value
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-muted-foreground/50'
                  }`}
                  onClick={() => 
                    setPreferences({...preferences, defaultVerificationLevel: level.value as any})
                  }
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${
                      preferences.defaultVerificationLevel === level.value 
                        ? 'bg-primary' 
                        : 'bg-muted-foreground'
                    }`} />
                    <span className="font-medium text-sm">{level.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{level.description}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 编辑器设置 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold">编辑器设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 自动保存 */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>自动保存</Label>
              <p className="text-xs text-muted-foreground">
                自动保存您的编辑内容
              </p>
            </div>
            <Switch
              checked={preferences.autoSave}
              onCheckedChange={(checked) => 
                setPreferences({...preferences, autoSave: checked})
              }
            />
          </div>

          <Separator />

          {/* 启用快捷键 */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>启用快捷键</Label>
              <p className="text-xs text-muted-foreground">
                / 搜索、N 新建、U 上传、A 一键完成
              </p>
            </div>
            <Switch
              checked={preferences.enableShortcuts}
              onCheckedChange={(checked) => 
                setPreferences({...preferences, enableShortcuts: checked})
              }
            />
          </div>

          <Separator />

          {/* 文档宽度说明 */}
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-800">
              <p className="font-medium">结果页文档宽度</p>
              <p>文档显示宽度固定为 760px，以确保最佳阅读体验。此设置不可更改。</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 证据包设置 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold">证据包默认包含项</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>引用清单</Label>
              <p className="text-xs text-muted-foreground">
                导出完整的引用来源清单
              </p>
            </div>
            <Switch
              checked={preferences.evidencePackItems.citationList}
              onCheckedChange={(checked) => 
                setPreferences({
                  ...preferences,
                  evidencePackItems: {
                    ...preferences.evidencePackItems,
                    citationList: checked
                  }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>操作时间线</Label>
              <p className="text-xs text-muted-foreground">
                包含详细的操作审计记录
              </p>
            </div>
            <Switch
              checked={preferences.evidencePackItems.timeline}
              onCheckedChange={(checked) => 
                setPreferences({
                  ...preferences,
                  evidencePackItems: {
                    ...preferences.evidencePackItems,
                    timeline: checked
                  }
                })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>口头核验卡</Label>
              <p className="text-xs text-muted-foreground">
                生成面谈答辩要点总结
              </p>
            </div>
            <Switch
              checked={preferences.evidencePackItems.defenseCard}
              onCheckedChange={(checked) => 
                setPreferences({
                  ...preferences,
                  evidencePackItems: {
                    ...preferences.evidencePackItems,
                    defenseCard: checked
                  }
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* 保存按钮 */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className="rounded-xl"
        >
          {isLoading ? '保存中...' : '保存偏好设置'}
        </Button>
      </div>
    </div>
  );
};

export default PreferencesSettings;