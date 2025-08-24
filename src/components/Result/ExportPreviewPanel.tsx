import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  FileText,
  Download,
  Eye,
  FileImage,
  FileSpreadsheet,
  FileType,
  Package,
  ExternalLink,
  CheckCircle,
  Clock,
  RefreshCw,
  Settings,
  Copy,
  Share2,
  Printer,
  Zap,
  Code,
  Globe,
  BookOpen,
  Image,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

// Export format types
interface ExportFormat {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  fileSize: string;
  status: 'ready' | 'generating' | 'error';
  preview?: string;
  features: string[];
  recommended?: boolean;
  color: string;
  bgColor: string;
}

// Export configuration options
interface ExportOptions {
  includeComments: boolean;
  includeMetadata: boolean;
  citationStyle: 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'GB/T';
  imageQuality: 'low' | 'medium' | 'high';
  compressionLevel: 'none' | 'standard' | 'maximum';
}

// Export formats data factory
const createExportFormats = (t: (key: string) => string): ExportFormat[] => [
  {
    id: 'docx',
    name: t('result.export.format.docx'),
    description: t('result.export.format.docx_desc'),
    icon: FileText,
    fileSize: '2.3 MB',
    status: 'ready',
    features: [t('result.export.feature.complete_format'), t('result.export.feature.revision_mode'), t('result.export.feature.best_compatibility'), t('result.export.feature.editable')],
    recommended: true,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    preview: `# 机器学习在教育数据挖掘中的应用研究

## 摘要

本研究探讨了机器学习技术在教育数据挖掘领域的应用...

## 1. 引言

随着教育信息化的快速发展，教育数据呈现爆炸式增长...`
  },
  {
    id: 'pdf',
    name: t('result.export.format.pdf'),
    description: t('result.export.format.pdf_desc'),
    icon: FileType,
    fileSize: '1.8 MB',
    status: 'ready',
    features: [t('result.export.feature.format_locked'), t('result.export.feature.cross_platform'), t('result.export.feature.print_friendly'), t('result.export.feature.high_security')],
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    preview: t('result.export.preview.pdf')
  },
  {
    id: 'latex',
    name: t('result.export.format.latex'),
    description: t('result.export.format.latex_desc'),
    icon: Code,
    fileSize: '156 KB',
    status: 'ready',
    features: [t('result.export.feature.professional_typesetting'), t('result.export.feature.math_formula'), t('result.export.feature.version_control'), t('result.export.feature.journal_submission')],
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    preview: t('result.export.preview.latex')
  },
  {
    id: 'html',
    name: t('result.export.format.html'),
    description: t('result.export.format.html_desc'),
    icon: Globe,
    fileSize: '445 KB',
    status: 'ready',
    features: [t('result.export.feature.online_view'), t('result.export.feature.responsive_design'), t('result.export.feature.seo_friendly'), t('result.export.feature.interactive')],
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    preview: t('result.export.preview.html')
  },
  {
    id: 'markdown',
    name: t('result.export.format.markdown'),
    description: t('result.export.format.markdown_desc'),
    icon: FileText,
    fileSize: '89 KB',
    status: 'ready',
    features: [t('result.export.feature.plain_text'), t('result.export.feature.version_control'), t('result.export.feature.lightweight'), t('result.export.feature.multi_platform')],
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    preview: t('result.export.preview.markdown')
  },
  {
    id: 'pptx',
    name: t('result.export.format.pptx'),
    description: t('result.export.format.pptx_desc'),
    icon: BarChart3,
    fileSize: '3.7 MB',
    status: 'generating',
    features: [t('result.export.feature.auto_layout'), t('result.export.feature.chart_visualization'), t('result.export.feature.presentation_friendly'), t('result.export.feature.rich_templates')],
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    preview: t('result.export.preview.generating')
  }
];

// Default export configuration
const defaultExportOptions: ExportOptions = {
  includeComments: true,
  includeMetadata: true,
  citationStyle: 'APA',
  imageQuality: 'high',
  compressionLevel: 'standard'
};

