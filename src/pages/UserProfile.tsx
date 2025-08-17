import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus,
  Upload,
  History,
  Shield,
  User,
  Smartphone,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCredit } from '@/contexts/CreditContext';
import AppSidebarEnhanced from '@/components/AppSidebarEnhanced';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ActivityItem {
  time: string;
  type: string;
  delta: string;
  balance: number;
}

interface DeviceItem {
  id: string;
  name: string;
  lastSeenAt: string;
}

// 统计数据组件
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="font-medium text-slate-700">{value}</div>
    </div>
  );
}

// 概览卡片组件
function OverviewCard() {
  const { balance } = useCredit();
  const navigate = useNavigate();
  
  // 模拟数据，实际应从API获取
  const overview = {
    balanceChars: balance.wordBalance,
    last30Chars: 2200,
    totalTopupCNY: 249,
    totalSpendCNY: 18.5
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-slate-500 text-sm mb-2">可用字数</div>
          <div className="text-5xl font-extrabold tracking-tight text-slate-900 mb-1">
            {overview.balanceChars.toLocaleString()}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <Stat label="近30天使用" value={`${overview.last30Chars.toLocaleString()}字`} />
          <Stat label="累计充值" value={`¥${overview.totalTopupCNY}`} />
          <Stat label="累计消费" value={`¥${overview.totalSpendCNY}`} />
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <Button 
          className="h-11 rounded-xl bg-blue-600 px-5 text-white font-medium hover:bg-blue-700"
          onClick={() => navigate('/topup')}
        >
          立即充值
        </Button>
        <Button 
          variant="outline"
          className="h-11 rounded-xl border px-5 text-slate-700 hover:bg-slate-50"
          onClick={() => navigate('/usage-history')}
        >
          查看账单
        </Button>
      </div>
    </div>
  );
}

