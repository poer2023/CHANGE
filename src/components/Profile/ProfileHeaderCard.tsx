import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Shield, 
  CreditCard, 
  Download,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { User as UserType } from '@/lib/types';
import { useTranslation } from '@/hooks/useTranslation';

interface ProfileHeaderCardProps {
  user: UserType;
}

const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ user }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formatLastLogin = (timestamp: string, city?: string, ip?: string) => {
    const date = new Date(timestamp);
    const timeStr = date.toLocaleString('zh-CN');
    let locationStr = '';
    
    if (city && ip) {
      locationStr = ` · ${city} (${ip})`;
    } else if (city) {
      locationStr = ` · ${city}`;
    }
    
    return timeStr + locationStr;
  };

  const handleQuickAction = (tab: string) => {
    navigate(`/settings?tab=${tab}`);
  };

  return (
    <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-foreground">
                {user.name}
              </h1>
              <Badge 
                variant="secondary"
                className={user.plan === 'Pro' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}
              >
                {user.plan}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{user.email}</span>
              {user.emailVerified ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-xs">
                {user.emailVerified ? t('profile.header.email_verified') : t('profile.header.email_not_verified')}
              </span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {t('profile.header.last_login')}{formatLastLogin(user.lastLoginAt, user.lastLoginCity, user.lastLoginIp)}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => handleQuickAction('account')}
          >
            <User className="h-4 w-4 mr-2" />
            {t('profile.header.edit_profile')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => handleQuickAction('security')}
          >
            <Shield className="h-4 w-4 mr-2" />
            {t('profile.header.manage_security')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => handleQuickAction('billing')}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            {t('profile.header.billing_invoices')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => handleQuickAction('data')}
          >
            <Download className="h-4 w-4 mr-2" />
            {t('profile.header.download_data')}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProfileHeaderCard;