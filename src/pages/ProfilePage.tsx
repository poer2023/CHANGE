import React from 'react';
import { Helmet } from 'react-helmet-async';
import ProfileHeaderCard from '@/components/Profile/ProfileHeaderCard';
import ProfileStats from '@/components/Profile/ProfileStats';
import RecentActivity from '@/components/Profile/RecentActivity';
import QuickQueues from '@/components/Profile/QuickQueues';
import { 
  mockUser, 
  mockUserStats, 
  generateMockActivities, 
  generateMockPendingDocs 
} from '@/lib/mockData';

const ProfilePage: React.FC = () => {
  const activities = generateMockActivities(5);
  const { gate1: gate1Docs, gate2: gate2Docs } = generateMockPendingDocs();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>个人中心 - 学术论文助手</title>
        <meta name="description" content="查看您的个人信息、统计数据和待处理任务" />
      </Helmet>
      
      <div className="max-w-[960px] mx-auto px-6 md:px-8 py-6 space-y-6">
        {/* 用户信息卡片 */}
        <ProfileHeaderCard user={mockUser} />
        
        {/* 统计数据 */}
        <ProfileStats stats={mockUserStats} />
        
        {/* 最近活动和快捷清单 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity activities={activities} />
          <div className="lg:col-span-2">
            <QuickQueues gate1Docs={gate1Docs} gate2Docs={gate2Docs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;