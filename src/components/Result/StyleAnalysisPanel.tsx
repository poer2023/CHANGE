import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  BarChart3, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Upload,
  RefreshCw,
  Eye,
  Zap,
  Settings,
  Download,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

// Style metrics data types
interface StyleMetrics {
  sentenceLength: {
    current: number;
    baseline: number;
    score: number; // 0-100, closer to baseline = higher score
  };
  lexicalVariety: {
    current: number;
    baseline: number;
    score: number;
  };
  burstiness: {
    current: number;
    baseline: number;
    score: number;
  };
  complexity: {
    current: number;
    baseline: number;
    score: number;
  };
  overallDistance: number; // 0-100, 0 means perfect match
  polishLevel: 'light' | 'medium' | 'strong';
  recommendation: string;
}

// Historical sample information
interface BaselineSample {
  id: string;
  name: string;
  wordCount: number;
  uploadDate: string;
  language: string;
  type: 'essay' | 'report' | 'thesis' | 'other';
  metrics: {
    sentenceLength: number;
    lexicalVariety: number;
    burstiness: number;
    complexity: number;
  };
}

// Mock baseline sample data factory
const createMockBaselineSample = (t: (key: string) => string): BaselineSample => ({
  id: 'baseline-001',
  name: t('result.style.baseline_sample_name'),
  wordCount: 3500,
  uploadDate: '2024-01-15',
  language: t('result.style.language'),
  type: 'essay',
  metrics: {
    sentenceLength: 18.5,
    lexicalVariety: 0.72,
    burstiness: 1.8,
    complexity: 2.3
  }
});

const createMockCurrentMetrics = (t: (key: string) => string): StyleMetrics => ({
  sentenceLength: {
    current: 24.8,
    baseline: 18.5,
    score: 68
  },
  lexicalVariety: {
    current: 0.85,
    baseline: 0.72,
    score: 75
  },
  burstiness: {
    current: 2.4,
    baseline: 1.8,
    score: 62
  },
  complexity: {
    current: 2.8,
    baseline: 2.3,
    score: 72
  },
  overallDistance: 32,
  polishLevel: 'medium',
  recommendation: t('result.style.recommendation')
});

// Comparison chart data factory
const createComparisonData = (metrics: StyleMetrics, t: (key: string) => string) => [
  {
    metric: t('result.style.metric.sentence_length'),
    baseline: metrics.sentenceLength.baseline,
    current: metrics.sentenceLength.current,
    optimal: 20
  },
  {
    metric: t('result.style.metric.lexical_variety'),
    baseline: metrics.lexicalVariety.baseline * 100,
    current: metrics.lexicalVariety.current * 100,
    optimal: 75
  },
  {
    metric: t('result.style.metric.burstiness'),
    baseline: metrics.burstiness.baseline,
    current: metrics.burstiness.current,
    optimal: 2.0
  },
  {
    metric: t('result.style.metric.complexity'),
    baseline: metrics.complexity.baseline,
    current: metrics.complexity.current,
    optimal: 2.5
  }
];

// Radar chart data factory
const createRadarData = (metrics: StyleMetrics, t: (key: string) => string) => [
  {
    subject: t('result.style.radar.sentence_fit'),
    baseline: metrics.sentenceLength.score,
    current: 100,
    fullMark: 100
  },
  {
    subject: t('result.style.radar.lexical_consistency'),
    baseline: metrics.lexicalVariety.score,
    current: 100,
    fullMark: 100
  },
  {
    subject: t('result.style.radar.expression_rhythm'),
    baseline: metrics.burstiness.score,
    current: 100,
    fullMark: 100
  },
  {
    subject: t('result.style.radar.language_complexity'),
    baseline: metrics.complexity.score,
    current: 100,
    fullMark: 100
  }
];

// Style distance history data factory
const createDistanceHistory = (t: (key: string) => string) => [
  { version: t('result.style.version.draft'), distance: 58, timestamp: '14:32' },
  { version: t('result.style.version.revision1'), distance: 45, timestamp: '14:45' },
  { version: t('result.style.version.revision2'), distance: 38, timestamp: '14:58' },
  { version: t('result.style.version.current'), distance: 32, timestamp: '15:12' }
];

