/**
 * 跨模块一致性分析面板组件
 * 显示论文各章节之间的逻辑一致性、引用完整性、结构合理性分析结果
 */

import React, { useState, useEffect } from 'react';
import { 
  ConsistencyAnalysisResult,
  LogicalIssue,
  ConsistencyRecommendation 
} from '../../services/consistency-analyzer';
import { Paper } from '../../types';

interface ConsistencyAnalysisPanelProps {
  paper: Paper;
  analysisResult?: ConsistencyAnalysisResult;
  onAnalyze?: () => void;
  onApplyRecommendation?: (recommendation: ConsistencyRecommendation) => void;
  isLoading?: boolean;
}

const ConsistencyAnalysisPanel: React.FC<ConsistencyAnalysisPanelProps> = ({
  paper,
  analysisResult,
  onAnalyze,
  onApplyRecommendation,
  isLoading = false
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'logical' | 'reference' | 'structural' | 'content'>('overview');
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

  const toggleIssueExpansion = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'excellent': return 'text-green-600 bg-green-50';
      case 'good': return 'text-blue-600 bg-blue-50';
      case 'fair': return 'text-yellow-600 bg-yellow-50';
      case 'poor': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'major': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'minor': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* 整体分数卡片 */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">整体一致性评分</h3>
          {analysisResult && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(analysisResult.overall.grade)}`}>
              {analysisResult.overall.score}/100 ({analysisResult.overall.grade})
            </div>
          )}
        </div>
        
        {analysisResult ? (
          <>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>整体评分</span>
                <span>{analysisResult.overall.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${analysisResult.overall.score}%` }}
                />
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {analysisResult.overall.summary}
            </p>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>点击"开始分析"来获取论文一致性评估</p>
          </div>
        )}
      </div>

      {/* 各维度得分 */}
      {analysisResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ScoreCard
            title="逻辑一致性"
            score={analysisResult.logicalConsistency.score}
            description="论证逻辑、章节过渡、内容连贯性"
            onClick={() => setSelectedTab('logical')}
          />
          <ScoreCard
            title="引用完整性"
            score={analysisResult.referenceIntegrity.score}
            description="引用格式、参考文献、引用一致性"
            onClick={() => setSelectedTab('reference')}
          />
          <ScoreCard
            title="结构连贯性"
            score={analysisResult.structuralCoherence.score}
            description="章节平衡、层次结构、内容分布"
            onClick={() => setSelectedTab('structural')}
          />
          <ScoreCard
            title="内容一致性"
            score={analysisResult.contentConsistency.score}
            description="术语统一、风格一致、重复检测"
            onClick={() => setSelectedTab('content')}
          />
        </div>
      )}

      {/* 主要建议 */}
      {analysisResult && analysisResult.recommendations.length > 0 && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">主要改进建议</h3>
          <div className="space-y-3">
            {analysisResult.recommendations.slice(0, 3).map((recommendation, index) => (
              <RecommendationCard
                key={index}
                recommendation={recommendation}
                onApply={() => onApplyRecommendation?.(recommendation)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderLogicalTab = () => (
    <div className="space-y-6">
      {analysisResult && (
        <>
          {/* 逻辑流分析 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">逻辑流分析</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>流畅度评分</span>
                <span>{analysisResult.logicalConsistency.flow.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${analysisResult.logicalConsistency.flow.score}%` }}
                />
              </div>
            </div>
            
            {analysisResult.logicalConsistency.flow.transitions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">章节过渡分析</h4>
                {analysisResult.logicalConsistency.flow.transitions.map((transition, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <span className="text-sm font-medium">{transition.fromSection}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="text-sm font-medium">{transition.toSection}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{transition.score}/100</span>
                      <div className={`w-2 h-2 rounded-full ${
                        transition.score >= 80 ? 'bg-green-500' :
                        transition.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 论证结构 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">论证结构</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>论证强度</span>
                <span>{analysisResult.logicalConsistency.argumentation.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${analysisResult.logicalConsistency.argumentation.score}%` }}
                />
              </div>
            </div>

            {analysisResult.logicalConsistency.argumentation.chain.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">论证链分析</h4>
                {analysisResult.logicalConsistency.argumentation.chain.map((chain, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">前提：</span>
                      <span className="text-sm text-gray-900">{chain.premise}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">结论：</span>
                      <span className="text-sm text-gray-900">{chain.conclusion}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">强度: {chain.strength}/100</span>
                      <div className={`px-2 py-1 rounded text-xs ${
                        chain.strength >= 80 ? 'bg-green-100 text-green-800' :
                        chain.strength >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {chain.strength >= 80 ? '强' : chain.strength >= 60 ? '中' : '弱'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 逻辑问题 */}
          {analysisResult.logicalConsistency.issues.length > 0 && (
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">检测到的问题</h3>
              <div className="space-y-3">
                {analysisResult.logicalConsistency.issues.map((issue, index) => (
                  <IssueCard
                    key={index}
                    issue={issue}
                    isExpanded={expandedIssues.has(`logical-${index}`)}
                    onToggle={() => toggleIssueExpansion(`logical-${index}`)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderReferenceTab = () => (
    <div className="space-y-6">
      {analysisResult && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">引用完整性分析</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {analysisResult.referenceIntegrity.totalReferences}
              </div>
              <div className="text-sm text-blue-800">总引用数</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {analysisResult.referenceIntegrity.citationIssues.length}
              </div>
              <div className="text-sm text-green-800">引用问题</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {analysisResult.referenceIntegrity.score}
              </div>
              <div className="text-sm text-purple-800">完整性评分</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStructuralTab = () => (
    <div className="space-y-6">
      {analysisResult && (
        <>
          {/* 章节平衡分析 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">章节平衡分析</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>平衡度评分</span>
                <span>{analysisResult.structuralCoherence.sectionBalance.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{ width: `${analysisResult.structuralCoherence.sectionBalance.score}%` }}
                />
              </div>
            </div>

            {analysisResult.structuralCoherence.sectionBalance.imbalances.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">结构不平衡问题</h4>
                {analysisResult.structuralCoherence.sectionBalance.imbalances.map((imbalance, index) => (
                  <div key={index} className={`p-3 rounded border ${getSeverityColor(imbalance.severity)}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-medium">{imbalance.section}</span>
                        <p className="text-sm mt-1">
                          {imbalance.issue === 'too_long' ? '章节过长' : 
                           imbalance.issue === 'too_short' ? '章节过短' : '长度不均衡'}
                        </p>
                        <p className="text-xs mt-1">
                          当前: {imbalance.currentLength} 字 | 
                          建议: {imbalance.recommendedRange.min}-{imbalance.recommendedRange.max} 字
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        imbalance.severity === 'severe' ? 'bg-red-200 text-red-800' :
                        imbalance.severity === 'moderate' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {imbalance.severity === 'severe' ? '严重' :
                         imbalance.severity === 'moderate' ? '中等' : '轻微'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 层次一致性 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">层次一致性</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>层次评分</span>
                <span>{analysisResult.structuralCoherence.hierarchyConsistency.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full"
                  style={{ width: `${analysisResult.structuralCoherence.hierarchyConsistency.score}%` }}
                />
              </div>
            </div>

            {analysisResult.structuralCoherence.hierarchyConsistency.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">层次问题</h4>
                {analysisResult.structuralCoherence.hierarchyConsistency.issues.map((issue, index) => (
                  <div key={index} className="p-3 bg-orange-50 border border-orange-200 rounded">
                    <div className="font-medium text-orange-800">{issue.section}</div>
                    <p className="text-sm text-orange-700 mt-1">{issue.description}</p>
                    <p className="text-xs text-orange-600 mt-1">{issue.suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  const renderContentTab = () => (
    <div className="space-y-6">
      {analysisResult && (
        <>
          {/* 术语一致性 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">术语一致性</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>一致性评分</span>
                <span>{analysisResult.contentConsistency.terminologyConsistency.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-emerald-600 h-2 rounded-full"
                  style={{ width: `${analysisResult.contentConsistency.terminologyConsistency.score}%` }}
                />
              </div>
            </div>
          </div>

          {/* 风格一致性 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">风格一致性</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>风格评分</span>
                <span>{analysisResult.contentConsistency.styleConsistency.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-rose-600 h-2 rounded-full"
                  style={{ width: `${analysisResult.contentConsistency.styleConsistency.score}%` }}
                />
              </div>
            </div>
          </div>

          {/* 重复内容 */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">重复内容检测</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>原创性评分</span>
                <span>{analysisResult.contentConsistency.duplicateContent.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-violet-600 h-2 rounded-full"
                  style={{ width: `${analysisResult.contentConsistency.duplicateContent.score}%` }}
                />
              </div>
            </div>

            {analysisResult.contentConsistency.duplicateContent.duplicates.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">发现的重复内容</h4>
                {analysisResult.contentConsistency.duplicateContent.duplicates.map((duplicate, index) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-red-800">相似度: {duplicate.similarity}%</span>
                    </div>
                    <p className="text-sm text-red-700 mb-1">
                      位置: {duplicate.locations.join(' ↔ ')}
                    </p>
                    <p className="text-xs text-red-600">{duplicate.suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        {/* 头部 */}
        <div className="mb-6 bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">论文一致性分析</h1>
              <p className="text-gray-600">
                分析论文《{paper.title}》的逻辑一致性、引用完整性和结构合理性
              </p>
            </div>
            <button
              onClick={onAnalyze}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              )}
              <span>{isLoading ? '分析中...' : '开始分析'}</span>
            </button>
          </div>
        </div>

        {/* 标签导航 */}
        <div className="mb-6">
          <nav className="flex space-x-8 border-b border-gray-200">
            {[
              { key: 'overview', label: '总览' },
              { key: 'logical', label: '逻辑一致性' },
              { key: 'reference', label: '引用完整性' },
              { key: 'structural', label: '结构连贯性' },
              { key: 'content', label: '内容一致性' }
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
          {selectedTab === 'logical' && renderLogicalTab()}
          {selectedTab === 'reference' && renderReferenceTab()}
          {selectedTab === 'structural' && renderStructuralTab()}
          {selectedTab === 'content' && renderContentTab()}
        </div>
      </div>
    </div>
  );
};

// 评分卡片组件
interface ScoreCardProps {
  title: string;
  score: number;
  description: string;
  onClick?: () => void;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, description, onClick }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div 
      className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getScoreColor(score)}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-2xl font-bold">{score}</span>
      </div>
      <p className="text-sm opacity-80">{description}</p>
    </div>
  );
};

// 问题卡片组件
interface IssueCardProps {
  issue: LogicalIssue;
  isExpanded: boolean;
  onToggle: () => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, isExpanded, onToggle }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-300 bg-red-50';
      case 'major': return 'border-orange-300 bg-orange-50';
      case 'minor': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      major: 'bg-orange-100 text-orange-800',
      minor: 'bg-yellow-100 text-yellow-800'
    };
    const labels = {
      critical: '严重',
      major: '重要',
      minor: '轻微'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[severity as keyof typeof colors]}`}>
        {labels[severity as keyof typeof labels]}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      contradiction: '逻辑矛盾',
      gap: '逻辑缺口',
      repetition: '重复内容',
      inconsistency: '不一致'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className={`border rounded-lg p-4 ${getSeverityColor(issue.severity)}`}>
      <div className="flex items-start justify-between cursor-pointer" onClick={onToggle}>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="font-medium text-gray-900">{getTypeLabel(issue.type)}</span>
            {getSeverityBadge(issue.severity)}
          </div>
          <p className="text-sm text-gray-700">{issue.description}</p>
          {issue.sections.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              涉及章节: {issue.sections.join(', ')}
            </p>
          )}
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
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            <strong>建议解决方案:</strong>
            <p className="mt-1">{issue.suggestion}</p>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>置信度: {Math.round(issue.confidence * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

// 建议卡片组件
interface RecommendationCardProps {
  recommendation: ConsistencyRecommendation;
  onApply?: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, onApply }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    const labels = {
      high: '高',
      medium: '中',
      low: '低'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        优先级: {labels[priority as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className={`border rounded-lg p-4 ${getPriorityColor(recommendation.priority)}`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
        {getPriorityBadge(recommendation.priority)}
      </div>
      <p className="text-sm text-gray-700 mb-3">{recommendation.description}</p>
      
      {recommendation.actions.length > 0 && (
        <div className="space-y-1 mb-3">
          <span className="text-xs font-medium text-gray-600">具体行动:</span>
          {recommendation.actions.map((action, index) => (
            <div key={index} className="text-xs text-gray-600 ml-2">
              • {action.description}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          预期影响: +{recommendation.expectedImpact}分
        </span>
        <button
          onClick={onApply}
          className="text-xs bg-white px-3 py-1 rounded border hover:bg-gray-50 transition-colors"
        >
          应用建议
        </button>
      </div>
    </div>
  );
};

export default ConsistencyAnalysisPanel;