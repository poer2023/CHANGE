import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit2, 
  Save, 
  X, 
  Camera,
  Shield,
  CreditCard,
  Activity,
  Award,
  TrendingUp,
  Coins,
  Clock,
  Download,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCredit } from '@/contexts/CreditContext';
import AppSidebarEnhanced from '@/components/AppSidebarEnhanced';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 扩展用户信息接口
interface ExtendedUserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  birthday?: string;
  location?: string;
  bio?: string;
  joinDate: string;
  lastLoginDate: string;
  preferences: {
    language: 'zh' | 'en';
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    emailUpdates: boolean;
  };
}

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { balance, usageStats, refreshBalance, isLoading } = useCredit();
  const { toast } = useToast();
  
  // 扩展的用户信息（模拟数据）
  const [userInfo, setUserInfo] = useState<ExtendedUserInfo>({
    id: user?.id || '1',
    name: user?.name || '用户名',
    email: user?.email || 'user@example.com',
    avatar: user?.avatar,
    phone: '+86 138****8888',
    birthday: '1995-05-15',
    location: '北京市朝阳区',
    bio: '热爱学习，专注于AI和教育领域的研究',
    joinDate: '2024-01-01',
    lastLoginDate: new Date().toISOString(),
    preferences: {
      language: 'zh',
      theme: 'light',
      notifications: true,
      emailUpdates: true,
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(userInfo);

  const handleSave = () => {
    setUserInfo(editForm);
    setIsEditing(false);
    toast({
      title: "保存成功",
      description: "个人信息已更新"
    });
  };

  const handleCancel = () => {
    setEditForm(userInfo);
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "已登出",
      description: "您已成功登出系统"
    });
  };

  const getVipBadge = () => {
    const level = balance.vipLevel;
    const colors = {
      0: 'bg-gray-100 text-gray-700',
      1: 'bg-amber-100 text-amber-700',
      2: 'bg-blue-100 text-blue-700',
      3: 'bg-purple-100 text-purple-700',
      4: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
    };
    
    const names = {
      0: '普通用户',
      1: '青铜会员',
      2: '白银会员', 
      3: '黄金会员',
      4: '钻石会员'
    };
    
    return (
      <Badge className={colors[level] || colors[0]}>
        <Award className="h-3 w-3 mr-1" />
        {names[level] || names[0]}
      </Badge>
    );
  };

  return (
    <SidebarProvider>
      <AppSidebarEnhanced />
      <SidebarInset>
        <div className="min-h-screen bg-background">
          <div className="container max-w-6xl mx-auto px-4 py-8">
            {/* 页面标题 */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">个人中心</h1>
                <p className="text-muted-foreground">管理您的账户信息和使用数据</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={refreshBalance} disabled={isLoading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  刷新数据
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  登出
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 左侧：个人信息 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 基本信息卡片 */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        基本信息
                      </CardTitle>
                      {!isEditing ? (
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          编辑
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSave}>
                            <Save className="h-4 w-4 mr-2" />
                            保存
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleCancel}>
                            <X className="h-4 w-4 mr-2" />
                            取消
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 头像区域 */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                          <AvatarFallback className="text-lg">
                            {userInfo.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="absolute -bottom-2 -right-2 h-8 w-8 p-0 rounded-full"
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{userInfo.name}</h3>
                          {getVipBadge()}
                        </div>
                        <p className="text-sm text-muted-foreground">{userInfo.email}</p>
                        <p className="text-sm text-muted-foreground">
                          加入时间: {format(new Date(userInfo.joinDate), 'yyyy年MM月dd日', { locale: zhCN })}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* 表单字段 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">姓名</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {userInfo.name}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">邮箱</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            {userInfo.email}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">手机号</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            value={editForm.phone || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {userInfo.phone || '未设置'}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthday">生日</Label>
                        {isEditing ? (
                          <Input
                            id="birthday"
                            type="date"
                            value={editForm.birthday || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, birthday: e.target.value }))}
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {userInfo.birthday ? format(new Date(userInfo.birthday), 'yyyy年MM月dd日', { locale: zhCN }) : '未设置'}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="location">所在地</Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            value={editForm.location || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                          />
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {userInfo.location || '未设置'}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">个人简介</Label>
                        {isEditing ? (
                          <Input
                            id="bio"
                            value={editForm.bio || ''}
                            onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                            placeholder="简单介绍一下自己..."
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            {userInfo.bio || '这个人很懒，什么都没有留下...'}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 账户安全 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      账户安全
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">登录密码</h4>
                        <p className="text-sm text-muted-foreground">最后修改: 30天前</p>
                      </div>
                      <Button variant="outline" size="sm">
                        修改密码
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">两步验证</h4>
                        <p className="text-sm text-muted-foreground">保护您的账户安全</p>
                      </div>
                      <Button variant="outline" size="sm">
                        开启
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">登录设备</h4>
                        <p className="text-sm text-muted-foreground">管理您的登录设备</p>
                      </div>
                      <Button variant="outline" size="sm">
                        查看详情
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 右侧：统计信息 */}
              <div className="space-y-6">
                {/* 余额卡片 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-blue-600" />
                      账户余额
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {balance.wordBalance.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">可用字数</div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>累计充值</span>
                        <span className="font-medium">¥{balance.totalRecharged}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>累计消费</span>
                        <span className="font-medium">¥{balance.totalSpent.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>会员等级</span>
                        <span>{getVipBadge()}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full" onClick={() => window.location.href = '/topup'}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      立即充值
                    </Button>
                  </CardContent>
                </Card>

                {/* 使用统计 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      使用统计
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {usageStats.totalWords.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">累计使用字数</div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Essay生成</span>
                          <span>{usageStats.serviceCounts.essay_generation.count}次</span>
                        </div>
                        <Progress 
                          value={(usageStats.serviceCounts.essay_generation.words / usageStats.totalWords) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>AI对话</span>
                          <span>{usageStats.serviceCounts.ai_chat.count}次</span>
                        </div>
                        <Progress 
                          value={(usageStats.serviceCounts.ai_chat.words / usageStats.totalWords) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>文档分析</span>
                          <span>{usageStats.serviceCounts.document_analysis.count}次</span>
                        </div>
                        <Progress 
                          value={(usageStats.serviceCounts.document_analysis.words / usageStats.totalWords) * 100} 
                          className="h-2"
                        />
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full" onClick={() => window.location.href = '/usage-history'}>
                      <Activity className="h-4 w-4 mr-2" />
                      查看详细记录
                    </Button>
                  </CardContent>
                </Card>

                {/* 最近活动 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-600" />
                      最近活动
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">生成了Essay</span>
                      </div>
                      <p className="text-muted-foreground text-xs ml-4">
                        AI与教育的未来发展 - 2小时前
                      </p>
                    </div>
                    
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">充值成功</span>
                      </div>
                      <p className="text-muted-foreground text-xs ml-4">
                        标准套餐 ¥249 - 1天前
                      </p>
                    </div>
                    
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="font-medium">使用AI对话</span>
                      </div>
                      <p className="text-muted-foreground text-xs ml-4">
                        文献查找咨询 - 2天前
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default UserProfile;