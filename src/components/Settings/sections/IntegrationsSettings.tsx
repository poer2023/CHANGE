import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cloud, Link, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

const IntegrationsSettings: React.FC = () => {
  const { t } = useTranslation();
  
  const handleConnectCloud = () => {
    toast.info(t('settings.integrations.cloud_dev_toast'));
  };

  const integrations = [
    {
      id: 'cloud-storage',
      name: t('settings.integrations.cloud_sync'),
      description: t('settings.integrations.cloud_sync_desc'),
      icon: Cloud,
      status: 'not_connected',
      providers: ['百度网盘', '阿里云盘', 'OneDrive', 'Google Drive'],
      comingSoon: true
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      connected: { label: t('settings.integrations.status.connected'), className: 'bg-green-100 text-green-800' },
      not_connected: { label: t('settings.integrations.status.not_connected'), className: 'bg-gray-100 text-gray-800' },
      error: { label: t('settings.integrations.status.error'), className: 'bg-red-100 text-red-800' }
    };

    const config = statusMap[status as keyof typeof statusMap] || statusMap.not_connected;
    return (
      <Badge variant="secondary" className={`text-xs ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* 页面说明 */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-[16px] font-semibold flex items-center gap-2">
            <Link className="h-4 w-4" />
            {t('settings.integrations.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t('settings.integrations.description')}
          </p>
        </CardContent>
      </Card>

      {/* 集成列表 */}
      <div className="space-y-4">
        {integrations.map((integration) => {
          const IconComponent = integration.icon;
          
          return (
            <Card key={integration.id} className="rounded-2xl border bg-card shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-muted-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[16px] font-semibold">{integration.name}</h3>
                        {getStatusBadge(integration.status)}
                        {integration.comingSoon && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            {t('settings.integrations.coming_soon')}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                      
                      {integration.providers && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          <span className="text-xs text-muted-foreground">{t('settings.integrations.supports')}</span>
                          {integration.providers.map((provider, index) => (
                            <span key={provider} className="text-xs text-muted-foreground">
                              {provider}
                              {index < integration.providers!.length - 1 && '、'}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {integration.status === 'not_connected' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                        onClick={handleConnectCloud}
                        disabled={integration.comingSoon}
                      >
                        {t('settings.integrations.connect')}
                      </Button>
                    )}
                    
                    {integration.status === 'connected' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          {t('settings.integrations.settings')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {t('settings.integrations.disconnect')}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 更多集成即将推出 */}
      <Card className="rounded-2xl border border-dashed bg-muted/30 shadow-sm">
        <CardContent className="p-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto">
              <Settings className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">{t('settings.integrations.more_coming')}</p>
            <p className="text-xs text-muted-foreground">
              {t('settings.integrations.more_coming_desc')}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsSettings;