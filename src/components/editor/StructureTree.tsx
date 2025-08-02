import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  CheckCircle,
  Circle,
  AlertCircle,
  GripVertical,
  MoreHorizontal,
  Copy,
  Trash2,
  Edit3
} from 'lucide-react';
import { PaperModule } from '@/types/modular';

interface StructureTreeProps {
  modules: PaperModule[];
  selectedModuleId: string | null;
  onModuleSelect: (moduleId: string) => void;
  onModuleReorder: (dragIndex: number, hoverIndex: number) => void;
  onBulkSelection: (moduleIds: string[]) => void;
  bulkSelection: string[];
}

const StructureTree: React.FC<StructureTreeProps> = ({
  modules,
  selectedModuleId,
  onModuleSelect,
  onModuleReorder,
  onBulkSelection,
  bulkSelection
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['root']));
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);

  const toggleExpanded = (moduleId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedItems(newExpanded);
  };

  const getModuleIcon = (module: PaperModule) => {
    if (module.isCompleted) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (module.progress > 0) {
      return <Circle className="h-4 w-4 text-blue-500" />;
    } else {
      return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getModuleTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'abstract': 'bg-purple-100 text-purple-800',
      'introduction': 'bg-blue-100 text-blue-800',
      'literature-review': 'bg-green-100 text-green-800',
      'methodology': 'bg-yellow-100 text-yellow-800',
      'results': 'bg-orange-100 text-orange-800',
      'discussion': 'bg-red-100 text-red-800',
      'conclusion': 'bg-indigo-100 text-indigo-800',
      'references': 'bg-gray-100 text-gray-800',
      'appendix': 'bg-pink-100 text-pink-800',
      'custom': 'bg-teal-100 text-teal-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const handleModuleClick = (moduleId: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // 多选模式
      const newSelection = bulkSelection.includes(moduleId)
        ? bulkSelection.filter(id => id !== moduleId)
        : [...bulkSelection, moduleId];
      onBulkSelection(newSelection);
    } else {
      onModuleSelect(moduleId);
      onBulkSelection([]);
    }
  };

  const renderModuleItem = (module: PaperModule, level: number = 0) => {
    const isSelected = selectedModuleId === module.id;
    const isBulkSelected = bulkSelection.includes(module.id);
    const isExpanded = expandedItems.has(module.id);
    const hasSubmodules = false; // 可以扩展为支持子模块

    return (
      <div key={module.id} className="relative">
        <div
          className={`group flex items-center px-2 py-2 rounded-lg cursor-pointer transition-colors ${
            isSelected 
              ? 'bg-blue-100 text-blue-900' 
              : isBulkSelected
              ? 'bg-blue-50 text-blue-800'
              : 'hover:bg-gray-50'
          }`}
          style={{ paddingLeft: `${8 + level * 16}px` }}
          onClick={(e) => handleModuleClick(module.id, e)}
          onMouseEnter={() => setHoveredModule(module.id)}
          onMouseLeave={() => setHoveredModule(null)}
        >
          {/* 拖拽手柄 */}
          <div className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-3 w-3 text-gray-400 cursor-grab" />
          </div>

          {/* 展开/折叠按钮 */}
          {hasSubmodules ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(module.id);
              }}
              className="mr-1 p-0.5 rounded hover:bg-gray-200"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3 text-gray-500" />
              ) : (
                <ChevronRight className="h-3 w-3 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-4 mr-1" />
          )}

          {/* 状态图标 */}
          <div className="mr-2">
            {getModuleIcon(module)}
          </div>

          {/* 模块标题 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium truncate">
                {module.title}
              </span>
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${getModuleTypeColor(module.type)}`}>
                {module.type}
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex-1 bg-gray-200 rounded-full h-1">
                <div
                  className="bg-blue-500 h-1 rounded-full transition-all"
                  style={{ width: `${module.progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {module.wordCount}词
              </span>
            </div>
          </div>

          {/* 操作菜单 */}
          {(hoveredModule === module.id || isSelected) && (
            <div className="ml-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // 显示上下文菜单
                }}
                className="p-1 rounded hover:bg-gray-200"
              >
                <MoreHorizontal className="h-3 w-3 text-gray-500" />
              </button>
            </div>
          )}
        </div>

        {/* 依赖关系指示器 */}
        {module.dependencies.length > 0 && (
          <div className="ml-8 mt-1">
            <div className="flex items-center space-x-1">
              <AlertCircle className="h-3 w-3 text-yellow-500" />
              <span className="text-xs text-gray-500">
                依赖: {module.dependencies.length} 个模块
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 按order排序模块
  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  return (
    <div className="flex-1 overflow-y-auto p-2">
      {/* 整体进度 */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">整体进度</span>
          <span className="text-sm text-gray-600">
            {Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length || 0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ 
              width: `${Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length || 0)}%` 
            }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{modules.filter(m => m.isCompleted).length} 已完成</span>
          <span>{modules.length} 总计</span>
        </div>
      </div>

      {/* 模块列表 */}
      <div className="space-y-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">论文结构</h3>
          {bulkSelection.length > 0 && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  // 批量复制
                }}
                className="p-1 text-gray-500 hover:text-gray-700 rounded"
                title="复制选中"
              >
                <Copy className="h-3 w-3" />
              </button>
              <button
                onClick={() => {
                  // 批量删除
                }}
                className="p-1 text-red-500 hover:text-red-700 rounded"
                title="删除选中"
              >
                <Trash2 className="h-3 w-3" />
              </button>
              <span className="text-xs text-gray-500">
                已选择 {bulkSelection.length} 项
              </span>
            </div>
          )}
        </div>

        {sortedModules.map((module) => renderModuleItem(module))}
      </div>

      {/* 快捷操作 */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-xs font-medium text-gray-700 mb-2">快捷操作</h4>
        <div className="space-y-1">
          <button className="w-full text-left px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded">
            <Edit3 className="h-3 w-3 inline mr-2" />
            重命名模块
          </button>
          <button className="w-full text-left px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 rounded">
            <Copy className="h-3 w-3 inline mr-2" />
            复制模块
          </button>
          <button className="w-full text-left px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="h-3 w-3 inline mr-2" />
            删除模块
          </button>
        </div>
      </div>
    </div>
  );
};

export default StructureTree;