// Polish levels configuration factory
const createPolishLevels = (t: (key: string) => string) => [
  {
    level: 'light',
    name: t('result.style.polish.light'),
    description: t('result.style.polish.light_desc'),
    naturalErrorRate: t('result.style.error_rate.light'),
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    level: 'medium',
    name: t('result.style.polish.medium'),
    description: t('result.style.polish.medium_desc'),
    naturalErrorRate: t('result.style.error_rate.medium'),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    level: 'strong',
    name: t('result.style.polish.strong'),
    description: t('result.style.polish.strong_desc'),
    naturalErrorRate: t('result.style.error_rate.strong'),
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
];

// Baseline info card
const BaselineInfoCard: React.FC<{ sample: BaselineSample; t: (key: string) => string }> = ({ sample, t }) => (
  <Card className="border border-blue-200 bg-blue-50">
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <Target className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-blue-900 truncate">{sample.name}</h4>
          <p className="text-sm text-blue-700">{t('result.style.personal_baseline')}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-blue-600 font-medium">{t('result.style.word_count')}:</span>
          <span className="ml-1 text-blue-900">{sample.wordCount.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-blue-600 font-medium">{t('result.style.type')}:</span>
          <span className="ml-1 text-blue-900">
            {sample.type === 'essay' ? t('result.style.type_essay') : 
             sample.type === 'report' ? t('result.style.type_report') : 
             sample.type === 'thesis' ? t('result.style.type_thesis') : t('result.style.type_other')}
          </span>
        </div>
        <div>
          <span className="text-blue-600 font-medium">{t('result.style.upload_date')}:</span>
          <span className="ml-1 text-blue-900">{new Date(sample.uploadDate).toLocaleDateString()}</span>
        </div>
        <div>
          <span className="text-blue-600 font-medium">{t('result.style.language_label')}:</span>
          <span className="ml-1 text-blue-900">{sample.language}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-blue-200">
        <Button size="sm" variant="outline" className="text-xs border-blue-300 text-blue-700 hover:bg-blue-100">
          <Upload className="w-3 h-3 mr-1" />
          {t('result.style.update_baseline')}
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Style distance indicator
const StyleDistanceIndicator: React.FC<{ distance: number; targetDistance?: number; t: (key: string) => string }> = ({ 
  distance, 
  targetDistance = 25,
  t
}) => {
  const getDistanceStatus = () => {
    if (distance <= targetDistance) return { status: 'excellent', color: 'text-green-600', bgColor: 'bg-green-50', label: t('result.style.match.excellent') };
    if (distance <= 35) return { status: 'good', color: 'text-blue-600', bgColor: 'bg-blue-50', label: t('result.style.match.good') };
    if (distance <= 50) return { status: 'fair', color: 'text-orange-600', bgColor: 'bg-orange-50', label: t('result.style.match.fair') };
    return { status: 'poor', color: 'text-red-600', bgColor: 'bg-red-50', label: t('result.style.match.poor') };
  };

  const { status, color, bgColor, label } = getDistanceStatus();

  return (
    <div className={`p-6 rounded-xl ${bgColor} text-center`}>
      <div className="relative w-24 h-24 mx-auto mb-4">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeDasharray={`${(100 - distance) * 2.827} 282.7`}
            className={color}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`text-2xl font-bold ${color}`}>{distance}</div>
            <div className="text-xs text-gray-600">{t('result.style.distance')}</div>
          </div>
        </div>
      </div>
      
      <Badge className={`${bgColor} ${color} border-current`}>
        {label}
      </Badge>
      
      <p className="text-sm text-gray-600 mt-2">
        {t('result.style.target_distance')}: ≤{targetDistance}
      </p>
    </div>
  );
};

// Main component
const StyleAnalysisPanel: React.FC = () => {
  const { t } = useTranslation();
  const mockBaselineSample = createMockBaselineSample(t);
  const mockCurrentMetrics = createMockCurrentMetrics(t);
  const comparisonData = createComparisonData(mockCurrentMetrics, t);
  const radarData = createRadarData(mockCurrentMetrics, t);
  const distanceHistory = createDistanceHistory(t);
  const polishLevels = createPolishLevels(t);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [polishLevel, setPolishLevel] = useState<'light' | 'medium' | 'strong'>('medium');

  // Simulate reanalyze
  const handleReanalyze = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
    toast.success(t('result.style.analysis_updated'));
  };

  // Apply polish suggestion
  const handleApplyPolish = async (level: 'light' | 'medium' | 'strong') => {
    setPolishLevel(level);
    toast.success(t('result.style.polish_set', { 
      level: level === 'light' ? t('result.style.polish.light') : 
             level === 'medium' ? t('result.style.polish.medium') : 
             t('result.style.polish.strong')
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              <CardTitle>{t('result.style.title')}</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {t('result.style.based_on_history')}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReanalyze}
                disabled={isAnalyzing}
                className="text-xs"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    {t('result.style.analyzing')}
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    {t('result.style.reanalyze')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Style distance */}
            <StyleDistanceIndicator distance={mockCurrentMetrics.overallDistance} t={t} />
            
            {/* Right: Baseline info */}
            <BaselineInfoCard sample={mockBaselineSample} t={t} />
          </div>
        </CardContent>
      </Card>

      {/* Detailed analysis tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            {t('result.style.tab.overview')}
          </TabsTrigger>
          <TabsTrigger value="metrics" className="text-xs">
            <BarChart3 className="h-3 w-3 mr-1" />
            {t('result.style.tab.metrics')}
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            <Activity className="h-3 w-3 mr-1" />
            {t('result.style.tab.history')}
          </TabsTrigger>
          <TabsTrigger value="polish" className="text-xs">
            <Settings className="h-3 w-3 mr-1" />
            {t('result.style.tab.polish')}
          </TabsTrigger>
        </TabsList>

        {/* Overview comparison */}
        <TabsContent value="overview" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('result.style.style_metrics_comparison')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData} barGap={10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="metric" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="baseline" fill="#3B82F6" name={t('result.style.personal_baseline')} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="current" fill="#10B981" name={t('result.style.current_document')} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="optimal" fill="#F59E0B" name={t('result.style.recommended_target')} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('result.style.radar_analysis')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e0e0e0" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  <PolarRadiusAxis 
                    angle={0} 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10, fill: '#999' }}
                    tickCount={5}
                  />
                  <Radar 
                    name={t('result.style.match_degree')} 
                    dataKey="baseline" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metrics details */}
        <TabsContent value="metrics" className="mt-6 space-y-4">
          {Object.entries(mockCurrentMetrics).map(([key, value]) => {
            if (typeof value === 'object' && value !== null && 'current' in value) {
              const metric = value as { current: number; baseline: number; score: number };
              const metricName = 
                key === 'sentenceLength' ? t('result.style.metric.avg_sentence_length') :
                key === 'lexicalVariety' ? t('result.style.metric.lexical_variety') :
                key === 'burstiness' ? t('result.style.metric.expression_burstiness') :
                key === 'complexity' ? t('result.style.metric.language_complexity') : key;

              return (
                <Card key={key}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{metricName}</h4>
                      <Badge 
                        variant="outline" 
                        className={
                          metric.score >= 80 ? 'bg-green-50 text-green-700 border-green-200' :
                          metric.score >= 60 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-orange-50 text-orange-700 border-orange-200'
                        }
                      >
                        {t('result.style.match_degree')}: {metric.score}%
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <Progress value={metric.score} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">{t('result.style.personal_baseline')}:</span>
                        <span className="ml-2 font-medium">{metric.baseline.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('result.style.current_value')}:</span>
                        <span className="ml-2 font-medium">{metric.current.toFixed(2)}</span>
                      </div>
                    </div>

                    {metric.score < 70 && (
                      <div className="mt-3 p-2 bg-orange-50 rounded border border-orange-200">
                        <div className="flex items-center gap-2 text-orange-800 text-sm">
                          <Info className="w-4 h-4" />
                          <span>{t('result.style.adjust_suggestion')}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            }
            return null;
          })}
        </TabsContent>

        {/* Optimization history */}
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('result.style.optimization_history')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={distanceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="version" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    domain={[0, 70]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="distance" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#1D4ED8' }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 space-y-2">
                <h5 className="font-medium text-gray-900">{t('result.style.optimization_records')}</h5>
                {distanceHistory.map((record, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        record.distance <= 25 ? 'bg-green-500' :
                        record.distance <= 35 ? 'bg-blue-500' :
                        record.distance <= 50 ? 'bg-orange-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium">{record.version}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span>{t('result.style.style_distance')}: {record.distance}</span>
                      <span>{record.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Polish settings */}
        <TabsContent value="polish" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('result.style.polish_intensity')}</CardTitle>
              <p className="text-sm text-gray-600">
                {t('result.style.polish_description')}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {polishLevels.map((level) => (
                  <Card 
                    key={level.level}
                    className={`cursor-pointer border-2 transition-colors ${
                      polishLevel === level.level 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleApplyPolish(level.level)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            polishLevel === level.level ? 'bg-blue-600' : 'bg-gray-300'
                          }`} />
                          <div>
                            <h4 className="font-medium text-gray-900">{level.name}</h4>
                            <p className="text-sm text-gray-600">{level.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {t('result.style.natural_error_rate')}: {level.naturalErrorRate}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <div className="font-medium text-blue-900">{t('result.style.non_native_friendly')}</div>
                    <ul className="space-y-1 text-blue-800 list-disc list-inside ml-2">
                      <li>{t('result.style.preserve_imperfection')}</li>
                      <li>{t('result.style.maintain_habits')}</li>
                      <li>{t('result.style.preserve_academic')}</li>
                      <li>{t('result.style.auto_adjust')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StyleAnalysisPanel;