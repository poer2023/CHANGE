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

const NotificationsSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>(mockNotificationSettings);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: API call to save notification settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('通知设置已保存');
    } catch (error) {
      toast.error('保存失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const notificationTypes = [
    {
      key: 'generationComplete',
      title: '生成完成',
      description: '文档生成完成时通知'
    },
    {
      key: 'exportComplete',
      title: '导出完成',
      description: '文档导出完成时通知'
    },
    {
      key: 'orderStatus',
      title: '订单状态',
      description: '订单状态变更时通知'
    },
    {
      key: 'systemAnnouncement',
      title: '系统公告',
      description: '重要系统更新和公告'
    }
  ] as const;

  const frequencyOptions = [
    { value: 'immediate', label: '即时通知' },
    { value: 'daily', label: '每日汇总' },
    { value: 'off', label: '关闭' }
  ];

  return (
    <div className="space-y-6">
      {/* 站内通知 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" />
            站内通知
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
            邮件通知
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 通知频率 */}
          <div className="space-y-2">
            <Label htmlFor="email-frequency">通知频率</Label>
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
              选择 "每日汇总" 将在每天固定时间发送一封邮件汇总
            </p>
          </div>

          <Separator />

          {/* 各类邮件通知开关 */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">邮件通知类型</Label>
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
          {isLoading ? '保存中...' : '保存通知设置'}
        </Button>
      </div>
    </div>
  );
};

export default NotificationsSettings;