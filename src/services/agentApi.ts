// AI Agent API 服务层和模拟实现
import { 
  AgentCommand, 
  Plan, 
  PlanStep, 
  DiffItem, 
  ExecutionResult, 
  AgentOperation,
  AgentRecipe,
  Scope,
  PlanCommandRequest,
  PlanCommandResponse,
  ApplyPlanRequest,
  ApplyPlanResponse,
  UndoOperationRequest,
  UndoOperationResponse,
  AgentHistoryResponse,
  ExecutionStatus
} from '@/types/agent';

// 本地存储键名
const STORAGE_KEYS = {
  operations: 'writing-flow:agent:operations',
  recipes: 'writing-flow:agent:recipes',
  history: 'writing-flow:agent:history'
};

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 生成唯一 ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// 模拟命令解析和计划生成
export async function planCommand(request: PlanCommandRequest): Promise<PlanCommandResponse> {
  await delay(1500); // 模拟网络延迟

  const { command, scope } = request;
  const planId = generateId();
  
  // 解析命令，生成计划步骤（简化版解析）
  const steps: PlanStep[] = [];
  const warnings: string[] = [];
  const requirements: string[] = [];
  const previewDiffs: DiffItem[] = [];

  // 模拟命令解析逻辑
  if (command.includes('拆成') || command.includes('split')) {
    steps.push({
      type: 'structure.split',
      id: scope.id || 'chapter-2',
      into: ['related-work', 'methodology'],
      description: '将第2章拆分为相关工作和方法论两个章节'
    });
    
    previewDiffs.push(
      {
        path: '/document/chapters/2',
        sectionId: 'chapter-2',
        before: '# 第2章 文献综述与方法',
        after: '# 第2章 相关工作\n\n# 第3章 方法论',
        kind: 'mod',
        category: 'structure',
        description: '章节标题重新组织'
      }
    );
  }

  if (command.includes('统一') && (command.includes('APA') || command.includes('引用'))) {
    const citationCount = Math.floor(Math.random() * 15) + 5;
    steps.push({
      type: 'style.citationFormat',
      to: 'APA',
      affectedCount: citationCount,
      description: `统一 ${citationCount} 条引用为 APA 7th 格式`
    });

    previewDiffs.push({
      path: '/document/references',
      before: 'Zhang et al. (2023)',
      after: 'Zhang, L., Wang, H., & Li, M. (2023)',
      kind: 'mod',
      category: 'format',
      description: '引用格式标准化'
    });
  }

  if (command.includes('插入') && (command.includes('图') || command.includes('统计'))) {
    if (!command.includes('Table') && !command.includes('表')) {
      warnings.push('未指定数据来源，无法生成图表');
      requirements.push('dataSource');
    } else {
      steps.push({
        type: 'figure.insertFromTable',
        tableId: 'table-2',
        chartType: 'bar',
        figId: 'fig-new-1',
        caption: '基于表格2的统计分析结果',
        sourceRef: 'Table 2',
        position: 'after-section-2.1',
        description: '在2.1节后插入基于表格2的柱状图'
      });

      previewDiffs.push({
        path: '/document/sections/2.1/figures',
        after: 'Figure 1: 统计分析结果 (Source: Table 2)',
        kind: 'ins',
        category: 'figure',
        description: '新增统计图表'
      });
    }
  }

  if (command.includes('重写') || command.includes('正式')) {
    steps.push({
      type: 'language.rewrite',
      scope,
      tone: 'formal',
      description: '将选定内容重写为正式学术语气'
    });
  }

  // 生成计划
  const plan: Plan = {
    id: planId,
    commandId: generateId(),
    scope,
    steps,
    warnings,
    requires: requirements as any[],
    estimatedTime: `${Math.ceil(steps.length * 0.5)}-${Math.ceil(steps.length * 1.2)} 分钟`,
    createdAt: new Date().toISOString()
  };

  return {
    plan,
    previewDiffs,
    warnings,
    requirements
  };
}

// 执行计划
export async function applyPlan(request: ApplyPlanRequest): Promise<ApplyPlanResponse> {
  const startTime = Date.now();
  
  // 模拟执行过程
  await delay(2000);
  
  const completedSteps = request.acceptSteps || [];
  const failedSteps: ExecutionResult['failedSteps'] = [];
  
  // 模拟部分失败场景
  if (Math.random() < 0.1) {
    failedSteps.push({
      stepId: 'step-1',
      error: '缺少必要的数据源',
      retryable: true
    });
  }

  const result: ExecutionResult = {
    planId: request.planId,
    status: failedSteps.length > 0 ? 'partial' : 'success',
    completedSteps,
    failedSteps,
    diffs: [
      {
        path: '/document/structure',
        before: '原始章节结构',
        after: '调整后的章节结构',
        kind: 'mod',
        category: 'structure',
        description: '章节结构调整已完成'
      }
    ],
    updatedRefs: [
      {
        id: 'ref-1',
        action: 'modified',
        content: 'Zhang, L., Wang, H., & Li, M. (2023). Deep Learning for NLP.',
        verified: true
      }
    ],
    figures: [
      {
        id: 'fig-1',
        url: '/mock/chart-1.png',
        caption: '基于表格2的统计分析结果',
        source: 'Table 2',
        number: 1
      }
    ],
    appliedAt: new Date().toISOString(),
    duration: Date.now() - startTime
  };

  // 创建审计条目
  const auditEntry: AgentOperation = {
    id: generateId(),
    commandId: 'cmd-' + request.planId,
    planId: request.planId,
    command: {
      id: 'cmd-' + request.planId,
      text: '模拟执行的命令',
      scope: { kind: 'document' },
      createdAt: new Date().toISOString()
    },
    plan: {
      id: request.planId,
      commandId: 'cmd-' + request.planId,
      scope: { kind: 'document' },
      steps: [],
      warnings: [],
      requires: [],
      estimatedTime: '1-2 分钟',
      createdAt: new Date().toISOString()
    },
    result,
    reversible: true,
    createdAt: new Date().toISOString(),
    appliedAt: new Date().toISOString()
  };

  // 保存到本地存储
  saveOperation(auditEntry);

  return {
    result,
    auditEntry
  };
}

