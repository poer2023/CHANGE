import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package,
  FileText, 
  Database, 
  MessageSquare,
  Activity,
  Download,
  Share2,
  Clock,
  User,
  CheckCircle,
  RefreshCw,
  Eye,
  Link,
  QrCode,
  Calendar,
  MapPin,
  Edit3,
  Search,
  AlertTriangle,
  Info,
  ExternalLink,
  Copy,
  Shield
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

// Timeline event types
interface TimelineEvent {
  id: string;
  timestamp: string;
  actor: 'user' | 'agent' | 'system';
  action: string;
  description: string;
  details?: {
    type: 'citation' | 'edit' | 'generation' | 'verification' | 'export';
    data?: any;
  };
}

// Citation source information
interface CitationSource {
  id: string;
  title: string;
  authors: string[];
  year: number;
  doi?: string;
  pmid?: string;
  isbn?: string;
  journal?: string;
  verified: boolean;
  insertedAt: string;
  pageNumber?: string;
}

// Viva question types
interface VivaQuestion {
  id: string;
  category: 'methodology' | 'sources' | 'analysis' | 'contribution' | 'technical';
  question: string;
  suggestedAnswer: string;
  keyPoints: string[];
  relatedSources: string[];
}

// Evidence package content
interface EvidencePackage {
  documentId: string;
  title: string;
  generatedAt: string;
  author: string;
  wordCount: number;
  citationCount: number;
  sessionDuration: number; // minutes
  timeline: TimelineEvent[];
  sources: CitationSource[];
  vivaQuestions: VivaQuestion[];
  shareLink?: {
    url: string;
    expiresAt: string;
    accessCount: number;
  };
  qualityMetrics: {
    originalityScore: number;
    citationAccuracy: number;
    styleConsistency: number;
    structureScore: number;
  };
}

// Mock evidence package data factory
const createMockEvidencePackage = (t: (key: string) => string): EvidencePackage => ({
  documentId: 'doc_20241201_001',
  title: t('result.evidence.document.title'),
  generatedAt: '2024-12-01T15:30:00Z',
  author: t('result.evidence.document.author'),
  wordCount: 8500,
  citationCount: 24,
  sessionDuration: 180,
  timeline: [
    {
      id: 'event-001',
      timestamp: '14:32',
      actor: 'user',
      action: t('result.evidence.timeline.start_session'),
      description: t('result.evidence.timeline.start_desc'),
      details: { type: 'generation' }
    },
    {
      id: 'event-002',
      timestamp: '14:45',
      actor: 'system',
      action: t('result.evidence.timeline.search_complete'),
      description: t('result.evidence.timeline.search_desc'),
      details: { type: 'citation', data: { found: 32, selected: 24 } }
    },
    {
      id: 'event-003',
      timestamp: '14:52',
      actor: 'agent',
      action: t('result.evidence.timeline.insert_citation'),
      description: t('result.evidence.timeline.insert_desc'),
      details: { type: 'citation', data: { section: '2.1', count: 3 } }
    },
    {
      id: 'event-004',
      timestamp: '15:08',
      actor: 'user',
      action: t('result.evidence.timeline.manual_edit'),
      description: t('result.evidence.timeline.manual_desc'),
      details: { type: 'edit', data: { section: '3', changes: 'logic_adjustment' } }
    },
    {
      id: 'event-005',
      timestamp: '15:15',
      actor: 'agent',
      action: t('result.evidence.timeline.format_apa'),
      description: t('result.evidence.timeline.format_desc'),
      details: { type: 'verification' }
    },
    {
      id: 'event-006',
      timestamp: '15:30',
      actor: 'system',
      action: t('result.evidence.timeline.generation_complete'),
      description: t('result.evidence.timeline.generation_desc'),
      details: { type: 'export' }
    }
  ],
  sources: [
    {
      id: 'src-001',
      title: 'Deep Learning Approaches in Educational Data Mining: A Comprehensive Survey',
      authors: ['Wang, L.', 'Zhang, M.', 'Liu, J.'],
      year: 2023,
      doi: '10.1016/j.compedu.2023.104567',
      journal: 'Computers & Education',
      verified: true,
      insertedAt: '14:52'
    },
    {
      id: 'src-002',
      title: 'Machine Learning in Education: Applications and Challenges',
      authors: ['Smith, A.', 'Johnson, B.'],
      year: 2022,
      doi: '10.1080/10494820.2022.2158781',
      journal: 'Interactive Learning Environments',
      verified: true,
      insertedAt: '14:58'
    },
    {
      id: 'src-003',
      title: 'Educational Data Mining Techniques for Student Performance Prediction',
      authors: ['Chen, Y.', 'Wu, X.', 'Li, H.'],
      year: 2024,
      pmid: '38745623',
      journal: 'Journal of Educational Technology & Society',
      verified: true,
      insertedAt: '15:05'
    }
  ],
  vivaQuestions: [
    {
      id: 'q-001',
      category: 'methodology',
      question: t('result.evidence.viva.methodology.question1'),
      suggestedAnswer: t('result.evidence.viva.methodology.answer1'),
      keyPoints: [
        t('result.evidence.viva.methodology.point1_1'),
        t('result.evidence.viva.methodology.point1_2'),
        t('result.evidence.viva.methodology.point1_3')
      ],
      relatedSources: ['src-001', 'src-002']
    },
    {
      id: 'q-002',
      category: 'sources',
      question: t('result.evidence.viva.sources.question1'),
      suggestedAnswer: t('result.evidence.viva.sources.answer1'),
      keyPoints: [
        t('result.evidence.viva.sources.point1_1'),
        t('result.evidence.viva.sources.point1_2'),
        t('result.evidence.viva.sources.point1_3')
      ],
      relatedSources: ['src-001']
    },
    {
      id: 'q-003',
      category: 'contribution',
      question: t('result.evidence.viva.contribution.question1'),
      suggestedAnswer: t('result.evidence.viva.contribution.answer1'),
      keyPoints: [
        t('result.evidence.viva.contribution.point1_1'),
        t('result.evidence.viva.contribution.point1_2'),
        t('result.evidence.viva.contribution.point1_3')
      ],
      relatedSources: ['src-001', 'src-002', 'src-003']
    }
  ],
  qualityMetrics: {
    originalityScore: 92,
    citationAccuracy: 98,
    styleConsistency: 89,
    structureScore: 94
  }
});

// Timeline visualization data factory
const createTimelineData = (evidencePackage: EvidencePackage) => evidencePackage.timeline.map((event, index) => ({
  time: event.timestamp,
  activity: index + 1,
  type: event.actor
}));

// Quality analysis pie chart data factory
const createQualityData = (evidencePackage: EvidencePackage, t: (key: string) => string) => [
  { name: t('result.evidence.quality.originality'), value: evidencePackage.qualityMetrics.originalityScore, color: '#10B981' },
  { name: t('result.evidence.quality.citation_accuracy'), value: evidencePackage.qualityMetrics.citationAccuracy, color: '#3B82F6' },
  { name: t('result.evidence.quality.style_consistency'), value: evidencePackage.qualityMetrics.styleConsistency, color: '#8B5CF6' },
  { name: t('result.evidence.quality.structure_score'), value: evidencePackage.qualityMetrics.structureScore, color: '#F59E0B' }
];

// Timeline card component
const TimelineCard: React.FC<{ event: TimelineEvent; t: (key: string) => string }> = ({ event, t }) => {
  const getActorInfo = () => {
    switch (event.actor) {
      case 'user':
        return { icon: User, color: 'text-blue-600', bgColor: 'bg-blue-50', label: t('result.evidence.actor.user') };
      case 'agent':
        return { icon: Edit3, color: 'text-purple-600', bgColor: 'bg-purple-50', label: t('result.evidence.actor.agent') };
      case 'system':
        return { icon: RefreshCw, color: 'text-green-600', bgColor: 'bg-green-50', label: t('result.evidence.actor.system') };
      default:
        return { icon: Activity, color: 'text-gray-600', bgColor: 'bg-gray-50', label: t('result.evidence.actor.other') };
    }
  };

  const { icon: IconComponent, color, bgColor, label } = getActorInfo();

  return (
    <div className="flex gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgColor}`}>
        <IconComponent className={`w-4 h-4 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-900">{event.action}</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{label}</Badge>
            <span className="text-xs text-gray-500">{event.timestamp}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">{event.description}</p>
        {event.details && (
          <div className="mt-2 text-xs text-gray-500">
            {t('result.evidence.type_label')}: {event.details.type === 'citation' ? t('result.evidence.type.citation') : 
                  event.details.type === 'edit' ? t('result.evidence.type.edit') :
                  event.details.type === 'generation' ? t('result.evidence.type.generation') :
                  event.details.type === 'verification' ? t('result.evidence.type.verification') : t('result.evidence.type.export')}
            {event.details.data && (
              <span className="ml-2">
                {JSON.stringify(event.details.data)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Citation source card
const SourceCard: React.FC<{ source: CitationSource; t: (key: string) => string }> = ({ source, t }) => (
  <div className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
    <div className="flex items-start justify-between gap-2 mb-2">
      <h4 className="text-sm font-medium text-gray-900 flex-1">{source.title}</h4>
      <div className="flex items-center gap-1">
        {source.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
        <Badge variant="outline" className={source.verified ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}>
          {source.verified ? t('result.evidence.source.verified') : t('result.evidence.source.unverified')}
        </Badge>
      </div>
    </div>
    
    <p className="text-sm text-gray-600 mb-2">
      {source.authors.join(', ')} ({source.year})
    </p>
    
    <div className="flex items-center justify-between text-xs text-gray-500">
      <span>{source.journal}</span>
      <span>{t('result.evidence.source.inserted_at')}: {source.insertedAt}</span>
    </div>
    
    {source.doi && (
      <div className="mt-2">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => window.open(`https://doi.org/${source.doi}`, '_blank')}
          className="text-xs"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          {t('result.evidence.source.view_doi')}
        </Button>
      </div>
    )}
  </div>
);

