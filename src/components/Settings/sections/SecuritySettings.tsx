import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { QrCode, Shield, Smartphone, AlertTriangle, LogOut, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Session } from '@/lib/types';
import { generateMockSessions } from '@/lib/mockData';

const SecuritySettings: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>(generateMockSessions(5));
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      toast.error('请填写所有密码字段');
      return;
    }

    if (passwordForm.new !== passwordForm.confirm) {
      toast.error('新密码和确认密码不匹配');
      return;
    }

    if (passwordForm.new.length < 8) {
      toast.error('新密码长度至少8位');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('密码修改成功');
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (error) {
      toast.error('密码修改失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTwoFactor = () => {
    if (twoFactorEnabled) {
      // 关闭2FA需要确认
      if (window.confirm('确定要关闭双重验证吗？这会降低您的账户安全性。')) {
        setTwoFactorEnabled(false);
        toast.success('双重验证已关闭');
      }
    } else {
      // 开启2FA显示对话框
      setShowTwoFactorDialog(true);
    }
  };

  const handleEnable2FA = () => {
    setTwoFactorEnabled(true);
    setShowTwoFactorDialog(false);
    toast.success('双重验证已开启');
  };

  const handleLogoutDevice = (sessionId: string) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    toast.success('设备已退出登录');
  };

  const handleLogoutAll = () => {
    if (window.confirm('确定要退出所有设备的登录吗？（当前设备除外）')) {
      setSessions(sessions.filter(s => s.current));
      toast.success('已退出所有其他设备');
    }
  };

  const copyCodes = () => {
    const codes = [
      '1a2b3c4d', '5e6f7g8h', '9i0j1k2l', '3m4n5o6p',
      '7q8r9s0t', '1u2v3w4x', '5y6z7a8b', '9c0d1e2f'
    ];
    navigator.clipboard.writeText(codes.join('\n'));
    toast.success('恢复码已复制到剪贴板');
  };

  const formatTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  return (
    <div className="space-y-6">
      {/* 修改密码 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold">修改密码</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">当前密码</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordForm.current}
                onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-password">新密码</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordForm.new}
                onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-password">确认新密码</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordForm.confirm}
                onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handlePasswordChange}
              disabled={isLoading}
              className="rounded-xl"
            >
              {isLoading ? '修改中...' : '修改密码'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 双重验证 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" />
            双重验证 (2FA)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {twoFactorEnabled ? '双重验证已开启' : '双重验证已关闭'}
              </p>
              <p className="text-xs text-muted-foreground">
                通过手机应用程序增强您的账户安全性
              </p>
            </div>
            
            <Switch 
              checked={twoFactorEnabled}
              onCheckedChange={handleToggleTwoFactor}
            />
          </div>
        </CardContent>
      </Card>

      {/* 登录设备与会话 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold flex items-center justify-between">
            登录设备与会话
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-xl"
              onClick={handleLogoutAll}
            >
              <LogOut className="h-3 w-3 mr-1" />
              退出所有设备
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>设备</TableHead>
                <TableHead>浏览器</TableHead>
                <TableHead>位置</TableHead>
                <TableHead>最后活跃</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{session.device}</span>
                      {session.current && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          当前设备
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {session.agent}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {session.city} ({session.ip})
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatTime(session.lastActiveAt)}
                  </TableCell>
                  <TableCell>
                    {!session.current && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleLogoutDevice(session.id)}
                      >
                        <LogOut className="h-3 w-3 mr-1" />
                        退出
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 2FA 设置对话框 */}
      <Dialog open={showTwoFactorDialog} onOpenChange={setShowTwoFactorDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              开启双重验证
            </DialogTitle>
            <DialogDescription>
              使用认证应用扫描二维码来设置双重验证
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* 二维码占位 */}
            <div className="flex justify-center p-4">
              <div className="w-48 h-48 bg-muted rounded-xl flex items-center justify-center">
                <QrCode className="h-16 w-16 text-muted-foreground" />
              </div>
            </div>
            
            {/* 恢复码 */}
            <div className="space-y-2">
              <Label>恢复码 (请安全保存)</Label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-muted p-3 rounded-xl">
                <div>1a2b3c4d</div>
                <div>5e6f7g8h</div>
                <div>9i0j1k2l</div>
                <div>3m4n5o6p</div>
                <div>7q8r9s0t</div>
                <div>1u2v3w4x</div>
                <div>5y6z7a8b</div>
                <div>9c0d1e2f</div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full rounded-xl"
                onClick={copyCodes}
              >
                <Copy className="h-3 w-3 mr-1" />
                复制恢复码
              </Button>
            </div>
            
            {/* 警告 */}
            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800">
                <p className="font-medium">请妥善保存恢复码</p>
                <p>如果您丢失了认证设备，恢复码是找回账户的唯一方式。</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl"
                onClick={() => setShowTwoFactorDialog(false)}
              >
                取消
              </Button>
              <Button 
                className="flex-1 rounded-xl"
                onClick={handleEnable2FA}
              >
                开启验证
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecuritySettings;