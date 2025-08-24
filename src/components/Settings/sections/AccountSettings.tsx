import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Upload, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { User, InvoiceProfile } from '@/lib/types';
import { mockUser, mockInvoiceProfile } from '@/lib/mockData';
import { useTranslation } from '@/hooks/useTranslation';

const AccountSettings: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User>(mockUser);
  const [invoiceProfile, setInvoiceProfile] = useState<InvoiceProfile>(mockInvoiceProfile);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserSave = async () => {
    setIsLoading(true);
    try {
      // TODO: API call to update user info
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('settings.toast.basic_saved'));
    } catch (error) {
      toast.error(t('settings.toast.save_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvoiceSave = async () => {
    setIsLoading(true);
    try {
      // TODO: API call to update invoice profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('settings.toast.invoice_saved'));
    } catch (error) {
      toast.error(t('settings.toast.save_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    toast.info(t('settings.toast.avatar_dev'));
  };

  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold">{t('settings.account.basic_info')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 头像上传 */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button 
                variant="outline" 
                size="sm"
                className="rounded-xl"
                onClick={handleAvatarUpload}
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('settings.account.change_avatar')}
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                {t('settings.account.avatar_format')}
              </p>
            </div>
          </div>

          {/* 基本信息表单 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('settings.account.name')}</Label>
              <Input
                id="name"
                value={user.name}
                onChange={(e) => setUser({...user, name: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('settings.account.email')}</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  value={user.email}
                  readOnly
                  className="bg-muted"
                />
                {user.emailVerified ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {t('settings.account.verified')}
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    {t('settings.account.unverified')}
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">{t('settings.account.timezone')}</Label>
              <Select value={user.timezone} onValueChange={(value) => setUser({...user, timezone: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Shanghai">Asia/Shanghai (UTC+8)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">{t('settings.account.language')}</Label>
              <Select value={user.language} onValueChange={(value) => setUser({...user, language: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh-CN">{t('settings.account.language.zh_cn')}</SelectItem>
                  <SelectItem value="zh-TW">{t('settings.account.language.zh_tw')}</SelectItem>
                  <SelectItem value="en-US">{t('settings.account.language.en_us')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleUserSave}
              disabled={isLoading}
              className="rounded-xl"
            >
              {isLoading ? t('settings.account.saving') : t('settings.account.save_changes')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 发票抬头信息 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold">{t('settings.account.invoice_title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 发票类型 */}
          <div className="space-y-3">
            <Label>{t('settings.account.invoice_type')}</Label>
            <RadioGroup
              value={invoiceProfile.type}
              onValueChange={(value: 'personal' | 'company') => 
                setInvoiceProfile({...invoiceProfile, type: value})
              }
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal" id="personal" />
                <Label htmlFor="personal">{t('settings.account.invoice_personal')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="company" />
                <Label htmlFor="company">{t('settings.account.invoice_company')}</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 发票信息表单 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                {invoiceProfile.type === 'company' ? t('settings.account.company_name') : t('settings.account.personal_name')}
              </Label>
              <Input
                id="title"
                value={invoiceProfile.title}
                onChange={(e) => setInvoiceProfile({...invoiceProfile, title: e.target.value})}
                required
              />
            </div>

            {invoiceProfile.type === 'company' && (
              <div className="space-y-2">
                <Label htmlFor="taxId">{t('settings.account.tax_id')}</Label>
                <Input
                  id="taxId"
                  value={invoiceProfile.taxId || ''}
                  onChange={(e) => setInvoiceProfile({...invoiceProfile, taxId: e.target.value})}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="address">{t('settings.account.address')}</Label>
              <Input
                id="address"
                value={invoiceProfile.address || ''}
                onChange={(e) => setInvoiceProfile({...invoiceProfile, address: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">{t('settings.account.zip')}</Label>
              <Input
                id="zip"
                value={invoiceProfile.zip || ''}
                onChange={(e) => setInvoiceProfile({...invoiceProfile, zip: e.target.value})}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">{t('settings.account.phone')}</Label>
              <Input
                id="phone"
                value={invoiceProfile.phone || ''}
                onChange={(e) => setInvoiceProfile({...invoiceProfile, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleInvoiceSave}
              disabled={isLoading}
              className="rounded-xl"
            >
              {isLoading ? t('settings.account.saving') : t('settings.account.save_invoice')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;