// 撤销操作
export async function undoOperation(request: UndoOperationRequest): Promise<UndoOperationResponse> {
  await delay(1000);

  const operations = getStoredOperations();
  const operation = operations.find(op => op.id === request.operationId);
  
  if (!operation) {
    throw new Error('操作不存在或已被删除');
  }

  if (!operation.reversible) {
    throw new Error('此操作不可撤销');
  }

  // 模拟撤销
  const revertedChanges: DiffItem[] = operation.result?.diffs.map(diff => ({
    ...diff,
    before: diff.after,
    after: diff.before,
    kind: diff.kind === 'ins' ? 'del' : diff.kind === 'del' ? 'ins' : 'mod',
    description: `撤销：${diff.description}`
  })) || [];

  // 标记为已撤销
  operation.revertedAt = new Date().toISOString();
  saveOperation(operation);

  return {
    success: true,
    revertedChanges,
    newSnapshotId: generateId()
  };
}

// 获取历史记录
export async function getAgentHistory(docId?: string): Promise<AgentHistoryResponse> {
  await delay(500);

  const operations = getStoredOperations();
  
  return operations.map(op => ({
    operationId: op.id,
    command: op.command.text,
    scope: op.command.scope,
    stepsCount: op.plan.steps.length,
    status: op.result?.status || 'success',
    timestamp: op.appliedAt || op.createdAt
  }));
}

// 配方管理
export function saveRecipe(recipe: Omit<AgentRecipe, 'id' | 'createdAt' | 'updatedAt'>): AgentRecipe {
  const recipes = getStoredRecipes();
  const newRecipe: AgentRecipe = {
    ...recipe,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  recipes.push(newRecipe);
  localStorage.setItem(STORAGE_KEYS.recipes, JSON.stringify(recipes));
  
  return newRecipe;
}

export function getRecipes(): AgentRecipe[] {
  return getStoredRecipes();
}

export function deleteRecipe(recipeId: string): boolean {
  const recipes = getStoredRecipes();
  const index = recipes.findIndex(r => r.id === recipeId);
  
  if (index === -1) return false;
  
  recipes.splice(index, 1);
  localStorage.setItem(STORAGE_KEYS.recipes, JSON.stringify(recipes));
  
  return true;
}

// 本地存储辅助函数
function saveOperation(operation: AgentOperation): void {
  const operations = getStoredOperations();
  const existingIndex = operations.findIndex(op => op.id === operation.id);
  
  if (existingIndex >= 0) {
    operations[existingIndex] = operation;
  } else {
    operations.push(operation);
  }
  
  // 只保留最近50条记录
  if (operations.length > 50) {
    operations.splice(0, operations.length - 50);
  }
  
  localStorage.setItem(STORAGE_KEYS.operations, JSON.stringify(operations));
}

function getStoredOperations(): AgentOperation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.operations);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function getStoredRecipes(): AgentRecipe[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.recipes);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// 导出审计日志
export function exportAuditLog(): string {
  const operations = getStoredOperations();
  const auditData = {
    exportedAt: new Date().toISOString(),
    totalOperations: operations.length,
    operations: operations.map(op => ({
      id: op.id,
      command: op.command.text,
      scope: op.command.scope,
      stepsCompleted: op.result?.completedSteps.length || 0,
      stepsTotal: op.plan.steps.length,
      status: op.result?.status,
      duration: op.result?.duration,
      createdAt: op.createdAt,
      appliedAt: op.appliedAt,
      revertedAt: op.revertedAt
    }))
  };
  
  return JSON.stringify(auditData, null, 2);
}

// 清理历史记录
export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEYS.operations);
}

// 示例命令模板
export const EXAMPLE_COMMANDS = [
  {
    text: "把第 2 章拆成 related work 和 method，统一 APA7，插入统计图（数据用 Table 2）",
    description: "结构调整 + 格式标准化 + 图表插入"
  },
  {
    text: "将 3.1 提升为二级标题，并把 3.2 合并到 3.1 后面，重写为正式语气",
    description: "标题层级调整 + 内容合并 + 语气优化"
  },
  {
    text: "为当前章节补充引用，要求每段至少2个引用，格式统一为 APA",
    description: "引用补充 + 格式规范化"
  },
  {
    text: "重新排列章节顺序：方法论移到文献综述前面，调整所有交叉引用",
    description: "章节重排 + 引用更新"
  }
];