import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  FileText, 
  Unlock, 
  Download, 
  ShoppingCart, 
  AlertTriangle 
} from 'lucide-react';
import { Activity } from '@/lib/types';
import { useTranslation } from '@/hooks/useTranslation';

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const { t } = useTranslation();
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'create':
        return FileText;
      case 'unlock':
        return Unlock;
      case 'export':
        return Download;
      case 'addon':
        return ShoppingCart;
      case 'error':
        return AlertTriangle;
      default:
        return FileText;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'create':
        return 'text-blue-600 bg-blue-50';
      case 'unlock':
        return 'text-amber-600 bg-amber-50';
      case 'export':
        return 'text-green-600 bg-green-50';
      case 'addon':
        return 'text-purple-600 bg-purple-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays}${t('profile.activity.time.days_ago')}`;
    } else if (diffHours > 0) {
      return `${diffHours}${t('profile.activity.time.hours_ago')}`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}${t('profile.activity.time.minutes_ago')}`;
    } else {
      return t('profile.activity.time.just_now');
    }
  };

  return (
    <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow p-6">
      <h2 className="text-[16px] font-semibold text-foreground mb-4">{t('profile.activity.title')}</h2>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const IconComponent = getActivityIcon(activity.type);
          const colorClasses = getActivityColor(activity.type);
          
          return (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses}`}>
                <IconComponent className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {formatTime(activity.ts)}
                  </p>
                  {activity.meta && (
                    <>
                      <span className="text-xs text-muted-foreground">·</span>
                      <p className="text-xs text-muted-foreground">
                        {activity.meta}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RecentActivity;