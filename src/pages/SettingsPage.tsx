import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TabsContent } from '@/components/ui/tabs';
import SettingsLayout from '@/components/Settings/SettingsLayout';
import AccountSettings from '@/components/Settings/sections/AccountSettings';
import SecuritySettings from '@/components/Settings/sections/SecuritySettings';
import PreferencesSettings from '@/components/Settings/sections/PreferencesSettings';
import NotificationsSettings from '@/components/Settings/sections/NotificationsSettings';
import BillingSettings from '@/components/Settings/sections/BillingSettings';
import DataPrivacySettings from '@/components/Settings/sections/DataPrivacySettings';
import IntegrationsSettings from '@/components/Settings/sections/IntegrationsSettings';

const SettingsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'account';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <>
      <Helmet>
        <title>设置 - 学术论文助手</title>
        <meta name="description" content="管理您的账户设置、偏好和隐私选项" />
      </Helmet>
      
      <SettingsLayout defaultTab={activeTab} onTabChange={handleTabChange}>
        <TabsContent value="account" className="mt-0">
          <AccountSettings />
        </TabsContent>
        
        <TabsContent value="security" className="mt-0">
          <SecuritySettings />
        </TabsContent>
        
        <TabsContent value="preferences" className="mt-0">
          <PreferencesSettings />
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-0">
          <NotificationsSettings />
        </TabsContent>
        
        <TabsContent value="billing" className="mt-0">
          <BillingSettings />
        </TabsContent>
        
        <TabsContent value="data" className="mt-0">
          <DataPrivacySettings />
        </TabsContent>
        
        <TabsContent value="integrations" className="mt-0">
          <IntegrationsSettings />
        </TabsContent>
      </SettingsLayout>
    </>
  );
};

export default SettingsPage;