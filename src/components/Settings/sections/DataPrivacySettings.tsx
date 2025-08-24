import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  Trash2, 
  AlertTriangle, 
  Database,
  FileArchive,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

const DataPrivacySettings: React.FC = () => {
  const { t } = useTranslation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCloseAccountDialog, setShowCloseAccountDialog] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const userEmail = 'zhang.xueyou@example.com'; // 从context获取

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // TODO: API call to export data
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(t('settings.data_privacy.toast.export_start'));
    } catch (error) {
      toast.error(t('settings.data_privacy.toast.export_failed'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleClearDrafts = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmClearDrafts = async () => {
    setIsDeleting(true);
    try {
      // TODO: Clear local storage and cache
      localStorage.removeItem('drafts');
      sessionStorage.clear();
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t('settings.data_privacy.toast.drafts_cleared'));
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error(t('settings.data_privacy.toast.clear_failed'));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseAccount = () => {
    setShowCloseAccountDialog(true);
  };

  const handleConfirmCloseAccount = async () => {
    if (confirmEmail !== userEmail) {
      toast.error(t('settings.data_privacy.toast.email_incorrect'));
      return;
    }

    try {
      // TODO: API call to close account
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(t('settings.data_privacy.toast.account_close_submitted'));
      setShowCloseAccountDialog(false);
      setConfirmEmail('');
    } catch (error) {
      toast.error(t('settings.data_privacy.toast.account_close_failed'));
    }
  };

  const exportItems = [
    { label: '所有文稿内容', description: '包括草稿和已完成的文档' },
    { label: '引用数据', description: '所有引用来源和核验记录' },
    { label: '审计日志', description: '完整的操作历史记录' },
    { label: '订单记录', description: '付费记录和发票信息' },
    { label: '个人设置', description: '偏好设置和配置信息' }
  ];

  return (
    <div className="space-y-6">
      {/* 导出数据 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold flex items-center gap-2">
            <FileArchive className="h-4 w-4" />
            导出全部数据
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            您可以导出账户中的所有数据，包括文档、引用、审计记录等。数据将以ZIP格式打包，并发送下载链接到您的邮箱。
          </p>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">导出内容包括：</Label>
            <div className="grid gap-2">
              {exportItems.map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-2 bg-muted/50 rounded-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button 
            onClick={handleExportData}
            disabled={isExporting}
            className="rounded-xl"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? '正在打包...' : '开始导出数据'}
          </Button>
        </CardContent>
      </Card>

      {/* 清除草稿 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold flex items-center gap-2">
            <Database className="h-4 w-4" />
            清除草稿数据
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            清除本地缓存的草稿数据和临时文件。这将删除您在浏览器中保存的未提交内容。
          </p>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              此操作不可逆转。请确保您已保存所有重要的草稿内容。
            </AlertDescription>
          </Alert>
          
          <Button 
            variant="outline"
            onClick={handleClearDrafts}
            className="rounded-xl border-amber-200 text-amber-700 hover:bg-amber-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            清除草稿数据
          </Button>
        </CardContent>
      </Card>

      {/* 关闭账户 - Danger Zone */}
      <Card className="rounded-2xl border border-red-200 bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold flex items-center gap-2 text-red-700">
            <Shield className="h-4 w-4" />
            危险操作区域
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <p className="text-sm font-medium text-red-700">关闭账户</p>
            <p className="text-sm text-muted-foreground">
              永久删除您的账户和所有相关数据。此操作不可逆转，请谨慎考虑。
            </p>
            
            <Alert className="border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm text-red-800">
                <strong>账户关闭后将发生以下情况：</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>所有文档和数据将被永久删除</li>
                  <li>无法恢复任何内容或访问历史记录</li>
                  <li>订阅服务将被取消（按比例退款）</li>
                  <li>您将无法使用此邮箱重新注册</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
          
          <Button 
            variant="destructive"
            onClick={handleCloseAccount}
            className="rounded-xl"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            关闭账户
          </Button>
        </CardContent>
      </Card>

      {/* 清除草稿确认对话框 */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-5 w-5" />
              确认清除草稿
            </DialogTitle>
            <DialogDescription>
              此操作将清除所有本地缓存的草稿数据和临时文件。
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert className="border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-800">
                清除后无法恢复未保存的草稿内容，请确保您已保存所有重要数据。
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
              >
                取消
              </Button>
              <Button 
                variant="destructive"
                className="flex-1 rounded-xl"
                onClick={handleConfirmClearDrafts}
                disabled={isDeleting}
              >
                {isDeleting ? '清除中...' : '确认清除'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 关闭账户确认对话框 */}
      <Dialog open={showCloseAccountDialog} onOpenChange={setShowCloseAccountDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              关闭账户确认
            </DialogTitle>
            <DialogDescription>
              此操作将永久删除您的账户，无法撤销。
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert className="border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm text-red-800">
                <strong>警告：</strong>账户关闭后，所有数据将被永久删除且无法恢复。
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="confirm-email">
                请输入您的邮箱地址以确认此操作：
              </Label>
              <Input
                id="confirm-email"
                type="email"
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder={userEmail}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1 rounded-xl"
                onClick={() => {
                  setShowCloseAccountDialog(false);
                  setConfirmEmail('');
                }}
              >
                取消
              </Button>
              <Button 
                variant="destructive"
                className="flex-1 rounded-xl"
                onClick={handleConfirmCloseAccount}
                disabled={confirmEmail !== userEmail}
              >
                确认关闭账户
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataPrivacySettings;