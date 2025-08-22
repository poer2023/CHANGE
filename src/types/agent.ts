// AI Agent 审查编辑系统类型定义

export type Scope = {
  kind: 'document' | 'chapter' | 'section' | 'selection';
  id?: string;
  title?: string;
  range?: { start: number; end: number };
};

export type AgentCommand = {
  id: string;
  text: string;
  scope: Scope;
  createdAt: string;
  userId?: string;
};

export type PlanStep = 
  | {
      type: 'structure.reorder';
      from: string;
      to: string;
      description: string;
    }
  | {
      type: 'structure.split';
      id: string;
      into: string[];
      description: string;
    }
  | {
      type: 'structure.merge';
      ids: string[];
      into: string;
      description: string;
    }
  | {
      type: 'structure.levelAdjust';
      id: string;
      fromLevel: number;
      toLevel: number;
      description: string;
    }
  | {
      type: 'style.citationFormat';
      to: 'APA' | 'MLA' | 'Chicago' | 'IEEE' | 'GBT';
      affectedCount: number;
      description: string;
    }
  | {
      type: 'figure.insertFromTable';
      tableId: string;
      chartType: 'bar' | 'line' | 'scatter' | 'pie';
      figId: string;
      caption: string;
      sourceRef: string;
      position: string;
      description: string;
    }
  | {
      type: 'language.rewrite';
      scope: Scope;
      tone: 'formal' | 'neutral' | 'explanatory';
      description: string;
    }
  | {
      type: 'reference.supplement';
      sectionId: string;
      expectedCount: number;
      description: string;
    };

export type Plan = {
  id: string;
  commandId: string;
  scope: Scope;
  steps: PlanStep[];
  warnings: string[];
  requires: Array<'dataSource' | 'citationStyle' | 'outline' | 'verification'>;
  estimatedTime: string;
  createdAt: string;
};

export type DiffItem = {
  path: string;
  sectionId?: string;
  before?: string;
  after?: string;
  kind: 'ins' | 'del' | 'mod' | 'move';
  category: 'structure' | 'content' | 'format' | 'reference' | 'figure';
  description: string;
};

export type ExecutionStatus = 
  | 'idle'
  | 'planning'
  | 'preview'
  | 'applying'
  | 'success'
  | 'error'
  | 'partial';

export type ExecutionResult = {
  planId: string;
  status: ExecutionStatus;
  completedSteps: string[];
  failedSteps: Array<{
    stepId: string;
    error: string;
    retryable: boolean;
  }>;
  diffs: DiffItem[];
  updatedRefs?: Array<{
    id: string;
    action: 'added' | 'removed' | 'modified';
    content: string;
    verified: boolean;
  }>;
  figures?: Array<{
    id: string;
    url?: string;
    caption: string;
    source: string;
    number: number;
  }>;
  appliedAt: string;
  duration: number;
};

export type AgentOperation = {
  id: string;
  commandId: string;
  planId: string;
  command: AgentCommand;
  plan: Plan;
  result?: ExecutionResult;
  reversible: boolean;
  createdAt: string;
  appliedAt?: string;
  revertedAt?: string;
};

export type AgentRecipe = {
  id: string;
  name: string;
  description: string;
  template: string;
  tags: string[];
  usageCount: number;
  createdAt: string;
  updatedAt: string;
};

// API 合约类型
export type PlanCommandRequest = {
  command: string;
  scope: Scope;
  docSnapshotId?: string;
  userId?: string;
};

export type PlanCommandResponse = {
  plan: Plan;
  previewDiffs: DiffItem[];
  warnings: string[];
  requirements: string[];
};

export type ApplyPlanRequest = {
  planId: string;
  acceptSteps?: string[];
  userId?: string;
};

export type ApplyPlanResponse = {
  result: ExecutionResult;
  auditEntry: AgentOperation;
};

export type UndoOperationRequest = {
  operationId: string;
  userId?: string;
};

export type UndoOperationResponse = {
  success: boolean;
  revertedChanges: DiffItem[];
  newSnapshotId?: string;
};

export type AgentHistoryResponse = Array<{
  operationId: string;
  command: string;
  scope: Scope;
  stepsCount: number;
  status: ExecutionStatus;
  timestamp: string;
}>;

// UI 状态类型
export type AgentPanelState = {
  status: ExecutionStatus;
  currentCommand: string;
  scope: Scope;
  plan?: Plan;
  previewDiffs: DiffItem[];
  selectedDiffCategories: Set<DiffItem['category']>;
  showPreview: boolean;
  error?: string;
};

// 验证和安全相关
export type SourceVerification = {
  sourceId: string;
  type: 'doi' | 'url' | 'isbn' | 'manual';
  value: string;
  verified: boolean;
  verifiedAt?: string;
  status: 'pending' | 'verified' | 'failed' | 'need_manual';
  reason?: string;
};

export type SecurityConstraint = {
  type: 'no_fake_sources' | 'require_verification' | 'no_data_fabrication';
  message: string;
  blocking: boolean;
};