// Format preview card
const FormatCard: React.FC<{
  format: ExportFormat;
  onPreview: () => void;
  onDownload: () => void;
  onConfigure: () => void;
  t: (key: string) => string;
}> = ({ format, onPreview, onDownload, onConfigure, t }) => {
  const IconComponent = format.icon;

  return (
    <Card className={`border-2 transition-all duration-200 hover:shadow-lg ${format.recommended ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${format.bgColor}`}>
              <IconComponent className={`w-5 h-5 ${format.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{format.name}</CardTitle>
                {format.recommended && (
                  <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-300">
                    {t('result.export.recommended')}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600">{format.description}</p>
            </div>
          </div>
          
          {format.status === 'generating' && (
            <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          )}
          
          {format.status === 'ready' && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">{t('result.export.file_size')}</span>
          <span className="font-medium">{format.fileSize}</span>
        </div>

        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-900">{t('result.export.features')}</h5>
          <div className="flex flex-wrap gap-1">
            {format.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onPreview}
            className="flex-1 text-xs"
            disabled={format.status !== 'ready'}
          >
            <Eye className="w-3 h-3 mr-1" />
            {t('result.export.preview_btn')}
          </Button>
          <Button
            size="sm"
            onClick={onDownload}
            className="flex-1 text-xs"
            disabled={format.status !== 'ready'}
          >
            <Download className="w-3 h-3 mr-1" />
            {t('result.export.download')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onConfigure}
            className="text-xs"
          >
            <Settings className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Preview modal component
const PreviewModal: React.FC<{
  format: ExportFormat;
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
}> = ({ format, isOpen, onClose, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <format.icon className={`w-5 h-5 ${format.color}`} />
            <h3 className="text-lg font-semibold">{format.name} {t('result.export.preview_title')}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
            <pre className="whitespace-pre-wrap">{format.preview}</pre>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {t('result.export.file_size')}: {format.fileSize}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-1" />
              {t('result.export.copy_content')}
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-1" />
              {t('result.export.download_file')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Batch export component
const BatchExportPanel: React.FC = () => {
  const { t } = useTranslation();
  const [selectedFormats, setSelectedFormats] = useState<string[]>(['docx', 'pdf']);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleBatchExport = async () => {
    setIsExporting(true);
    setProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    setIsExporting(false);
    toast.success(t('result.export.batch_export_success', { count: selectedFormats.length.toString() }));
  };

  const toggleFormat = (formatId: string) => {
    setSelectedFormats(prev => 
      prev.includes(formatId) 
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('result.export.batch_export')}</CardTitle>
        <p className="text-sm text-gray-600">{t('result.export.batch_export_desc')}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {exportFormats.filter(f => f.status === 'ready').map((format) => (
            <button
              key={format.id}
              onClick={() => toggleFormat(format.id)}
              className={`flex items-center gap-2 p-2 rounded border text-left transition-colors ${
                selectedFormats.includes(format.id)
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <format.icon className={`w-4 h-4 ${format.color}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{format.name}</div>
                <div className="text-xs text-gray-500">{format.fileSize}</div>
              </div>
              {selectedFormats.includes(format.id) && (
                <CheckCircle className="w-4 h-4 text-blue-600" />
              )}
            </button>
          ))}
        </div>

        {isExporting && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{t('result.export.export_progress')}</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Button 
          onClick={handleBatchExport} 
          disabled={selectedFormats.length === 0 || isExporting}
          className="w-full"
        >
          {isExporting ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              {t('result.export.exporting')}
            </>
          ) : (
            <>
              <Package className="w-4 h-4 mr-2" />
              {t('result.export.batch_export')} ({selectedFormats.length})
            </>
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          {t('result.export.estimated_size')}: {
            selectedFormats.reduce((total, formatId) => {
              const format = exportFormats.find(f => f.id === formatId);
              const size = format ? parseFloat(format.fileSize.replace(/[^\d.]/g, '')) : 0;
              return total + size;
            }, 0).toFixed(1)
          } MB
        </div>
      </CardContent>
    </Card>
  );
};

// Main component
const ExportPreviewPanel: React.FC = () => {
  const { t } = useTranslation();
  const exportFormats = createExportFormats(t);
  const [activeTab, setActiveTab] = useState('formats');
  const [previewFormat, setPreviewFormat] = useState<ExportFormat | null>(null);
  const [exportOptions, setExportOptions] = useState<ExportOptions>(defaultExportOptions);

  const handlePreview = (format: ExportFormat) => {
    setPreviewFormat(format);
  };

  const handleDownload = (format: ExportFormat) => {
    toast.success(t('result.export.start_download', { format: format.name }));
  };

  const handleConfigure = (format: ExportFormat) => {
    toast.info(t('result.export.config_in_development', { format: format.name }));
  };

  const handleQuickAction = (action: 'print' | 'share' | 'email') => {
    switch (action) {
      case 'print':
        toast.success(t('result.export.prepare_print'));
        break;
      case 'share':
        toast.success(t('result.export.generate_share_link'));
        break;
      case 'email':
        toast.success(t('result.export.prepare_email'));
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header info */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">{t('result.export.title')}</h3>
              <p className="text-sm text-green-700">
                {t('result.export.subtitle')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="formats" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            {t('result.export.tab.format_selection')}
          </TabsTrigger>
          <TabsTrigger value="batch" className="text-xs">
            <Package className="h-3 w-3 mr-1" />
            {t('result.export.tab.batch_export')}
          </TabsTrigger>
          <TabsTrigger value="actions" className="text-xs">
            <Zap className="h-3 w-3 mr-1" />
            {t('result.export.tab.quick_actions')}
          </TabsTrigger>
        </TabsList>

        {/* Format selection */}
        <TabsContent value="formats" className="mt-6 space-y-4">
          <div className="grid gap-4">
            {exportFormats.map((format) => (
              <FormatCard
                key={format.id}
                format={format}
                onPreview={() => handlePreview(format)}
                onDownload={() => handleDownload(format)}
                onConfigure={() => handleConfigure(format)}
                t={t}
              />
            ))}
          </div>
        </TabsContent>

        {/* Batch export */}
        <TabsContent value="batch" className="mt-6">
          <BatchExportPanel />
        </TabsContent>

        {/* Quick actions */}
        <TabsContent value="actions" className="mt-6 space-y-4">
          <div className="grid gap-3">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction('print')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Printer className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{t('result.export.action.print_preview')}</h4>
                    <p className="text-sm text-gray-600">{t('result.export.action.print_desc')}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction('share')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{t('result.export.action.online_share')}</h4>
                    <p className="text-sm text-gray-600">{t('result.export.action.online_share_desc')}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleQuickAction('email')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{t('result.export.action.email_send')}</h4>
                    <p className="text-sm text-gray-600">{t('result.export.action.email_desc')}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('result.export.settings.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t('result.export.settings.citation_style')}</label>
                  <select 
                    value={exportOptions.citationStyle}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, citationStyle: e.target.value as any }))}
                    className="w-full p-2 border border-gray-200 rounded text-sm"
                  >
                    <option value="APA">{t('result.export.citation.apa')}</option>
                    <option value="MLA">{t('result.export.citation.mla')}</option>
                    <option value="Chicago">{t('result.export.citation.chicago')}</option>
                    <option value="IEEE">{t('result.export.citation.ieee')}</option>
                    <option value="GB/T">{t('result.export.citation.gbt')}</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">{t('result.export.settings.image_quality')}</label>
                  <select 
                    value={exportOptions.imageQuality}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, imageQuality: e.target.value as any }))}
                    className="w-full p-2 border border-gray-200 rounded text-sm"
                  >
                    <option value="low">{t('result.export.image_quality.low')}</option>
                    <option value="medium">{t('result.export.image_quality.medium')}</option>
                    <option value="high">{t('result.export.image_quality.high')}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={exportOptions.includeComments}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeComments: e.target.checked }))}
                  />
                  {t('result.export.settings.include_comments')}
                </label>
                
                <label className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={exportOptions.includeMetadata}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                  />
                  {t('result.export.settings.include_metadata')}
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview modal */}
      {previewFormat && (
        <PreviewModal
          format={previewFormat}
          isOpen={!!previewFormat}
          onClose={() => setPreviewFormat(null)}
          t={t}
        />
      )}
    </div>
  );
};

export default ExportPreviewPanel;