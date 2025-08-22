import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useWritingFlow } from '@/contexts/WritingFlowContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Plus, 
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Edit,
  ChevronRight,
  ChevronDown,
  Target,
  BookOpen,
  Hash,
  GripVertical,
  Download,
  Settings,
  HelpCircle,
  BarChart3,
  Zap,
  Check,
  Lock,
  Unlock,
  Info,
  MoreHorizontal,
  Edit3,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 数据模型类型定义
type NodeId = string;
type OutlineNode = {
  id: NodeId;
  level: 1 | 2;
  order: number;
  number: string;
  title: string;
  summary?: string;
  estWords: number;
  locked?: boolean;
  children?: OutlineNode[];
  expanded?: boolean;
};

type OutlineDoc = {
  version: 'v1' | 'v2' | 'custom';
  targetWords: number;
  nodes: OutlineNode[];
};

// Zod 验证架构
const OutlineNodeZ = z.object({
  id: z.string(),
  level: z.union([z.literal(1), z.literal(2)]),
  order: z.number().int().min(0),
  number: z.string().regex(/^\d+(\.\d+)?$/),
  title: z.string().min(3, '标题至少3个字符').max(120, '标题不能超过120个字符'),
  summary: z.string().max(200, '简介不能超过200个字符').optional(),
  estWords: z.number().int().min(50, '至少50字').max(6000, '不能超过6000字'),
  locked: z.boolean().optional(),
  children: z.lazy(() => z.array(OutlineNodeZ)).optional(),
  expanded: z.boolean().optional()
});

const OutlineDocZ = z.object({
  version: z.enum(['v1','v2','custom']),
  targetWords: z.number().int().min(300).max(20000),
  nodes: z.array(OutlineNodeZ).min(3, '至少需要3个顶层章节')
});

// 模板构建函数
const buildTemplateV1 = (targetWords: number): OutlineNode[] => {
  const distribution = {
    introduction: 0.12,
    literature: 0.25,
    methodology: 0.20,
    results: 0.25,
    discussion: 0.13,
    conclusion: 0.05
  };

  return [
    {
      id: 'intro',
      level: 1 as const,
      order: 1,
      number: '1',
      title: '引言',
      summary: '研究背景、问题陈述和研究目标',
      estWords: Math.round(targetWords * distribution.introduction),
      children: [
        {
          id: 'intro-bg',
          level: 2 as const,
          order: 1,
          number: '1.1',
          title: '研究背景',
          summary: '领域现状和研究动机',
          estWords: Math.round(targetWords * distribution.introduction * 0.4)
        },
        {
          id: 'intro-problem',
          level: 2 as const,
          order: 2,
          number: '1.2',
          title: '问题陈述',
          summary: '待解决的核心问题',
          estWords: Math.round(targetWords * distribution.introduction * 0.6)
        }
      ],
      expanded: true
    },
    {
      id: 'literature',
      level: 1 as const,
      order: 2,
      number: '2',
      title: '文献综述',
      summary: '相关研究回顾和理论框架',
      estWords: Math.round(targetWords * distribution.literature),
      children: [
        {
          id: 'lit-theory',
          level: 2 as const,
          order: 1,
          number: '2.1',
          title: '理论基础',
          summary: '核心理论和概念框架',
          estWords: Math.round(targetWords * distribution.literature * 0.5)
        },
        {
          id: 'lit-related',
          level: 2 as const,
          order: 2,
          number: '2.2',
          title: '相关研究',
          summary: '现有研究成果分析',
          estWords: Math.round(targetWords * distribution.literature * 0.5)
        }
      ],
      expanded: true
    },
    {
      id: 'methodology',
      level: 1 as const,
      order: 3,
      number: '3',
      title: '研究方法',
      summary: '研究设计、数据收集和分析方法',
      estWords: Math.round(targetWords * distribution.methodology),
      children: [
        {
          id: 'method-design',
          level: 2 as const,
          order: 1,
          number: '3.1',
          title: '研究设计',
          summary: '整体研究框架和流程',
          estWords: Math.round(targetWords * distribution.methodology * 0.6)
        },
        {
          id: 'method-data',
          level: 2 as const,
          order: 2,
          number: '3.2',
          title: '数据收集',
          summary: '数据来源和收集方法',
          estWords: Math.round(targetWords * distribution.methodology * 0.4)
        }
      ],
      expanded: true
    },
    {
      id: 'results',
      level: 1 as const,
      order: 4,
      number: '4',
      title: '结果与分析',
      summary: '研究发现和数据分析结果',
      estWords: Math.round(targetWords * distribution.results),
      children: [
        {
          id: 'results-findings',
          level: 2 as const,
          order: 1,
          number: '4.1',
          title: '主要发现',
          summary: '核心研究结果展示',
          estWords: Math.round(targetWords * distribution.results * 0.7)
        },
        {
          id: 'results-analysis',
          level: 2 as const,
          order: 2,
          number: '4.2',
          title: '深入分析',
          summary: '结果的详细解读',
          estWords: Math.round(targetWords * distribution.results * 0.3)
        }
      ],
      expanded: true
    },
    {
      id: 'discussion',
      level: 1 as const,
      order: 5,
      number: '5',
      title: '讨论',
      summary: '结果解释、局限性和影响',
      estWords: Math.round(targetWords * distribution.discussion),
      children: [
        {
          id: 'disc-interpret',
          level: 2 as const,
          order: 1,
          number: '5.1',
          title: '结果解释',
          summary: '发现的意义和影响',
          estWords: Math.round(targetWords * distribution.discussion * 0.7)
        },
        {
          id: 'disc-limits',
          level: 2 as const,
          order: 2,
          number: '5.2',
          title: '研究局限',
          summary: '方法和结果的局限性',
          estWords: Math.round(targetWords * distribution.discussion * 0.3)
        }
      ],
      expanded: true
    },
    {
      id: 'conclusion',
      level: 1 as const,
      order: 6,
      number: '6',
      title: '结论',
      summary: '研究总结和未来展望',
      estWords: Math.round(targetWords * distribution.conclusion),
      children: [
        {
          id: 'conc-summary',
          level: 2 as const,
          order: 1,
          number: '6.1',
          title: '研究总结',
          summary: '主要贡献和发现',
          estWords: Math.round(targetWords * distribution.conclusion * 0.7)
        },
        {
          id: 'conc-future',
          level: 2 as const,
          order: 2,
          number: '6.2',
          title: '未来研究',
          summary: '后续研究方向',
          estWords: Math.round(targetWords * distribution.conclusion * 0.3)
        }
      ],
      expanded: true
    }
  ];
};

const buildTemplateV2 = (targetWords: number): OutlineNode[] => {
  const distribution = {
    abstract: 0.05,
    introduction: 0.15,
    background: 0.20,
    methods: 0.25,
    findings: 0.20,
    implications: 0.10,
    conclusion: 0.05
  };

  return [
    {
      id: 'abstract',
      level: 1 as const,
      order: 1,
      number: '1',
      title: '摘要',
      summary: '研究概要和主要发现',
      estWords: Math.round(targetWords * distribution.abstract),
      children: []
    },
    {
      id: 'introduction',
      level: 1 as const,
      order: 2,
      number: '2',
      title: '引言',
      summary: '研究背景和目标',
      estWords: Math.round(targetWords * distribution.introduction),
      children: [
        {
          id: 'intro-context',
          level: 2 as const,
          order: 1,
          number: '2.1',
          title: '研究背景',
          summary: '问题的重要性和现实意义',
          estWords: Math.round(targetWords * distribution.introduction * 0.6)
        },
        {
          id: 'intro-objectives',
          level: 2 as const,
          order: 2,
          number: '2.2',
          title: '研究目标',
          summary: '具体的研究问题和假设',
          estWords: Math.round(targetWords * distribution.introduction * 0.4)
        }
      ],
      expanded: true
    },
    {
      id: 'background',
      level: 1 as const,
      order: 3,
      number: '3',
      title: '理论背景',
      summary: '相关理论和前期研究',
      estWords: Math.round(targetWords * distribution.background),
      children: [
        {
          id: 'bg-theory',
          level: 2 as const,
          order: 1,
          number: '3.1',
          title: '理论框架',
          summary: '支撑研究的核心理论',
          estWords: Math.round(targetWords * distribution.background * 0.5)
        },
        {
          id: 'bg-prior',
          level: 2 as const,
          order: 2,
          number: '3.2',
          title: '前期研究',
          summary: '相关领域的研究进展',
          estWords: Math.round(targetWords * distribution.background * 0.5)
        }
      ],
      expanded: true
    },
    {
      id: 'methods',
      level: 1 as const,
      order: 4,
      number: '4',
      title: '研究方法',
      summary: '研究设计和实施过程',
      estWords: Math.round(targetWords * distribution.methods),
      children: [
        {
          id: 'method-approach',
          level: 2 as const,
          order: 1,
          number: '4.1',
          title: '研究路径',
          summary: '总体研究策略和方法选择',
          estWords: Math.round(targetWords * distribution.methods * 0.4)
        },
        {
          id: 'method-procedure',
          level: 2 as const,
          order: 2,
          number: '4.2',
          title: '实施程序',
          summary: '具体的操作步骤和流程',
          estWords: Math.round(targetWords * distribution.methods * 0.6)
        }
      ],
      expanded: true
    },
    {
      id: 'findings',
      level: 1 as const,
      order: 5,
      number: '5',
      title: '研究发现',
      summary: '主要结果和关键发现',
      estWords: Math.round(targetWords * distribution.findings),
      children: [
        {
          id: 'find-primary',
          level: 2 as const,
          order: 1,
          number: '5.1',
          title: '核心发现',
          summary: '最重要的研究结果',
          estWords: Math.round(targetWords * distribution.findings * 0.7)
        },
        {
          id: 'find-secondary',
          level: 2 as const,
          order: 2,
          number: '5.2',
          title: '补充发现',
          summary: '其他有价值的观察',
          estWords: Math.round(targetWords * distribution.findings * 0.3)
        }
      ],
      expanded: true
    },
    {
      id: 'implications',
      level: 1 as const,
      order: 6,
      number: '6',
      title: '影响与启示',
      summary: '研究意义和实践价值',
      estWords: Math.round(targetWords * distribution.implications),
      children: [
        {
          id: 'impl-theoretical',
          level: 2 as const,
          order: 1,
          number: '6.1',
          title: '理论贡献',
          summary: '对学术理论的推进',
          estWords: Math.round(targetWords * distribution.implications * 0.5)
        },
        {
          id: 'impl-practical',
          level: 2 as const,
          order: 2,
          number: '6.2',
          title: '实践启示',
          summary: '对现实问题的指导意义',
          estWords: Math.round(targetWords * distribution.implications * 0.5)
        }
      ],
      expanded: true
    },
    {
      id: 'conclusion',
      level: 1 as const,
      order: 7,
      number: '7',
      title: '结论与展望',
      summary: '研究总结和后续方向',
      estWords: Math.round(targetWords * distribution.conclusion),
      children: []
    }
  ];
};

// 编号重新计算
const renumber = (nodes: OutlineNode[]): OutlineNode[] => {
  return nodes.map((node, index) => {
    const newNode = { ...node };
    newNode.order = index + 1;
    newNode.number = (index + 1).toString();
    
    if (newNode.children && newNode.children.length > 0) {
      newNode.children = newNode.children.map((child, childIndex) => ({
        ...child,
        order: childIndex + 1,
        number: `${index + 1}.${childIndex + 1}`
      }));
    }
    
    return newNode;
  });
};

// 大纲质量评估
const calculateOutlineQuality = (outline: OutlineDoc) => {
  const { nodes } = outline;
  
  // 覆盖度 - 检查必要章节的覆盖
  const requiredSections = ['引言', '文献', '方法', '结果', '讨论', '结论'];
  const presentSections = nodes.map(n => n.title.toLowerCase());
  const coverage = requiredSections.filter(req => 
    presentSections.some(present => present.includes(req.toLowerCase()))
  ).length;
  const coverageScore = Math.round((coverage / requiredSections.length) * 100);
  
  // 层级深度 - 检查二级节点的完整性
  let totalWithChildren = 0;
  let totalShouldHaveChildren = 0;
  nodes.forEach(node => {
    if (node.level === 1) {
      totalShouldHaveChildren++;
      if (node.children && node.children.length >= 2) {
        totalWithChildren++;
      }
    }
  });
  const depthScore = totalShouldHaveChildren > 0 ? Math.round((totalWithChildren / totalShouldHaveChildren) * 100) : 0;
  
  // 平衡度 - 字数分配的合理性
  const totalWords = nodes.reduce((sum, node) => {
    const nodeWords = node.estWords + (node.children?.reduce((childSum, child) => childSum + child.estWords, 0) || 0);
    return sum + nodeWords;
  }, 0);
  const variance = totalWords > 0 ? Math.abs(totalWords - outline.targetWords) / outline.targetWords : 1;
  const balanceScore = Math.round(Math.max(0, (1 - variance) * 100));
  
  // 可写性 - 标题完整性和内容描述
  let completeNodes = 0;
  const allNodes: OutlineNode[] = [];
  const collectNodes = (nodeList: OutlineNode[]) => {
    nodeList.forEach(node => {
      allNodes.push(node);
      if (node.children) {
        collectNodes(node.children);
      }
    });
  };
  collectNodes(nodes);
  
  allNodes.forEach(node => {
    if (node.title.trim() && node.summary && node.summary.trim()) {
      completeNodes++;
    }
  });
  const writabilityScore = allNodes.length > 0 ? Math.round((completeNodes / allNodes.length) * 100) : 0;
  
  return {
    覆盖度: coverageScore,
    层级深度: depthScore,
    平衡度: balanceScore,
    可写性: writabilityScore
  };
};

// 验证规则 - 保留建议但不阻止操作
const validateOutline = (outline: OutlineDoc) => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 基本检查：至少要有章节 - 这个仍然是必须的
  if (outline.nodes.length === 0) {
    errors.push('请添加至少1个章节');
  }
  
  // 基本标题检查 - 这个仍然是必须的
  const emptyTitles = outline.nodes.filter(node => !node.title.trim());
  if (emptyTitles.length > 0) {
    errors.push('请填写所有章节标题');
  }
  
  // 以下都改为建议（warnings），不会阻止用户继续
  
  // 检查顶层章节数量
  if (outline.nodes.length < 3) {
    warnings.push('建议至少添加3个顶层章节');
  }
  
  // 检查每个顶层章节的子章节
  outline.nodes.forEach((node, index) => {
    if (!node.children || node.children.length < 2) {
      warnings.push(`建议第${index + 1}章添加至少2个二级小节`);
    }
  });
  
  // 检查标题唯一性
  const titles = new Set<string>();
  const checkTitles = (nodes: OutlineNode[]) => {
    nodes.forEach(node => {
      if (titles.has(node.title)) {
        warnings.push(`标题"${node.title}"重复，建议修改`);
      }
      titles.add(node.title);
      if (node.children) {
        checkTitles(node.children);
      }
    });
  };
  checkTitles(outline.nodes);
  
  // 检查总字数
  const totalWords = outline.nodes.reduce((sum, node) => {
    const nodeWords = node.estWords + (node.children?.reduce((childSum, child) => childSum + child.estWords, 0) || 0);
    return sum + nodeWords;
  }, 0);
  
  const variance = Math.abs(totalWords - outline.targetWords) / outline.targetWords;
  if (variance > 0.1) {
    warnings.push(`总字数偏离目标较多（当前：${totalWords}，目标：${outline.targetWords}），建议调整`);
  }
  
  // 检查结构完整性
  const requiredSections = ['引言', '文献', '方法', '结果', '讨论', '结论'];
  const presentSections = outline.nodes.map(n => n.title.toLowerCase());
  const missingSections = requiredSections.filter(req => 
    !presentSections.some(present => present.includes(req.toLowerCase()))
  );
  
  if (missingSections.length > 2) {
    warnings.push(`建议补充章节：${missingSections.join('、')}`);
  }
  
  return {
    isValid: errors.length === 0, // 只有真正的错误才阻止继续
    errors,
    warnings,
    hasWarnings: warnings.length > 0
  };
};

// 可拖拽的大纲项组件
const SortableOutlineNode: React.FC<{
  node: OutlineNode;
  onEdit: (id: string, field: keyof OutlineNode, value: any) => void;
  onDelete: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onAddChild: (parentId: string) => void;
  onToggleLock: (id: string) => void;
  selectedId?: string;
  onSelect: (id: string) => void;
}> = ({ 
  node, 
  onEdit, 
  onDelete, 
  onToggleExpand, 
  onAddChild, 
  onToggleLock,
  selectedId, 
  onSelect 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.title);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      onEdit(node.id, 'title', editValue.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditValue(node.title);
      setIsEditing(false);
    }
  };

  const isSelected = selectedId === node.id;

  return (
    <div ref={setNodeRef} style={style} className="space-y-2">
      {/* 主节点 */}
      <div 
        className={cn(
          "group flex items-start gap-3 rounded-xl px-3 py-2 hover:bg-[#F6F7FB] transition-colors",
          isSelected ? "bg-purple-50" : "",
          node.level === 1 ? "ml-0" : "ml-6"
        )}
        onClick={() => onSelect(node.id)}
      >
        {/* 序号 */}
        <div className="text-[#6E5BFF] font-medium w-10 shrink-0">
          <span className="text-sm">{node.number}</span>
        </div>
        
        {/* 折叠按钮（仅一级节点） */}
        {node.level === 1 && node.children && node.children.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className="h-6 w-6 p-0 shrink-0"
          >
            {node.expanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </Button>
        )}
        
        {/* 标题编辑 */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyPress}
              className="h-8 text-sm"
              autoFocus
            />
          ) : (
            <div className="space-y-1">
              <h4 className="text-[#2A3241] font-semibold truncate">{node.title}</h4>
              {node.summary && (
                <p className="text-[#5B667A] text-sm line-clamp-1">{node.summary}</p>
              )}
              <div className="text-xs text-[#5B667A]">
                <span>~{node.estWords} words</span>
                {node.children && node.children.length > 0 && (
                  <span> · {node.children.length} subsections</span>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* 操作按钮 */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="h-6 w-6 p-0"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
          
          {node.level === 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(node.id);
              }}
              className="h-6 w-6 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          )}
          
          {/* 溢出菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="h-6 w-6 p-0"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {node.level === 1 && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    // Dispatch event to open Agent for this chapter
                    window.dispatchEvent(new CustomEvent('openAgentForChapter', {
                      detail: { 
                        chapterId: node.id, 
                        chapterTitle: node.title,
                        chapterNumber: node.number
                      }
                    }));
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  用 Agent 重构此章
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(node.id);
                }}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* 拖拽把手 */}
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
            <GripVertical className="h-3 w-3 text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* 子节点 */}
      {node.expanded && node.children && node.children.length > 0 && (
        <div className="ml-4 space-y-1">
          {node.children.map((child) => (
            <SortableOutlineNode
              key={child.id}
              node={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleExpand={onToggleExpand}
              onAddChild={onAddChild}
              onToggleLock={onToggleLock}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const OutlineStep: React.FC = () => {
  const { project, setOutline: setProjectOutline, setCurrentStep, completeStep } = useWritingFlow();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // 从项目中获取目标字数
  const targetWords = project.topic?.wordLimit || 5000;
  
  // 状态管理
  const [outline, setOutline] = useState<OutlineDoc>({
    version: 'custom',
    targetWords,
    nodes: []
  });
  
  const [selectedNodeId, setSelectedNodeId] = useState<string>();
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // DnD 传感器
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  // 从localStorage恢复
  useEffect(() => {
    const saved = sessionStorage.getItem('writing-flow:outline');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setOutline(data);
      } catch (error) {
        console.error('Failed to load outline from storage:', error);
      }
    } else {
      // 如果没有保存的数据，使用模板
      setOutline({
        version: 'v1',
        targetWords,
        nodes: buildTemplateV1(targetWords)
      });
    }
  }, [targetWords]);
  
  // 自动保存
  useEffect(() => {
    if (outline.nodes.length > 0) {
      sessionStorage.setItem('writing-flow:outline', JSON.stringify(outline));
    }
  }, [outline]);
  
  // 验证结果
  const validation = useMemo(() => validateOutline(outline), [outline]);
  
  // 质量评分
  const qualityScores = useMemo(() => calculateOutlineQuality(outline), [outline]);
  const averageScore = Object.values(qualityScores).reduce((a, b) => a + b, 0) / 4;
  
  // 总字数计算
  const totalWords = useMemo(() => {
    return outline.nodes.reduce((sum, node) => {
      const nodeWords = node.estWords + (node.children?.reduce((childSum, child) => childSum + child.estWords, 0) || 0);
      return sum + nodeWords;
    }, 0);
  }, [outline.nodes]);
  
  // 处理版本切换
  const handleVersionChange = (version: 'v1' | 'v2' | 'custom') => {
    if (version === 'custom') return;
    
    let newNodes: OutlineNode[];
    if (version === 'v1') {
      newNodes = buildTemplateV1(targetWords);
    } else {
      newNodes = buildTemplateV2(targetWords);
    }
    
    setOutline({
      ...outline,
      version,
      nodes: newNodes
    });
    
    toast({
      title: "模板已应用",
      description: `已切换到${version === 'v1' ? '标准学术' : '研究报告'}模板`
    });
  };
  
  // 节点操作
  const handleEditNode = (id: string, field: keyof OutlineNode, value: any) => {
    const updateNodes = (nodes: OutlineNode[]): OutlineNode[] => {
      return nodes.map(node => {
        if (node.id === id) {
          const updatedNode = { ...node, [field]: value };
          // 如果是custom版本，标记为已修改
          if (outline.version !== 'custom') {
            setOutline(prev => ({ ...prev, version: 'custom' }));
          }
          return updatedNode;
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };
    
    setOutline(prev => ({
      ...prev,
      nodes: updateNodes(prev.nodes)
    }));
  };
  
  const handleDeleteNode = (id: string) => {
    const removeFromNodes = (nodes: OutlineNode[]): OutlineNode[] => {
      return nodes.filter(node => {
        if (node.id === id) return false;
        if (node.children) {
          node.children = removeFromNodes(node.children);
        }
        return true;
      });
    };
    
    const newNodes = renumber(removeFromNodes(outline.nodes));
    setOutline(prev => ({
      ...prev,
      version: 'custom',
      nodes: newNodes
    }));
  };
  
  const handleToggleExpand = (id: string) => {
    handleEditNode(id, 'expanded', !outline.nodes.find(n => n.id === id)?.expanded);
  };
  
  const handleAddChild = (parentId: string) => {
    const addChildToNodes = (nodes: OutlineNode[]): OutlineNode[] => {
      return nodes.map(node => {
        if (node.id === parentId) {
          const childOrder = (node.children?.length || 0) + 1;
          const newChild: OutlineNode = {
            id: `${parentId}-child-${Date.now()}`,
            level: 2,
            order: childOrder,
            number: `${node.number}.${childOrder}`,
            title: `新建小节 ${childOrder}`,
            summary: '',
            estWords: 400
          };
          
          return {
            ...node,
            children: [...(node.children || []), newChild],
            expanded: true
          };
        }
        return node;
      });
    };
    
    setOutline(prev => ({
      ...prev,
      version: 'custom',
      nodes: addChildToNodes(prev.nodes)
    }));
  };
  
  const handleToggleLock = (id: string) => {
    handleEditNode(id, 'locked', !outline.nodes.find(n => n.id === id)?.locked);
  };
  
  const handleAddChapter = () => {
    const newChapter: OutlineNode = {
      id: `chapter-${Date.now()}`,
      level: 1,
      order: outline.nodes.length + 1,
      number: (outline.nodes.length + 1).toString(),
      title: `新建章节 ${outline.nodes.length + 1}`,
      summary: '',
      estWords: 800,
      children: [
        {
          id: `section-${Date.now()}-1`,
          level: 2,
          order: 1,
          number: `${outline.nodes.length + 1}.1`,
          title: '小节1',
          summary: '',
          estWords: 400
        },
        {
          id: `section-${Date.now()}-2`,
          level: 2,
          order: 2,
          number: `${outline.nodes.length + 1}.2`,
          title: '小节2',
          summary: '',
          estWords: 400
        }
      ],
      expanded: true
    };
    
    setOutline(prev => ({
      ...prev,
      version: 'custom',
      nodes: [...prev.nodes, newChapter]
    }));
  };
  
  // 一键完成大纲功能
  const handleQuickComplete = () => {
    const quickOutline: OutlineDoc = {
      version: 'custom',
      targetWords,
      nodes: [
        {
          id: 'quick-intro',
          level: 1,
          order: 1,
          number: '1',
          title: '引言',
          summary: '研究背景和目标',
          estWords: Math.round(targetWords * 0.15),
          children: [
            {
              id: 'quick-intro-1',
              level: 2,
              order: 1,
              number: '1.1',
              title: '研究背景',
              summary: '问题的重要性',
              estWords: Math.round(targetWords * 0.08)
            },
            {
              id: 'quick-intro-2',
              level: 2,
              order: 2,
              number: '1.2',
              title: '研究目标',
              summary: '具体目标和假设',
              estWords: Math.round(targetWords * 0.07)
            }
          ],
          expanded: true
        },
        {
          id: 'quick-main',
          level: 1,
          order: 2,
          number: '2',
          title: '主要内容',
          summary: '核心研究内容',
          estWords: Math.round(targetWords * 0.70),
          children: [
            {
              id: 'quick-main-1',
              level: 2,
              order: 1,
              number: '2.1',
              title: '第一部分',
              summary: '主要观点和论证',
              estWords: Math.round(targetWords * 0.35)
            },
            {
              id: 'quick-main-2',
              level: 2,
              order: 2,
              number: '2.2',
              title: '第二部分',
              summary: '支撑论据和分析',
              estWords: Math.round(targetWords * 0.35)
            }
          ],
          expanded: true
        },
        {
          id: 'quick-conclusion',
          level: 1,
          order: 3,
          number: '3',
          title: '结论',
          summary: '研究总结和展望',
          estWords: Math.round(targetWords * 0.15),
          children: [
            {
              id: 'quick-conc-1',
              level: 2,
              order: 1,
              number: '3.1',
              title: '主要发现',
              summary: '研究的核心贡献',
              estWords: Math.round(targetWords * 0.10)
            },
            {
              id: 'quick-conc-2',
              level: 2,
              order: 2,
              number: '3.2',
              title: '未来展望',
              summary: '后续研究方向',
              estWords: Math.round(targetWords * 0.05)
            }
          ],
          expanded: true
        }
      ]
    };
    
    setOutline(quickOutline);
    
    toast({
      title: "大纲自动完成！",
      description: "已生成基础大纲结构，您可以直接进入下一步或继续编辑"
    });
  };

  // AI助手功能
  const handleStructureHelp = () => {
    toast({
      title: "结构建议",
      description: "基于您的主题和研究方向，建议采用经典的学术论文结构..."
    });
  };
  
  const handleAddSections = () => {
    toast({
      title: "智能补充",
      description: "正在分析您的大纲，为缺失的部分添加建议章节..."
    });
  };
  
  const handleBalanceContent = () => {
    // 重新分配字数，但保留锁定的节点
    const redistributeWords = (nodes: OutlineNode[], totalTarget: number): OutlineNode[] => {
      const lockedWords = nodes.reduce((sum, node) => {
        if (node.locked) return sum + node.estWords;
        if (node.children) {
          return sum + node.children.reduce((childSum, child) => 
            child.locked ? childSum + child.estWords : childSum, 0);
        }
        return sum;
      }, 0);
      
      const unlockedNodes = nodes.filter(n => !n.locked).length;
      const remainingWords = totalTarget - lockedWords;
      const avgPerNode = Math.round(remainingWords / Math.max(unlockedNodes, 1));
      
      return nodes.map(node => {
        if (node.locked) return node;
        
        const newNode = { ...node };
        if (!node.locked) {
          newNode.estWords = avgPerNode;
        }
        
        if (newNode.children) {
          const childLockedWords = newNode.children.reduce((sum, child) => 
            child.locked ? sum + child.estWords : sum, 0);
          const unlockedChildren = newNode.children.filter(c => !c.locked).length;
          const childRemaining = newNode.estWords - childLockedWords;
          const avgPerChild = Math.round(childRemaining / Math.max(unlockedChildren, 1));
          
          newNode.children = newNode.children.map(child => 
            child.locked ? child : { ...child, estWords: avgPerChild });
        }
        
        return newNode;
      });
    };
    
    setOutline(prev => ({
      ...prev,
      version: 'custom',
      nodes: redistributeWords(prev.nodes, prev.targetWords)
    }));
    
    toast({
      title: "内容已平衡",
      description: "已根据目标字数重新分配各章节字数"
    });
  };
  
  // 导出功能
  const handleExport = (format: 'markdown' | 'docx' | 'json') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(outline, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'outline.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else {
      toast({
        title: "导出功能",
        description: `${format.toUpperCase()} 导出功能开发中...`
      });
    }
  };
  
  // 拖拽处理
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (over && active.id !== over.id) {
      const oldIndex = outline.nodes.findIndex(node => node.id === active.id);
      const newIndex = outline.nodes.findIndex(node => node.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedNodes = arrayMove(outline.nodes, oldIndex, newIndex);
        setOutline(prev => ({
          ...prev,
          version: 'custom',
          nodes: renumber(reorderedNodes)
        }));
      }
    }
  };
  
  // 提交处理
  const handleContinue = () => {
    if (!validation.isValid) {
      toast({
        title: "大纲验证失败",
        description: validation.errors[0],
        variant: "destructive"
      });
      return;
    }
    
    // 保存到项目
    setProjectOutline(outline.nodes);
    
    // 标记步骤完成
    completeStep('outline');
    
    // 导航到内容页
    navigate('/writing-flow/content');
    
    toast({
      title: "大纲已完成",
      description: "正在进入内容编写阶段..."
    });
  };

  // 计算缺失的模块
  const requiredSections = ['引言', '文献', '方法', '结果', '讨论', '结论'];
  const presentSections = outline.nodes.map(n => n.title.toLowerCase());
  const missingSections = requiredSections.filter(req => 
    !presentSections.some(present => present.includes(req.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F7F8FB]">
      <div className="max-w-[1120px] mx-auto px-4 md:px-6 space-y-6 py-8">
        
        {/* 页面标题 */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#6E5BFF] text-white">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold text-gray-900">论文大纲</h1>
              <p className="text-[#5B667A]">构建清晰的文章结构框架</p>
            </div>
          </div>
        </div>

        {/* 顶部信息条 */}
        <Card className="bg-white border-[#EEF0F4] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-4 flex-1">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">大纲优化建议</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#5B667A]">
                    <div>
                      <span className="font-medium">总字数：</span>
                      <span>目标 {targetWords} · 当前 {totalWords}</span>
                      {Math.abs(totalWords - targetWords) > targetWords * 0.1 && (
                        <span className="text-yellow-600 ml-2">
                          ({totalWords > targetWords ? '超出' : '不足'} {Math.abs(totalWords - targetWords)})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">建议模块：</span>
                      <div className="flex items-center gap-1">
                        {requiredSections.map(section => {
                          const isPresent = presentSections.some(present => present.includes(section.toLowerCase()));
                          return (
                            <div key={section} className="flex items-center gap-1">
                              <span className={isPresent ? 'text-green-600' : 'text-gray-400'}>{section}</span>
                              {!isPresent && <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 错误提示 - 阻止继续 */}
        {!validation.isValid && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800 mb-2">必须完成以下项目</h3>
                  <ul className="space-y-1 text-sm text-red-700">
                    {validation.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* 建议提示 - 不阻止继续 */}
        {validation.hasWarnings && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-blue-800 mb-2">大纲优化建议</h3>
                  <ul className="space-y-1 text-sm text-blue-700">
                    {validation.warnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-blue-600 mt-2 font-medium">
                    💡 以上为优化建议，您可以直接进入下一步
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 指标卡 */}
        <Card className="bg-white border-[#EEF0F4] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-[#6E5BFF]" />
              <div>
                <CardTitle className="text-base font-semibold">质量评分</CardTitle>
                <CardDescription className="text-sm text-[#5B667A]">
                  评估大纲结构的四个核心维度
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {Object.entries(qualityScores).map(([key, score]) => (
                <div key={key} className="text-center">
                  <div className={cn(
                    "relative w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-sm font-medium",
                    score >= 80 ? "bg-green-100 text-green-700" :
                    score >= 60 ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  )}>
                    {score}
                    {score < 60 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-900">{key}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Progress value={averageScore} className="h-2" />
                </div>
                <span className="text-sm font-medium">{averageScore.toFixed(0)}%</span>
              </div>
              <p className="text-xs text-[#5B667A] text-center">
                目标 {targetWords} · 当前 {totalWords} · 
                {totalWords !== targetWords && (
                  <span className={totalWords > targetWords ? 'text-yellow-600' : 'text-blue-600'}>
                    预计差额 {totalWords > targetWords ? '+' : ''}{totalWords - targetWords}
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 布局容器 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* 主内容区 - 大纲卡 */}
          <div className="lg:col-span-3">
            <Card className="bg-white border-[#EEF0F4] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#6E5BFF]" />
                    <div>
                      <CardTitle className="text-base font-semibold">论文大纲</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Label className="text-sm font-medium">大纲模板</Label>
                        <Select value={outline.version} onValueChange={handleVersionChange}>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="v1">标准学术</SelectItem>
                            <SelectItem value="v2">研究报告</SelectItem>
                            <SelectItem value="custom">自定义</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* 导出按钮 */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full gap-2">
                          <Download className="h-4 w-4" />
                          导出
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleExport('markdown')}>
                          Markdown
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('docx')}>
                          Word 文档
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('json')}>
                          JSON 格式
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {/* AI助手功能菜单 */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full gap-2">
                          <Zap className="h-4 w-4" />
                          AI助手
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={handleQuickComplete}>
                          <Zap className="h-4 w-4 mr-2" />
                          一键完成大纲
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleStructureHelp}>
                          <HelpCircle className="h-4 w-4 mr-2" />
                          结构建议
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleAddSections}>
                          <Plus className="h-4 w-4 mr-2" />
                          智能补充
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleBalanceContent}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          平衡内容
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {/* 添加章节 */}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleAddChapter}
                      className="rounded-full gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      添加章节
                    </Button>
                    
                    {/* 设置按钮 */}
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 pt-0">
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={outline.nodes.map(n => n.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-1">
                      {outline.nodes.map((node) => (
                        <SortableOutlineNode
                          key={node.id}
                          node={node}
                          onEdit={handleEditNode}
                          onDelete={handleDeleteNode}
                          onToggleExpand={handleToggleExpand}
                          onAddChild={handleAddChild}
                          onToggleLock={handleToggleLock}
                          selectedId={selectedNodeId}
                          onSelect={setSelectedNodeId}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  
                  <DragOverlay>
                    {activeId ? (
                      <div className="p-3 bg-white shadow-lg border rounded-lg opacity-90">
                        <span className="font-medium">
                          {outline.nodes.find(n => n.id === activeId)?.title}
                        </span>
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
                
                {/* 空状态 */}
                {outline.nodes.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">开始构建大纲</h3>
                    <p className="text-gray-500 mb-6">选择一个选项来快速开始</p>
                    <div className="space-x-3 mb-4">
                      <Button 
                        onClick={handleQuickComplete}
                        className="rounded-full bg-[#6E5BFF] hover:bg-[#5B4FCC] text-white gap-2"
                      >
                        <Zap className="h-4 w-4" />
                        一键完成大纲
                      </Button>
                    </div>
                    <div className="space-x-3">
                      <Button variant="outline" onClick={() => handleVersionChange('v1')} className="rounded-full">
                        标准学术模板
                      </Button>
                      <Button variant="outline" onClick={() => handleVersionChange('v2')} className="rounded-full">
                        研究报告模板
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* 右栏 - 帮助卡 */}
          <div className="space-y-6">
            <Card className="bg-white border-[#EEF0F4] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-5 w-5 text-[#6E5BFF]" />
                  大纲编辑帮助
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-[#5B667A]">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6E5BFF] flex-shrink-0 mt-2"></div>
                  <p>点击章节标题可直接编辑，按Enter保存，Esc取消</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6E5BFF] flex-shrink-0 mt-2"></div>
                  <p>拖拽章节右侧的把手可调整顺序，系统会自动重新编号</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6E5BFF] flex-shrink-0 mt-2"></div>
                  <p>使用+按钮为一级章节添加二级小节，完善大纲层次</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6E5BFF] flex-shrink-0 mt-2"></div>
                  <p>AI助手可帮您一键完成、智能补充或平衡字数分配</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
        </div>
        
        {/* 底部操作条 */}
        <Card className="bg-white border-[#EEF0F4] rounded-2xl shadow-[0_6px_24px_rgba(15,23,42,0.06)]">
          <CardContent className="p-6 md:p-8">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => navigate('/writing-flow/strategy')}
                className="rounded-full gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                返回策略
              </Button>
              
              <div className="flex items-center gap-4">
                {validation.isValid && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">大纲验证通过</span>
                  </div>
                )}
                
                <Button
                  onClick={handleContinue}
                  disabled={!validation.isValid}
                  className="rounded-full px-8 py-3 bg-[#6E5BFF] hover:bg-[#5B4FCC] hover:shadow-lg hover:-translate-y-0.5 text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#6E5BFF] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none gap-2"
                >
                  进入内容编写
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
};

export default OutlineStep;