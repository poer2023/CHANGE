import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText,
  MoreVertical,
  Download,
  Share2,
  History,
  ExternalLink,
  Clock,
  CheckCircle,
  Loader2,
  AlertTriangle,
  Eye,
  Copy
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useApp, useResult, usePayment } from '@/state/AppContext';
import { useGenerationStream, useGenerationContentListener } from '@/hooks/useStreaming';
import { useTranslation } from '@/hooks/useTranslation';

interface ArticleCardProps {
  docId: string;
  disabled?: boolean;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ docId, disabled = false }) => {
  const { track, trackTyped } = useApp();
  const { result, startDocumentGeneration } = useResult();
  const { pay } = usePayment();
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Map<string, string>>(new Map());
  const [streamingContent, setStreamingContent] = useState<string>('');
  
  // Hook for managing generation streaming
  const { isStreaming, getAllContent } = useGenerationStream(
    result.streamId, 
    { enabled: !disabled && result.generation === 'streaming' }
  );

  const handleStartGeneration = useCallback(async () => {
    if (!docId || result.generation === 'streaming') return;
    
    try {
      trackTyped('generation_start', {
        docId,
        trigger: 'manual',
        generationType: 'full'
      }, 'document', 'generation');
      await startDocumentGeneration(docId);
    } catch (error) {
      console.error('Failed to start generation:', error);
      trackTyped('generation_error', {
        docId,
        error: error instanceof Error ? error.message : 'Unknown error',
        stage: 'start',
        retryable: true
      }, 'error', 'generation');
    }
  }, [docId, result.generation, startDocumentGeneration, track]);

  const handleExport = async (type: 'docx' | 'pdf' | 'latex') => {
    const startTime = Date.now();
    
    trackTyped('export_attempt', {
      docId,
      format: type,
      addons: undefined,
      fileSize: undefined
    }, 'export', 'download');
    
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fileSize = Math.floor(Math.random() * 500000) + 100000; // Mock file size
      const processingTime = Date.now() - startTime;
      
      trackTyped('export_success', {
        docId,
        format: type,
        fileSize,
        processingTime,
        downloadUrl: `/${type}/${docId}`
      }, 'export', 'download');
    } catch (error) {
      trackTyped('export_error', {
        docId,
        format: type,
        error: error instanceof Error ? error.message : 'Unknown error',
        retryable: true
      }, 'error', 'export');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/share/${docId}`;
    navigator.clipboard.writeText(shareUrl);
    
    trackTyped('share_link_copy', {
      docId,
      shareUrl,
      context: 'article_card'
    }, 'export', 'share');
  };

  // Listen for real-time content updates during streaming
  useGenerationContentListener(
    useCallback((data) => {
      setStreamingContent(prev => {
        if (data.blockId === 'main') {
          return data.content;
        }
        return prev;
      });
    }, [])
  );

  // Update generated content when streaming completes
  useEffect(() => {
    if (result.generation === 'ready' && isStreaming === false) {
      const content = getAllContent();
      setGeneratedContent(content);
      setStreamingContent('');
    }
  }, [result.generation, isStreaming, getAllContent]);

  const getStatusInfo = () => {
    switch (result.generation) {
      case 'idle':
        return {
          icon: Clock,
          label: t('result.article.status.idle'),
          color: 'text-gray-500',
          bgColor: 'bg-gray-100'
        };
      case 'starting':
        return {
          icon: Loader2,
          label: t('result.article.status.starting'),
          color: 'text-blue-500',
          bgColor: 'bg-blue-100',
          animate: 'animate-spin'
        };
      case 'streaming':
        return {
          icon: Loader2,
          label: t('result.article.status.streaming'),
          color: 'text-blue-500',
          bgColor: 'bg-blue-100',
          animate: 'animate-spin'
        };
      case 'ready':
        return {
          icon: CheckCircle,
          label: t('result.article.status.ready'),
          color: 'text-green-500',
          bgColor: 'bg-green-100'
        };
      case 'error':
        return {
          icon: AlertTriangle,
          label: t('result.article.status.error'),
          color: 'text-red-500',
          bgColor: 'bg-red-100'
        };
      default:
        return {
          icon: Clock,
          label: t('result.article.status.idle'),
          color: 'text-gray-500',
          bgColor: 'bg-gray-100'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Card className="w-[760px] flex-shrink-0 bg-white border-[#EEF0F4] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6E5BFF] flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {t('result.article.title')}
              </h2>
              <p className="text-sm text-gray-600">
                {t('result.article.document_id')}: {docId.slice(0, 8)}...
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className={cn("text-xs", statusInfo.bgColor, statusInfo.color)}>
              <StatusIcon className={cn("h-3 w-3 mr-1", statusInfo.animate)} />
              {statusInfo.label}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full px-2">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => handleExport('docx')}
                  disabled={disabled || result.generation !== 'ready'}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('result.article.export.docx')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleExport('pdf')}
                  disabled={disabled || result.generation !== 'ready'}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('result.article.export.pdf')}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleExport('latex')}
                  disabled={disabled || result.generation !== 'ready'}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t('result.article.export.latex')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {t('result.article.actions.copy_share_link')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <History className="w-4 h-4 mr-2" />
                  {t('result.article.actions.view_history')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Document Content Area */}
        <div className="min-h-[600px] p-6 bg-gray-50 rounded-xl">
          {pay.previewMode ? (
            /* Preview Mode */
            <div className="space-y-6">
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('result.article.preview.title')}</h3>
                <p className="text-sm text-gray-600">
                  {t('result.article.preview.description')}
                </p>
              </div>

              {/* Sample Content */}
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">{t('result.article.preview.abstract')}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t('result.article.preview.sample_text_abstract')}
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded ml-2">
                      {t('result.article.preview.content_limited')}
                    </span>
                  </p>
                </div>

                <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">1. {t('result.article.preview.introduction')}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {t('result.article.preview.sample_text_introduction')}
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded ml-2">
                      {t('result.article.preview.content_limited')}
                    </span>
                  </p>
                </div>

                <div className="text-center py-4 text-gray-400">
                  <div className="text-xs">{t('result.article.preview.more_content')}</div>
                </div>
              </div>
            </div>
          ) : (
            /* Full Content Mode */
            <div className="space-y-6">
              {result.generation === 'ready' ? (
                /* Generated Content */
                <div className="prose max-w-none">
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {t('result.article.title')}
                    </h1>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {t('result.article.generation.completed')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                    {generatedContent.size > 0 ? (
                      /* Display generated content blocks */
                      Array.from(generatedContent.entries()).map(([blockId, content]) => (
                        <div key={blockId} className="p-4 bg-white rounded-lg border">
                          <div className="whitespace-pre-wrap">{content}</div>
                        </div>
                      ))
                    ) : (
                      /* Default content if no streaming data */
                      <>
                        <section>
                          <h2 className="text-lg font-semibold text-gray-900 mb-3">{t('result.article.preview.abstract')}</h2>
                          <p>{t('result.article.preview.sample_text_abstract')}</p>
                        </section>

                        <section>
                          <h2 className="text-lg font-semibold text-gray-900 mb-3">1. {t('result.article.preview.introduction')}</h2>
                          <p>{t('result.article.preview.sample_text_introduction')}</p>
                        </section>

                        <section>
                          <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Literature Review</h2>
                          <p>Previous research indicates that this field encompasses various theoretical perspectives and practical approaches. Smith et al. (2023) point out...</p>
                        </section>
                      </>
                    )}
                  </div>
                </div>
              ) : result.generation === 'streaming' ? (
                /* Streaming Generation */
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-blue-600 mb-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('result.article.generation.streaming')}
                    {isStreaming && (
                      <Badge variant="secondary" className="text-xs">
                        {t('result.article.generation.realtime_streaming')}
                      </Badge>
                    )}
                  </div>
                  
                  {streamingContent ? (
                    /* Real-time streaming content */
                    <div className="prose max-w-none">
                      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {streamingContent}
                        <span className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1" />
                      </div>
                    </div>
                  ) : (
                    /* Loading placeholder */
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                    </div>
                  )}
                </div>
              ) : (
                /* Waiting State */
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('result.article.waiting.title')}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('result.article.waiting.description')}
                  </p>
                  {!disabled && result.generation === 'idle' && (
                    <Button 
                      onClick={handleStartGeneration}
                      className="bg-[#6E5BFF] hover:bg-[#5B4AE6] text-white"
                    >
                      <Loader2 className="h-4 w-4 mr-2" />
                      {t('result.article.waiting.start_generation')}
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Document Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <span>{t('result.article.metadata.created_time')}: {new Date().toLocaleDateString()}</span>
            <span>{t('result.article.metadata.format')}: APA</span>
            <span>{t('result.article.metadata.word_count')}: ~{streamingContent ? streamingContent.length : generatedContent.size > 0 ? Array.from(generatedContent.values()).join('').length : 3500}</span>
            {isStreaming && (
              <span className="flex items-center gap-1 text-blue-600">
                <Loader2 className="h-3 w-3 animate-spin" />
                {t('result.article.metadata.realtime_sync')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Copy className="h-3 w-3" />
            <span>{isStreaming ? t('result.article.metadata.saving') : t('result.article.metadata.auto_save')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;