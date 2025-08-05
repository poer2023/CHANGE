import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SmartModule, ModuleRelationship, DependencyType, RelationStrength } from '../../types/intelligent-modules';

interface DependencyVisualizerProps {
  modules: SmartModule[];
  relationships: ModuleRelationship[];
  selectedModuleId?: string;
  onModuleSelect: (moduleId: string) => void;
  onRelationshipEdit?: (relationship: ModuleRelationship) => void;
  className?: string;
}

interface NodePosition {
  x: number;
  y: number;
  id: string;
}

interface Edge {
  source: NodePosition;
  target: NodePosition;
  type: DependencyType;
  strength: RelationStrength;
  description: string;
}

/**
 * 智能依赖关系可视化组件
 * 提供交互式的模块依赖关系图
 */
export const DependencyVisualizer: React.FC<DependencyVisualizerProps> = ({
  modules,
  relationships,
  selectedModuleId,
  onModuleSelect,
  onRelationshipEdit,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // 计算节点位置（使用力导向布局算法）
  const nodePositions = useMemo(() => {
    const positions: NodePosition[] = [];
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) * 0.3;

    // 简化的圆形布局算法
    modules.forEach((module, index) => {
      const angle = (index / modules.length) * 2 * Math.PI;
      positions.push({
        id: module.id,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    });

    return positions;
  }, [modules, dimensions]);

  // 计算边（连接线）
  const edges = useMemo(() => {
    const result: Edge[] = [];
    
    relationships.forEach(relationship => {
      const source = nodePositions.find(pos => pos.id === relationship.sourceId);
      const target = nodePositions.find(pos => pos.id === relationship.targetId);
      
      if (source && target) {
        result.push({
          source,
          target,
          type: relationship.type,
          strength: relationship.strength,
          description: relationship.description
        });
      }
    });

    return result;
  }, [nodePositions, relationships]);

  // 获取依赖类型的颜色
  const getDependencyColor = (type: DependencyType): string => {
    switch (type) {
      case 'structural': return '#3B82F6'; // blue
      case 'content': return '#10B981'; // green
      case 'reference': return '#F59E0B'; // amber
      case 'style': return '#8B5CF6'; // purple
      default: return '#6B7280'; // gray
    }
  };

  // 获取关系强度的样式
  const getStrengthStyle = (strength: RelationStrength) => {
    switch (strength) {
      case 'strong': return { strokeWidth: 3, strokeDasharray: 'none' };
      case 'medium': return { strokeWidth: 2, strokeDasharray: 'none' };
      case 'weak': return { strokeWidth: 1, strokeDasharray: '5,5' };
      default: return { strokeWidth: 1, strokeDasharray: 'none' };
    }
  };

  // 获取模块状态颜色
  const getModuleStatusColor = (module: SmartModule): string => {
    switch (module.status) {
      case 'completed': return '#10B981'; // green
      case 'review': return '#F59E0B'; // amber
      case 'draft': return '#3B82F6'; // blue
      case 'empty': return '#6B7280'; // gray
      default: return '#6B7280';
    }
  };

  // 处理鼠标拖拽
  const handleMouseDown = (event: React.MouseEvent, nodeId: string) => {
    event.preventDefault();
    setIsDragging(nodeId);
    
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const node = nodePositions.find(pos => pos.id === nodeId);
      if (node) {
        setDragOffset({
          x: event.clientX - rect.left - node.x,
          y: event.clientY - rect.top - node.y
        });
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const newX = event.clientX - rect.left - dragOffset.x;
      const newY = event.clientY - rect.top - dragOffset.y;
      
      // 在实际应用中，这里会更新节点位置的状态
      // 为了简化，这里只是演示拖拽逻辑
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // 计算箭头标记
  const getArrowMarkerId = (type: DependencyType, strength: RelationStrength): string => {
    return `arrow-${type}-${strength}`;
  };

  // 响应式处理
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.parentElement?.getBoundingClientRect();
        if (rect) {
          setDimensions({
            width: rect.width,
            height: rect.height
          });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`dependency-visualizer relative ${className}`}>
      {/* 工具栏 */}
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-3">
        <h3 className="text-sm font-medium text-gray-900 mb-2">依赖关系图</h3>
        <div className="space-y-2">
          {/* 图例 */}
          <div className="text-xs">
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-3 h-0.5 bg-blue-500"></div>
              <span className="text-gray-600">结构依赖</span>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span className="text-gray-600">内容依赖</span>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-3 h-0.5 bg-amber-500"></div>
              <span className="text-gray-600">引用依赖</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-0.5 bg-purple-500"></div>
              <span className="text-gray-600">风格依赖</span>
            </div>
          </div>
        </div>
      </div>

      {/* 信息面板 */}
      {hoveredNode && (
        <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          {(() => {
            const module = modules.find(m => m.id === hoveredNode);
            if (!module) return null;
            
            return (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">{module.title}</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>状态: {module.status}</div>
                  <div>字数: {module.progress.wordCount}</div>
                  <div>完成度: {Math.round(module.quality.completeness * 100)}%</div>
                  <div>依赖数: {module.dependencies.length}</div>
                  <div>被依赖数: {module.dependents.length}</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* SVG 可视化区域 */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="border border-gray-200 rounded-lg bg-gray-50"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 定义箭头标记 */}
        <defs>
          {['structural', 'content', 'reference', 'style'].map(type => 
            ['strong', 'medium', 'weak'].map(strength => (
              <marker
                key={`${type}-${strength}`}
                id={getArrowMarkerId(type as DependencyType, strength as RelationStrength)}
                viewBox="0 0 10 10"
                refX="9"
                refY="3"
                markerWidth="6"
                markerHeight="6"
                orient="auto"
              >
                <path
                  d="M0,0 L0,6 L9,3 z"
                  fill={getDependencyColor(type as DependencyType)}
                />
              </marker>
            ))
          )}
        </defs>

        {/* 绘制连接线 */}
        {edges.map((edge, index) => {
          const markerId = getArrowMarkerId(edge.type, edge.strength);
          const style = getStrengthStyle(edge.strength);
          const color = getDependencyColor(edge.type);
          
          return (
            <line
              key={`edge-${index}`}
              x1={edge.source.x}
              y1={edge.source.y}
              x2={edge.target.x}
              y2={edge.target.y}
              stroke={color}
              strokeWidth={style.strokeWidth}
              strokeDasharray={style.strokeDasharray}
              markerEnd={`url(#${markerId})`}
              className="transition-opacity hover:opacity-80 cursor-pointer"
              onMouseEnter={() => setHoveredEdge(`edge-${index}`)}
              onMouseLeave={() => setHoveredEdge(null)}
              onClick={() => onRelationshipEdit?.(relationships[index])}
            />
          );
        })}

        {/* 绘制节点 */}
        {nodePositions.map(position => {
          const module = modules.find(m => m.id === position.id);
          if (!module) return null;

          const isSelected = selectedModuleId === module.id;
          const isHovered = hoveredNode === module.id;
          const statusColor = getModuleStatusColor(module);
          
          return (
            <g key={module.id}>
              {/* 节点圆圈 */}
              <circle
                cx={position.x}
                cy={position.y}
                r={isSelected ? 25 : isHovered ? 22 : 20}
                fill={statusColor}
                stroke={isSelected ? '#1D4ED8' : '#FFFFFF'}
                strokeWidth={isSelected ? 3 : 2}
                className="transition-all cursor-pointer hover:brightness-110"
                onMouseDown={(e) => handleMouseDown(e, module.id)}
                onMouseEnter={() => setHoveredNode(module.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => onModuleSelect(module.id)}
              />
              
              {/* 进度环 */}
              <circle
                cx={position.x}
                cy={position.y}
                r={isSelected ? 28 : isHovered ? 25 : 23}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="2"
              />
              <circle
                cx={position.x}
                cy={position.y}
                r={isSelected ? 28 : isHovered ? 25 : 23}
                fill="none"
                stroke={statusColor}
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * (isSelected ? 28 : isHovered ? 25 : 23)}`}
                strokeDashoffset={`${2 * Math.PI * (isSelected ? 28 : isHovered ? 25 : 23) * (1 - module.quality.completeness)}`}
                transform={`rotate(-90 ${position.x} ${position.y})`}
                className="transition-all"
              />
              
              {/* 节点标签 */}
              <text
                x={position.x}
                y={position.y + 35}
                textAnchor="middle"
                className="text-xs font-medium fill-gray-700"
                style={{ fontSize: '12px' }}
              >
                {module.title.slice(0, 10)}
                {module.title.length > 10 && '...'}
              </text>
              
              {/* AI建议指示器 */}
              {module.suggestions.length > 0 && (
                <circle
                  cx={position.x + 15}
                  cy={position.y - 15}
                  r="4"
                  fill="#F59E0B"
                  className="animate-pulse"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* 底部工具栏 */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-2">
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
            onClick={() => {
              // 自动布局
              console.log('Auto layout triggered');
            }}
          >
            自动布局
          </button>
          <button
            className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
            onClick={() => {
              // 检查依赖
              console.log('Dependency check triggered');
            }}
          >
            检查依赖
          </button>
          <button
            className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded hover:bg-purple-200 transition-colors"
            onClick={() => {
              // 智能建议
              console.log('Smart suggestions triggered');
            }}
          >
            智能建议
          </button>
        </div>
      </div>
    </div>
  );
};