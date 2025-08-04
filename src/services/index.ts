/**
 * Services - 统一导出所有服务模块
 */

// API客户端服务
export { default as GLMClient, createGLMClient, defaultGLMClient } from './glm-client';

// API健康监控服务
export { 
  default as APIHealthMonitor, 
  defaultHealthMonitor,
  EnvironmentValidator 
} from './api-health-monitor';

// 配置管理服务
export { 
  default as ConfigManager, 
  defaultConfigManager,
  configUtils 
} from './config-manager';

// 内容分析服务（如果存在）
export { default as ContentAnalyzer } from './content-analyzer';

// 论文类型相关服务
export { PaperTypeService } from './paper-type-service';
export { ModuleStructureGenerator } from './module-structure-generator';
export { PaperStyleManager, PAPER_TYPE_STYLES, PAPER_FORMAT_CONFIGS } from './paper-style-config';

// 类型导出
export type {
  HealthCheckResult,
  FallbackOptions
} from './api-health-monitor';

export type {
  ConfigChangeEvent,
  ConfigMonitorOptions
} from './config-manager';