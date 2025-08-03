import React, { useState, useCallback, useRef } from 'react';
import { LayoutGrid, List, Search, GripVertical } from 'lucide-react';
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
  const [dropLinePosition, setDropLinePosition] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const handleDragStart = useCallback((index: number, e: React.DragEvent) => {
    setDraggedIndex(index);
    dragCounter.current = 0;
    
    // 设置拖拽数据
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
    
    // 创建自定义拖拽预览
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.8';
    dragImage.style.transform = 'rotate(2deg)';
    dragImage.style.backgroundColor = 'white';
    dragImage.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    dragImage.style.borderRadius = '8px';
    dragImage.style.width = '300px';
    
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 150, 50);
    
    // 清理临时元素
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  }, []);

  const handleDragEnter = useCallback((index: number, e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (draggedIndex !== index) {
      setDragOverIndex(index);
      setDropLinePosition(index);
    }
  }, [draggedIndex]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverIndex(null);
      setDropLinePosition(null);
    }
  }, []);

  const handleDragOver = useCallback((index: number, e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // 计算插入位置
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseY = e.clientY;
    const elementMiddle = rect.top + rect.height / 2;
    
    if (draggedIndex !== null && draggedIndex !== index) {
      const insertIndex = mouseY < elementMiddle ? index : index + 1;
      setDropLinePosition(insertIndex);
    }
  }, [draggedIndex]);

  const handleDrop = useCallback((index: number, e: React.DragEvent) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex !== index && !isNaN(dragIndex)) {
      // 计算最终插入位置
      const rect = e.currentTarget.getBoundingClientRect();
      const mouseY = e.clientY;
      const elementMiddle = rect.top + rect.height / 2;
      const targetIndex = mouseY < elementMiddle ? index : index + 1;
      
      onModuleReorder(dragIndex, targetIndex > dragIndex ? targetIndex - 1 : targetIndex);
    }
    
    handleDragEnd();
  }, [onModuleReorder]);

  const handleDragEnd = useCallback(() => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDropLinePosition(null);
    dragCounter.current = 0;
  }, []);

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

  const renderDropLine = (position: number) => {
    if (dropLinePosition === position && draggedIndex !== null) {
      return (
        <div className="relative">
          <div className="absolute inset-x-0 -top-1 h-0.5 bg-blue-500 rounded-full shadow-lg">
            <div className="absolute -left-1 -top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCardView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
        {modules.map((module, index) => (
          <div key={module.id} className="relative">
            {renderDropLine(index)}
            <div
              draggable
              onDragStart={(e) => handleDragStart(index, e)}
              onDragEnter={(e) => handleDragEnter(index, e)}
              onDragLeave={handleDragLeave}
              onDragOver={(e) => handleDragOver(index, e)}
              onDrop={(e) => handleDrop(index, e)}
              onDragEnd={handleDragEnd}
              className={`relative transition-all duration-300 ease-in-out cursor-grab active:cursor-grabbing ${
                draggedIndex === index 
                  ? 'opacity-50 scale-95 rotate-1 z-10' 
                  : 'hover:shadow-lg hover:-translate-y-1'
              } ${
                dragOverIndex === index && draggedIndex !== index 
                  ? 'scale-105 shadow-xl ring-2 ring-blue-300 ring-opacity-50' 
                  : ''
              }`}
            >
              {/* 拖拽手柄 */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <GripVertical className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </div>
              
              <ModuleCard
                module={module}
                isSelected={selectedModuleId === module.id}
                isBulkSelected={bulkSelection.includes(module.id)}
                onUpdate={(updates) => onModuleUpdate(module.id, updates)}
                onSelect={() => handleModuleClick(module.id, {} as React.MouseEvent)}
                onDragStart={() => handleDragStart(index, {} as React.DragEvent)}
                onDragEnd={handleDragEnd}
              />
            </div>
            {index === modules.length - 1 && renderDropLine(index + 1)}
          </div>
        ))}
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="p-6">
        <div className="space-y-2">
          {modules.map((module, index) => (
            <div key={module.id} className="relative">
              {renderDropLine(index)}
              <div
                draggable
                onDragStart={(e) => handleDragStart(index, e)}
                onDragEnter={(e) => handleDragEnter(index, e)}
                onDragLeave={handleDragLeave}
                onDragOver={(e) => handleDragOver(index, e)}
                onDrop={(e) => handleDrop(index, e)}
                onDragEnd={handleDragEnd}
                className={`group relative transition-all duration-300 ease-in-out cursor-grab active:cursor-grabbing ${
                  draggedIndex === index 
                    ? 'opacity-50 scale-98 z-10' 
                    : 'hover:shadow-md hover:bg-white'
                } ${
                  dragOverIndex === index && draggedIndex !== index 
                    ? 'shadow-lg bg-blue-50 border-blue-200' 
                    : ''
                }`}
              >
                {/* 拖拽手柄 - 列表视图 */}
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  <GripVertical className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </div>
                
                <div className="pl-8">
                  <ModuleCard
                    module={module}
                    isSelected={selectedModuleId === module.id}
                    isBulkSelected={bulkSelection.includes(module.id)}
                    onUpdate={(updates) => onModuleUpdate(module.id, updates)}
                    onSelect={() => handleModuleClick(module.id, {} as React.MouseEvent)}
                    onDragStart={() => handleDragStart(index, {} as React.DragEvent)}
                    onDragEnd={handleDragEnd}
                  />
                </div>
              </div>
              {index === modules.length - 1 && renderDropLine(index + 1)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOutlineView = () => {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">论文大纲</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {modules.map((module, index) => (
              <div key={module.id} className="relative">
                {renderDropLine(index)}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(index, e)}
                  onDragEnter={(e) => handleDragEnter(index, e)}
                  onDragLeave={handleDragLeave}
                  onDragOver={(e) => handleDragOver(index, e)}
                  onDrop={(e) => handleDrop(index, e)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleModuleClick(module.id, {} as React.MouseEvent)}
                  className={`group p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 cursor-grab active:cursor-grabbing ${
                    selectedModuleId === module.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  } ${
                    bulkSelection.includes(module.id) ? 'bg-blue-25' : ''
                  } ${
                    draggedIndex === index ? 'opacity-50 bg-gray-100' : ''
                  } ${
                    dragOverIndex === index && draggedIndex !== index 
                      ? 'bg-blue-100 shadow-inner' 
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <GripVertical className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors duration-200" />
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
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${module.progress}%` }}
                          />
                        </div>
                        <span>{module.progress}%</span>
                      </div>
                    </div>
                  </div>
                  {module.content && (
                    <div className="mt-2 ml-7 text-sm text-gray-600 line-clamp-2">
                      {module.content.substring(0, 100)}
                      {module.content.length > 100 ? '...' : ''}
                    </div>
                  )}
                </div>
                {index === modules.length - 1 && renderDropLine(index + 1)}
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