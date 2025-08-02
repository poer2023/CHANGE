import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Edit3,
  Copy,
  Trash2,
  CheckCircle,
  Circle,
  Clock,
  FileText,
  AlertTriangle,
  Target,
  MessageSquare,
  GripVertical
} from 'lucide-react';
import { PaperModule } from '@/types/modular';

interface ModuleCardProps {
  module: PaperModule;
  isSelected: boolean;
  isBulkSelected: boolean;
  onUpdate: (updates: Partial<PaperModule>) => void;
  onSelect: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isSelected,
  isBulkSelected,
  onUpdate,
  onSelect,
  onDragStart,
  onDragEnd
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(module.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalContent(module.content);
  }, [module.content]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleContentChange = (content: string) => {
    setLocalContent(content);
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    onUpdate({ 
      content, 
      wordCount,
      progress: Math.min(100, (wordCount / (module.template?.wordCountTarget?.min || 100)) * 100)
    });
  };

  const handleToggleComplete = () => {
    onUpdate({ 
      isCompleted: !module.isCompleted,
      progress: !module.isCompleted ? 100 : module.progress
    });
  };

  const getModuleTypeColor = (type: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      'abstract': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
      'introduction': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
      'literature-review': { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
      'methodology': { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
      'results': { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
      'discussion': { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200' },
      'conclusion': { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' },
      'references': { bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200' },
      'appendix': { bg: 'bg-pink-50', text: 'text-pink-800', border: 'border-pink-200' },
      'custom': { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' }
    };
    return colors[type] || colors['custom'];
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      'easy': 'text-green-600',
      'medium': 'text-yellow-600',
      'hard': 'text-red-600'
    };
    return colors[difficulty] || 'text-gray-600';
  };

  const typeColors = getModuleTypeColor(module.type);

  return (
    <div
      className={`group relative bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${
        isSelected 
          ? 'border-blue-500 shadow-lg' 
          : isBulkSelected
          ? 'border-blue-300 shadow-md'
          : 'border-gray-200 hover:border-gray-300'
      } ${typeColors.border} ${typeColors.bg}`}
      onClick={onSelect}
    >
      {/* 拖拽手柄 */}
      <div 
        className="absolute left-2 top-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>

      {/* 卡片头部 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1 ml-6">
            <div className="flex items-center space-x-2 mb-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate({ isCollapsed: !module.isCollapsed });
                }}
                className="p-1 rounded hover:bg-gray-100"
              >
                {module.isCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              
              <h3 className={`font-semibold ${typeColors.text}`}>
                {module.title}
              </h3>
              
              <span className={`px-2 py-1 text-xs rounded-full bg-white ${typeColors.text} font-medium`}>
                {module.type}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleComplete();
                }}
                className="ml-auto"
              >
                {module.isCompleted ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>

            {/* 进度条 */}
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    module.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${module.progress}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{module.progress}%</span>
            </div>

            {/* 元数据 */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <FileText className="h-3 w-3" />
                <span>{module.wordCount} 词</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{module.metadata.estimatedTime}分钟</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className={`h-3 w-3 ${getDifficultyColor(module.metadata.difficulty)}`} />
                <span className={getDifficultyColor(module.metadata.difficulty)}>
                  {module.metadata.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* 操作菜单 */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 rounded hover:bg-gray-100"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>编辑模块</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // 复制模块逻辑
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Copy className="h-4 w-4" />
                  <span>复制模块</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // 删除模块逻辑
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>删除模块</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 依赖关系提示 */}
        {module.dependencies.length > 0 && (
          <div className="mt-2 flex items-center space-x-1 text-xs text-yellow-600">
            <AlertTriangle className="h-3 w-3" />
            <span>依赖 {module.dependencies.length} 个模块</span>
          </div>
        )}
      </div>

      {/* 卡片内容 */}
      {!module.isCollapsed && (
        <div className="p-4">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                ref={textareaRef}
                value={localContent}
                onChange={(e) => handleContentChange(e.target.value)}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`开始编写${module.title}...`}
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setLocalContent(module.content);
                  }}
                  className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  保存
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="min-h-24 p-3 bg-white rounded border border-gray-200 cursor-text hover:border-gray-300 transition-colors"
            >
              {module.content ? (
                <div className="text-sm text-gray-700 whitespace-pre-wrap">
                  {module.content}
                </div>
              ) : (
                <div className="text-sm text-gray-400 italic">
                  点击开始编写{module.title}...
                </div>
              )}
            </div>
          )}

          {/* 模块底部信息 */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-3">
                <span>最后修改: {new Date(module.updatedAt).toLocaleDateString()}</span>
                <span>修订: {module.metadata.revisionCount} 次</span>
              </div>
              <div className="flex items-center space-x-2">
                {module.metadata.notes.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{module.metadata.notes.length} 备注</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;