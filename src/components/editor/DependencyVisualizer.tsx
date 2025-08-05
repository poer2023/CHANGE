import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  GitBranch, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  RefreshCw,
  Filter,
  Maximize2,
  Minimize2,
  Settings,
  Info,
  Search
} from 'lucide-react';

import { useSmartModule } from '../../contexts/SmartModuleContext';
import { SmartModule, DependencyRelation } from '../../types/modular';
import { Button } from '../UI/Button';
import { Card } from '../UI/Card';
import { Input } from '../UI/Input';
import { LoadingSpinner } from '../UI/LoadingSpinner';

interface DependencyVisualizerProps {
  modules: SmartModule[];
  selectedModule?: SmartModule | null;
  onModuleSelect?: (module: SmartModule | null) => void;
  className?: string;
  compact?: boolean;
  showControls?: boolean;
}

interface NodePosition {
  x: number;
  y: number;
}

interface VisualizationNode {
  id: string;
  module: SmartModule;
  position: NodePosition;
  connections: string[];
  level: number;
  dependencyCount: number;
  dependentCount: number;
}

const DependencyVisualizer: React.FC<DependencyVisualizerProps> = ({
  modules,
  selectedModule,
  onModuleSelect,
  className = '',
  compact = false,
  showControls = true
}) => {
  const { dependencies } = useSmartModule();
  
  // Local state
  const [visualizationMode, setVisualizationMode] = useState<'tree' | 'network' | 'timeline'>('network');
  const [showDependencyTypes, setShowDependencyTypes] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'active' | 'suggested' | 'broken'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  
  // Refs
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter dependencies based on current filter
  const filteredDependencies = useMemo(() => {
    let filtered = dependencies;

    if (filterType !== 'all') {
      filtered = filtered.filter(dep => dep.status === filterType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(dep => {
        const sourceModule = modules.find(m => m.id === dep.sourceId);
        const targetModule = modules.find(m => m.id === dep.targetId);
        return (
          sourceModule?.title.toLowerCase().includes(query) ||
          targetModule?.title.toLowerCase().includes(query) ||
          dep.reasoning.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [dependencies, filterType, searchQuery, modules]);

  // Calculate visualization nodes
  const visualizationNodes = useMemo(() => {
    const nodes: Map<string, VisualizationNode> = new Map();
    
    // Create nodes for all modules
    modules.forEach((module, index) => {
      const dependencyCount = filteredDependencies.filter(d => d.sourceId === module.id).length;
      const dependentCount = filteredDependencies.filter(d => d.targetId === module.id).length;
      
      nodes.set(module.id, {
        id: module.id,
        module,
        position: { x: 0, y: 0 }, // Will be calculated based on mode
        connections: [],
        level: 0, // Will be calculated
        dependencyCount,
        dependentCount
      });
    });

    // Add connections
    filteredDependencies.forEach(dep => {
      const sourceNode = nodes.get(dep.sourceId);
      const targetNode = nodes.get(dep.targetId);
      
      if (sourceNode && targetNode) {
        sourceNode.connections.push(dep.targetId);
      }
    });

    // Calculate positions based on visualization mode
    const nodeArray = Array.from(nodes.values());
    
    if (visualizationMode === 'tree') {
      calculateTreeLayout(nodeArray, filteredDependencies);
    } else if (visualizationMode === 'network') {
      calculateNetworkLayout(nodeArray, filteredDependencies);
    } else if (visualizationMode === 'timeline') {
      calculateTimelineLayout(nodeArray);
    }

    return nodeArray;
  }, [modules, filteredDependencies, visualizationMode]);

  // Calculate tree layout
  const calculateTreeLayout = useCallback((nodes: VisualizationNode[], deps: DependencyRelation[]) => {
    // Find root nodes (nodes with no dependencies)
    const rootNodes = nodes.filter(node => 
      !deps.some(dep => dep.targetId === node.id)
    );

    if (rootNodes.length === 0) {
      // Fallback to network layout if no clear hierarchy
      calculateNetworkLayout(nodes, deps);
      return;
    }

    const levelWidth = 200;
    const nodeHeight = 80;
    let currentLevel = 0;

    const processLevel = (levelNodes: VisualizationNode[], level: number) => {
      levelNodes.forEach((node, index) => {
        node.level = level;
        node.position.x = level * levelWidth + 100;
        node.position.y = index * nodeHeight + 50;
      });

      const nextLevelNodes: VisualizationNode[] = [];
      levelNodes.forEach(node => {
        const children = deps
          .filter(dep => dep.sourceId === node.id)
          .map(dep => nodes.find(n => n.id === dep.targetId))
          .filter(Boolean) as VisualizationNode[];
        
        children.forEach(child => {
          if (child.level <= level) { // Avoid cycles
            child.level = level + 1;
            nextLevelNodes.push(child);
          }
        });
      });

      if (nextLevelNodes.length > 0) {
        processLevel(nextLevelNodes, level + 1);
      }
    };

    processLevel(rootNodes, 0);
  }, []);

  // Calculate network layout using force-directed algorithm (simplified)
  const calculateNetworkLayout = useCallback((nodes: VisualizationNode[], deps: DependencyRelation[]) => {
    const centerX = 300;
    const centerY = 200;
    const radius = 150;

    // Initial circular layout
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI;
      node.position.x = centerX + Math.cos(angle) * radius;
      node.position.y = centerY + Math.sin(angle) * radius;
    });

    // Simple force simulation (in a real implementation, you'd use D3.js or similar)
    for (let iteration = 0; iteration < 50; iteration++) {
      // Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const node1 = nodes[i];
          const node2 = nodes[j];
          const dx = node2.position.x - node1.position.x;
          const dy = node2.position.y - node1.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            const force = (100 - distance) / distance;
            const fx = dx * force * 0.1;
            const fy = dy * force * 0.1;
            
            node1.position.x -= fx;
            node1.position.y -= fy;
            node2.position.x += fx;
            node2.position.y += fy;
          }
        }
      }

      // Attraction along dependencies
      deps.forEach(dep => {
        const source = nodes.find(n => n.id === dep.sourceId);
        const target = nodes.find(n => n.id === dep.targetId);
        
        if (source && target) {
          const dx = target.position.x - source.position.x;
          const dy = target.position.y - source.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance > 120) {
            const force = (distance - 120) / distance;
            const fx = dx * force * 0.05;
            const fy = dy * force * 0.05;
            
            source.position.x += fx;
            source.position.y += fy;
            target.position.x -= fx;
            target.position.y -= fy;
          }
        }
      });
    }
  }, []);

  // Calculate timeline layout
  const calculateTimelineLayout = useCallback((nodes: VisualizationNode[]) => {
    // Sort by module order or creation date
    const sortedNodes = [...nodes].sort((a, b) => a.module.order - b.module.order);
    
    const nodeSpacing = 150;
    const trackHeight = 60;
    const tracks = 3; // Multiple tracks to avoid overlaps

    sortedNodes.forEach((node, index) => {
      const track = index % tracks;
      node.position.x = (Math.floor(index / tracks)) * nodeSpacing + 100;
      node.position.y = track * trackHeight + 100;
    });
  }, []);

  // Get dependency status color
  const getDependencyStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10B981'; // green
      case 'suggested': return '#F59E0B'; // yellow
      case 'broken': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  };

  // Get dependency type info
  const getDependencyTypeInfo = (type: string) => {
    switch (type) {
      case 'prerequisite':
        return { label: 'Prerequisite', color: '#DC2626', symbol: '→' };
      case 'reference':
        return { label: 'Reference', color: '#2563EB', symbol: '↗' };
      case 'continuation':
        return { label: 'Continuation', color: '#059669', symbol: '⟹' };
      case 'support':
        return { label: 'Support', color: '#7C3AED', symbol: '⌐' };
      default:
        return { label: 'Dependency', color: '#6B7280', symbol: '—' };
    }
  };

  // Handle node click
  const handleNodeClick = useCallback((node: VisualizationNode) => {
    onModuleSelect?.(node.module);
  }, [onModuleSelect]);

  // Handle dependency analysis
  const handleAnalyzeDependencies = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      // This would call the actual dependency analysis from the store
      console.log('Analyzing dependencies...');
      // await analyzeDependencies();
    } catch (error) {
      console.error('Failed to analyze dependencies:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  // Calculate canvas dimensions
  const canvasDimensions = useMemo(() => {
    if (visualizationNodes.length === 0) {
      return { width: 600, height: 400 };
    }

    const padding = 100;
    const minX = Math.min(...visualizationNodes.map(n => n.position.x)) - padding;
    const maxX = Math.max(...visualizationNodes.map(n => n.position.x)) + padding;
    const minY = Math.min(...visualizationNodes.map(n => n.position.y)) - padding;
    const maxY = Math.max(...visualizationNodes.map(n => n.position.y)) + padding;

    return {
      width: Math.max(600, maxX - minX),
      height: Math.max(400, maxY - minY),
      offsetX: -minX,
      offsetY: -minY
    };
  }, [visualizationNodes]);

  return (
    <div className={`dependency-visualizer ${className} ${compact ? 'compact' : ''}`} ref={containerRef}>
      {/* Header */}
      {showControls && !compact && (
        <div className="p-4 border-b bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Dependency Visualization
              </h3>
              {isAnalyzing && <LoadingSpinner size="small" />}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleAnalyzeDependencies}
                disabled={isAnalyzing}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Analyze
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                View Mode
              </label>
              <select
                value={visualizationMode}
                onChange={(e) => setVisualizationMode(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="network">Network</option>
                <option value="tree">Tree</option>
                <option value="timeline">Timeline</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="all">All Dependencies</option>
                <option value="active">Active Only</option>
                <option value="suggested">Suggested</option>
                <option value="broken">Broken</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-sm"
                />
              </div>
            </div>

            <div className="flex items-end space-x-2">
              <Button
                size="sm"
                variant={showDependencyTypes ? 'primary' : 'outline'}
                onClick={() => setShowDependencyTypes(!showDependencyTypes)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Types
              </Button>
              
              <Button
                size="sm"
                variant={showDetails ? 'primary' : 'outline'}
                onClick={() => setShowDetails(!showDetails)}
              >
                <Info className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Visualization */}
      <div className={`visualization-container ${isFullscreen ? 'fullscreen' : ''} flex`}>
        <div className="flex-1 overflow-auto">
          <svg
            ref={svgRef}
            width={canvasDimensions.width}
            height={canvasDimensions.height}
            className="w-full h-full min-h-96"
            viewBox={`0 0 ${canvasDimensions.width} ${canvasDimensions.height}`}
          >
            {/* Grid background */}
            <defs>
              <pattern
                id="grid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#f0f0f0"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Dependency Lines */}
            <g className="dependencies">
              {filteredDependencies.map((dep) => {
                const sourceNode = visualizationNodes.find(n => n.id === dep.sourceId);
                const targetNode = visualizationNodes.find(n => n.id === dep.targetId);
                
                if (!sourceNode || !targetNode) return null;
                
                const typeInfo = getDependencyTypeInfo(dep.type);
                const statusColor = getDependencyStatusColor(dep.status);
                
                // Calculate line position
                const x1 = sourceNode.position.x + (canvasDimensions.offsetX || 0) + 50;
                const y1 = sourceNode.position.y + (canvasDimensions.offsetY || 0) + 25;
                const x2 = targetNode.position.x + (canvasDimensions.offsetX || 0) + 50;
                const y2 = targetNode.position.y + (canvasDimensions.offsetY || 0) + 25;
                
                return (
                  <g key={dep.id}>
                    {/* Connection line */}
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={statusColor}
                      strokeWidth={dep.strength * 3 + 1}
                      strokeDasharray={dep.status === 'suggested' ? '5,5' : 'none'}
                      opacity={0.7}
                      className="transition-opacity hover:opacity-1"
                    />
                    
                    {/* Arrow marker */}
                    <polygon
                      points={`${x2-5},${y2-3} ${x2},${y2} ${x2-5},${y2+3}`}
                      fill={statusColor}
                    />
                    
                    {/* Type label */}
                    {showDependencyTypes && (
                      <text
                        x={(x1 + x2) / 2}
                        y={(y1 + y2) / 2 - 5}
                        fill={typeInfo.color}
                        fontSize="10"
                        textAnchor="middle"
                        className="font-medium"
                      >
                        {typeInfo.symbol}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Module Nodes */}
            <g className="nodes">
              {visualizationNodes.map((node) => {
                const isSelected = selectedModule?.id === node.id;
                const isHovered = hoveredNode === node.id;
                const hasIssues = filteredDependencies.some(
                  dep => (dep.sourceId === node.id || dep.targetId === node.id) && dep.status === 'broken'
                );

                return (
                  <g
                    key={node.id}
                    className="node cursor-pointer transition-transform hover:scale-105"
                    transform={`translate(${node.position.x + (canvasDimensions.offsetX || 0)}, ${node.position.y + (canvasDimensions.offsetY || 0)})`}
                    onClick={() => handleNodeClick(node)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Node background */}
                    <rect
                      width="100"
                      height="50"
                      rx="8"
                      fill={isSelected ? '#3B82F6' : isHovered ? '#F3F4F6' : '#FFFFFF'}
                      stroke={hasIssues ? '#EF4444' : isSelected ? '#1D4ED8' : '#E5E7EB'}
                      strokeWidth={isSelected ? 3 : hasIssues ? 2 : 1}
                      className="transition-all duration-200"
                    />
                    
                    {/* Status indicator */}
                    <circle
                      cx="90"
                      cy="10"
                      r="4"
                      fill={
                        node.module.completionLevel === 'complete' ? '#10B981' :
                        node.module.completionLevel === 'review' ? '#F59E0B' :
                        '#6B7280'
                      }
                    />
                    
                    {/* Module title */}
                    <text
                      x="50"
                      y="20"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="500"
                      fill={isSelected ? '#FFFFFF' : '#1F2937'}
                      className="truncate"
                    >
                      {node.module.title.length > 12 
                        ? node.module.title.slice(0, 12) + '...' 
                        : node.module.title
                      }
                    </text>
                    
                    {/* Module type */}
                    <text
                      x="50"
                      y="35"
                      textAnchor="middle"
                      fontSize="9"
                      fill={isSelected ? '#E5E7EB' : '#6B7280'}
                    >
                      {node.module.type}
                    </text>
                    
                    {/* Connection indicators */}
                    {node.dependencyCount > 0 && (
                      <text
                        x="10"
                        y="45"
                        fontSize="8"
                        fill="#10B981"
                        title={`${node.dependencyCount} dependencies`}
                      >
                        →{node.dependencyCount}
                      </text>
                    )}
                    
                    {node.dependentCount > 0 && (
                      <text
                        x="70"
                        y="45"
                        fontSize="8"
                        fill="#3B82F6"
                        title={`${node.dependentCount} dependents`}
                      >
                        ←{node.dependentCount}
                      </text>
                    )}
                    
                    {/* Warning indicator for issues */}
                    {hasIssues && (
                      <AlertTriangle
                        x="85"
                        y="35"
                        width="10"
                        height="10"
                        fill="#EF4444"
                      />
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Details Panel */}
        {showDetails && !compact && (
          <div className="details-panel w-80 border-l bg-gray-50 dark:bg-gray-900 overflow-auto">
            <div className="p-4">
              {selectedModule ? (
                <SelectedModuleDetails 
                  module={selectedModule} 
                  dependencies={filteredDependencies}
                  modules={modules}
                />
              ) : (
                <DependencyOverview 
                  dependencies={filteredDependencies}
                  modules={modules}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {showDependencyTypes && !compact && (
        <div className="legend p-4 border-t bg-gray-50 dark:bg-gray-900">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">
            Legend
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Dependency Types
              </h5>
              <div className="space-y-1">
                {['prerequisite', 'reference', 'continuation', 'support'].map(type => {
                  const typeInfo = getDependencyTypeInfo(type);
                  return (
                    <div key={type} className="flex items-center space-x-2">
                      <span 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: typeInfo.color }}
                      />
                      <span className="text-xs text-gray-600">
                        {typeInfo.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">
                Status
              </h5>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-green-500 rounded" />
                  <span className="text-xs text-gray-600">Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-yellow-500 rounded border-dashed border border-yellow-500" />
                  <span className="text-xs text-gray-600">Suggested</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-1 bg-red-500 rounded" />
                  <span className="text-xs text-gray-600">Broken</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Selected Module Details Component
interface SelectedModuleDetailsProps {
  module: SmartModule;
  dependencies: DependencyRelation[];
  modules: SmartModule[];
}

const SelectedModuleDetails: React.FC<SelectedModuleDetailsProps> = ({
  module,
  dependencies,
  modules
}) => {
  const moduleDependencies = dependencies.filter(d => d.sourceId === module.id);
  const moduleDependents = dependencies.filter(d => d.targetId === module.id);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white mb-2">
          {module.title}
        </h3>
        <div className="flex items-center space-x-2 mb-3">
          <span className={`px-2 py-1 text-xs rounded-full ${
            module.completionLevel === 'complete' ? 'bg-green-100 text-green-800' :
            module.completionLevel === 'review' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {module.completionLevel}
          </span>
          <span className="text-xs text-gray-500">
            {module.wordCount} words
          </span>
        </div>
      </div>

      {/* Dependencies */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">
          Dependencies ({moduleDependencies.length})
        </h4>
        {moduleDependencies.length > 0 ? (
          <div className="space-y-2">
            {moduleDependencies.map(dep => {
              const targetModule = modules.find(m => m.id === dep.targetId);
              const typeInfo = getDependencyTypeInfo(dep.type);
              
              return (
                <Card key={dep.id} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {targetModule?.title || 'Unknown Module'}
                    </span>
                    <span 
                      className="px-2 py-1 text-xs rounded"
                      style={{ 
                        backgroundColor: typeInfo.color + '20', 
                        color: typeInfo.color 
                      }}
                    >
                      {typeInfo.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {dep.reasoning}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      Strength: {Math.round(dep.strength * 100)}%
                    </span>
                    <span className={`text-xs ${
                      dep.status === 'active' ? 'text-green-600' :
                      dep.status === 'suggested' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {dep.status}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No dependencies</p>
        )}
      </div>

      {/* Dependents */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">
          Dependents ({moduleDependents.length})
        </h4>
        {moduleDependents.length > 0 ? (
          <div className="space-y-2">
            {moduleDependents.map(dep => {
              const sourceModule = modules.find(m => m.id === dep.sourceId);
              
              return (
                <Card key={dep.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {sourceModule?.title || 'Unknown Module'}
                    </span>
                    <span className={`text-xs ${
                      dep.status === 'active' ? 'text-green-600' :
                      dep.status === 'suggested' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {dep.status}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No dependents</p>
        )}
      </div>
    </div>
  );
};

// Dependency Overview Component
interface DependencyOverviewProps {
  dependencies: DependencyRelation[];
  modules: SmartModule[];
}

const DependencyOverview: React.FC<DependencyOverviewProps> = ({
  dependencies,
  modules
}) => {
  const stats = useMemo(() => {
    const total = dependencies.length;
    const active = dependencies.filter(d => d.status === 'active').length;
    const suggested = dependencies.filter(d => d.status === 'suggested').length;
    const broken = dependencies.filter(d => d.status === 'broken').length;
    
    const typeStats = dependencies.reduce((acc, dep) => {
      acc[dep.type] = (acc[dep.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, active, suggested, broken, typeStats };
  }, [dependencies]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
          Dependency Overview
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-gray-900">
              {stats.total}
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </Card>
          
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-green-600">
              {stats.active}
            </div>
            <div className="text-xs text-gray-500">Active</div>
          </Card>
          
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-yellow-600">
              {stats.suggested}
            </div>
            <div className="text-xs text-gray-500">Suggested</div>
          </Card>
          
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-red-600">
              {stats.broken}
            </div>
            <div className="text-xs text-gray-500">Broken</div>
          </Card>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-2">
          Dependency Types
        </h4>
        <div className="space-y-2">
          {Object.entries(stats.typeStats).map(([type, count]) => {
            const typeInfo = getDependencyTypeInfo(type);
            return (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: typeInfo.color }}
                  />
                  <span className="text-sm">{typeInfo.label}</span>
                </div>
                <span className="text-sm font-medium">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-2">
          Module Statistics
        </h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>Total Modules: {modules.length}</div>
          <div>
            Connected Modules: {
              new Set([
                ...dependencies.map(d => d.sourceId),
                ...dependencies.map(d => d.targetId)
              ]).size
            }
          </div>
          <div>
            Isolated Modules: {
              modules.length - new Set([
                ...dependencies.map(d => d.sourceId),
                ...dependencies.map(d => d.targetId)
              ]).size
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default DependencyVisualizer;