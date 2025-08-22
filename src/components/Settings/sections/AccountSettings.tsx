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

const AccountSettings: React.FC = () => {
  const [user, setUser] = useState<User>(mockUser);
  const [invoiceProfile, setInvoiceProfile] = useState<InvoiceProfile>(mockInvoiceProfile);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserSave = async () => {
    setIsLoading(true);
    try {
      // TODO: API call to update user info
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('基本信息已保存');
    } catch (error) {
      toast.error('保存失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvoiceSave = async () => {
    setIsLoading(true);
    try {
      // TODO: API call to update invoice profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('发票抬头已保存');
    } catch (error) {
      toast.error('保存失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    toast.info('头像上传功能开发中');
  };

  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold">基本信息</CardTitle>
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
                更换头像
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                支持 JPG、PNG 格式，不超过 2MB
              </p>
            </div>
          </div>

          {/* 基本信息表单 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                value={user.name}
                onChange={(e) => setUser({...user, name: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
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
                    已验证
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    未验证
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">时区</Label>
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
              <Label htmlFor="language">界面语言</Label>
              <Select value={user.language} onValueChange={(value) => setUser({...user, language: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zh-CN">简体中文</SelectItem>
                  <SelectItem value="zh-TW">繁体中文</SelectItem>
                  <SelectItem value="en-US">English</SelectItem>
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
              {isLoading ? '保存中...' : '保存更改'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 发票抬头信息 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold">发票抬头信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 发票类型 */}
          <div className="space-y-3">
            <Label>抬头类型</Label>
            <RadioGroup
              value={invoiceProfile.type}
              onValueChange={(value: 'personal' | 'company') => 
                setInvoiceProfile({...invoiceProfile, type: value})
              }
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal" id="personal" />
                <Label htmlFor="personal">个人</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="company" />
                <Label htmlFor="company">企业</Label>
              </div>
            </RadioGroup>
          </div>

          {/* 发票信息表单 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                {invoiceProfile.type === 'company' ? '企业名称' : '姓名'}
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
                <Label htmlFor="taxId">统一社会信用代码</Label>
                <Input
                  id="taxId"
                  value={invoiceProfile.taxId || ''}
                  onChange={(e) => setInvoiceProfile({...invoiceProfile, taxId: e.target.value})}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="address">地址</Label>
              <Input
                id="address"
                value={invoiceProfile.address || ''}
                onChange={(e) => setInvoiceProfile({...invoiceProfile, address: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">邮政编码</Label>
              <Input
                id="zip"
                value={invoiceProfile.zip || ''}
                onChange={(e) => setInvoiceProfile({...invoiceProfile, zip: e.target.value})}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone">联系电话</Label>
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
              {isLoading ? '保存中...' : '保存发票抬头'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;