// Viva question card
const VivaQuestionCard: React.FC<{ question: VivaQuestion; t: (key: string) => string }> = ({ question, t }) => {
  const [expanded, setExpanded] = useState(false);

  const getCategoryInfo = () => {
    switch (question.category) {
      case 'methodology':
        return { label: t('result.evidence.category.methodology'), color: 'text-blue-600', bgColor: 'bg-blue-50' };
      case 'sources':
        return { label: t('result.evidence.category.sources'), color: 'text-green-600', bgColor: 'bg-green-50' };
      case 'analysis':
        return { label: t('result.evidence.category.analysis'), color: 'text-purple-600', bgColor: 'bg-purple-50' };
      case 'contribution':
        return { label: t('result.evidence.category.contribution'), color: 'text-orange-600', bgColor: 'bg-orange-50' };
      case 'technical':
        return { label: t('result.evidence.category.technical'), color: 'text-red-600', bgColor: 'bg-red-50' };
      default:
        return { label: t('result.evidence.category.other'), color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  const { label, color, bgColor } = getCategoryInfo();

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge variant="outline" className={`${bgColor} ${color} border-current`}>
            {label}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setExpanded(!expanded)}
            className="text-xs"
          >
            {expanded ? t('result.evidence.collapse') : t('result.evidence.expand')}
          </Button>
        </div>

        <h4 className="text-sm font-medium text-gray-900 mb-2">{question.question}</h4>

        {expanded && (
          <div className="space-y-3">
            <div>
              <h5 className="text-xs font-medium text-gray-700 mb-1">{t('result.evidence.suggested_answer')}:</h5>
              <p className="text-sm text-gray-600">{question.suggestedAnswer}</p>
            </div>

            <div>
              <h5 className="text-xs font-medium text-gray-700 mb-1">{t('result.evidence.key_points')}:</h5>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                {question.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>

            {question.relatedSources.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-gray-700 mb-1">{t('result.evidence.related_sources')}:</h5>
                <div className="flex flex-wrap gap-1">
                  {question.relatedSources.map((sourceId) => (
                    <Badge key={sourceId} variant="outline" className="text-xs">
                      {sourceId}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main component
const EvidencePackagePanel: React.FC = () => {
  const { t } = useTranslation();
  const mockEvidencePackage = createMockEvidencePackage(t);
  const timelineData = createTimelineData(mockEvidencePackage);
  const qualityData = createQualityData(mockEvidencePackage, t);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareLink, setShareLink] = useState<string>('');

  // Generate share link
  const generateShareLink = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const link = `https://evidence.example.com/view/${mockEvidencePackage.documentId}`;
    setShareLink(link);
    setIsGenerating(false);
    
    toast.success(t('result.evidence.share_link_generated'));
  };

  // Copy link
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast.success(t('result.evidence.link_copied'));
  };

  // Export evidence package
  const exportEvidencePackage = (format: 'pdf' | 'json' | 'zip') => {
    toast.success(t('result.evidence.exporting_format', { format: format.toUpperCase() }));
  };

  return (
    <div className="space-y-6">
      {/* Header overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <CardTitle>{t('result.evidence.title')}</CardTitle>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {t('result.evidence.subtitle')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{mockEvidencePackage.wordCount}</div>
              <div className="text-sm text-gray-500">{t('result.evidence.word_count')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{mockEvidencePackage.citationCount}</div>
              <div className="text-sm text-gray-500">{t('result.evidence.citation_count')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mockEvidencePackage.sessionDuration}</div>
              <div className="text-sm text-gray-500">{t('result.evidence.session_duration')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{mockEvidencePackage.timeline.length}</div>
              <div className="text-sm text-gray-500">{t('result.evidence.operation_records')}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => exportEvidencePackage('pdf')} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              {t('result.evidence.export_pdf')}
            </Button>
            <Button variant="outline" onClick={() => exportEvidencePackage('json')}>
              <Database className="w-4 h-4 mr-2" />
              {t('result.evidence.export_data')}
            </Button>
            <Button variant="outline" onClick={() => exportEvidencePackage('zip')}>
              <Package className="w-4 h-4 mr-2" />
              {t('result.evidence.complete_package')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed content tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            {t('result.evidence.tab.overview')}
          </TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            {t('result.evidence.tab.timeline')}
          </TabsTrigger>
          <TabsTrigger value="sources" className="text-xs">
            <Database className="h-3 w-3 mr-1" />
            {t('result.evidence.tab.sources')}
          </TabsTrigger>
          <TabsTrigger value="viva" className="text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            {t('result.evidence.tab.viva')}
          </TabsTrigger>
          <TabsTrigger value="share" className="text-xs">
            <Share2 className="h-3 w-3 mr-1" />
            {t('result.evidence.tab.share')}
          </TabsTrigger>
        </TabsList>

        {/* Quality overview */}
        <TabsContent value="overview" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('result.evidence.quality_analysis')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {Object.entries(mockEvidencePackage.qualityMetrics).map(([key, value]) => {
                    const metricName = 
                      key === 'originalityScore' ? t('result.evidence.quality.originality') :
                      key === 'citationAccuracy' ? t('result.evidence.quality.citation_accuracy') :
                      key === 'styleConsistency' ? t('result.evidence.quality.style_consistency') :
                      key === 'structureScore' ? t('result.evidence.quality.structure_score') : key;

                    return (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{metricName}</span>
                          <span className="text-sm font-medium text-gray-900">{value}%</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    );
                  })}
                </div>

                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={qualityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {qualityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, t('result.evidence.score')]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <div className="font-medium text-green-900">{t('result.evidence.integrity_check')}</div>
                  <ul className="space-y-1 text-green-800 list-disc list-inside ml-2">
                    <li>✓ {t('result.evidence.check.timeline', { count: mockEvidencePackage.timeline.length.toString() })}</li>
                    <li>✓ {t('result.evidence.check.sources', { count: mockEvidencePackage.sources.length.toString() })}</li>
                    <li>✓ {t('result.evidence.check.viva', { count: mockEvidencePackage.vivaQuestions.length.toString() })}</li>
                    <li>✓ {t('result.evidence.check.session', { duration: mockEvidencePackage.sessionDuration.toString() })}</li>
                    <li>✓ {t('result.evidence.check.quality', { average: Math.round(Object.values(mockEvidencePackage.qualityMetrics).reduce((a, b) => a + b, 0) / 4).toString() })}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Operation timeline */}
        <TabsContent value="timeline" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('result.evidence.timeline_title')}</CardTitle>
              <p className="text-sm text-gray-600">
                {t('result.evidence.timeline_description')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="activity" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {mockEvidencePackage.timeline.map((event) => (
                  <TimelineCard key={event.id} event={event} t={t} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Citation sources */}
        <TabsContent value="sources" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('result.evidence.sources_title')}</CardTitle>
              <p className="text-sm text-gray-600">
                {t('result.evidence.sources_description')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockEvidencePackage.sources.map((source) => (
                  <SourceCard key={source.id} source={source} t={t} />
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const csvContent = mockEvidencePackage.sources.map(s => 
                      `"${s.title}","${s.authors.join('; ')}",${s.year},"${s.doi || ''}","${s.journal || ''}"`
                    ).join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'citation-sources.csv';
                    a.click();
                    toast.success(t('result.evidence.citation_exported'));
                  }}
                >
                  <Download className="w-4 h-4 mr-1" />
                  {t('result.evidence.export_csv')}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const bibContent = mockEvidencePackage.sources.map(s => 
                      `@article{${s.id},\n  title={${s.title}},\n  author={${s.authors.join(' and ')}},\n  year={${s.year}},\n  journal={${s.journal || ''}},\n  doi={${s.doi || ''}}\n}`
                    ).join('\n\n');
                    navigator.clipboard.writeText(bibContent);
                    toast.success(t('result.evidence.bibtex_copied'));
                  }}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  {t('result.evidence.copy_bibtex')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Viva preparation */}
        <TabsContent value="viva" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('result.evidence.viva_title')}</CardTitle>
              <p className="text-sm text-gray-600">
                {t('result.evidence.viva_description')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockEvidencePackage.vivaQuestions.map((question) => (
                  <VivaQuestionCard key={question.id} question={question} t={t} />
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-900 mb-1">{t('result.evidence.viva_tips_title')}</div>
                    <ul className="text-blue-800 space-y-1 list-disc list-inside">
                      <li>{t('result.evidence.viva_tip1')}</li>
                      <li>{t('result.evidence.viva_tip2')}</li>
                      <li>{t('result.evidence.viva_tip3')}</li>
                      <li>{t('result.evidence.viva_tip4')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Share verification */}
        <TabsContent value="share" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('result.evidence.share_title')}</CardTitle>
              <p className="text-sm text-gray-600">
                {t('result.evidence.share_description')}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!shareLink ? (
                <div className="text-center py-8">
                  <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">{t('result.evidence.click_generate')}</p>
                  <Button onClick={generateShareLink} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        {t('result.evidence.generating')}
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 mr-2" />
                        {t('result.evidence.generate_share_link')}
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                    <Link className="w-4 h-4 text-gray-600" />
                    <span className="flex-1 text-sm font-mono text-gray-800 truncate">{shareLink}</span>
                    <Button size="sm" variant="outline" onClick={copyShareLink}>
                      <Copy className="w-3 h-3 mr-1" />
                      {t('result.evidence.copy')}
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{t('result.evidence.expires_7_days')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-500" />
                      <span>{t('result.evidence.readonly_access')}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h5 className="font-medium text-gray-900 mb-2">{t('result.evidence.qr_share')}</h5>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1 text-sm text-gray-600">
                        <p>{t('result.evidence.scan_to_access')}</p>
                        <p className="text-xs mt-1">{t('result.evidence.link_contains_info')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <div className="font-medium text-orange-900">{t('result.evidence.share_security_title')}</div>
                  <ul className="space-y-1 text-orange-800 list-disc list-inside ml-2">
                    <li>{t('result.evidence.security_tip1')}</li>
                    <li>{t('result.evidence.security_tip2')}</li>
                    <li>{t('result.evidence.security_tip3')}</li>
                    <li>{t('result.evidence.security_tip4')}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EvidencePackagePanel;