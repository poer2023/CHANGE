import React, { useState, useCallback } from 'react';
import { Grid3X3, List, Search } from 'lucide-react';
import ModuleCard from './ModuleCard';
import { PaperModule } from '@/types/modular';

interface ModuleDragDropProps {
  modules: PaperModule[];
  viewMode: 'card' | 'list' | 'outline';
  selectedModuleId: string | null;
  onModuleUpdate: (moduleId: string, updates: Partial<PaperModule>) => void;
  onModuleSelect: (moduleId: string) => void;
  onModuleReorder: (dragIndex: number, hoverIndex: number) => void;
  bulkSelection: string[];
  onBulkSelection: (moduleIds: string[]) => void;
}

const ModuleDragDrop: React.FC<ModuleDragDropProps> = ({
  modules,
  viewMode,
  selectedModuleId,
  onModuleUpdate,
  onModuleSelect,
  onModuleReorder,
  bulkSelection,
  onBulkSelection
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDragOver = useCallback((index: number, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      onModuleReorder(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [draggedIndex, dragOverIndex, onModuleReorder]);

  const handleModuleClick = useCallback((moduleId: string, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // 多选模式
      const newSelection = bulkSelection.includes(moduleId)
        ? bulkSelection.filter(id => id !== moduleId)
        : [...bulkSelection, moduleId];
      onBulkSelection(newSelection);
    } else {
      onModuleSelect(moduleId);
    }
  }, [bulkSelection, onBulkSelection, onModuleSelect]);

  const renderCardView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
        {modules.map((module, index) => (
          <div
            key={module.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(index, e)}
            onDragEnd={handleDragEnd}
            className={`transition-all duration-200 ${
              draggedIndex === index ? 'opacity-50 scale-95' : ''
            } ${
              dragOverIndex === index && draggedIndex !== index 
                ? 'transform scale-105 shadow-lg' 
                : ''
            }`}
          >
            <ModuleCard
              module={module}
              isSelected={selectedModuleId === module.id}
              isBulkSelected={bulkSelection.includes(module.id)}
              onUpdate={(updates) => onModuleUpdate(module.id, updates)}
              onSelect={() => handleModuleClick(module.id, {} as React.MouseEvent)}
              onDragStart={() => handleDragStart(index)}
              onDragEnd={handleDragEnd}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {modules.map((module, index) => (
            <div
              key={module.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(index, e)}
              onDragEnd={handleDragEnd}
              className={`transition-all duration-200 ${
                draggedIndex === index ? 'opacity-50' : ''
              } ${
                dragOverIndex === index && draggedIndex !== index 
                  ? 'transform translate-y-1 shadow-lg' 
                  : ''
              }`}
            >
              <ModuleCard
                module={module}
                isSelected={selectedModuleId === module.id}
                isBulkSelected={bulkSelection.includes(module.id)}
                onUpdate={(updates) => onModuleUpdate(module.id, updates)}
                onSelect={() => handleModuleClick(module.id, {} as React.MouseEvent)}
                onDragStart={() => handleDragStart(index)}
                onDragEnd={handleDragEnd}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOutlineView = () => {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">论文大纲</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {modules.map((module, index) => (
              <div
                key={module.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(index, e)}
                onDragEnd={handleDragEnd}
                onClick={() => handleModuleClick(module.id, {} as React.MouseEvent)}
                className={`p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                  selectedModuleId === module.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                } ${
                  bulkSelection.includes(module.id) ? 'bg-blue-25' : ''
                } ${
                  draggedIndex === index ? 'opacity-50' : ''
                } ${
                  dragOverIndex === index && draggedIndex !== index 
                    ? 'bg-blue-100' 
                    : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">
                      {module.order}.
                    </span>
                    <span className="font-medium text-gray-900">
                      {module.title}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                      {module.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{module.wordCount} 词</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-16 bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full"
                          style={{ width: `${module.progress}%` }}
                        />
                      </div>
                      <span>{module.progress}%</span>
                    </div>
                  </div>
                </div>
                {module.content && (
                  <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {module.content.substring(0, 100)}
                    {module.content.length > 100 ? '...' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (modules.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无模块</h3>
          <p className="text-gray-500 mb-4">
            开始创建你的第一个论文模块
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            添加模块
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      {/* 批量操作工具栏 */}
      {bulkSelection.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-900">
                已选择 {bulkSelection.length} 个模块
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-blue-700 border border-blue-300 rounded hover:bg-blue-100">
                复制
              </button>
              <button className="px-3 py-1 text-sm text-blue-700 border border-blue-300 rounded hover:bg-blue-100">
                移动
              </button>
              <button className="px-3 py-1 text-sm text-red-700 border border-red-300 rounded hover:bg-red-100">
                删除
              </button>
              <button
                onClick={() => onBulkSelection([])}
                className="px-3 py-1 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-100"
              >
                取消选择
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 拖拽指示器 */}
      {draggedIndex !== null && (
        <div className="fixed top-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg text-sm z-50">
          正在移动模块...
        </div>
      )}

      {/* 渲染不同视图 */}
      {viewMode === 'card' && renderCardView()}
      {viewMode === 'list' && renderListView()}
      {viewMode === 'outline' && renderOutlineView()}
    </div>
  );
};

export default ModuleDragDrop;