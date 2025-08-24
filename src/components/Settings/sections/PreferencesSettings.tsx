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
import { useTranslation } from '@/hooks/useTranslation';

const PreferencesSettings: React.FC = () => {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState<UserPreferences>(mockUserPreferences);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: API call to save preferences
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('preferences.saved_success'));
    } catch (error) {
      toast.error(t('preferences.save_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const citationFormats = [
    { value: 'APA', label: t('citation.format.apa') },
    { value: 'MLA', label: t('citation.format.mla') },
    { value: 'Chicago', label: t('citation.format.chicago') },
    { value: 'IEEE', label: t('citation.format.ieee') },
    { value: 'GB/T 7714', label: t('citation.format.gb_t_7714') }
  ];

  const languageLevels = [
    { value: '本科', label: t('language_level.undergraduate') },
    { value: '研究生', label: t('language_level.graduate') },
    { value: 'ESL', label: t('language_level.esl') },
    { value: '专业', label: t('language_level.professional') }
  ];

  const verificationLevels = [
    { value: 'Basic', label: t('verification.basic'), description: t('verification.basic_desc') },
    { value: 'Standard', label: t('verification.standard'), description: t('verification.standard_desc') },
    { value: 'Pro', label: t('verification.pro'), description: t('verification.pro_desc') }
  ];

  return (
    <div className="space-y-6">
      {/* 默认设置 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold">{t('preferences.default_settings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 默认引用格式 */}
          <div className="space-y-3">
            <Label>{t('preferences.default_citation_format')}</Label>
            <RadioGroup
              value={preferences.defaultCitationFormat}
              onValueChange={(value: string) => 
                setPreferences({...preferences, defaultCitationFormat: value as UserPreferences['defaultCitationFormat']})
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
            <Label htmlFor="language-level">{t('preferences.default_language_level')}</Label>
            <Select 
              value={preferences.defaultLanguageLevel} 
              onValueChange={(value: string) => 
                setPreferences({...preferences, defaultLanguageLevel: value as UserPreferences['defaultLanguageLevel']})
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
            <Label>{t('preferences.default_verification_level')}</Label>
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
                    setPreferences({...preferences, defaultVerificationLevel: level.value as UserPreferences['defaultVerificationLevel']})
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
          <CardTitle className="text-[16px] font-semibold">{t('preferences.editor_settings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 自动保存 */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>{t('preferences.auto_save')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('preferences.auto_save_desc')}
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
              <Label>{t('preferences.enable_shortcuts')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('preferences.shortcuts_desc')}
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
              <p className="font-medium">{t('preferences.document_width_note_title')}</p>
              <p>{t('preferences.document_width_note_desc')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 证据包设置 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold">{t('preferences.evidence_pack_settings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>{t('preferences.citation_list')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('preferences.citation_list_desc')}
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
              <Label>{t('preferences.timeline')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('preferences.timeline_desc')}
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
              <Label>{t('preferences.defense_card')}</Label>
              <p className="text-xs text-muted-foreground">
                {t('preferences.defense_card_desc')}
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
          {isLoading ? t('preferences.saving') : t('preferences.save_preferences')}
        </Button>
      </div>
    </div>
  );
};

export default PreferencesSettings;