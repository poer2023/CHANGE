import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { NotificationSettings } from '@/lib/types';
import { mockNotificationSettings } from '@/lib/mockData';
import { useTranslation } from '@/hooks/useTranslation';

const NotificationsSettings: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<NotificationSettings>(mockNotificationSettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: API call to save notification settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('notifications.save.success'));
    } catch (error) {
      toast.error(t('notifications.save.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const notificationTypes = [
    {
      key: 'generationComplete',
      title: t('notifications.type.generation_complete.title'),
      description: t('notifications.type.generation_complete.description')
    },
    {
      key: 'exportComplete',
      title: t('notifications.type.export_complete.title'),
      description: t('notifications.type.export_complete.description')
    },
    {
      key: 'orderStatus',
      title: t('notifications.type.order_status.title'),
      description: t('notifications.type.order_status.description')
    },
    {
      key: 'systemAnnouncement',
      title: t('notifications.type.system_announcement.title'),
      description: t('notifications.type.system_announcement.description')
    }
  ] as const;

  const frequencyOptions = [
    { value: 'immediate', label: t('notifications.frequency.immediate') },
    { value: 'daily', label: t('notifications.frequency.daily') },
    { value: 'off', label: t('notifications.frequency.off') }
  ];

  return (
    <div className="space-y-6">
      {/* 站内通知 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t('notifications.in_app.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notificationTypes.map((type, index) => (
            <React.Fragment key={type.key}>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>{type.title}</Label>
                  <p className="text-xs text-muted-foreground">
                    {type.description}
                  </p>
                </div>
                <Switch
                  checked={settings.inApp[type.key]}
                  onCheckedChange={(checked) => 
                    setSettings({
                      ...settings,
                      inApp: {
                        ...settings.inApp,
                        [type.key]: checked
                      }
                    })
                  }
                />
              </div>
              {index < notificationTypes.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>

      {/* 邮件通知 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {t('notifications.email.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 通知频率 */}
          <div className="space-y-2">
            <Label htmlFor="email-frequency">{t('notifications.frequency.label')}</Label>
            <Select 
              value={settings.email.frequency} 
              onValueChange={(value: 'immediate' | 'daily' | 'off') => 
                setSettings({
                  ...settings,
                  email: {
                    ...settings.email,
                    frequency: value
                  }
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {t('notifications.frequency.description')}
            </p>
          </div>

          <Separator />

          {/* 各类邮件通知开关 */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">{t('notifications.email_types.label')}</Label>
            {notificationTypes.map((type, index) => (
              <React.Fragment key={type.key}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className={settings.email.frequency === 'off' ? 'text-muted-foreground' : ''}>
                      {type.title}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                  <Switch
                    checked={settings.email[type.key]}
                    onCheckedChange={(checked) => 
                      setSettings({
                        ...settings,
                        email: {
                          ...settings.email,
                          [type.key]: checked
                        }
                      })
                    }
                    disabled={settings.email.frequency === 'off'}
                  />
                </div>
                {index < notificationTypes.length - 1 && <Separator />}
              </React.Fragment>
            ))}
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
          {isLoading ? t('notifications.save.loading') : t('notifications.save.button')}
        </Button>
      </div>
    </div>
  );
};

export default NotificationsSettings;