// 快捷操作组件
function QuickActions() {
  const navigate = useNavigate();
  
  const items = [
    { icon: Plus, text: '新建文档', onClick: () => navigate('/form') },
    { icon: Upload, text: '上传文件', onClick: () => navigate('/knowledge') },
    { icon: History, text: '历史记录', onClick: () => navigate('/history') },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      <div className="grid grid-cols-3 gap-3">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="rounded-xl border border-slate-200 py-3 px-4 text-center hover:bg-slate-50 transition-colors"
          >
            <item.icon className="h-5 w-5 mx-auto mb-2 text-slate-600" />
            <div className="text-slate-700 text-sm">{item.text}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// 安全概览组件
function SecurityMini({ onOpenDevices }: { onOpenDevices: () => void }) {
  const [twoFA, setTwoFA] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      <h3 className="text-base font-medium mb-4 text-slate-900">账号安全</h3>
      <ul className="space-y-3 text-sm">
        <li className="flex items-center justify-between">
          <span className="text-slate-600">二步验证</span>
          <Switch checked={twoFA} onCheckedChange={setTwoFA} />
        </li>
        <li className="flex items-center justify-between">
          <span className="text-slate-600">密码</span>
          <button className="text-blue-600 hover:underline text-sm">30天前已修改</button>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-slate-600">登录设备</span>
          <button 
            className="text-slate-700 rounded-lg border px-3 py-1.5 hover:bg-slate-50 text-sm"
            onClick={onOpenDevices}
          >
            管理
          </button>
        </li>
      </ul>
    </div>
  );
}

// 个人信息组件
function ProfileMini({ onOpenEdit }: { onOpenEdit: () => void }) {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-slate-900">个人信息</h3>
        <div className="flex items-center gap-2">
          <button 
            className="text-slate-700 rounded-lg border px-3 py-1.5 hover:bg-slate-50 text-sm"
            onClick={onOpenEdit}
          >
            编辑
          </button>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-slate-100 rounded"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {!isCollapsed && (
        <div className="mt-4 flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.slice(0, 2) || '用户'}</AvatarFallback>
          </Avatar>
          <div className="text-sm text-slate-600 space-y-1">
            <div className="font-medium text-slate-900">{user?.name || '用户名'}</div>
            <div>{user?.email || 'user@example.com'}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// 最近活动组件
function RecentActivity() {
  // 模拟数据，实际应从API获取
  const activities: ActivityItem[] = [
    { time: '08/18 02:46', type: '充值', delta: '+5,000字', balance: 31300 },
    { time: '08/17 21:12', type: '论文生成', delta: '-1,200字', balance: 26300 },
    { time: '08/17 15:30', type: 'AI对话', delta: '-800字', balance: 27500 },
    { time: '08/16 09:15', type: '文档分析', delta: '-500字', balance: 28300 },
    { time: '08/15 14:20', type: '充值', delta: '+3,000字', balance: 28800 },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-slate-900">最近活动</h3>
        <a 
          href="/usage-history?tab=usage" 
          className="text-slate-600 text-sm hover:underline"
        >
          查看全部
        </a>
      </div>
      {activities.length > 0 ? (
        <ul className="space-y-3 text-sm">
          {activities.map((activity, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className="text-slate-700">{activity.time} {activity.type}</span>
              <span className={`font-medium ${
                activity.delta.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {activity.delta}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-slate-500 text-center py-4">暂无记录</div>
      )}
    </div>
  );
}

// 编辑资料抽屉组件
function EditProfileDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: ''
  });

  const handleSave = () => {
    // 这里应该调用API保存数据
    toast({
      title: "保存成功",
      description: "个人信息已更新"
    });
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>编辑个人信息</DrawerTitle>
          <DrawerDescription>
            更新你的基本信息
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">昵称</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="请输入昵称"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="请输入邮箱"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">所在地（可选）</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="请输入所在地"
            />
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleSave}>保存</Button>
          <DrawerClose asChild>
            <Button variant="outline">取消</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// 设备管理抽屉组件
function DevicesDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { toast } = useToast();
  const [devices] = useState<DeviceItem[]>([
    { id: '1', name: 'MacBook Pro', lastSeenAt: '2小时前' },
    { id: '2', name: 'iPhone 15', lastSeenAt: '1天前' },
    { id: '3', name: 'Chrome on Windows', lastSeenAt: '3天前' },
  ]);

  const handleRevoke = (deviceId: string, deviceName: string) => {
    if (confirm(`确定要移除设备"${deviceName}"吗？`)) {
      // 这里应该调用API移除设备
      toast({
        title: "设备已移除",
        description: `已成功移除设备"${deviceName}"`
      });
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>设备管理</DrawerTitle>
          <DrawerDescription>
            管理登录到你账户的设备
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <ul className="space-y-3">
            {devices.map((device) => (
              <li key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-slate-500" />
                  <div>
                    <div className="font-medium text-slate-900">{device.name}</div>
                    <div className="text-sm text-slate-500">最近活跃: {device.lastSeenAt}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRevoke(device.id, device.name)}
                >
                  移除
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">关闭</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// 主组件
export default function UserProfile() {
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [devicesOpen, setDevicesOpen] = useState(false);

  return (
    <SidebarProvider>
      <AppSidebarEnhanced />
      <SidebarInset>
        <div className="min-h-screen bg-slate-50">
          <div className="mx-auto max-w-[1100px] px-4 py-8">
            <header className="mb-6">
              <h1 className="text-2xl font-semibold text-slate-900">个人中心</h1>
              <p className="text-slate-500 mt-1">管理你的额度与最近活动</p>
            </header>

            <div className="grid grid-cols-12 gap-6">
              {/* 主列 */}
              <section className="col-span-12 lg:col-span-8 space-y-6">
                {/* 1) 概览 */}
                <OverviewCard />

                {/* 2) 快捷操作 */}
                <QuickActions />

                {/* 3) 最近活动 */}
                <RecentActivity />
              </section>

              {/* 侧列 */}
              <aside className="col-span-12 lg:col-span-4 space-y-6">
                <SecurityMini onOpenDevices={() => setDevicesOpen(true)} />
                <ProfileMini onOpenEdit={() => setEditProfileOpen(true)} />
              </aside>
            </div>

            {/* 抽屉们 */}
            <EditProfileDrawer 
              isOpen={editProfileOpen} 
              onClose={() => setEditProfileOpen(false)} 
            />
            <DevicesDrawer 
              isOpen={devicesOpen} 
              onClose={() => setDevicesOpen(false)} 
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}