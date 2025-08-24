import React from 'react';
import { Card } from '@/components/ui/card';
import { FileText, CheckCircle, Download } from 'lucide-react';
import { UserStats } from '@/lib/types';
import { useTranslation } from '@/hooks/useTranslation';

interface ProfileStatsProps {
  stats: UserStats;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const { t } = useTranslation();
  
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + t('profile.stats.wan_suffix');
    }
    return num.toLocaleString();
  };

  const formatPercentage = (num: number): string => {
    return num.toFixed(1) + '%';
  };

  const statCards = [
    {
      title: t('profile.stats.total_words'),
      value: formatNumber(stats.totalWords),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: t('profile.stats.citation_pass_rate'),
      value: formatPercentage(stats.citationPassRate),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: t('profile.stats.export_count'),
      value: formatNumber(stats.exportCount),
      icon: Download,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <Card key={index} className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <IconComponent className={`h-5 w-5 ${stat.color}`} />
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ProfileStats;