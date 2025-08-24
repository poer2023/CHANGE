import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Gate1Modal from '@/components/Gate1Modal';
import Gate2Dialog from '@/components/Gate2Dialog';
import {
  Lock,
  Unlock,
  Clock,
  Download,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocItem } from '@/types/home';
import { getAddonName } from '@/lib/mockHomeData';
import { useTranslation } from '@/hooks/useTranslation';

interface TodoPanelsProps {
  todoItems: {
    gate1: DocItem[];
    gate2: DocItem[];
    retry: DocItem[];
  };
  onGate1Unlock: (docId: string) => void;
  onGate1Preview: (docId: string) => void;
  onGate2Export: (docId: string, selectedAddons: string[]) => void;
}

const TodoPanels: React.FC<TodoPanelsProps> = ({
  todoItems,
  onGate1Unlock,
  onGate1Preview,
  onGate2Export
}) => {
  const { t } = useTranslation();
  const [gate1ModalOpen, setGate1ModalOpen] = useState(false);
  const [gate2DialogOpen, setGate2DialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update current time every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeLeft = (expiresAt: string): { text: string; isExpired: boolean } => {
    const expiry = new Date(expiresAt).getTime();
    const remaining = expiry - currentTime;
    
    if (remaining <= 0) {
      return { text: t('todos.expired'), isExpired: true };
    }

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return { 
        text: `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, 
        isExpired: false 
      };
    } else {
      return { 
        text: `${minutes}:${seconds.toString().padStart(2, '0')}`, 
        isExpired: false 
      };
    }
  };

  const handleGate1Unlock = (doc: DocItem) => {
    if (!doc.lockExpireAt) return;
    
    const { isExpired } = formatTimeLeft(doc.lockExpireAt);
    if (isExpired) {
      // Handle re-pricing logic
      return;
    }

    setSelectedDoc(doc);
    setGate1ModalOpen(true);
  };

  const handleGate1Preview = (doc: DocItem) => {
    onGate1Preview(doc.id);
  };

  const handleGate2Export = (doc: DocItem) => {
    setSelectedDoc(doc);
    setGate2DialogOpen(true);
  };

  const onGate1ModalUnlock = async () => {
    if (!selectedDoc) return;
    
    setGate1ModalOpen(false);
    await onGate1Unlock(selectedDoc.id);
    setSelectedDoc(null);
  };

  const onGate1ModalPreview = () => {
    if (!selectedDoc) return;
    
    setGate1ModalOpen(false);
    onGate1Preview(selectedDoc.id);
    setSelectedDoc(null);
  };

  const onGate2DialogExport = async (selectedAddons: string[]) => {
    if (!selectedDoc) return;
    
    setGate2DialogOpen(false);
    await onGate2Export(selectedDoc.id, selectedAddons);
    setSelectedDoc(null);
  };

  const onGate2DialogCancel = () => {
    setGate2DialogOpen(false);
    setSelectedDoc(null);
  };

  // Don't render if no todo items
  if (todoItems.gate1.length === 0 && todoItems.gate2.length === 0 && todoItems.retry.length === 0) {
    return null;
  }

  return (
    <>
      <section className="space-y-4">
        <div>
          <h2 className="text-h2 text-text">
            {t('todos.title')}
          </h2>
          <p className="text-body text-text-muted mt-1">
            {todoItems.gate1.length + todoItems.gate2.length + todoItems.retry.length} {t('todos.count')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Gate1 Panel - 待解锁生成 */}
          {todoItems.gate1.length > 0 && (
            <Card className="relative bg-surface border-[hsl(var(--border))] hover:border-[color-mix(in_oklab,hsl(var(--brand-500))_25%,hsl(var(--border)))]">
              
              <CardHeader className="pb-4 pl-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-surface-alt border border-[hsl(var(--border))] flex items-center justify-center relative">
                    <div className="absolute inset-[1px] rounded-full bg-gradient-to-br from-white/12 to-transparent" />
                    <Lock className="size-5 text-text-muted relative z-10" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-text">
                      {t('todos.gate1.title')}
                    </CardTitle>
                    <CardDescription className="text-body text-text-muted">
                      {t('todos.gate1.subtitle')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {todoItems.gate1.map((doc) => {
                  const timeInfo = doc.lockExpireAt ? formatTimeLeft(doc.lockExpireAt) : null;
                  
                  return (
                    <div key={doc.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-sm text-text">{doc.title}</p>
                        <p className="text-body text-text-muted">
                          {doc.words.toLocaleString()} {t('todos.words')} · {doc.cites} {t('todos.citations')}
                          {timeInfo && (
                            <span className={timeInfo.isExpired ? 'text-red-600' : 'text-amber-600'}>
                              {' · '}{t('todos.gate1.price_locked')} {timeInfo.text}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2 ml-3">
                        <Button
                          onClick={() => handleGate1Unlock(doc)}
                          size="sm"
                          className="rounded-xl h-8 text-xs"
                          disabled={timeInfo?.isExpired}
                        >
                          {timeInfo?.isExpired ? t('todos.gate1.reprice') : t('todos.gate1.unlock')}
                        </Button>
                        <Button
                          onClick={() => handleGate1Preview(doc)}
                          variant="secondary"
                          size="sm"
                          className="rounded-xl h-8 text-xs"
                        >
                          {t('todos.gate1.preview')}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Gate2 Panel - 待导出/分享 */}
          {todoItems.gate2.length > 0 && (
            <Card className="relative bg-surface border-[hsl(var(--border))] hover:border-[color-mix(in_oklab,hsl(var(--brand-500))_25%,hsl(var(--border)))]">
              
              <CardHeader className="pb-4 pl-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-surface-alt border border-[hsl(var(--border))] flex items-center justify-center relative">
                    <div className="absolute inset-[1px] rounded-full bg-gradient-to-br from-white/12 to-transparent" />
                    <Download className="size-5 text-text-muted relative z-10" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-text">
                      {t('todos.gate2.title')}
                    </CardTitle>
                    <CardDescription className="text-body text-text-muted">
                      {t('todos.gate2.subtitle')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {todoItems.gate2.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm text-foreground">{doc.title}</p>
                      <p className="text-sm text-muted-foreground leading-[1.4]">
                        {doc.words.toLocaleString()} {t('todos.words')} · {doc.cites} {t('todos.citations')} · {t('todos.gate2.missing')}: {doc.missingAddons?.map(addon => getAddonName(addon)).join(', ')}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <Button
                        onClick={() => handleGate2Export(doc)}
                        size="sm"
                        className="rounded-xl h-8 text-xs"
                      >
                        {t('todos.gate2.buy_export')}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Retry Panel - 失败重试 */}
          {todoItems.retry.length > 0 && (
            <Card className="rounded-2xl border-l-2 border-l-red-500 border bg-card shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                    <AlertTriangle className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                      {t('todos.retry.title')}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground leading-[1.4]">
                      {t('todos.retry.subtitle')}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {todoItems.retry.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm text-foreground">{doc.title}</p>
                      <p className="text-sm text-muted-foreground leading-[1.4]">
                        {t('todos.retry.failed_message')}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <Button
                        size="sm"
                        className="rounded-xl h-8 text-xs"
                      >
                        {t('todos.retry.retry_button')}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="rounded-xl h-8 text-xs"
                      >
                        {t('todos.retry.view_details')}
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Modals */}
      {selectedDoc && (
        <>
          <Gate1Modal
            open={gate1ModalOpen}
            price={{
              value: Math.floor(Math.random() * 200) + 100, // Mock price
              currency: 'CNY',
              expiresAt: new Date(selectedDoc.lockExpireAt || 0).getTime()
            }}
            benefits={[
              '一次完整生成',
              '2 次局部重写',
              '全量引用核验'
            ]}
            onPreviewOnly={onGate1ModalPreview}
            onUnlock={onGate1ModalUnlock}
          />

          <Gate2Dialog
            open={gate2DialogOpen}
            missingAddons={selectedDoc.missingAddons || []}
            onBuyAndExport={onGate2DialogExport}
            onCancel={onGate2DialogCancel}
          />
        </>
      )}
    </>
  );
};

export default TodoPanels;