import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Lightbulb,
  Link,
  Unlink,
  Eye,
  EyeOff,
  RotateCcw,
  Zap,
  Target,
  GitBranch,
  Network,
  Filter,
  Search
} from 'lucide-react';
import { PaperModule, ModuleDependency, ModuleAISuggestion } from '@/types/modular';

interface DependencyVisualizationProps {
  modules: PaperModule[];
  selectedModuleId: string | null;
  onModuleSelect: (moduleId: string) => void;
  onModuleUpdate: (moduleId: string, updates: Partial<PaperModule>) => void;
  dependencies?: ModuleDependency[];
  suggestions?: ModuleAISuggestion[];
}

interface DependencyNode {
  id: string;
  module: PaperModule;
  x: number;
  y: number;
  dependencies: string[];
  dependents: string[];
}

interface DependencyEdge {
  from: string;
  to: string;
  type: 'content' | 'reference' | 'order';
  strength: number;
}

const DependencyVisualization: React.FC<DependencyVisualizationProps> = ({
  modules,
  selectedModuleId,
  onModuleSelect,
  onModuleUpdate,
  dependencies = [],
  suggestions = []
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewMode, setViewMode] = useState<'network' | 'hierarchy' | 'flow'>('network');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'content' | 'reference' | 'order'>('all');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 计算依赖关系网络
  const calculateDependencyNetwork = useCallback(() => {
    const nodes: DependencyNode[] = modules.map((module, index) => ({
      id: module.id,
      module,
      x: 0,
      y: 0,
      dependencies: module.dependencies,
      dependents: modules.filter(m => m.dependencies.includes(module.id)).map(m => m.id)
    }));

    const edges: DependencyEdge[] = [];
    
    // 从模块依赖创建边
    modules.forEach(module => {
      module.dependencies.forEach(depId => {
        edges.push({
          from: depId,
          to: module.id,
          type: 'order',
          strength: 1
        });
      });
    });

    // 从显式依赖关系创建边
    dependencies.forEach(dep => {
      edges.push({
        from: dep.sourceId,
        to: dep.targetId,
        type: dep.type,
        strength: dep.type === 'content' ? 3 : dep.type === 'reference' ? 2 : 1
      });
    });

    return { nodes, edges };
  }, [modules, dependencies]);

  // 布局算法
  const layoutNodes = useCallback((nodes: DependencyNode[], edges: DependencyEdge[]) => {
    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;

    switch (viewMode) {
      case 'hierarchy':
        // 分层布局
        const levels: string[][] = [];
        const visited = new Set<string>();
        const inDegree = new Map<string, number>();
        
        // 计算入度
        nodes.forEach(node => inDegree.set(node.id, 0));
        edges.forEach(edge => {
          inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
        });
        
        // 拓扑排序分层
        const queue = nodes.filter(node => inDegree.get(node.id) === 0);
        let level = 0;
        
        while (queue.length > 0) {
          const levelNodes = [...queue];
          levels.push(levelNodes.map(n => n.id));
          queue.length = 0;
          
          levelNodes.forEach(node => {
            visited.add(node.id);
            edges.forEach(edge => {
              if (edge.from === node.id && !visited.has(edge.to)) {
                const newInDegree = (inDegree.get(edge.to) || 0) - 1;
                inDegree.set(edge.to, newInDegree);
                if (newInDegree === 0) {
                  const targetNode = nodes.find(n => n.id === edge.to);
                  if (targetNode) queue.push(targetNode);
                }
              }
            });
          });
          level++;
        }
        
        // 设置位置
        levels.forEach((levelNodes, levelIndex) => {
          const y = (height / (levels.length + 1)) * (levelIndex + 1);
          levelNodes.forEach((nodeId, nodeIndex) => {
            const node = nodes.find(n => n.id === nodeId);
            if (node) {
              node.x = (width / (levelNodes.length + 1)) * (nodeIndex + 1);
              node.y = y;
            }
          });
        });
        break;

      case 'flow':
        // 流程布局 - 按order排序
        const sortedModules = [...nodes].sort((a, b) => a.module.order - b.module.order);
        sortedModules.forEach((node, index) => {
          node.x = (width / (sortedModules.length + 1)) * (index + 1);
          node.y = centerY;
        });
        break;

      case 'network':
      default:
        // 力导向布局（简化版）
        const iterations = 50;
        const k = Math.sqrt((width * height) / nodes.length);
        
        // 初始随机位置
        nodes.forEach(node => {
          node.x = Math.random() * width;
          node.y = Math.random() * height;
        });
        
        for (let i = 0; i < iterations; i++) {
          // 斥力
          nodes.forEach(node1 => {
            let fx = 0, fy = 0;
            nodes.forEach(node2 => {
              if (node1.id !== node2.id) {
                const dx = node1.x - node2.x;
                const dy = node1.y - node2.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                const force = (k * k) / distance;
                fx += (dx / distance) * force;
                fy += (dy / distance) * force;
              }
            });
            node1.x = Math.max(50, Math.min(width - 50, node1.x + fx * 0.01));
            node1.y = Math.max(50, Math.min(height - 50, node1.y + fy * 0.01));
          });
          
          // 引力
          edges.forEach(edge => {
            const source = nodes.find(n => n.id === edge.from);
            const target = nodes.find(n => n.id === edge.to);
            if (source && target) {
              const dx = target.x - source.x;
              const dy = target.y - source.y;
              const distance = Math.sqrt(dx * dx + dy * dy) || 1;
              const force = (distance * distance) / k * edge.strength;
              const fx = (dx / distance) * force * 0.01;
              const fy = (dy / distance) * force * 0.01;
              source.x += fx;
              source.y += fy;
              target.x -= fx;
              target.y -= fy;
            }
          });
        }
        break;
    }

    return nodes;
  }, [viewMode]);

  // 生成智能建议
  const generateSmartSuggestions = useCallback((nodes: DependencyNode[], edges: DependencyEdge[]) => {
    const newSuggestions: ModuleAISuggestion[] = [];

    // 检查缺失的依赖关系
    nodes.forEach(node => {
      const module = node.module;
      
      // 建议添加引言依赖
      if (module.type !== 'abstract' && module.type !== 'introduction' && 
          !module.dependencies.includes('introduction')) {
        newSuggestions.push({
          id: `dep-intro-${module.id}`,
          moduleId: module.id,
          type: 'structure',
          title: '建议添加引言依赖',
          description: '大多数学术论文模块都应该依赖引言部分',
          suggestion: '添加引言模块作为依赖项',
          confidence: 0.8,
          isApplied: false,
          createdAt: new Date()
        });
      }

      // 建议方法论依赖
      if ((module.type === 'results' || module.type === 'discussion') && 
          !module.dependencies.includes('methodology')) {
        newSuggestions.push({
          id: `dep-method-${module.id}`,
          moduleId: module.id,
          type: 'structure',
          title: '建议添加方法论依赖',
          description: '结果和讨论部分通常需要引用研究方法',
          suggestion: '添加研究方法模块作为依赖项',
          confidence: 0.9,
          isApplied: false,
          createdAt: new Date()
        });
      }

      // 检查循环依赖
      const hasCyclicDependency = (startId: string, currentId: string, visited: Set<string>): boolean => {
        if (visited.has(currentId)) return currentId === startId;
        visited.add(currentId);
        
        const currentNode = nodes.find(n => n.id === currentId);
        if (!currentNode) return false;
        
        return currentNode.dependencies.some(depId => 
          hasCyclicDependency(startId, depId, new Set(visited))
        );
      };

      if (hasCyclicDependency(module.id, module.id, new Set())) {
        newSuggestions.push({
          id: `cycle-${module.id}`,
          moduleId: module.id,
          type: 'consistency',
          title: '检测到循环依赖',
          description: '模块间存在循环依赖关系，可能导致逻辑问题',
          suggestion: '检查并移除循环依赖',
          confidence: 1.0,
          isApplied: false,
          createdAt: new Date()
        });
      }

      // 内容一致性建议
      if (module.wordCount > 0 && module.progress < 30) {
        newSuggestions.push({
          id: `content-${module.id}`,
          moduleId: module.id,
          type: 'content',
          title: '内容进度建议',
          description: '模块有内容但进度较低，建议更新进度状态',
          suggestion: '检查内容完整度并更新进度',
          confidence: 0.7,
          isApplied: false,
          createdAt: new Date()
        });
      }
    });

    return newSuggestions;
  }, []);

  const { nodes, edges } = calculateDependencyNetwork();
  const layoutedNodes = layoutNodes(nodes, edges);
  const smartSuggestions = generateSmartSuggestions(nodes, edges);

  // 过滤边
  const filteredEdges = edges.filter(edge => 
    filterType === 'all' || edge.type === filterType
  );

  // 过滤节点（基于搜索）
  const filteredNodes = layoutedNodes.filter(node =>
    searchQuery === '' || 
    node.module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.module.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNodeClick = (nodeId: string) => {
    onModuleSelect(nodeId);
    if (selectedNodes.includes(nodeId)) {
      setSelectedNodes(selectedNodes.filter(id => id !== nodeId));
    } else {
      setSelectedNodes([...selectedNodes, nodeId]);
    }
  };

  const handleApplySuggestion = (suggestion: ModuleAISuggestion) => {
    // 应用建议的逻辑
    if (suggestion.type === 'structure' && suggestion.title.includes('引言依赖')) {
      const module = modules.find(m => m.id === suggestion.moduleId);
      if (module && !module.dependencies.includes('introduction')) {
        onModuleUpdate(suggestion.moduleId, {
          dependencies: [...module.dependencies, 'introduction']
        });
      }
    } else if (suggestion.type === 'structure' && suggestion.title.includes('方法论依赖')) {
      const module = modules.find(m => m.id === suggestion.moduleId);
      if (module && !module.dependencies.includes('methodology')) {
        onModuleUpdate(suggestion.moduleId, {
          dependencies: [...module.dependencies, 'methodology']
        });
      }
    }
  };

  const getNodeColor = (node: DependencyNode) => {
    if (node.id === selectedModuleId) return '#3b82f6'; // blue-500
    if (selectedNodes.includes(node.id)) return '#8b5cf6'; // violet-500
    if (hoveredNode === node.id) return '#06b6d4'; // cyan-500
    if (node.module.isCompleted) return '#10b981'; // emerald-500
    if (node.module.progress > 50) return '#f59e0b'; // amber-500
    return '#6b7280'; // gray-500
  };

  const getEdgeColor = (edge: DependencyEdge) => {
    const colors = {
      content: '#ef4444', // red-500
      reference: '#8b5cf6', // violet-500
      order: '#6b7280' // gray-500
    };
    return colors[edge.type];
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 工具栏 */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">依赖关系视图</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className={`p-2 rounded-lg transition-colors ${
                showSuggestions ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
              }`}
              title="智能建议"
            >
              <Lightbulb className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* 视图模式切换 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 font-medium">视图:</span>
            <div className="flex rounded-lg border border-gray-300">
              {[
                { key: 'network', label: '网络', icon: Network },
                { key: 'hierarchy', label: '层次', icon: GitBranch },
                { key: 'flow', label: '流程', icon: ArrowRight }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key as any)}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    viewMode === key
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 inline mr-1" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 过滤器 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 font-medium">类型:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">全部</option>
              <option value="content">内容依赖</option>
              <option value="reference">引用依赖</option>
              <option value="order">顺序依赖</option>
            </select>
          </div>

          {/* 搜索 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索模块..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* 主视图区域 */}
        <div className="flex-1 relative">
          <svg
            ref={svgRef}
            className="w-full h-full"
            viewBox="0 0 800 600"
          >
            {/* 定义箭头标记 */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#6b7280"
                />
              </marker>
            </defs>

            {/* 绘制边 */}
            {filteredEdges.map((edge, index) => {
              const sourceNode = filteredNodes.find(n => n.id === edge.from);
              const targetNode = filteredNodes.find(n => n.id === edge.to);
              if (!sourceNode || !targetNode) return null;

              return (
                <line
                  key={`edge-${index}`}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={getEdgeColor(edge)}
                  strokeWidth={edge.strength}
                  strokeOpacity={0.6}
                  markerEnd="url(#arrowhead)"
                />
              );
            })}

            {/* 绘制节点 */}
            {filteredNodes.map((node) => {
              const radius = 20 + (node.module.progress / 100) * 10;
              return (
                <g key={node.id}>
                  {/* 节点圆圈 */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={getNodeColor(node)}
                    stroke="#fff"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    onClick={() => handleNodeClick(node.id)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  />
                  
                  {/* 进度环 */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + 3}
                    fill="none"
                    stroke={getNodeColor(node)}
                    strokeWidth="2"
                    strokeOpacity={0.3}
                    strokeDasharray={`${(node.module.progress / 100) * (2 * Math.PI * (radius + 3))} ${2 * Math.PI * (radius + 3)}`}
                  />

                  {/* 节点标签 */}
                  <text
                    x={node.x}
                    y={node.y + radius + 15}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700"
                  >
                    {node.module.title.length > 8 
                      ? node.module.title.substring(0, 8) + '...' 
                      : node.module.title}
                  </text>

                  {/* 依赖数量标识 */}
                  {node.dependencies.length > 0 && (
                    <circle
                      cx={node.x + radius - 5}
                      cy={node.y - radius + 5}
                      r="8"
                      fill="#f59e0b"
                      className="text-white text-xs"
                    />
                  )}
                  {node.dependencies.length > 0 && (
                    <text
                      x={node.x + radius - 5}
                      y={node.y - radius + 9}
                      textAnchor="middle"
                      className="text-xs font-bold fill-white"
                    >
                      {node.dependencies.length}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* 悬浮信息卡片 */}
          {hoveredNode && (
            <div className="absolute top-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
              {(() => {
                const node = filteredNodes.find(n => n.id === hoveredNode);
                if (!node) return null;
                return (
                  <div className="space-y-2">
                    <div className="font-semibold text-gray-900">{node.module.title}</div>
                    <div className="text-sm text-gray-600">类型: {node.module.type}</div>
                    <div className="text-sm text-gray-600">进度: {node.module.progress}%</div>
                    <div className="text-sm text-gray-600">字数: {node.module.wordCount}</div>
                    <div className="text-sm text-gray-600">
                      依赖: {node.dependencies.length} | 被依赖: {node.dependents.length}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* 智能建议面板 */}
        {showSuggestions && (
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">智能建议</h4>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <EyeOff className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              {smartSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${
                        suggestion.type === 'structure' ? 'bg-blue-100 text-blue-600' :
                        suggestion.type === 'content' ? 'bg-green-100 text-green-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {suggestion.type === 'structure' ? <GitBranch className="h-3 w-3" /> :
                         suggestion.type === 'content' ? <Target className="h-3 w-3" /> :
                         <AlertTriangle className="h-3 w-3" />}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {suggestion.title}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Zap className="h-3 w-3" />
                      <span>{Math.round(suggestion.confidence * 100)}%</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {modules.find(m => m.id === suggestion.moduleId)?.title}
                    </span>
                    <button
                      onClick={() => handleApplySuggestion(suggestion)}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      应用建议
                    </button>
                  </div>
                </div>
              ))}

              {smartSuggestions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">当前没有建议</p>
                  <p className="text-xs">依赖关系结构良好！</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>模块: {filteredNodes.length}</span>
            <span>连接: {filteredEdges.length}</span>
            <span>建议: {smartSuggestions.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>已完成</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span>进行中</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>未开始</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DependencyVisualization;