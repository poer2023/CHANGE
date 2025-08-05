import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Quote, 
  Code,
  Link,
  Image,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  Type,
  Palette,
  Minus,
  Table,
  FileText,
  Strikethrough,
  Superscript,
  Subscript,
  Save,
  Upload,
  Hash
} from 'lucide-react';

interface EnhancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  onSelectionChange?: (start: number, end: number) => void;
  showToolbar?: boolean;
  showStatusBar?: boolean;
  minHeight?: number;
  maxHeight?: number;
  fontSize?: number;
  fontFamily?: string;
  theme?: 'light' | 'dark';
  onSave?: () => void;
}

interface EditorAction {
  type: 'format' | 'insert' | 'replace' | 'heading' | 'align';
  action: string;
  value?: string;
  level?: number;
}

interface ToolbarGroup {
  id: string;
  label: string;
  buttons: ToolbarButton[];
}

interface ToolbarButton {
  id: string;
  action: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: EditorAction['type'];
  value?: string;
  level?: number;
}

const EnhancedRichTextEditor: React.FC<EnhancedRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "开始写作...",
  className = "",
  readOnly = false,
  autoFocus = false,
  onSelectionChange,
  showToolbar = true,
  showStatusBar = true,
  minHeight = 400,
  maxHeight,
  fontSize = 16,
  fontFamily = 'Inter',
  theme = 'light',
  onSave
}) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [history, setHistory] = useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [currentFontSize, setCurrentFontSize] = useState(fontSize);
  const [currentFontFamily, setCurrentFontFamily] = useState(fontFamily);
  const [wordCount, setWordCount] = useState({ characters: 0, words: 0, lines: 0 });
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  // 处理选择变化
  const handleSelectionChange = useCallback(() => {
    const editor = editorRef.current;
    if (editor) {
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      setSelection({ start, end });
      onSelectionChange?.(start, end);
    }
  }, [onSelectionChange]);

  // 执行编辑器操作
  const executeAction = useCallback((action: EditorAction) => {
    const editor = editorRef.current;
    if (!editor || readOnly) return;

    const { selectionStart, selectionEnd } = editor;
    const currentValue = editor.value;
    let newValue = currentValue;
    let newSelectionStart = selectionStart;
    let newSelectionEnd = selectionEnd;

    switch (action.type) {
      case 'format':
        const selectedText = currentValue.substring(selectionStart, selectionEnd);
        let formattedText = '';
        
        switch (action.action) {
          case 'bold':
            formattedText = `**${selectedText}**`;
            break;
          case 'italic':
            formattedText = `*${selectedText}*`;
            break;
          case 'underline':
            formattedText = `<u>${selectedText}</u>`;
            break;
          case 'strikethrough':
            formattedText = `~~${selectedText}~~`;
            break;
          case 'superscript':
            formattedText = `<sup>${selectedText}</sup>`;
            break;
          case 'subscript':
            formattedText = `<sub>${selectedText}</sub>`;
            break;
          case 'code':
            formattedText = selectedText.includes('\n') 
              ? `\`\`\`\n${selectedText}\n\`\`\`` 
              : `\`${selectedText}\``;
            break;
          case 'quote':
            formattedText = selectedText.split('\n').map(line => `> ${line}`).join('\n');
            break;
          case 'list':
            formattedText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
            break;
          case 'orderedList':
            formattedText = selectedText.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n');
            break;
        }
        
        newValue = currentValue.substring(0, selectionStart) + formattedText + currentValue.substring(selectionEnd);
        newSelectionEnd = selectionStart + formattedText.length;
        break;

      case 'insert':
        const insertText = action.value || '';
        newValue = currentValue.substring(0, selectionStart) + insertText + currentValue.substring(selectionEnd);
        newSelectionStart = newSelectionEnd = selectionStart + insertText.length;
        break;

      case 'heading':
        const level = action.level || 1;
        const headingPrefix = '#'.repeat(level);
        const headingText = currentValue.substring(selectionStart, selectionEnd) || '标题';
        const headingFormatted = `${headingPrefix} ${headingText}`;
        newValue = currentValue.substring(0, selectionStart) + headingFormatted + currentValue.substring(selectionEnd);
        newSelectionEnd = selectionStart + headingFormatted.length;
        break;

      case 'align':
        const alignText = currentValue.substring(selectionStart, selectionEnd);
        const alignTag = action.action === 'alignCenter' ? 'center' : action.action === 'alignRight' ? 'right' : 'left';
        const alignFormatted = `<div align="${alignTag}">${alignText}</div>`;
        newValue = currentValue.substring(0, selectionStart) + alignFormatted + currentValue.substring(selectionEnd);
        newSelectionEnd = selectionStart + alignFormatted.length;
        break;

      case 'replace':
        newValue = action.value || '';
        newSelectionStart = newSelectionEnd = newValue.length;
        break;
    }

    // 更新历史记录
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newValue);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    onChange(newValue);

    // 恢复选择
    setTimeout(() => {
      editor.focus();
      editor.setSelectionRange(newSelectionStart, newSelectionEnd);
    }, 0);
  }, [value, onChange, readOnly, history, historyIndex]);

  // 撤销/重做
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  }, [history, historyIndex, onChange]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      onChange(history[newIndex]);
    }
  }, [history, historyIndex, onChange]);

  // 插入链接
  const insertLink = useCallback(() => {
    const url = prompt('请输入链接地址:');
    const text = prompt('请输入链接文本:');
    if (url && text) {
      executeAction({ type: 'insert', action: 'link', value: `[${text}](${url})` });
    }
  }, [executeAction]);

  // 插入图片
  const insertImage = useCallback(() => {
    const url = prompt('请输入图片地址:');
    const alt = prompt('请输入图片描述:');
    if (url) {
      executeAction({ type: 'insert', action: 'image', value: `![${alt || '图片'}](${url})` });
    }
  }, [executeAction]);

  // 插入表格
  const insertTable = useCallback(() => {
    const tableMarkdown = `
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |
`;
    executeAction({ type: 'insert', action: 'table', value: tableMarkdown });
  }, [executeAction]);

  // 插入分割线
  const insertDivider = useCallback(() => {
    executeAction({ type: 'insert', action: 'divider', value: '\n---\n' });
  }, [executeAction]);

  // 上传文件处理
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 这里可以实现文件上传到服务器的逻辑
      // 目前只是插入一个占位符
      const fileName = file.name;
      const fileType = file.type.startsWith('image/') ? '图片' : '文件';
      executeAction({ type: 'insert', action: 'upload', value: `[${fileType}: ${fileName}](uploaded/${fileName})` });
    }
    event.target.value = ''; // 清空input
  }, [executeAction]);

  // 键盘快捷键
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeAction({ type: 'format', action: 'bold' });
          break;
        case 'i':
          e.preventDefault();
          executeAction({ type: 'format', action: 'italic' });
          break;
        case 'u':
          e.preventDefault();
          executeAction({ type: 'format', action: 'underline' });
          break;
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
          break;
        case 'Enter':
          if (e.shiftKey) {
            e.preventDefault();
            setIsFullscreen(!isFullscreen);
          }
          break;
        case 's':
          e.preventDefault();
          onSave?.();
          break;
      }
    }

    // Tab缩进
    if (e.key === 'Tab') {
      e.preventDefault();
      executeAction({ type: 'insert', action: 'tab', value: '  ' });
    }
  }, [executeAction, undo, redo, isFullscreen, onSave]);

  // 更新字数统计
  const updateWordCount = useCallback((text: string) => {
    const characters = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    setWordCount({ characters, words, lines });
  }, []);

  // 监听内容变化，更新字数统计
  useEffect(() => {
    updateWordCount(value);
  }, [value, updateWordCount]);

  // 自动聚焦
  useEffect(() => {
    if (autoFocus && editorRef.current) {
      editorRef.current.focus();
    }
  }, [autoFocus]);

  // 工具栏按钮组
  const toolbarGroups: ToolbarGroup[] = [
    {
      id: 'text-formatting',
      label: '文本格式',
      buttons: [
        { id: 'bold', action: 'bold', icon: Bold, title: 'Bold (Ctrl+B)', type: 'format' },
        { id: 'italic', action: 'italic', icon: Italic, title: 'Italic (Ctrl+I)', type: 'format' },
        { id: 'underline', action: 'underline', icon: Underline, title: 'Underline (Ctrl+U)', type: 'format' },
        { id: 'strikethrough', action: 'strikethrough', icon: Strikethrough, title: 'Strikethrough', type: 'format' }
      ]
    },
    {
      id: 'headings',
      label: '标题',
      buttons: [
        { id: 'h1', action: 'heading', icon: Hash, title: 'Heading 1', type: 'heading', level: 1 },
        { id: 'h2', action: 'heading', icon: Hash, title: 'Heading 2', type: 'heading', level: 2 },
        { id: 'h3', action: 'heading', icon: Hash, title: 'Heading 3', type: 'heading', level: 3 }
      ]
    },
    {
      id: 'lists',
      label: '列表',
      buttons: [
        { id: 'list', action: 'list', icon: List, title: 'Bullet List', type: 'format' },
        { id: 'orderedList', action: 'orderedList', icon: ListOrdered, title: 'Numbered List', type: 'format' },
        { id: 'quote', action: 'quote', icon: Quote, title: 'Quote', type: 'format' }
      ]
    },
    {
      id: 'insert',
      label: '插入',
      buttons: [
        { id: 'link', action: 'link', icon: Link, title: 'Insert Link', onClick: insertLink },
        { id: 'image', action: 'image', icon: Image, title: 'Insert Image', onClick: insertImage },
        { id: 'table', action: 'table', icon: Table, title: 'Insert Table', onClick: insertTable },
        { id: 'divider', action: 'divider', icon: Minus, title: 'Insert Divider', onClick: insertDivider },
        { id: 'code', action: 'code', icon: Code, title: 'Code', type: 'format' }
      ]
    },
    {
      id: 'align',
      label: '对齐',
      buttons: [
        { id: 'alignLeft', action: 'alignLeft', icon: AlignLeft, title: 'Align Left', type: 'align' },
        { id: 'alignCenter', action: 'alignCenter', icon: AlignCenter, title: 'Align Center', type: 'align' },
        { id: 'alignRight', action: 'alignRight', icon: AlignRight, title: 'Align Right', type: 'align' }
      ]
    },
    {
      id: 'history',
      label: '历史',
      buttons: [
        { id: 'undo', action: 'undo', icon: Undo, title: 'Undo (Ctrl+Z)', onClick: undo, disabled: historyIndex <= 0 },
        { id: 'redo', action: 'redo', icon: Redo, title: 'Redo (Ctrl+Shift+Z)', onClick: redo, disabled: historyIndex >= history.length - 1 }
      ]
    }
  ];

  return (
    <div className={`flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border border-gray-200 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${className}`}>
      {/* 工具栏 */}
      {showToolbar && (
        <div className={`px-4 py-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border-b border-gray-200`}>
          {/* 顶部工具栏 */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {/* 保存按钮 */}
              {onSave && (
                <button
                  onClick={onSave}
                  className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 hover:text-gray-900"
                  title="Save (Ctrl+S)"
                >
                  <Save className="h-4 w-4" />
                </button>
              )}
              
              {/* 文件上传 */}
              <label className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 hover:text-gray-900 cursor-pointer" title="Upload File">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
              </label>
              
              {/* 字体大小控制 */}
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500">字体:</span>
                <select
                  value={currentFontSize}
                  onChange={(e) => setCurrentFontSize(Number(e.target.value))}
                  className="text-xs border border-gray-300 rounded px-1 py-0.5"
                >
                  {[12, 14, 16, 18, 20, 24, 28, 32].map(size => (
                    <option key={size} value={size}>{size}px</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-500">
                {wordCount.words} 词 · {wordCount.characters} 字符
              </div>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700 hover:text-gray-900"
                title={isFullscreen ? 'Exit Fullscreen (Ctrl+Shift+Enter)' : 'Fullscreen (Ctrl+Shift+Enter)'}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          {/* 格式化工具栏 */}
          <div className="flex items-center flex-wrap gap-1">
            {toolbarGroups.map((group, groupIndex) => (
              <React.Fragment key={group.id}>
                {groupIndex > 0 && <div className="w-px h-6 bg-gray-300 mx-1" />}
                <div className="flex items-center space-x-1">
                  {group.buttons.map((button) => {
                    const Icon = button.icon;
                    const isDisabled = button.disabled;
                    const isActive = activeFormats.includes(button.id);
                    
                    return (
                      <button
                        key={button.id}
                        title={button.title}
                        disabled={isDisabled || readOnly}
                        onClick={button.onClick || (() => {
                          const action: EditorAction = {
                            type: button.type || 'format',
                            action: button.action,
                            level: button.level
                          };
                          executeAction(action);
                        })}
                        className={`p-1.5 rounded transition-colors ${
                          isDisabled 
                            ? 'opacity-50 cursor-not-allowed' 
                            : isActive
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-200'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* 编辑器 */}
      <div className="flex-1 relative">
        <textarea
          ref={editorRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onSelect={handleSelectionChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full h-full p-4 border-none resize-none focus:outline-none leading-relaxed ${
            theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'
          }`}
          style={{ 
            fontFamily: currentFontFamily === 'Inter' 
              ? 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              : '"JetBrains Mono", "Fira Code", Consolas, "Liberation Mono", Menlo, Courier, monospace',
            fontSize: `${currentFontSize}px`,
            lineHeight: '1.6',
            tabSize: 2,
            minHeight: `${minHeight}px`,
            maxHeight: maxHeight ? `${maxHeight}px` : 'none'
          }}
        />
      </div>

      {/* 状态栏 */}
      {showStatusBar && (
        <div className={`flex items-center justify-between px-4 py-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border-t border-gray-200 text-xs text-gray-500`}>
          <div className="flex items-center space-x-4">
            <span>行 {value.substring(0, selection.start).split('\n').length}</span>
            <span>列 {selection.start - value.lastIndexOf('\n', selection.start - 1)}</span>
            <span>选中 {selection.end - selection.start}</span>
            <span>字数 {wordCount.words}</span>
            <span>字符 {wordCount.characters}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Markdown</span>
            <span>UTF-8</span>
            <span className={`w-2 h-2 rounded-full ${
              readOnly ? 'bg-gray-400' : 'bg-green-400'
            }`} title={readOnly ? '只读模式' : '编辑模式'}></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedRichTextEditor;
export type { EnhancedRichTextEditorProps, EditorAction, ToolbarGroup, ToolbarButton };