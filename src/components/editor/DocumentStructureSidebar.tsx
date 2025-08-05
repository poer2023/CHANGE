import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Hash,
  List,
  Quote,
  Code,
  FileText,
  Search,
  Filter,
  Eye,
  EyeOff,
  MoreVertical,
  Edit3,
  Trash2
} from 'lucide-react';

interface DocumentNode {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'quote' | 'code' | 'table' | 'image';
  level?: number; // For headings (1-6)
  content: string;
  startIndex: number;
  endIndex: number;
  children?: DocumentNode[];
  isVisible?: boolean;
  isCollapsed?: boolean;
}

interface DocumentStructureSidebarProps {
  content: string;
  onNavigate: (startIndex: number, endIndex: number) => void;
  onEdit?: (nodeId: string, newContent: string) => void;
  onDelete?: (nodeId: string) => void;
  className?: string;
  theme?: 'light' | 'dark';
  showLineNumbers?: boolean;
  enableFiltering?: boolean;
}

const DocumentStructureSidebar: React.FC<DocumentStructureSidebarProps> = ({
  content,
  onNavigate,
  onEdit,
  onDelete,
  className = '',
  theme = 'light',
  showLineNumbers = true,
  enableFiltering = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // 解析文档结构
  const documentStructure = useMemo(() => {
    const parseMarkdown = (text: string): DocumentNode[] => {
      const lines = text.split('\n');
      const nodes: DocumentNode[] = [];
      let currentIndex = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const lineStartIndex = currentIndex;
        const lineEndIndex = currentIndex + line.length;
        currentIndex = lineEndIndex + 1; // +1 for newline

        // Skip empty lines
        if (!line.trim()) continue;

        // Heading
        const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
        if (headingMatch) {
          nodes.push({
            id: `heading-${i}`,
            type: 'heading',
            level: headingMatch[1].length,
            content: headingMatch[2].trim(),
            startIndex: lineStartIndex,
            endIndex: lineEndIndex,
            isVisible: true
          });
          continue;
        }

        // List item
        const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)/);
        if (listMatch) {
          const indent = listMatch[1].length;
          nodes.push({
            id: `list-${i}`,
            type: 'list',
            level: Math.floor(indent / 2) + 1,
            content: listMatch[3],
            startIndex: lineStartIndex,
            endIndex: lineEndIndex,
            isVisible: true
          });
          continue;
        }

        // Quote
        if (line.startsWith('>')) {
          const quoteContent = line.replace(/^>\s*/, '');
          nodes.push({
            id: `quote-${i}`,
            type: 'quote',
            content: quoteContent,
            startIndex: lineStartIndex,
            endIndex: lineEndIndex,
            isVisible: true
          });
          continue;
        }

        // Code block
        if (line.startsWith('```')) {
          const codeBlockEnd = lines.findIndex((l, idx) => idx > i && l.startsWith('```'));
          if (codeBlockEnd !== -1) {
            const codeContent = lines.slice(i + 1, codeBlockEnd).join('\n');
            const codeEndIndex = lines.slice(0, codeBlockEnd + 1).join('\n').length;
            nodes.push({
              id: `code-${i}`,
              type: 'code',
              content: codeContent.trim() || 'Code Block',
              startIndex: lineStartIndex,
              endIndex: codeEndIndex,
              isVisible: true
            });
            i = codeBlockEnd; // Skip to end of code block
            currentIndex = codeEndIndex + 1;
            continue;
          }
        }

        // Inline code
        if (line.includes('`') && !line.startsWith('```')) {
          nodes.push({
            id: `inline-code-${i}`,
            type: 'code',
            content: line.trim(),
            startIndex: lineStartIndex,
            endIndex: lineEndIndex,
            isVisible: true
          });
          continue;
        }

        // Table detection
        if (line.includes('|') && line.trim().startsWith('|')) {
          nodes.push({
            id: `table-${i}`,
            type: 'table',
            content: line.trim(),
            startIndex: lineStartIndex,
            endIndex: lineEndIndex,
            isVisible: true
          });
          continue;
        }

        // Image
        const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imageMatch) {
          nodes.push({
            id: `image-${i}`,
            type: 'image',
            content: imageMatch[1] || 'Image',
            startIndex: lineStartIndex,
            endIndex: lineEndIndex,
            isVisible: true
          });
          continue;
        }

        // Regular paragraph
        if (line.trim().length > 0) {
          nodes.push({
            id: `paragraph-${i}`,
            type: 'paragraph',
            content: line.trim(),
            startIndex: lineStartIndex,
            endIndex: lineEndIndex,
            isVisible: true
          });
        }
      }

      return nodes;
    };

    return parseMarkdown(content);
  }, [content]);

  // 构建层级结构
  const hierarchicalStructure = useMemo(() => {
    const buildHierarchy = (nodes: DocumentNode[]): DocumentNode[] => {
      const result: DocumentNode[] = [];
      const stack: DocumentNode[] = [];

      for (const node of nodes) {
        if (node.type === 'heading') {
          // Find the appropriate parent level
          while (stack.length > 0 && stack[stack.length - 1].level! >= node.level!) {
            stack.pop();
          }

          if (stack.length > 0) {
            const parent = stack[stack.length - 1];
            if (!parent.children) parent.children = [];
            parent.children.push(node);
          } else {
            result.push(node);
          }

          stack.push(node);
        } else {
          // Add non-heading nodes to the current level
          if (stack.length > 0) {
            const parent = stack[stack.length - 1];
            if (!parent.children) parent.children = [];
            parent.children.push(node);
          } else {
            result.push(node);
          }
        }
      }

      return result;
    };

    return buildHierarchy(documentStructure);
  }, [documentStructure]);

  // 过滤节点
  const filteredStructure = useMemo(() => {
    const filterNodes = (nodes: DocumentNode[]): DocumentNode[] => {
      return nodes.filter(node => {
        const matchesSearch = searchTerm === '' || 
          node.content.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filterTypes.length === 0 || 
          filterTypes.includes(node.type);

        const childrenMatch = node.children ? 
          filterNodes(node.children).length > 0 : false;

        return (matchesSearch && matchesFilter) || childrenMatch;
      }).map(node => ({
        ...node,
        children: node.children ? filterNodes(node.children) : undefined
      }));
    };

    return filterNodes(hierarchicalStructure);
  }, [hierarchicalStructure, searchTerm, filterTypes]);

  // 获取节点图标
  const getNodeIcon = (node: DocumentNode) => {
    switch (node.type) {
      case 'heading':
        return <Hash className="h-4 w-4 text-blue-600" />;
      case 'list':
        return <List className="h-4 w-4 text-green-600" />;
      case 'quote':
        return <Quote className="h-4 w-4 text-orange-600" />;
      case 'code':
        return <Code className="h-4 w-4 text-purple-600" />;
      case 'table':
        return <FileText className="h-4 w-4 text-indigo-600" />;
      case 'image':
        return <Eye className="h-4 w-4 text-pink-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  // 切换节点展开状态
  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // 处理节点点击
  const handleNodeClick = (node: DocumentNode) => {
    setSelectedNode(node.id);
    onNavigate(node.startIndex, node.endIndex);
  };

  // 切换过滤类型
  const toggleFilterType = (type: string) => {
    setFilterTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // 渲染节点
  const renderNode = (node: DocumentNode, depth: number = 0): React.ReactNode => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isSelected = selectedNode === node.id;

    return (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center space-x-2 px-2 py-1 rounded cursor-pointer transition-colors ${
            isSelected 
              ? theme === 'dark' ? 'bg-blue-900 text-blue-100' : 'bg-blue-100 text-blue-900'
              : theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => handleNodeClick(node)}
        >
          {/* 展开/收起按钮 */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNodeExpansion(node.id);
              }}
              className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          ) : (
            <div className="w-4" />
          )}

          {/* 节点图标 */}
          {getNodeIcon(node)}

          {/* 节点内容 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className={`text-sm truncate ${ 
                node.type === 'heading' ? 'font-semibold' : 'font-normal'
              }`}>
                {node.content}
              </span>
              
              {node.type === 'heading' && node.level && (
                <span className="text-xs text-gray-500 bg-gray-200 px-1 rounded">
                  H{node.level}
                </span>
              )}
            </div>
            
            {showLineNumbers && (
              <div className="text-xs text-gray-400">
                {Math.floor(node.startIndex / 50) + 1}:{node.startIndex % 50}
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newContent = prompt('编辑内容:', node.content);
                  if (newContent !== null) {
                    onEdit(node.id, newContent);
                  }
                }}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title="编辑"
              >
                <Edit3 className="h-3 w-3" />
              </button>
            )}
            
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('确定要删除此项吗？')) {
                    onDelete(node.id);
                  }
                }}
                className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-600 text-red-600"
                title="删除"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* 子节点 */}
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // 获取所有可用的节点类型
  const availableTypes = Array.from(new Set(documentStructure.map(node => node.type)));

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} ${className}`}>
      {/* 标题 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold">文档结构</h3>
        <div className="text-sm text-gray-500">
          {documentStructure.length} 项
        </div>
      </div>

      {/* 搜索和过滤 */}
      {enableFiltering && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 space-y-3">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          {/* 类型过滤 */}
          <div className="flex flex-wrap gap-1">
            {availableTypes.map(type => {
              const isActive = filterTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleFilterType(type)}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 文档结构树 */}
      <div className="flex-1 overflow-y-auto">
        {filteredStructure.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm || filterTypes.length > 0 ? '没有找到匹配的内容' : '文档为空'}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredStructure.map(node => renderNode(node))}
          </div>
        )}
      </div>

      {/* 统计信息 */}
      <div className={`p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="grid grid-cols-2 gap-2">
          <div>标题: {documentStructure.filter(n => n.type === 'heading').length}</div>
          <div>段落: {documentStructure.filter(n => n.type === 'paragraph').length}</div>
          <div>列表: {documentStructure.filter(n => n.type === 'list').length}</div>
          <div>代码块: {documentStructure.filter(n => n.type === 'code').length}</div>
        </div>
      </div>
    </div>
  );
};

export default DocumentStructureSidebar;
export type { DocumentNode, DocumentStructureSidebarProps };