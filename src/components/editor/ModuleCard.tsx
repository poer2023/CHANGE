import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  GripVertical,
  BarChart3,
  Eye,
  EyeOff,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link,
  Save,
  X
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
  const [showStatistics, setShowStatistics] = useState(false);
  const [showRichTextTools, setShowRichTextTools] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

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

  const getContentStatistics = useCallback((content: string) => {
    const trimmedContent = content.trim();
    const words = trimmedContent.split(/\s+/).filter(word => word.length > 0);
    const sentences = trimmedContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = trimmedContent.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const characters = trimmedContent.length;
    const charactersNoSpaces = trimmedContent.replace(/\s/g, '').length;
    
    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      characterCount: characters,
      characterCountNoSpaces: charactersNoSpaces,
      averageWordsPerSentence: sentences.length > 0 ? Math.round(words.length / sentences.length) : 0,
      readingTime: Math.ceil(words.length / 200) // assuming 200 WPM reading speed
    };
  }, []);

  const handleContentChange = (content: string) => {
    setLocalContent(content);
    const stats = getContentStatistics(content);
    const targetWords = module.template?.wordCountTarget?.min || 100;
    const progress = Math.min(100, (stats.wordCount / targetWords) * 100);
    
    onUpdate({ 
      content, 
      wordCount: stats.wordCount,
      progress: progress,
      metadata: {
        ...module.metadata,
        lastModified: new Date(),
        revisionCount: module.metadata.revisionCount + (content !== module.content ? 1 : 0)
      }
    });
  };

  const insertTextAtCursor = (text: string, wrapSelection: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = localContent;
    const selectedText = currentContent.substring(start, end);
    
    let newText = text;
    if (wrapSelection && selectedText) {
      newText = text + selectedText + text;
    }
    
    const newContent = currentContent.substring(0, start) + newText + currentContent.substring(end);
    handleContentChange(newContent);
    
    // 设置新的光标位置
    setTimeout(() => {
      const newCursorPos = start + (wrapSelection && selectedText ? text.length : newText.length);
      textarea.setSelectionRange(newCursorPos, wrapSelection && selectedText ? newCursorPos + selectedText.length : newCursorPos);
      textarea.focus();
    }, 0);
  };

  const handleFormatting = (format: string) => {
    switch (format) {
      case 'bold':
        insertTextAtCursor('**', true);
        break;
      case 'italic':
        insertTextAtCursor('*', true);
        break;
      case 'list':
        insertTextAtCursor('\n- ');
        break;
      case 'numbered-list':
        insertTextAtCursor('\n1. ');
        break;
      case 'quote':
        insertTextAtCursor('\n> ');
        break;
      case 'link':
        insertTextAtCursor('[链接文本](URL)');
        break;
    }
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
              {/* 增强的富文本工具栏 */}
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-t-lg border border-gray-200">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setShowRichTextTools(!showRichTextTools)}
                    className={`p-1 rounded transition-colors ${
                      showRichTextTools ? 'text-blue-600 bg-blue-100' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="切换格式工具"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  
                  {showRichTextTools && (
                    <>
                      <div className="w-px h-4 bg-gray-300 mx-2"></div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleFormatting('bold')}
                          className="p-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-200 transition-colors"
                          title="粗体 (Ctrl+B)"
                        >
                          <Bold className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleFormatting('italic')}
                          className="p-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-200 transition-colors"
                          title="斜体 (Ctrl+I)"
                        >
                          <Italic className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleFormatting('list')}
                          className="p-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-200 transition-colors"
                          title="无序列表"
                        >
                          <List className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleFormatting('numbered-list')}
                          className="p-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-200 transition-colors"
                          title="有序列表"
                        >
                          <ListOrdered className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleFormatting('quote')}
                          className="p-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-200 transition-colors"
                          title="引用"
                        >
                          <Quote className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleFormatting('link')}
                          className="p-1 text-gray-600 hover:text-gray-900 rounded hover:bg-gray-200 transition-colors"
                          title="链接"
                        >
                          <Link className="h-4 w-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setShowStatistics(!showStatistics)}
                    className={`p-1 rounded transition-colors ${
                      showStatistics ? 'text-blue-600 bg-blue-100' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    title="统计信息"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </button>
                  
                  <div className="flex items-center space-x-1 ml-2 text-xs text-gray-500">
                    <FileText className="h-3 w-3" />
                    <span>{getContentStatistics(localContent).wordCount} 词</span>
                  </div>
                </div>
              </div>
              
              {/* 实时统计信息面板 */}
              {showStatistics && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 transition-all duration-200">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {(() => {
                      const stats = getContentStatistics(localContent);
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">字数:</span>
                            <span className="font-medium text-blue-900">{stats.wordCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">句子:</span>
                            <span className="font-medium text-blue-900">{stats.sentenceCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">段落:</span>
                            <span className="font-medium text-blue-900">{stats.paragraphCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">字符:</span>
                            <span className="font-medium text-blue-900">{stats.characterCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">平均句长:</span>
                            <span className="font-medium text-blue-900">{stats.averageWordsPerSentence} 词</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">阅读时间:</span>
                            <span className="font-medium text-blue-900">{stats.readingTime} 分钟</span>
                          </div>
                          {module.template?.wordCountTarget && (
                            <div className="col-span-2 pt-2 border-t border-blue-200">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-600 text-xs">目标进度:</span>
                                <span className="text-xs font-medium text-blue-900">
                                  {stats.wordCount}/{module.template.wordCountTarget.min} 词 
                                  ({Math.min(100, (stats.wordCount / module.template.wordCountTarget.min) * 100).toFixed(1)}%)
                                </span>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-1.5">
                                <div
                                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(100, (stats.wordCount / module.template.wordCountTarget.min) * 100)}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()
                    }
                  </div>
                </div>
              )}
              
              {/* 增强的编辑器文本区域 */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={localContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm leading-relaxed transition-all duration-200"
                  placeholder={`开始编写${module.title}...\n\n提示：\n• 使用 **粗体** 和 *斜体* 格式\n• 使用 # 标题 格式\n• 使用 - 列表项 格式\n• 支持Markdown语法`}
                  autoFocus
                  onKeyDown={(e) => {
                    // 支持Tab缩进
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      insertTextAtCursor('    ');
                    }
                    // 支持快捷键
                    if (e.ctrlKey || e.metaKey) {
                      switch (e.key) {
                        case 'b':
                          e.preventDefault();
                          handleFormatting('bold');
                          break;
                        case 'i':
                          e.preventDefault();
                          handleFormatting('italic');
                          break;
                        case 'k':
                          e.preventDefault();
                          handleFormatting('link');
                          break;
                      }
                    }
                  }}
                />
                
                {/* 实时字数和进度显示 */}
                <div className="absolute bottom-2 right-2 flex items-center space-x-2">
                  {module.template?.wordCountTarget && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-white bg-opacity-90 rounded text-xs border shadow-sm">
                      <div className="w-8 bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-green-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (getContentStatistics(localContent).wordCount / module.template.wordCountTarget.min) * 100)}%` }}
                        />
                      </div>
                      <span className="text-gray-600">
                        {Math.min(100, (getContentStatistics(localContent).wordCount / module.template.wordCountTarget.min) * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}
                  <div className="px-2 py-1 bg-white bg-opacity-90 rounded text-xs text-gray-500 border shadow-sm">
                    {getContentStatistics(localContent).wordCount} 词
                  </div>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>最后保存: {new Date().toLocaleTimeString()}</span>
                  {localContent !== module.content && (
                    <span className="text-orange-600 font-medium">• 有未保存的更改</span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setLocalContent(module.content);
                      setShowRichTextTools(false);
                      setShowStatistics(false);
                    }}
                    className="inline-flex items-center px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                  >
                    <X className="h-3 w-3 mr-1" />
                    取消
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setShowRichTextTools(false);
                      setShowStatistics(false);
                    }}
                    className="inline-flex items-center px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    保存
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="min-h-24 p-3 bg-white rounded border border-gray-200 cursor-text hover:border-gray-300 transition-colors group"
            >
              {module.content ? (
                <div className="relative">
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {module.content}
                  </div>
                  
                  {/* 悬停时显示快速统计 */}
                  <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg">
                      {getContentStatistics(module.content).wordCount} 词 • {getContentStatistics(module.content).readingTime} 分钟
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-16">
                  <div className="text-center">
                    <div className="text-sm text-gray-400 italic mb-1">
                      点击开始编写{module.title}...
                    </div>
                    <div className="text-xs text-gray-300">
                      支持Markdown格式
                    </div>
                  </div>
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