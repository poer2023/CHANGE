import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Unlock, Eye, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { PendingDocument } from '@/lib/types';
import Countdown from '@/components/shared/Countdown';
import { useTranslation } from '@/hooks/useTranslation';

interface QuickQueuesProps {
  gate1Docs: PendingDocument[];
  gate2Docs: PendingDocument[];
}

const QuickQueues: React.FC<QuickQueuesProps> = ({ gate1Docs, gate2Docs }) => {
  const { t } = useTranslation();
  const handleUnlock = (docId: string) => {
    toast.success(`${t('profile.quick_queues.toast.unlock_prepare')} ${docId}`);
    // TODO: 打开 Gate1Dialog
  };

  const handlePreview = (docId: string) => {
    toast.info(`${t('profile.quick_queues.toast.preview_open')}：${docId}`);
    // TODO: 跳转到预览页面
  };

  const handleAddonPurchase = (docId: string) => {
    toast.success(`${t('profile.quick_queues.toast.addon_purchase_prepare')}：${docId}`);
    // TODO: 打开 Gate2Dialog
  };

  const getAddonBadge = (addon: string) => {
    const addonMap = {
      plagiarism: { labelKey: 'profile.quick_queues.addon.plagiarism' as const, color: 'bg-red-100 text-red-800' },
      aiCheck: { labelKey: 'profile.quick_queues.addon.ai_check' as const, color: 'bg-blue-100 text-blue-800' },
      evidencePack: { labelKey: 'profile.quick_queues.addon.evidence_pack' as const, color: 'bg-purple-100 text-purple-800' },
      latex: { labelKey: 'profile.quick_queues.addon.latex' as const, color: 'bg-green-100 text-green-800' },
      defenseCard: { labelKey: 'profile.quick_queues.addon.defense_card' as const, color: 'bg-orange-100 text-orange-800' },
      shareLink: { labelKey: 'profile.quick_queues.addon.share_link' as const, color: 'bg-indigo-100 text-indigo-800' }
    };
    
    const config = addonMap[addon as keyof typeof addonMap];
    const label = config ? t(config.labelKey) : addon;
    const color = config ? config.color : 'bg-gray-100 text-gray-800';
    
    return (
      <Badge variant="secondary" className={`text-xs ${color}`}>
        {label}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gate1 待解锁生成 */}
      <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow p-6">
        <h2 className="text-[16px] font-semibold text-foreground mb-4 flex items-center gap-2">
          <Unlock className="h-4 w-4" />
          {t('profile.quick_queues.gate1.title')}
        </h2>
        
        <div className="space-y-4">
          {gate1Docs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {t('profile.quick_queues.gate1.empty')}
            </p>
          ) : (
            gate1Docs.map((doc) => (
              <div key={doc.id} className="p-4 border rounded-xl space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {doc.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{doc.wordCount}{t('profile.quick_queues.word_count')}</span>
                    <span>{doc.citationCount}{t('profile.quick_queues.citation_count')}</span>
                    {doc.lockedPrice && (
                      <span className="text-amber-600 font-medium">¥{doc.lockedPrice}</span>
                    )}
                  </div>
                </div>
                
                {doc.expiresAt && (
                  <Countdown 
                    expiresAt={doc.expiresAt}
                    onExpire={() => toast.error(`${doc.title} ${t('profile.quick_queues.toast.price_expired')}`)}
                  />
                )}
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="rounded-xl flex-1"
                    onClick={() => handleUnlock(doc.id)}
                  >
                    <Unlock className="h-3 w-3 mr-1" />
                    {t('profile.quick_queues.gate1.unlock_button')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="rounded-xl"
                    onClick={() => handlePreview(doc.id)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    {t('profile.quick_queues.gate1.preview_button')}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Gate2 待导出/需补购 */}
      <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow p-6">
        <h2 className="text-[16px] font-semibold text-foreground mb-4 flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          {t('profile.quick_queues.gate2.title')}
        </h2>
        
        <div className="space-y-4">
          {gate2Docs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              {t('profile.quick_queues.gate2.empty')}
            </p>
          ) : (
            gate2Docs.map((doc) => (
              <div key={doc.id} className="p-4 border rounded-xl space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {doc.title}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{doc.wordCount}{t('profile.quick_queues.word_count')}</span>
                    <span>{doc.citationCount}{t('profile.quick_queues.citation_count')}</span>
                  </div>
                </div>
                
                {doc.missingAddons && doc.missingAddons.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {doc.missingAddons.map((addon, index) => (
                      <span key={index}>
                        {getAddonBadge(addon)}
                      </span>
                    ))}
                  </div>
                )}
                
                <Button 
                  size="sm" 
                  className="rounded-xl w-full"
                  onClick={() => handleAddonPurchase(doc.id)}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {t('profile.quick_queues.gate2.purchase_button')}
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuickQueues;