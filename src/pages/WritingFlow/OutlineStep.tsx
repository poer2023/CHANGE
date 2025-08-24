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
import OutcomePanelCard from '@/components/WritingFlow/OutcomePanelCard';
import StepNav from '@/components/WritingFlow/StepNav';
import Gate1Modal from '@/components/Gate1Modal';
import DemoModeToggle from '@/components/DemoModeToggle';
import { useStep1, useEstimate, useAutopilot, useApp, useWritingFlow as useNewWritingFlow, usePayment, useDemoMode } from '@/state/AppContext';
import { lockPrice, createPaymentIntent, confirmPayment, startAutopilot as apiStartAutopilot, streamAutopilotProgress, track } from '@/services/pricing';
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
import { useTranslation } from '@/hooks/useTranslation';
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

// Template building functions
const buildTemplateV1 = (targetWords: number, t: (key: string) => string): OutlineNode[] => {
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
      title: t('outline.templates.intro.title'),
      summary: t('outline.templates.intro.summary'),
      estWords: Math.round(targetWords * distribution.introduction),
      children: [
        {
          id: 'intro-bg',
          level: 2 as const,
          order: 1,
          number: '1.1',
          title: t('outline.templates.intro.background.title'),
          summary: t('outline.templates.intro.background.summary'),
          estWords: Math.round(targetWords * distribution.introduction * 0.4)
        },
        {
          id: 'intro-problem',
          level: 2 as const,
          order: 2,
          number: '1.2',
          title: t('outline.templates.intro.problem.title'),
          summary: t('outline.templates.intro.problem.summary'),
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
      title: t('outline.templates.literature.title'),
      summary: t('outline.templates.literature.summary'),
      estWords: Math.round(targetWords * distribution.literature),
      children: [
        {
          id: 'lit-theory',
          level: 2 as const,
          order: 1,
          number: '2.1',
          title: t('outline.templates.literature.theory.title'),
          summary: t('outline.templates.literature.theory.summary'),
          estWords: Math.round(targetWords * distribution.literature * 0.5)
        },
        {
          id: 'lit-related',
          level: 2 as const,
          order: 2,
          number: '2.2',
          title: t('outline.templates.literature.related.title'),
          summary: t('outline.templates.literature.related.summary'),
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
      title: t('outline.templates.methodology.title'),
      summary: t('outline.templates.methodology.summary'),
      estWords: Math.round(targetWords * distribution.methodology),
      children: [
        {
          id: 'method-design',
          level: 2 as const,
          order: 1,
          number: '3.1',
          title: t('outline.templates.methodology.design.title'),
          summary: t('outline.templates.methodology.design.summary'),
          estWords: Math.round(targetWords * distribution.methodology * 0.6)
        },
        {
          id: 'method-data',
          level: 2 as const,
          order: 2,
          number: '3.2',
          title: t('outline.templates.methodology.data.title'),
          summary: t('outline.templates.methodology.data.summary'),
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
      title: t('outline.templates.results.title'),
      summary: t('outline.templates.results.summary'),
      estWords: Math.round(targetWords * distribution.results),
      children: [
        {
          id: 'results-findings',
          level: 2 as const,
          order: 1,
          number: '4.1',
          title: t('outline.templates.results.findings.title'),
          summary: t('outline.templates.results.findings.summary'),
          estWords: Math.round(targetWords * distribution.results * 0.7)
        },
        {
          id: 'results-analysis',
          level: 2 as const,
          order: 2,
          number: '4.2',
          title: t('outline.templates.results.analysis.title'),
          summary: t('outline.templates.results.analysis.summary'),
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
      title: t('outline.templates.discussion.title'),
      summary: t('outline.templates.discussion.summary'),
      estWords: Math.round(targetWords * distribution.discussion),
      children: [
        {
          id: 'disc-interpret',
          level: 2 as const,
          order: 1,
          number: '5.1',
          title: t('outline.templates.discussion.interpret.title'),
          summary: t('outline.templates.discussion.interpret.summary'),
          estWords: Math.round(targetWords * distribution.discussion * 0.7)
        },
        {
          id: 'disc-limits',
          level: 2 as const,
          order: 2,
          number: '5.2',
          title: t('outline.templates.discussion.limits.title'),
          summary: t('outline.templates.discussion.limits.summary'),
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
      title: t('outline.templates.conclusion.title'),
      summary: t('outline.templates.conclusion.summary'),
      estWords: Math.round(targetWords * distribution.conclusion),
      children: [
        {
          id: 'conc-summary',
          level: 2 as const,
          order: 1,
          number: '6.1',
          title: t('outline.templates.conclusion.summary_content.title'),
          summary: t('outline.templates.conclusion.summary_content.summary'),
          estWords: Math.round(targetWords * distribution.conclusion * 0.7)
        },
        {
          id: 'conc-future',
          level: 2 as const,
          order: 2,
          number: '6.2',
          title: t('outline.templates.conclusion.future.title'),
          summary: t('outline.templates.conclusion.future.summary'),
          estWords: Math.round(targetWords * distribution.conclusion * 0.3)
        }
      ],
      expanded: true
    }
  ];
};

const buildTemplateV2 = (targetWords: number, t: (key: string) => string): OutlineNode[] => {
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
      title: t('outline.templates.v2.abstract.title'),
      summary: t('outline.templates.v2.abstract.summary'),
      estWords: Math.round(targetWords * distribution.abstract),
      children: []
    },
    {
      id: 'introduction',
      level: 1 as const,
      order: 2,
      number: '2',
      title: t('outline.templates.v2.intro.title'),
      summary: t('outline.templates.v2.intro.summary'),
      estWords: Math.round(targetWords * distribution.introduction),
      children: [
        {
          id: 'intro-context',
          level: 2 as const,
          order: 1,
          number: '2.1',
          title: t('outline.templates.v2.intro.context.title'),
          summary: t('outline.templates.v2.intro.context.summary'),
          estWords: Math.round(targetWords * distribution.introduction * 0.6)
        },
        {
          id: 'intro-objectives',
          level: 2 as const,
          order: 2,
          number: '2.2',
          title: t('outline.templates.v2.intro.objectives.title'),
          summary: t('outline.templates.v2.intro.objectives.summary'),
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
      title: t('outline.templates.v2.background.title'),
      summary: t('outline.templates.v2.background.summary'),
      estWords: Math.round(targetWords * distribution.background),
      children: [
        {
          id: 'bg-theory',
          level: 2 as const,
          order: 1,
          number: '3.1',
          title: t('outline.templates.v2.background.theory.title'),
          summary: t('outline.templates.v2.background.theory.summary'),
          estWords: Math.round(targetWords * distribution.background * 0.5)
        },
        {
          id: 'bg-prior',
          level: 2 as const,
          order: 2,
          number: '3.2',
          title: t('outline.templates.v2.background.prior.title'),
          summary: t('outline.templates.v2.background.prior.summary'),
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
      title: t('outline.templates.v2.methods.title'),
      summary: t('outline.templates.v2.methods.summary'),
      estWords: Math.round(targetWords * distribution.methods),
      children: [
        {
          id: 'method-approach',
          level: 2 as const,
          order: 1,
          number: '4.1',
          title: t('outline.templates.v2.methods.approach.title'),
          summary: t('outline.templates.v2.methods.approach.summary'),
          estWords: Math.round(targetWords * distribution.methods * 0.4)
        },
        {
          id: 'method-procedure',
          level: 2 as const,
          order: 2,
          number: '4.2',
          title: t('outline.templates.v2.methods.procedure.title'),
          summary: t('outline.templates.v2.methods.procedure.summary'),
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
      title: t('outline.templates.v2.findings.title'),
      summary: t('outline.templates.v2.findings.summary'),
      estWords: Math.round(targetWords * distribution.findings),
      children: [
        {
          id: 'find-primary',
          level: 2 as const,
          order: 1,
          number: '5.1',
          title: t('outline.templates.v2.findings.primary.title'),
          summary: t('outline.templates.v2.findings.primary.summary'),
          estWords: Math.round(targetWords * distribution.findings * 0.7)
        },
        {
          id: 'find-secondary',
          level: 2 as const,
          order: 2,
          number: '5.2',
          title: t('outline.templates.v2.findings.secondary.title'),
          summary: t('outline.templates.v2.findings.secondary.summary'),
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
      title: t('outline.templates.v2.implications.title'),
      summary: t('outline.templates.v2.implications.summary'),
      estWords: Math.round(targetWords * distribution.implications),
      children: [
        {
          id: 'impl-theoretical',
          level: 2 as const,
          order: 1,
          number: '6.1',
          title: t('outline.templates.v2.implications.theoretical.title'),
          summary: t('outline.templates.v2.implications.theoretical.summary'),
          estWords: Math.round(targetWords * distribution.implications * 0.5)
        },
        {
          id: 'impl-practical',
          level: 2 as const,
          order: 2,
          number: '6.2',
          title: t('outline.templates.v2.implications.practical.title'),
          summary: t('outline.templates.v2.implications.practical.summary'),
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
      title: t('outline.templates.v2.conclusion.title'),
      summary: t('outline.templates.v2.conclusion.summary'),
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

// Outline quality assessment
const calculateOutlineQuality = (outline: OutlineDoc, t: (key: string) => string) => {
  const { nodes } = outline;
  
  // Coverage - check coverage of required sections
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
    [t('outline.quality.coverage')]: coverageScore,
    [t('outline.quality.depth')]: depthScore,
    [t('outline.quality.balance')]: balanceScore,
    [t('outline.quality.writability')]: writabilityScore
  };
};

// Validation rules - keep suggestions but don't block operations
const validateOutline = (outline: OutlineDoc, t: (key: string) => string) => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Basic check: at least have sections - this is still required
  if (outline.nodes.length === 0) {
    errors.push(t('outline.validation.add_chapter'));
  }
  
  // Basic title check - this is still required
  const emptyTitles = outline.nodes.filter(node => !node.title.trim());
  if (emptyTitles.length > 0) {
    errors.push(t('outline.validation.fill_titles'));
  }
  
  // 以下都改为建议（warnings），不会阻止用户继续
  
  // 检查顶层章节数量
  if (outline.nodes.length < 3) {
    warnings.push(t('outline.validation.suggest_min_chapters'));
  }
  
  // 检查每个顶层章节的子章节
  outline.nodes.forEach((node, index) => {
    if (!node.children || node.children.length < 2) {
      warnings.push(t('outline.validation.suggest_subsections').replace('{index}', (index + 1).toString()));
    }
  });
  
  // 检查标题唯一性
  const titles = new Set<string>();
  const checkTitles = (nodes: OutlineNode[]) => {
    nodes.forEach(node => {
      if (titles.has(node.title)) {
        warnings.push(t('outline.validation.suggest_modify_duplicate').replace('{title}', node.title));
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
    warnings.push(t('outline.validation.word_target_deviation').replace('{current}', totalWords.toString()).replace('{target}', outline.targetWords.toString()));
  }
  
  // 检查结构完整性
  const requiredSections = ['引言', '文献', '方法', '结果', '讨论', '结论'];
  const presentSections = outline.nodes.map(n => n.title.toLowerCase());
  const missingSections = requiredSections.filter(req => 
    !presentSections.some(present => present.includes(req.toLowerCase()))
  );
  
  if (missingSections.length > 2) {
    warnings.push(t('outline.validation.suggest_add_sections').replace('{sections}', missingSections.join('、')));
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
  const { t } = useTranslation();
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
        <div className="text-[#6A5AF9] font-medium w-10 shrink-0">
          <span className="text-sm">{node.number}</span>
        </div>
        
        {/* 折叠按钮（仅一级节点） */}
        {node.level === 1 && node.children && node.children.length > 0 && (
          <Button
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
                <span>~{node.estWords} {t('outline.words')}</span>
                {node.children && node.children.length > 0 && (
                  <span> · {node.children.length} {t('outline.subsections')}</span>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* 操作按钮 */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
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
                  {t('outline.ai_assist.restructure_chapter')}
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
                {t('outline.actions.delete')}
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
  const { t } = useTranslation();
  const { project, setOutline: setProjectOutline, setCurrentStep, completeStep } = useWritingFlow();
  const { track: trackEvent } = useApp();
  const { step1 } = useStep1();
  const { estimate, setEstimate } = useEstimate();
  const { autopilot, startAutopilot, minimizeAutopilot, pauseAutopilot, resumeAutopilot, stopAutopilot } = useAutopilot();
  const { writingFlow, updateMetrics, toggleAddon, setError } = useNewWritingFlow();
  const { pay, lockPrice: lockPriceState } = usePayment();
  const { demoMode } = useDemoMode();
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
  const [showGate1Modal, setShowGate1Modal] = useState(false);
  const [verificationLevel, setVerificationLevel] = useState<'Basic' | 'Standard' | 'Pro'>('Standard');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
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
        nodes: buildTemplateV1(targetWords, t)
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
  const validation = useMemo(() => validateOutline(outline, t), [outline, t]);
  
  // 质量评分
  const qualityScores = useMemo(() => calculateOutlineQuality(outline, t), [outline, t]);
  const averageScore = Object.values(qualityScores).reduce((a, b) => a + b, 0) / 4;
  
  // 总字数计算
  const totalWords = useMemo(() => {
    return outline.nodes.reduce((sum, node) => {
      const nodeWords = node.estWords + (node.children?.reduce((childSum, child) => childSum + child.estWords, 0) || 0);
      return sum + nodeWords;
    }, 0);
  }, [outline.nodes]);
  
  // 处理核验等级变更
  const handleVerifyLevelChange = (level: 'Basic' | 'Standard' | 'Pro') => {
    setVerificationLevel(level);
    track('outcome_verify_change', { level, step: 'outline' });
    
    // Show confirmation feedback
    toast({
      title: t('outline.toast.verification_updated').replace('{level}', level),
      description: t('outline.toast.verification_rate').replace('{rate}', level === 'Pro' ? '100%' : level === 'Standard' ? '95%' : '85%'),
      duration: 2000
    });
    
    // Update estimate with new verification level
    setEstimate({
      ...estimate,
      verifyLevel: level,
      updatedAt: Date.now()
    });
  };
  
  // 处理版本切换
  const handleVersionChange = (version: 'v1' | 'v2' | 'custom') => {
    if (version === 'custom') return;
    
    let newNodes: OutlineNode[];
    if (version === 'v1') {
      newNodes = buildTemplateV1(targetWords, t);
    } else {
      newNodes = buildTemplateV2(targetWords, t);
    }
    
    setOutline({
      ...outline,
      version,
      nodes: newNodes
    });
    
    toast({
      title: t('outline.template.applied'),
      description: `${t('outline.template.switched')}${version === 'v1' ? t('outline.template.standard') : t('outline.template.research')}${t('outline.template.template')}`
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
            title: `${t('outline.new_section')} ${childOrder}`,
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
      title: `${t('outline.new_chapter')} ${outline.nodes.length + 1}`,
      summary: '',
      estWords: 800,
      children: [
        {
          id: `section-${Date.now()}-1`,
          level: 2,
          order: 1,
          number: `${outline.nodes.length + 1}.1`,
          title: `${t('outline.section')} 1`,
          summary: '',
          estWords: 400
        },
        {
          id: `section-${Date.now()}-2`,
          level: 2,
          order: 2,
          number: `${outline.nodes.length + 1}.2`,
          title: `${t('outline.section')} 2`,
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
          title: t('outline.templates.quick.intro.title'),
          summary: t('outline.templates.quick.intro.summary'),
          estWords: Math.round(targetWords * 0.15),
          children: [
            {
              id: 'quick-intro-1',
              level: 2,
              order: 1,
              number: '1.1',
              title: t('outline.templates.quick.intro.background.title'),
              summary: t('outline.templates.quick.intro.background.summary'),
              estWords: Math.round(targetWords * 0.08)
            },
            {
              id: 'quick-intro-2',
              level: 2,
              order: 2,
              number: '1.2',
              title: t('outline.templates.quick.intro.objectives.title'),
              summary: t('outline.templates.quick.intro.objectives.summary'),
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
          title: t('outline.templates.quick.main.title'),
          summary: t('outline.templates.quick.main.summary'),
          estWords: Math.round(targetWords * 0.70),
          children: [
            {
              id: 'quick-main-1',
              level: 2,
              order: 1,
              number: '2.1',
              title: t('outline.templates.quick.main.part1.title'),
              summary: t('outline.templates.quick.main.part1.summary'),
              estWords: Math.round(targetWords * 0.35)
            },
            {
              id: 'quick-main-2',
              level: 2,
              order: 2,
              number: '2.2',
              title: t('outline.templates.quick.main.part2.title'),
              summary: t('outline.templates.quick.main.part2.summary'),
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
          title: t('outline.templates.quick.conclusion.title'),
          summary: t('outline.templates.quick.conclusion.summary'),
          estWords: Math.round(targetWords * 0.15),
          children: [
            {
              id: 'quick-conc-1',
              level: 2,
              order: 1,
              number: '3.1',
              title: t('outline.templates.quick.conclusion.findings.title'),
              summary: t('outline.templates.quick.conclusion.findings.summary'),
              estWords: Math.round(targetWords * 0.10)
            },
            {
              id: 'quick-conc-2',
              level: 2,
              order: 2,
              number: '3.2',
              title: t('outline.templates.quick.conclusion.future.title'),
              summary: t('outline.templates.quick.conclusion.future.summary'),
              estWords: Math.round(targetWords * 0.05)
            }
          ],
          expanded: true
        }
      ]
    };
    
    setOutline(quickOutline);
    
    toast({
      title: t('outline.ai_assist.completed'),
      description: t('outline.ai_assist.completed_desc')
    });
  };

  // AI助手功能
  const handleStructureHelp = () => {
    toast({
      title: t('outline.toast.structure_suggestion'),
      description: "Based on your topic and research direction, we recommend adopting the classic academic paper structure..."
    });
  };
  
  const handleAddSections = () => {
    toast({
      title: t('outline.toast.smart_supplement'),
      description: t('outline.toast.analyzing_outline')
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
      title: t('outline.ai_assist.balanced'),
      description: t('outline.ai_assist.balanced_desc')
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
        title: t('outline.export.feature'),
        description: `${format.toUpperCase()} ${t('outline.export.in_development')}`
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
        title: t('outline.validation.failed'),
        description: validation.errors[0],
        variant: "destructive"
      });
      return;
    }
    
    // 保存到项目
    setProjectOutline(outline.nodes);
    
    // 标记步骤完成
    completeStep('outline');
    
    // 导航到结果页
    navigate('/result');
    
    toast({
      title: t('outline.completed'),
      description: t('outline.completed_desc')
    });
  };

  // 计算缺失的模块
  const requiredSections = ['引言', '文献', '方法', '结果', '讨论', '结论'];
  const presentSections = outline.nodes.map(n => n.title.toLowerCase());
  const missingSections = requiredSections.filter(req => 
    !presentSections.some(present => present.includes(req.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#F7F8FB] pt-6">
      <div className="container max-w-[1660px] mx-auto px-6 md:px-8">
        {/* Grid Layout */}
        <div className="max-w-[1660px] mx-auto px-6 md:px-8">
          <div className="grid gap-6 grid-cols-1 xl:grid-cols-[280px_minmax(900px,1fr)_360px] xl:gap-8">
          {/* Left Column - Step Navigation */}
          <aside className="hidden xl:block">
            <div className="sticky top-6 -ml-6 md:-ml-8">
              <StepNav />
            </div>
          </aside>
          
          {/* Main Column - Outline Content */}
          <main className="max-w-none mx-auto">
            <Card className="bg-white border-[#E7EAF3] rounded-[20px] shadow-[0_6px_18px_rgba(17,24,39,0.06)] hover:shadow-[0_10px_24px_rgba(17,24,39,0.10)] transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#6A5AF9]" />
                    <div>
                      <CardTitle className="text-base font-semibold">{t('outline.cards.document_outline')}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Label className="text-sm font-medium">{t('outline.template.label')}</Label>
                        <Select value={outline.version} onValueChange={handleVersionChange}>
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="v1">{t('outline.template.standard')}</SelectItem>
                            <SelectItem value="v2">{t('outline.template.research')}</SelectItem>
                            <SelectItem value="custom">{t('outline.template.custom')}</SelectItem>
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
                          {t('outline.buttons.export')}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleExport('markdown')}>
                          {t('outline.export.markdown')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('docx')}>
                          {t('outline.export.docx')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('json')}>
                          {t('outline.export.json')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    {/* AI助手功能菜单 */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full gap-2">
                          <Zap className="h-4 w-4" />
                          {t('outline.buttons.ai_assist')}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={handleQuickComplete}>
                          <Zap className="h-4 w-4 mr-2" />
                          {t('outline.ai_assist.quick_complete')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleStructureHelp}>
                          <HelpCircle className="h-4 w-4 mr-2" />
                          {t('outline.ai_assist.structure_help')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleAddSections}>
                          <Plus className="h-4 w-4 mr-2" />
                          {t('outline.ai_assist.add_sections')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleBalanceContent}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          {t('outline.ai_assist.balance_content')}
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
                      {t('outline.buttons.add_section')}
                    </Button>
                    
                    {/* 设置按钮 */}
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="px-4 md:px-6 xl:px-8 py-6 pt-0">
                {/* 综合建议信息条 */}
                <div className="mb-6 space-y-4">
                  {/* 基本信息条 */}
                  <div className="bg-[#F6F7FB] rounded-xl px-4 py-3">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-2">{t('outline.overview.title')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#5B667A]">
                          <div>
                            <span className="font-medium">{t('outline.overview.total_words')}：</span>
                            <span>{t('outline.overview.target')} {targetWords} · {t('outline.overview.current')} {totalWords}</span>
                            {Math.abs(totalWords - targetWords) > targetWords * 0.1 && (
                              <span className="text-yellow-600 ml-2">
                                ({totalWords > targetWords ? t('outline.word_count.exceeded') : t('outline.word_count.insufficient')} {Math.abs(totalWords - targetWords)})
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="font-medium">{t('outline.overview.sections')}：</span>
                            <span>{outline.nodes.length} {t('outline.word_count.chapters')} · {t('outline.word_count.quality_score')} {averageScore.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 错误提示 - 阻止继续 */}
                  {!validation.isValid && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-red-800 mb-2">{t('outline.validation.required')}</h3>
                          <ul className="space-y-1 text-sm text-red-700">
                            {validation.errors.map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 建议提示 - 不阻止继续 */}
                  {validation.hasWarnings && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                      <div className="flex items-start gap-3">
                        <HelpCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-blue-800 mb-2">{t('outline.suggestions.title')}</h3>
                          <ul className="space-y-1 text-sm text-blue-700">
                            {validation.warnings.map((warning, index) => (
                              <li key={index}>• {warning}</li>
                            ))}
                          </ul>
                          <p className="text-xs text-blue-600 mt-2 font-medium">
                            {t('outline.validation.optimization_tip')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('outline.empty.title')}</h3>
                    <p className="text-gray-500 mb-6">{t('outline.empty.description')}</p>
                    <div className="space-x-3 mb-4">
                      <Button 
                        onClick={handleQuickComplete}
                        className="rounded-full bg-[#6E5BFF] hover:bg-[#5B4FCC] text-white gap-2"
                      >
                        <Zap className="h-4 w-4" />
                        {t('outline.ai_assist.quick_complete')}
                      </Button>
                    </div>
                    <div className="space-x-3">
                      <Button variant="outline" onClick={() => handleVersionChange('v1')} className="rounded-full">
                        {t('outline.empty.standard_template')}
                      </Button>
                      <Button variant="outline" onClick={() => handleVersionChange('v2')} className="rounded-full">
                        {t('outline.empty.research_template')}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* 底部操作条 */}
            <Card className="bg-white border-[#E7EAF3] rounded-[20px] shadow-[0_6px_18px_rgba(17,24,39,0.06)] hover:shadow-[0_10px_24px_rgba(17,24,39,0.10)] transition-shadow duration-200 mt-6">
              <CardContent className="px-4 md:px-6 xl:px-8 py-6 md:py-8">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/writing-flow/strategy')}
                    className="rounded-full gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t('outline.back_to_strategy')}
                  </Button>
                  
                  <div className="flex items-center gap-4">
                    {validation.isValid && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">{t('outline.validation.passed')}</span>
                      </div>
                    )}
                    
                    <Button
                      onClick={handleContinue}
                      disabled={!demoMode && !validation.isValid}
                      className="rounded-full px-8 py-3 bg-[#6E5BFF] hover:bg-[#5B4FCC] hover:shadow-lg hover:-translate-y-0.5 text-white transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#6E5BFF] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none gap-2"
                    >
                      {t('outline.continue_to_writing')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
          
          {/* Right Column - Outcome Panel */}
          <aside className="xl:sticky xl:top-6 self-start">
            <OutcomePanelCard
              step="outline"
              lockedPrice={lockPriceState.lockedPrice}
              estimate={{
                priceRange: estimate.priceRange,
                etaMinutes: estimate.etaMinutes,
                citesRange: estimate.citesRange,
                verifyLevel: verificationLevel
              }}
              metrics={{
                outlineDepth: outline.nodes.length > 0 ? Math.max(...outline.nodes.map(node => 
                  node.children && node.children.length > 0 ? 2 : 1
                )) : 1,
                sections: outline.nodes.length,
                perSectionCiteBalance: totalWords > 0 ? Math.round((outline.nodes.reduce((sum, node) => {
                  const nodeWords = node.estWords + (node.children?.reduce((childSum, child) => childSum + child.estWords, 0) || 0);
                  return sum + nodeWords;
                }, 0) / totalWords) * 100) : 0
              }}
              addons={writingFlow.addons}
              onVerifyChange={handleVerifyLevelChange}
              onToggleAddon={toggleAddon}
              onPreviewMore={() => {
                toast({
                  title: t('outline.toast.development'),
                  description: t('outline.toast.sample_preview_coming')
                });
              }}
              onPayAndWrite={async () => {
                try {
                  track('outcome_pay_and_write_click', { step: 'outline' });
                  
                  let finalPrice = lockPriceState.lockedPrice;
                  
                  // Step 1: Lock price if not already locked
                  if (!finalPrice) {
                    const priceLockResponse = await lockPrice({
                      title: step1.title,
                      wordCount: step1.wordCount,
                      verifyLevel: verificationLevel
                    });
                    
                    lockPriceState.lockPrice(priceLockResponse.value, priceLockResponse.expiresAt);
                    finalPrice = priceLockResponse;
                }
                
                // Step 2: Show Gate1 modal for payment
                setShowGate1Modal(true);
                
              } catch (error) {
                console.error('Error in pay and write:', error);
                setError(error instanceof Error ? error.message : t('outline.toast.price_lock_failed'));
                
                toast({
                  title: t('outline.toast.error'),
                  description: t('outline.toast.price_lock_failed'),
                  variant: 'destructive'
                });
              }
            }}
            />
          </aside>
          </div>
        </div>
        
      </div>
      
      {/* Gate1 Modal */}
      {lockPriceState.lockedPrice && (
        <Gate1Modal
          open={showGate1Modal}
          price={lockPriceState.lockedPrice}
          benefits={[
            t('outline.gate1.benefits.complete_generation'),
            t('outline.gate1.benefits.local_rewrites'),
            t('outline.gate1.benefits.full_verification')
          ]}
          onPreviewOnly={async () => {
            setShowGate1Modal(false);
            toast({
              title: t('outline.toast.preview_mode'),
              description: t('outline.toast.continue_editing')
            });
          }}
          onUnlock={async () => {
            try {
              setIsProcessingPayment(true);
              
              if (!lockPriceState.lockedPrice) {
                throw new Error('No locked price available');
              }
              
              // Create payment intent
              const paymentIntent = await createPaymentIntent({
                price: lockPriceState.lockedPrice.value
              });
              
              track('gate1_payment_intent_created', {
                paymentIntentId: paymentIntent.paymentIntentId,
                price: lockPriceState.lockedPrice.value
              });
              
              // Simulate payment confirmation
              const confirmResponse = await confirmPayment(paymentIntent.paymentIntentId);
              
              if (confirmResponse.status === 'succeeded') {
                track('gate1_payment_success', {
                  paymentIntentId: paymentIntent.paymentIntentId,
                  price: lockPriceState.lockedPrice.value
                });
                
                setShowGate1Modal(false);
                
                // Start autopilot after successful payment
                await startAutopilotFlow();
                
                toast({
                  title: t('outline.toast.payment_success'),
                  description: t('outline.toast.starting_autopilot')
                });
              } else {
                throw new Error('Payment failed');
              }
              
            } catch (error) {
              console.error('Payment error:', error);
              toast({
                title: t('outline.toast.payment_failed'),
                description: error instanceof Error ? error.message : t('outline.toast.payment_error'),
                variant: 'destructive'
              });
            } finally {
              setIsProcessingPayment(false);
            }
          }}
        />
      )}
      
      {/* Demo Mode Toggle */}
      <DemoModeToggle />
    </div>
  );

  // Helper function for autopilot flow
  async function startAutopilotFlow() {
    try {
      // Start autopilot for remaining steps
      const autopilotResponse = await apiStartAutopilot({
        fromStep: 'outline', // From current step
        docId: project.id || 'default'
      });
      
      track('autopilot_started', {
        fromStep: 'outline',
        autopilotId: autopilotResponse.autopilotId
      });
      
      // Start the autopilot in the UI
      startAutopilot('outline', autopilotResponse.autopilotId);
      
      // Stream progress updates
      const progressStream = streamAutopilotProgress(autopilotResponse.autopilotId);
      
      for await (const update of progressStream) {
        // Update autopilot state through the context
        // This will trigger UI updates in the OutcomePanel
        if (update.step === 'done') {
          // Autopilot completed, navigate to results
          navigate('/result?from=autopilot');
          break;
        } else if (update.step === 'error') {
          // Handle autopilot error
          setError(`${t('outline.toast.autopilot_failed')}: ${update.message}`);
          break;
        }
      }
      
    } catch (error) {
      console.error('Autopilot error:', error);
      setError(error instanceof Error ? error.message : t('outline.toast.autopilot_failed'));
      
      toast({
        title: t('outline.toast.autopilot_failed'),
        description: t('outline.toast.manual_steps'),
        variant: 'destructive'
      });
    }
  }
};

export default OutlineStep;