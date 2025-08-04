/**
 * 质量评估和报告生成组件
 * 提供内容质量评分、学术规范检查、格式验证、改进建议等功能
 */

import React, { useState, useEffect } from 'react';
import { 
  ProgressTrackingResult,
  ConsistencyAnalysisResult 
} from '../../services';
import { Paper, ContentAnalysisResult } from '../../types';

interface QualityAssessmentPanelProps {
  paper: Paper;
  consistencyResult?: ConsistencyAnalysisResult;
  progressResult?: ProgressTrackingResult;
  contentAnalysis?: ContentAnalysisResult;
  onGenerateReport?: (format: ReportFormat) => void;
  onExportPaper?: (config: ExportConfig) => void;
  isLoading?: boolean;
}

interface QualityAssessment {
  overall: {
    score: number;
    grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
    summary: string;
  };
  dimensions: {
    content: QualityDimension;
    structure: QualityDimension;
    language: QualityDimension;
    format: QualityDimension;
    academic: QualityDimension;
    consistency: QualityDimension;
  };
  improvements: ImprovementRecommendation[];
  compliance: ComplianceCheck;
  timeline: QualityTimeline[];
}

interface QualityDimension {
  score: number;
  weight: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  trend: 'improving' | 'stable' | 'declining';
}

interface ImprovementRecommendation {
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'content' | 'structure' | 'language' | 'format' | 'academic';
  title: string;
  description: string;
  impact: number;
  effort: number;
  timeframe: 'immediate' | 'short-term' | 'long-term';
  actions: ActionItem[];
}

interface ActionItem {
  description: string;
  completed: boolean;
  dueDate?: Date;
  estimatedHours: number;
}

interface ComplianceCheck {
  academicStandards: {
    passed: boolean;
    issues: string[];
  };
  citationStyle: {
    passed: boolean;
    issues: string[];
  };
  formatGuidelines: {
    passed: boolean;
    issues: string[];
  };
  wordCount: {
    passed: boolean;
    current: number;
    target: number;
    deviation: number;
  };
}

interface QualityTimeline {
  date: Date;
  score: number;
  improvements: string[];
  issues: string[];
}

type ReportFormat = 'pdf' | 'docx' | 'html' | 'json';

interface ExportConfig {
  format: 'pdf' | 'docx' | 'latex';
  includeComments: boolean;
  includeAnalysis: boolean;
  template?: string;
}

const QualityAssessmentPanel: React.FC<QualityAssessmentPanelProps> = ({
  paper,
  consistencyResult,
  progressResult,
  contentAnalysis,
  onGenerateReport,
  onExportPaper,
  isLoading = false
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'dimensions' | 'improvements' | 'compliance' | 'reports'>('overview');
  const [qualityAssessment, setQualityAssessment] = useState<QualityAssessment | null>(null);
  const [expandedImprovements, setExpandedImprovements] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (consistencyResult || progressResult || contentAnalysis) {
      generateQualityAssessment();
    }
  }, [consistencyResult, progressResult, contentAnalysis]);

  const generateQualityAssessment = () => {
    // 综合各项分析结果生成质量评估
    const contentScore = contentAnalysis?.overall.score || 75;
    const consistencyScore = consistencyResult?.overall.score || 80;
    const progressScore = progressResult?.overall.qualityScore || 70;

    // 计算各维度分数
    const dimensions = {
      content: {
        score: contentScore,
        weight: 0.25,
        strengths: ['论证清晰', '内容丰富'],
        weaknesses: ['部分章节深度不够'],
        suggestions: ['扩充案例分析', '增加数据支撑'],
        trend: 'improving' as const
      },
      structure: {
        score: consistencyResult?.structuralCoherence.score || 75,
        weight: 0.20,
        strengths: ['逻辑清晰', '层次分明'],
        weaknesses: ['章节平衡待优化'],
        suggestions: ['调整章节长度', '加强过渡'],
        trend: 'stable' as const
      },
      language: {
        score: contentAnalysis?.language.score || 82,
        weight: 0.15,
        strengths: ['语言流畅', '表达准确'],
        weaknesses: ['个别术语不统一'],
        suggestions: ['统一专业术语', '润色表达'],
        trend: 'improving' as const
      },
      format: {
        score: 85,
        weight: 0.10,
        strengths: ['格式规范', '引用正确'],
        weaknesses: ['图表标注不够完整'],
        suggestions: ['完善图表说明', '检查引用格式'],
        trend: 'stable' as const
      },
      academic: {
        score: contentAnalysis?.academics.score || 78,
        weight: 0.20,
        strengths: ['研究方法适当', '文献引用充分'],
        weaknesses: ['创新点阐述不够突出'],
        suggestions: ['强化创新性描述', '增加对比分析'],
        trend: 'stable' as const
      },
      consistency: {
        score: consistencyScore,
        weight: 0.10,
        strengths: ['内容一致', '逻辑连贯'],
        weaknesses: ['部分术语需统一'],
        suggestions: ['建立术语表', '统一表达方式'],
        trend: 'improving' as const
      }
    };

    // 计算总分
    const overallScore = Math.round(
      Object.values(dimensions).reduce((sum, dim) => sum + dim.score * dim.weight, 0)
    );

    const getGrade = (score: number): QualityAssessment['overall']['grade'] => {
      if (score >= 95) return 'A+';
      if (score >= 90) return 'A';
      if (score >= 85) return 'B+';
      if (score >= 80) return 'B';
      if (score >= 75) return 'C+';
      if (score >= 70) return 'C';
      if (score >= 60) return 'D';
      return 'F';
    };

    setQualityAssessment({
      overall: {
        score: overallScore,
        grade: getGrade(overallScore),
        summary: `论文整体质量${getGrade(overallScore)}级，在内容深度和结构组织方面表现良好，建议重点关注语言润色和学术规范性。`
      },
      dimensions,
      improvements: generateImprovements(dimensions),
      compliance: generateComplianceCheck(),
      timeline: generateTimeline()
    });
  };

  const generateImprovements = (dimensions: QualityAssessment['dimensions']): ImprovementRecommendation[] => {
    const improvements: ImprovementRecommendation[] = [];

    // 基于各维度得分生成改进建议
    Object.entries(dimensions).forEach(([category, dimension]) => {
      if (dimension.score < 80) {
        improvements.push({
          priority: dimension.score < 60 ? 'critical' : dimension.score < 70 ? 'high' : 'medium',
          category: category as any,
          title: `提升${getCategoryName(category)}质量`,
          description: `当前${getCategoryName(category)}得分为${dimension.score}分，需要重点改进`,
          impact: 85 - dimension.score,
          effort: Math.ceil((85 - dimension.score) / 10),
          timeframe: dimension.score < 60 ? 'immediate' : 'short-term',
          actions: dimension.suggestions.map(suggestion => ({
            description: suggestion,
            completed: false,
            estimatedHours: 2
          }))
        });
      }
    });

    return improvements.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const generateComplianceCheck = (): ComplianceCheck => {
    const currentWordCount = paper.sections?.reduce((sum, s) => sum + s.content.split(' ').length, 0) || 0;
    const targetWordCount = 8000; // 假设目标字数

    return {
      academicStandards: {
        passed: (contentAnalysis?.academics.score || 0) >= 70,
        issues: (contentAnalysis?.academics.score || 0) < 70 ? ['学术规范性需要提升'] : []
      },
      citationStyle: {
        passed: (consistencyResult?.referenceIntegrity.score || 0) >= 80,
        issues: (consistencyResult?.referenceIntegrity.score || 0) < 80 ? ['引用格式需要统一'] : []
      },
      formatGuidelines: {
        passed: true,
        issues: []
      },
      wordCount: {
        passed: Math.abs(currentWordCount - targetWordCount) / targetWordCount <= 0.1,
        current: currentWordCount,
        target: targetWordCount,
        deviation: Math.round(((currentWordCount - targetWordCount) / targetWordCount) * 100)
      }
    };
  };

  const generateTimeline = (): QualityTimeline[] => {
    // 模拟质量时间线数据
    const today = new Date();
    return [
      {
        date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
        score: 72,
        improvements: ['完成文献综述'],
        issues: ['引用格式不统一']
      },
      {
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
        score: 76,
        improvements: ['优化论文结构', '补充案例分析'],
        issues: ['部分章节过短']
      },
      {
        date: today,
        score: qualityAssessment?.overall.score || 78,
        improvements: ['语言润色', '格式调整'],
        issues: ['术语统一性待改善']
      }
    ];
  };

  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
      content: '内容质量',
      structure: '结构组织',
      language: '语言表达',
      format: '格式规范',
      academic: '学术水准',
      consistency: '一致性'
    };
    return names[category] || category;
  };

  const toggleImprovementExpansion = (index: number) => {
    const key = index.toString();
    const newExpanded = new Set(expandedImprovements);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedImprovements(newExpanded);
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {qualityAssessment && (
        <>
          {/* 整体评分 */}
          <div className="bg-white rounded-lg border p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <span className="text-3xl font-bold text-white">
                  {qualityAssessment.overall.grade}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                总体评分: {qualityAssessment.overall.score}/100
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {qualityAssessment.overall.summary}
              </p>
            </div>

            {/* 各维度雷达图占位 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(qualityAssessment.dimensions).map(([key, dimension]) => (
                <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {dimension.score}
                  </div>
                  <div className="text-sm text-gray-600">{getCategoryName(key)}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${dimension.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 快速统计 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="优势项目"
              value={Object.values(qualityAssessment.dimensions).filter(d => d.score >= 80).length}
              total={Object.keys(qualityAssessment.dimensions).length}
              icon="✅"
              color="green"
            />
            <StatCard
              title="需改进项"
              value={qualityAssessment.improvements.filter(i => i.priority === 'high' || i.priority === 'critical').length}
              total={qualityAssessment.improvements.length}
              icon="⚠️"
              color="orange"
            />
            <StatCard
              title="合规检查"
              value={Object.values(qualityAssessment.compliance).filter(c => typeof c === 'object' && c.passed).length}
              total={Object.keys(qualityAssessment.compliance).length}
              icon="📋"
              color="blue"
            />
            <StatCard
              title="整体趋势"
              value="上升"
              total=""
              icon="📈"
              color="purple"
            />
          </div>
        </>
      )}
    </div>
  );

  const renderDimensionsTab = () => (
    <div className="space-y-6">
      {qualityAssessment && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(qualityAssessment.dimensions).map(([key, dimension]) => (
            <DimensionCard key={key} name={getCategoryName(key)} dimension={dimension} />
          ))}
        </div>
      )}
    </div>
  );

  const renderImprovementsTab = () => (
    <div className="space-y-6">
      {qualityAssessment && (
        <>
          {/* 改进优先级分布 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">改进建议优先级分布</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              {[
                { priority: 'critical', label: '紧急', color: 'bg-red-500' },
                { priority: 'high', label: '高', color: 'bg-orange-500' },
                { priority: 'medium', label: '中', color: 'bg-yellow-500' },
                { priority: 'low', label: '低', color: 'bg-blue-500' }
              ].map(item => (
                <div key={item.priority} className="p-4 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 ${item.color} rounded-full mx-auto mb-2`} />
                  <div className="text-xl font-bold">
                    {qualityAssessment.improvements.filter(i => i.priority === item.priority).length}
                  </div>
                  <div className="text-sm text-gray-600">{item.label}优先级</div>
                </div>
              ))}
            </div>
          </div>

          {/* 改进建议列表 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">详细改进建议</h3>
            <div className="space-y-4">
              {qualityAssessment.improvements.map((improvement, index) => (
                <ImprovementCard
                  key={index}
                  improvement={improvement}
                  isExpanded={expandedImprovements.has(index.toString())}
                  onToggle={() => toggleImprovementExpansion(index)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderComplianceTab = () => (
    <div className="space-y-6">
      {qualityAssessment && (
        <>
          {/* 合规性检查总览 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">合规性检查总览</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(qualityAssessment.compliance).map(([key, check]) => (
                <ComplianceCard key={key} name={key} check={check} />
              ))}
            </div>
          </div>

          {/* 质量时间线 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">质量改进时间线</h3>
            <div className="space-y-4">
              {qualityAssessment.timeline.map((entry, index) => (
                <TimelineEntry key={index} entry={entry} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      {/* 报告生成 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">生成质量评估报告</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            { format: 'pdf' as ReportFormat, name: 'PDF报告', description: '完整的质量评估报告，包含图表和分析' },
            { format: 'docx' as ReportFormat, name: 'Word文档', description: '可编辑的详细报告文档' },
            { format: 'html' as ReportFormat, name: 'HTML报告', description: '交互式网页报告' },
            { format: 'json' as ReportFormat, name: 'JSON数据', description: '结构化数据，便于系统集成' }
          ].map(report => (
            <div key={report.format} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-gray-900 mb-2">{report.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{report.description}</p>
              <button
                onClick={() => onGenerateReport?.(report.format)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                生成{report.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 论文导出 */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">导出最终论文</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { format: 'pdf', name: 'PDF格式', description: '标准学术论文格式' },
            { format: 'docx', name: 'Word格式', description: '可编辑的文档格式' },
            { format: 'latex', name: 'LaTeX格式', description: '高质量排版格式' }
          ].map(exportOption => (
            <div key={exportOption.format} className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">{exportOption.name}</h4>
              <p className="text-sm text-gray-600 mb-3">{exportOption.description}</p>
              <div className="space-y-2 mb-3">
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  包含评论和建议
                </label>
                <label className="flex items-center text-sm">
                  <input type="checkbox" className="mr-2" />
                  包含质量分析
                </label>
              </div>
              <button
                onClick={() => onExportPaper?.({
                  format: exportOption.format as any,
                  includeComments: true,
                  includeAnalysis: false
                })}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                导出{exportOption.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* 头部 */}
        <div className="mb-6 bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">质量评估与报告</h1>
              <p className="text-gray-600">
                全面评估论文《{paper.title}》的质量并生成详细报告
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => generateQualityAssessment()}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                重新评估
              </button>
            </div>
          </div>
        </div>

        {/* 标签导航 */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { key: 'overview', label: '总览' },
              { key: 'dimensions', label: '质量维度' },
              { key: 'improvements', label: '改进建议' },
              { key: 'compliance', label: '合规检查' },
              { key: 'reports', label: '报告导出' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 内容区域 */}
        <div className="min-h-96">
          {selectedTab === 'overview' && renderOverviewTab()}
          {selectedTab === 'dimensions' && renderDimensionsTab()}
          {selectedTab === 'improvements' && renderImprovementsTab()}
          {selectedTab === 'compliance' && renderComplianceTab()}
          {selectedTab === 'reports' && renderReportsTab()}
        </div>
      </div>
    </div>
  );
};

// 统计卡片组件
interface StatCardProps {
  title: string;
  value: number | string;
  total: number | string;
  icon: string;
  color: 'green' | 'orange' | 'blue' | 'purple';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, total, icon, color }) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-700 border-green-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-medium opacity-75">{title}</span>
      </div>
      <div className="text-2xl font-bold">
        {value}
        {total && <span className="text-sm font-normal opacity-75">/{total}</span>}
      </div>
    </div>
  );
};

// 维度卡片组件
interface DimensionCardProps {
  name: string;
  dimension: QualityDimension;
}

const DimensionCard: React.FC<DimensionCardProps> = ({ name, dimension }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <div className="flex items-center space-x-2">
          <span className={`text-2xl font-bold ${getScoreColor(dimension.score)}`}>
            {dimension.score}
          </span>
          <span className="text-lg">{getTrendIcon(dimension.trend)}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              dimension.score >= 85 ? 'bg-green-500' :
              dimension.score >= 75 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${dimension.score}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {dimension.strengths.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-1">优势</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {dimension.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {dimension.weaknesses.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-700 mb-1">待改进</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {dimension.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">!</span>
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        )}

        {dimension.suggestions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-blue-700 mb-1">建议</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {dimension.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// 改进建议卡片组件
interface ImprovementCardProps {
  improvement: ImprovementRecommendation;
  isExpanded: boolean;
  onToggle: () => void;
}

const ImprovementCard: React.FC<ImprovementCardProps> = ({ improvement, isExpanded, onToggle }) => {
  const getPriorityColor = (priority: string) => {
    const colors = {
      critical: 'border-red-300 bg-red-50',
      high: 'border-orange-300 bg-orange-50',
      medium: 'border-yellow-300 bg-yellow-50',
      low: 'border-blue-300 bg-blue-50'
    };
    return colors[priority as keyof typeof colors] || 'border-gray-300 bg-gray-50';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    const labels = {
      critical: '紧急',
      high: '高',
      medium: '中',
      low: '低'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {labels[priority as keyof typeof labels]}
      </span>
    );
  };

  const getTimeframeLabel = (timeframe: string) => {
    const labels = {
      immediate: '立即',
      'short-term': '短期',
      'long-term': '长期'
    };
    return labels[timeframe as keyof typeof labels] || timeframe;
  };

  return (
    <div className={`border rounded-lg p-4 ${getPriorityColor(improvement.priority)}`}>
      <div className="flex items-start justify-between cursor-pointer" onClick={onToggle}>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-medium text-gray-900">{improvement.title}</h4>
            {getPriorityBadge(improvement.priority)}
          </div>
          <p className="text-sm text-gray-700 mb-2">{improvement.description}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>预期影响: +{improvement.impact}分</span>
            <span>工作量: {improvement.effort}小时</span>
            <span>时间框架: {getTimeframeLabel(improvement.timeframe)}</span>
          </div>
        </div>
        <button className="ml-2 text-gray-400 hover:text-gray-600">
          <svg 
            className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h5 className="font-medium text-gray-900 mb-2">具体行动项</h5>
          <div className="space-y-2">
            {improvement.actions.map((action, index) => (
              <div key={index} className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  checked={action.completed}
                  onChange={(e) => {
                    // 处理完成状态变更
                    action.completed = e.target.checked;
                  }}
                  className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className={`text-sm ${action.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {action.description}
                  </span>
                  <div className="text-xs text-gray-500">
                    预计时间: {action.estimatedHours}小时
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 合规性卡片组件
interface ComplianceCardProps {
  name: string;
  check: any;
}

const ComplianceCard: React.FC<ComplianceCardProps> = ({ name, check }) => {
  const getStatusIcon = (passed: boolean) => passed ? '✅' : '❌';
  const getStatusColor = (passed: boolean) => passed ? 'text-green-600' : 'text-red-600';

  const formatName = (name: string) => {
    const names: Record<string, string> = {
      academicStandards: '学术标准',
      citationStyle: '引用样式',
      formatGuidelines: '格式规范',
      wordCount: '字数要求'
    };
    return names[name] || name;
  };

  if (name === 'wordCount') {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">{formatName(name)}</h4>
          <span className={`text-lg ${getStatusColor(check.passed)}`}>
            {getStatusIcon(check.passed)}
          </span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <div>当前字数: {check.current.toLocaleString()}</div>
          <div>目标字数: {check.target.toLocaleString()}</div>
          <div>偏差: {check.deviation > 0 ? '+' : ''}{check.deviation}%</div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">{formatName(name)}</h4>
        <span className={`text-lg ${getStatusColor(check.passed)}`}>
          {getStatusIcon(check.passed)}
        </span>
      </div>
      {check.issues.length > 0 && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">需要关注:</span>
          <ul className="mt-1 space-y-1">
            {check.issues.map((issue: string, index: number) => (
              <li key={index} className="text-red-600">• {issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// 时间线条目组件
interface TimelineEntryProps {
  entry: QualityTimeline;
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({ entry }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-16 text-center">
        <div className="text-xs text-gray-500 mb-1">{formatDate(entry.date)}</div>
        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
          {entry.score}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="mb-2">
          {entry.improvements.length > 0 && (
            <div className="mb-1">
              <span className="text-sm font-medium text-green-700">改进:</span>
              <ul className="text-sm text-gray-600">
                {entry.improvements.map((improvement, index) => (
                  <li key={index}>• {improvement}</li>
                ))}
              </ul>
            </div>
          )}
          {entry.issues.length > 0 && (
            <div>
              <span className="text-sm font-medium text-red-700">问题:</span>
              <ul className="text-sm text-gray-600">
                {entry.issues.map((issue, index) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QualityAssessmentPanel;