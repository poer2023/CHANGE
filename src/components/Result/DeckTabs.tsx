import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Package, 
  Bot, 
  Activity,
  CheckCircle,
  Clock,
  Download,
  BarChart,
  BookOpen,
  FileText,
  AlertTriangle,
  Share2,
  MessageSquare,
  Edit3,
  Search,
  Zap,
  Users,
  ExternalLink,
  Shield,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DeckTabsProps } from '@/state/types';
import { useApp } from '@/state/AppContext';
import { useTranslation } from '@/hooks/useTranslation';
import CitationVerificationPanel from './CitationVerificationPanel';
import StyleAnalysisPanel from './StyleAnalysisPanel';
import AgentCommandPanel from './AgentCommandPanel';
import EvidencePackagePanel from './EvidencePackagePanel';
import ExportPreviewPanel from './ExportPreviewPanel';

const DeckTabs: React.FC<DeckTabsProps> = ({ disabled, docId }) => {
  const { track, trackTyped } = useApp();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('deliverables');

  const handleTabChange = (tab: string) => {
    const previousTab = activeTab;
    setActiveTab(tab);
    
    trackTyped('tab_change', {
      tabGroup: 'deck_tabs',
      previousTab,
      newTab: tab,
      context: 'result_page'
    }, 'user_action', 'ui_interaction');
  };

  // Deliverables Cards
  const DeliverablesGrid = () => {
    const deliverables = [
      {
        id: 'quality',
        title: t('result.deliverables.quality_score'),
        description: t('result.deliverables.quality_description'),
        icon: BarChart,
        status: 'ready' as const,
        value: '85/100',
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        id: 'process',
        title: t('result.deliverables.process_doc'),
        description: t('result.deliverables.process_description'),
        icon: FileText,
        status: 'ready' as const,
        value: '2.3 MB',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        id: 'references',
        title: t('result.deliverables.references'),
        description: t('result.deliverables.references_description'),
        icon: BookOpen,
        status: 'ready' as const,
        value: t('result.deliverables.references_count').replace('${count}', '24'),
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      {
        id: 'timeline',
        title: t('result.deliverables.timeline'),
        description: t('result.deliverables.timeline_description'),
        icon: Activity,
        status: 'ready' as const,
        value: 'JSON',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50'
      },
      {
        id: 'viva',
        title: t('result.deliverables.viva_cards'),
        description: t('result.deliverables.viva_description'),
        icon: Users,
        status: disabled ? 'locked' : 'ready' as const,
        value: 'PDF',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50'
      },
      {
        id: 'assets',
        title: t('result.deliverables.media_assets'),
        description: t('result.deliverables.media_description'),
        icon: Package,
        status: disabled ? 'locked' : 'ready' as const,
        value: 'ZIP',
        color: 'text-teal-600',
        bgColor: 'bg-teal-50'
      },
      {
        id: 'share',
        title: t('result.deliverables.share_link'),
        description: t('result.deliverables.share_description'),
        icon: Share2,
        status: disabled ? 'locked' : 'ready' as const,
        value: 'URL',
        color: 'text-pink-600',
        bgColor: 'bg-pink-50'
      },
      {
        id: 'bundle',
        title: t('result.deliverables.complete_bundle'),
        description: t('result.deliverables.complete_description'),
        icon: Download,
        status: disabled ? 'locked' : 'generating' as const,
        value: t('result.deliverables.generating'),
        color: 'text-gray-600',
        bgColor: 'bg-gray-50'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deliverables.map((item) => {
          const IconComponent = item.icon;
          const isLocked = item.status === 'locked';
          const isGenerating = item.status === 'generating';
          
          return (
            <Card 
              key={item.id}
              className={cn(
                "transition-all duration-200",
                isLocked ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg cursor-pointer"
              )}
              onClick={() => {
                if (!isLocked) {
                  trackTyped('download_click', {
                    docId,
                    format: item.id,
                    fileSize: 150000, // Mock file size
                    source: 'deck_tabs'
                  }, 'export', 'download');
                }
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.bgColor)}>
                      <IconComponent className={cn("h-4 w-4", item.color)} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-xs text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  {isLocked && (
                    <Badge variant="secondary" className="text-xs">
                      {t('result.deliverables.locked')}
                    </Badge>
                  )}
                  
                  {isGenerating && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  
                  {item.status === 'ready' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {isGenerating ? t('result.deliverables.generating') : item.value}
                  </span>
                  {!isLocked && !isGenerating && (
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                      {t('result.deliverables.download')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Assistant Cards
  const AssistantGrid = () => {
    const assistantCards = [
      {
        id: 'chat',
        title: t('result.assistant.ai_chat'),
        description: t('result.assistant.ai_chat_description'),
        icon: Bot,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        content: (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                {t('result.assistant.ai_chat_content')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                <MessageSquare className="h-3 w-3 mr-1" />
                {t('result.assistant.start_conversation')}
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                <Edit3 className="h-3 w-3 mr-1" />
                {t('result.assistant.edit_suggestions')}
              </Button>
            </div>
          </div>
        )
      },
      {
        id: 'search',
        title: t('result.assistant.doc_search'),
        description: t('result.assistant.doc_search_description'),
        icon: Search,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        content: (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                {t('result.assistant.doc_search_content')}
              </p>
            </div>
            <Button size="sm" variant="outline" className="text-xs w-full">
              <Search className="h-3 w-3 mr-1" />
              {t('result.assistant.start_search')}
            </Button>
          </div>
        )
      },
      {
        id: 'enhancement',
        title: t('result.assistant.enhancement'),
        description: t('result.assistant.enhancement_description'),
        icon: Zap,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        content: (
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                {t('result.assistant.enhancement_content')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                {t('result.assistant.language_polish')}
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                {t('result.assistant.structure_optimize')}
              </Button>
            </div>
          </div>
        )
      }
    ];

    return (
      <div className="space-y-4">
        {assistantCards.map((card) => {
          const IconComponent = card.icon;
          
          return (
            <Card key={card.id} className={cn("transition-all duration-200", disabled ? "opacity-50" : "hover:shadow-lg")}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", card.bgColor)}>
                    <IconComponent className={cn("h-4 w-4", card.color)} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{card.title}</h4>
                    <p className="text-xs text-gray-600">{card.description}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {card.content}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  // Audit Card
  const AuditCard = () => (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-base">
          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
            <Activity className="h-4 w-4 text-gray-600" />
          </div>
          {t('result.audit.title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <div className="text-xs text-gray-700">
              <div className="font-medium">{t('result.audit.document_generated')}</div>
              <div className="text-gray-500">2 {t('result.audit.minutes_ago')}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
            <div className="text-xs text-gray-700">
              <div className="font-medium">{t('result.audit.citation_verified')}</div>
              <div className="text-gray-500">5 {t('result.audit.minutes_ago')}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <div className="text-xs text-gray-700">
              <div className="font-medium">{t('result.audit.generation_started')}</div>
              <div className="text-gray-500">8 {t('result.audit.minutes_ago')}</div>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full text-xs">
          <ExternalLink className="h-3 w-3 mr-1" />
          {t('result.audit.view_full_log')}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full min-w-[420px] max-w-[520px] flex-shrink-0">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-6 w-full text-xs">
          <TabsTrigger value="deliverables" className="text-xs">
            <Download className="h-3 w-3 mr-1" />
            {t('result.tabs.export')}
          </TabsTrigger>
          <TabsTrigger value="evidence" className="text-xs">
            <Package className="h-3 w-3 mr-1" />
            {t('result.tabs.evidence')}
          </TabsTrigger>
          <TabsTrigger value="verification" className="text-xs">
            <Shield className="h-3 w-3 mr-1" />
            {t('result.tabs.verification')}
          </TabsTrigger>
          <TabsTrigger value="style" className="text-xs">
            <Target className="h-3 w-3 mr-1" />
            {t('result.tabs.style')}
          </TabsTrigger>
          <TabsTrigger value="assistant" className="text-xs">
            <Bot className="h-3 w-3 mr-1" />
            {t('result.tabs.assistant')}
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            {t('result.tabs.audit')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deliverables" className="mt-6">
          <ExportPreviewPanel />
        </TabsContent>

        <TabsContent value="evidence" className="mt-6">
          <EvidencePackagePanel />
        </TabsContent>

        <TabsContent value="verification" className="mt-6">
          <CitationVerificationPanel />
        </TabsContent>

        <TabsContent value="style" className="mt-6">
          <StyleAnalysisPanel />
        </TabsContent>

        <TabsContent value="assistant" className="mt-6">
          <AgentCommandPanel />
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <AuditCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeckTabs;