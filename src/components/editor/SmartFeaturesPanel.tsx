import React, { useState, useCallback } from 'react';
import {
  Wand2,
  FileText,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Target,
  BarChart3,
  Network,
  Lightbulb,
  Zap,
  ArrowRight,
  Plus,
  Minus,
  ChevronDown,
  ChevronRight,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react';
import { PaperModule } from '@/types/modular';
import { 
  useSmartFeatures, 
  SmartOutlineNode, 
  ParagraphSuggestion, 
  ContinuationOptions,
  CoherenceCheck
} from '@/hooks/useSmartFeatures';

interface SmartFeaturesPanelProps {
  modules: PaperModule[];
  selectedModule: PaperModule | null;
  onModuleUpdate: (moduleId: string, updates: Partial<PaperModule>) => void;
  isCompact?: boolean;
}

const SmartFeaturesPanel: React.FC<SmartFeaturesPanelProps> = ({
  modules,
  selectedModule,
  onModuleUpdate,
  isCompact = false
}) => {
  const [activeTab, setActiveTab] = useState<'outline' | 'continuation' | 'paragraphs' | 'coherence'>('outline');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [continuationOptions, setContinuationOptions] = useState<Partial<ContinuationOptions>>({
    style: 'academic',
    length: 'medium',
    focus: 'expansion',
    tone: 'formal'
  });

  const {
    isProcessing,
    currentOutline,
    lastCoherenceCheck,
    generateSmartContinuation,
    generateParagraphs,
    expandOutline,
    checkModuleCoherence,
    suggestStructureImprovements,
    setCurrentOutline,
    clearCoherenceCheck
  } = useSmartFeatures();

  // 处理大纲扩展
  const handleExpandOutline = useCallback(async () => {
    if (!selectedModule) return;

    const baseOutline: SmartOutlineNode[] = [
      {
        id: selectedModule.id,
        title: selectedModule.title,
        level: 1,
        content: selectedModule.content,
        children: [],
        status: selectedModule.content ? 'partial' : 'pending',
        wordTarget: 500
      }
    ];

    try {
      await expandOutline(baseOutline, 3, selectedModule.type);
    } catch (error) {
      console.error('大纲扩展失败:', error);
    }
  }, [selectedModule, expandOutline]);

  // 处理智能续写
  const handleSmartContinuation = useCallback(async () => {
    if (!selectedModule) return;

    try {
      const continuation = await generateSmartContinuation(
        selectedModule.content,
        continuationOptions
      );

      onModuleUpdate(selectedModule.id, {
        content: selectedModule.content + '\n\n' + continuation,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('智能续写失败:', error);
    }
  }, [selectedModule, continuationOptions, generateSmartContinuation, onModuleUpdate]);

  // 处理段落生成
  const handleGenerateParagraphs = useCallback(async () => {
    if (!selectedModule) return;

    const outline = selectedModule.content
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.replace(/^[-*]\s*/, '').trim());

    if (outline.length === 0) {
      outline.push('主要观点一', '主要观点二', '主要观点三');
    }

    try {
      const suggestions = await generateParagraphs(outline, selectedModule.content);
      // 这里可以显示建议让用户选择
      console.log('段落建议:', suggestions);
    } catch (error) {
      console.error('段落生成失败:', error);
    }
  }, [selectedModule, generateParagraphs]);

  // 处理连贯性检查
  const handleCoherenceCheck = useCallback(async () => {
    try {
      await checkModuleCoherence(modules);
    } catch (error) {
      console.error('连贯性检查失败:', error);
    }
  }, [modules, checkModuleCoherence]);

  // 切换大纲节点展开状态
  const toggleNodeExpanded = useCallback((nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  }, [expandedNodes]);

  // 渲染大纲节点
  const renderOutlineNode = useCallback((node: SmartOutlineNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="mb-2">
        <div
          className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer ${
            depth > 0 ? 'ml-' + (depth * 4) : ''
          }`}
          onClick={() => hasChildren && toggleNodeExpanded(node.id)}
        >
          {hasChildren && (
            <button className="text-gray-400 hover:text-gray-600">
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
          )}
          
          <div className={`w-2 h-2 rounded-full ${
            node.status === 'completed' ? 'bg-green-500' :
            node.status === 'partial' ? 'bg-yellow-500' : 'bg-gray-300'
          }`} />
          
          <span className={`text-sm ${depth === 0 ? 'font-medium' : ''}`}>
            {node.title}
          </span>
          
          {node.wordTarget && (
            <span className="text-xs text-gray-500 ml-auto">
              目标: {node.wordTarget}字
            </span>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div className="ml-4">
            {node.children.map(child => renderOutlineNode(child, depth + 1))}
          </div>
        )}

        {node.suggestedContent && (
          <div className="ml-6 mt-1 p-2 bg-blue-50 rounded text-xs text-blue-700">
            建议: {node.suggestedContent}
          </div>
        )}
      </div>
    );
  }, [expandedNodes, toggleNodeExpanded]);

  // 获取连贯性分数颜色
  const getCoherenceScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 标题栏 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Wand2 className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">智能功能</h3>
          {isProcessing && (
            <RefreshCw className="h-4 w-4 text-purple-500 animate-spin" />
          )}
        </div>
      </div>

      {/* 标签导航 */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'outline', label: '大纲', icon: FileText },
          { key: 'continuation', label: '续写', icon: Zap },
          { key: 'paragraphs', label: '段落', icon: Target },
          { key: 'coherence', label: '连贯性', icon: Network }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex-1 flex items-center justify-center space-x-1 px-2 py-3 text-xs font-medium ${
              activeTab === key
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="h-3 w-3" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* 大纲扩展 */}
        {activeTab === 'outline' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">智能大纲</h4>
              <button
                onClick={handleExpandOutline}
                disabled={isProcessing || !selectedModule}
                className="text-xs bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-3 py-1 rounded"
              >
                生成大纲
              </button>
            </div>

            {currentOutline.length > 0 ? (
              <div className="space-y-1">
                {currentOutline.map(node => renderOutlineNode(node))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">选择模块并生成智能大纲</p>
              </div>
            )}
          </div>
        )}

        {/* 智能续写 */}
        {activeTab === 'continuation' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">智能续写</h4>
              <button
                onClick={handleSmartContinuation}
                disabled={isProcessing || !selectedModule?.content}
                className="text-xs bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded"
              >
                生成续写
              </button>
            </div>

            {/* 续写选项 */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">写作风格</label>
                <select
                  value={continuationOptions.style}
                  onChange={(e) => setContinuationOptions(prev => ({ ...prev, style: e.target.value as any }))}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="academic">学术风格</option>
                  <option value="technical">技术风格</option>
                  <option value="casual">通俗风格</option>
                  <option value="creative">创意风格</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">内容长度</label>
                <select
                  value={continuationOptions.length}
                  onChange={(e) => setContinuationOptions(prev => ({ ...prev, length: e.target.value as any }))}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="short">简短</option>
                  <option value="medium">中等</option>
                  <option value="long">详细</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">续写重点</label>
                <select
                  value={continuationOptions.focus}
                  onChange={(e) => setContinuationOptions(prev => ({ ...prev, focus: e.target.value as any }))}
                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="expansion">内容扩展</option>
                  <option value="evidence">证据支撑</option>
                  <option value="analysis">深入分析</option>
                  <option value="summary">总结归纳</option>
                </select>
              </div>
            </div>

            {!selectedModule?.content && (
              <div className="text-center py-8 text-gray-500">
                <Zap className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">选择包含内容的模块开始续写</p>
              </div>
            )}
          </div>
        )}

        {/* 段落生成 */}
        {activeTab === 'paragraphs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">段落生成</h4>
              <button
                onClick={handleGenerateParagraphs}
                disabled={isProcessing || !selectedModule}
                className="text-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-1 rounded"
              >
                生成段落
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">段落生成说明</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 基于模块大纲自动生成段落</li>
                  <li>• 确保段落间逻辑连贯</li>
                  <li>• 支持不同类型段落生成</li>
                </ul>
              </div>

              {!selectedModule && (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">选择模块开始段落生成</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 连贯性检查 */}
        {activeTab === 'coherence' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">连贯性检查</h4>
              <button
                onClick={handleCoherenceCheck}
                disabled={isProcessing || modules.length === 0}
                className="text-xs bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-3 py-1 rounded"
              >
                检查连贯性
              </button>
            </div>

            {lastCoherenceCheck ? (
              <div className="space-y-3">
                {/* 连贯性分数 */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">连贯性分数</h5>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCoherenceScoreColor(lastCoherenceCheck.score)}`}>
                      {lastCoherenceCheck.score}/100
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        lastCoherenceCheck.score >= 80 ? 'bg-green-500' :
                        lastCoherenceCheck.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${lastCoherenceCheck.score}%` }}
                    />
                  </div>
                </div>

                {/* 问题列表 */}
                {lastCoherenceCheck.issues.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900">发现的问题</h5>
                    {lastCoherenceCheck.issues.map((issue, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertTriangle className={`h-4 w-4 ${
                            issue.severity === 'high' ? 'text-red-500' :
                            issue.severity === 'medium' ? 'text-yellow-500' : 'text-gray-500'
                          }`} />
                          <span className={`text-sm font-medium ${
                            issue.severity === 'high' ? 'text-red-700' :
                            issue.severity === 'medium' ? 'text-yellow-700' : 'text-gray-700'
                          }`}>
                            {issue.type === 'logical_gap' ? '逻辑缺口' :
                             issue.type === 'weak_transition' ? '过渡薄弱' :
                             issue.type === 'repetition' ? '内容重复' : '不一致'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                        <p className="text-xs text-blue-600">{issue.suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 改进建议 */}
                {lastCoherenceCheck.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900">改进建议</h5>
                    <ul className="space-y-1">
                      {lastCoherenceCheck.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Network className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">点击检查按钮分析模块间连贯性</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartFeaturesPanel;