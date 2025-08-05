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
  Upload
} from 'lucide-react';

interface RichTextEditorProps {
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

const RichTextEditor: React.FC<RichTextEditorProps> = ({
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
        const headingSelectedText = currentValue.substring(selectionStart, selectionEnd);
        const lines = headingSelectedText ? [headingSelectedText] : ['标题'];
        formattedText = lines.map(line => `${headingPrefix} ${line}`).join('\n');
        newValue = currentValue.substring(0, selectionStart) + formattedText + currentValue.substring(selectionEnd);
        newSelectionEnd = selectionStart + formattedText.length;
        break;

      case 'align':
        // 对于文本对齐，我们使用HTML标签或特殊标记
        const alignSelectedText = currentValue.substring(selectionStart, selectionEnd);
        const alignTag = action.action === 'alignCenter' ? 'center' : action.action === 'alignRight' ? 'right' : 'left';
        formattedText = `<div align="${alignTag}">${alignSelectedText}</div>`;
        newValue = currentValue.substring(0, selectionStart) + formattedText + currentValue.substring(selectionEnd);
        newSelectionEnd = selectionStart + formattedText.length;
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
      }
    }

    // Tab缩进
    if (e.key === 'Tab') {
      e.preventDefault();
      executeAction({ type: 'insert', action: 'tab', value: '  ' });
    }
  }, [executeAction, undo, redo, isFullscreen]);

  // 自动聚焦
  useEffect(() => {
    if (autoFocus && editorRef.current) {
      editorRef.current.focus();
    }
  }, [autoFocus]);

  const toolbarButtons: Array<
    | { action: string; icon: React.ComponentType<{ className?: string }>; title: string; onClick?: () => void; disabled?: boolean }
    | { type: 'separator' }
  > = [
    { action: 'bold', icon: Bold, title: 'Bold (Ctrl+B)' },
    { action: 'italic', icon: Italic, title: 'Italic (Ctrl+I)' },
    { action: 'underline', icon: Underline, title: 'Underline (Ctrl+U)' },
    { type: 'separator' },
    { action: 'list', icon: List, title: 'Bullet List' },
    { action: 'orderedList', icon: ListOrdered, title: 'Numbered List' },
    { action: 'quote', icon: Quote, title: 'Quote' },
    { action: 'code', icon: Code, title: 'Code' },
    { type: 'separator' },
    { action: 'link', icon: Link, title: 'Insert Link', onClick: insertLink },
    { action: 'image', icon: Image, title: 'Insert Image', onClick: insertImage },
    { type: 'separator' },
    { action: 'undo', icon: Undo, title: 'Undo (Ctrl+Z)', onClick: undo, disabled: historyIndex <= 0 },
    { action: 'redo', icon: Redo, title: 'Redo (Ctrl+Shift+Z)', onClick: redo, disabled: historyIndex >= history.length - 1 }
  ];

  return (
    <div className={`flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${className}`}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-1">
          {toolbarButtons.map((button, index) => {
            if ('type' in button && button.type === 'separator') {
              return <div key={index} className="w-px h-6 bg-gray-300 mx-1" />;
            }

            // Type guard to ensure we have a proper button
            if ('action' in button) {
              const Icon = button.icon;
              const isDisabled = button.disabled;
              
              return (
                <button
                  key={button.action}
                  title={button.title}
                  disabled={isDisabled || readOnly}
                  onClick={button.onClick || (() => executeAction({ type: 'format', action: button.action }))}
                  className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            }
            
            return null;
          })}
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            {value.length} 字符
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
          className="w-full h-full min-h-[400px] p-4 border-none resize-none focus:outline-none text-base leading-relaxed font-mono"
          style={{ 
            fontFamily: '"JetBrains Mono", "Fira Code", Consolas, "Liberation Mono", Menlo, Courier, monospace',
            lineHeight: '1.6',
            tabSize: 2
          }}
        />
      </div>

      {/* 状态栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>行 {value.substring(0, selection.start).split('\n').length}</span>
          <span>列 {selection.start - value.lastIndexOf('\n', selection.start - 1)}</span>
          <span>选中 {selection.end - selection.start}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Markdown</span>
          <span>UTF-8</span>
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor;