/**
 * 环境配置管理服务
 * 提供配置验证、监控、热更新等功能
 */

import { EnvironmentValidator } from './api-health-monitor';
import { EnvironmentConfig } from '../types';

export interface ConfigChangeEvent {
  type: 'config-changed' | 'validation-failed' | 'config-loaded';
  config: EnvironmentConfig;
  issues?: string[];
  recommendations?: string[];
}

export interface ConfigMonitorOptions {
  enableHotReload: boolean;
  validationInterval: number;
  enableAutoFix: boolean;
  notifyOnChange: boolean;
}

/**
 * 配置管理器
 */
export class ConfigManager {
  private config: EnvironmentConfig;
  private validationTimer: NodeJS.Timeout | null = null;
  private isMonitoring = false;
  private options: ConfigMonitorOptions;
  private listeners: Array<(event: ConfigChangeEvent) => void> = [];

  constructor(options: Partial<ConfigMonitorOptions> = {}) {
    this.options = {
      enableHotReload: true,
      validationInterval: 30000, // 30秒
      enableAutoFix: false,
      notifyOnChange: true,
      ...options
    };

    this.config = this.loadConfig();
    this.validateConfig();
  }

  /**
   * 加载环境配置
   */
  private loadConfig(): EnvironmentConfig {
    return {
      glmApiKey: import.meta.env?.VITE_GLM_API_KEY,
      glmBaseUrl: import.meta.env?.VITE_GLM_BASE_URL,
      glmTimeout: Number(import.meta.env?.VITE_GLM_TIMEOUT) || 30000,
      glmMaxRetries: Number(import.meta.env?.VITE_GLM_MAX_RETRIES) || 3,
      glmRetryDelay: Number(import.meta.env?.VITE_GLM_RETRY_DELAY) || 1000,
      glmRateLimit: Number(import.meta.env?.VITE_GLM_RATE_LIMIT) || 60,
      glmEnableCache: import.meta.env?.VITE_GLM_ENABLE_CACHE === 'true',
      glmCacheDuration: Number(import.meta.env?.VITE_GLM_CACHE_DURATION) || 30,
      glmEnableErrorReporting: import.meta.env?.VITE_GLM_ENABLE_ERROR_REPORTING !== 'false',
      glmMaxErrorLogs: Number(import.meta.env?.VITE_GLM_MAX_ERROR_LOGS) || 100,
      glmEnablePerformanceMonitoring: import.meta.env?.VITE_GLM_ENABLE_PERFORMANCE_MONITORING !== 'false',
      debugMode: import.meta.env?.VITE_DEBUG_MODE === 'true',
      useMockData: import.meta.env?.VITE_USE_MOCK_DATA === 'true',
    };
  }

  /**
   * 验证配置
   */
  private validateConfig(): void {
    const validation = EnvironmentValidator.validate();
    
    if (!validation.isValid) {
      this.emitEvent({
        type: 'validation-failed',
        config: this.config,
        issues: validation.issues,
        recommendations: validation.recommendations
      });

      // 如果启用自动修复，尝试修复一些问题
      if (this.options.enableAutoFix) {
        this.attemptAutoFix(validation);
      }
    } else {
      this.emitEvent({
        type: 'config-loaded',
        config: this.config
      });
    }
  }

  /**
   * 尝试自动修复配置问题
   */
  private attemptAutoFix(validation: ReturnType<typeof EnvironmentValidator.validate>): void {
    let fixed = false;
    const newConfig = { ...this.config };

    // 修复超时时间
    if (newConfig.glmTimeout && (newConfig.glmTimeout < 1000 || newConfig.glmTimeout > 300000)) {
      newConfig.glmTimeout = 30000;
      fixed = true;
    }

    // 修复重试次数
    if (newConfig.glmMaxRetries && (newConfig.glmMaxRetries < 0 || newConfig.glmMaxRetries > 10)) {
      newConfig.glmMaxRetries = 3;
      fixed = true;
    }

    // 修复速率限制
    if (newConfig.glmRateLimit && (newConfig.glmRateLimit < 1 || newConfig.glmRateLimit > 1000)) {
      newConfig.glmRateLimit = 60;
      fixed = true;
    }

    if (fixed) {
      this.config = newConfig;
      console.info('已自动修复配置问题:', newConfig);
      
      this.emitEvent({
        type: 'config-changed',
        config: this.config
      });
    }
  }

  /**
   * 开始监控配置变化
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    
    // 定期验证配置
    this.validationTimer = setInterval(() => {
      this.checkConfigChanges();
    }, this.options.validationInterval);

    // 监听环境变量变化（仅在开发模式下有效）
    if (this.options.enableHotReload && typeof window !== 'undefined') {
      this.setupHotReload();
    }
  }

  /**
   * 停止监控
   */
  stopMonitoring(): void {
    if (this.validationTimer) {
      clearInterval(this.validationTimer);
      this.validationTimer = null;
    }
    this.isMonitoring = false;
  }

  /**
   * 检查配置变化
   */
  private checkConfigChanges(): void {
    const newConfig = this.loadConfig();
    
    // 检查配置是否有变化
    if (JSON.stringify(newConfig) !== JSON.stringify(this.config)) {
      const oldConfig = this.config;
      this.config = newConfig;
      
      console.info('检测到配置变化:', {
        old: oldConfig,
        new: newConfig
      });

      this.validateConfig();
      
      if (this.options.notifyOnChange) {
        this.emitEvent({
          type: 'config-changed',
          config: this.config
        });
      }
    }
  }

  /**
   * 设置热重载（开发模式）
   */
  private setupHotReload(): void {
    // 在开发模式下，监听可能的配置变化信号
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', () => {
        // 窗口获得焦点时检查配置变化（可能用户修改了.env文件）
        setTimeout(() => this.checkConfigChanges(), 1000);
      });
    }
  }

  /**
   * 触发事件
   */
  private emitEvent(event: ConfigChangeEvent): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('配置事件监听器执行失败:', error);
      }
    });

    // 也可以触发自定义DOM事件
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('config-change', {
        detail: event
      }));
    }
  }

  /**
   * 添加配置变化监听器
   */
  addListener(listener: (event: ConfigChangeEvent) => void): () => void {
    this.listeners.push(listener);
    
    // 返回取消监听的函数
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * 获取当前配置
   */
  getConfig(): EnvironmentConfig {
    return { ...this.config };
  }

  /**
   * 获取配置状态
   */
  getConfigStatus(): {
    isValid: boolean;
    isMonitoring: boolean;
    lastValidation: number;
    issues: string[];
    recommendations: string[];
  } {
    const validation = EnvironmentValidator.validate();
    
    return {
      isValid: validation.isValid,
      isMonitoring: this.isMonitoring,
      lastValidation: Date.now(),
      issues: validation.issues,
      recommendations: validation.recommendations
    };
  }

  /**
   * 手动刷新配置
   */
  refreshConfig(): void {
    this.checkConfigChanges();
  }

  /**
   * 设置配置项（临时设置，不会持久化）
   */
  setConfig<K extends keyof EnvironmentConfig>(key: K, value: EnvironmentConfig[K]): void {
    const oldValue = this.config[key];
    this.config[key] = value;
    
    console.info(`配置项 ${key} 已更新:`, { old: oldValue, new: value });
    
    this.validateConfig();
    
    if (this.options.notifyOnChange) {
      this.emitEvent({
        type: 'config-changed',
        config: this.config
      });
    }
  }

  /**
   * 重置配置到默认值
   */
  resetToDefaults(): void {
    this.config = this.loadConfig();
    this.validateConfig();
    
    this.emitEvent({
      type: 'config-changed',
      config: this.config
    });
  }

  /**
   * 生成配置诊断报告
   */
  generateDiagnosticReport(): string {
    const status = this.getConfigStatus();
    const validation = EnvironmentValidator.validate();
    
    let report = '# 配置诊断报告\n\n';
    report += `**生成时间**: ${new Date().toLocaleString()}\n\n`;
    
    // 概览
    report += '## 概览\n\n';
    report += `- **配置状态**: ${status.isValid ? '✅ 有效' : '❌ 无效'}\n`;
    report += `- **监控状态**: ${status.isMonitoring ? '🟢 运行中' : '🔴 已停止'}\n`;
    report += `- **问题数量**: ${status.issues.length}\n`;
    report += `- **建议数量**: ${status.recommendations.length}\n\n`;
    
    // 当前配置
    report += '## 当前配置\n\n';
    report += '```json\n';
    report += JSON.stringify(this.config, null, 2);
    report += '\n```\n\n';
    
    // 问题
    if (status.issues.length > 0) {
      report += '## 配置问题\n\n';
      status.issues.forEach((issue, index) => {
        report += `${index + 1}. ❌ ${issue}\n`;
      });
      report += '\n';
    }
    
    // 建议
    if (status.recommendations.length > 0) {
      report += '## 优化建议\n\n';
      status.recommendations.forEach((rec, index) => {
        report += `${index + 1}. 💡 ${rec}\n`;
      });
      report += '\n';
    }
    
    // 环境变量检查
    report += '## 环境变量检查\n\n';
    const envVars = [
      'VITE_GLM_API_KEY',
      'VITE_GLM_BASE_URL',
      'VITE_GLM_TIMEOUT',
      'VITE_GLM_MAX_RETRIES',
      'VITE_GLM_ENABLE_CACHE',
      'VITE_DEBUG_MODE',
      'VITE_USE_MOCK_DATA'
    ];
    
    envVars.forEach(envVar => {
      const value = import.meta.env?.[envVar];
      const status = value ? '✅' : '❌';
      const displayValue = envVar === 'VITE_GLM_API_KEY' && value 
        ? value.substring(0, 8) + '...' 
        : value || '未设置';
      
      report += `- **${envVar}**: ${status} \`${displayValue}\`\n`;
    });
    
    return report;
  }

  /**
   * 清理资源
   */
  dispose(): void {
    this.stopMonitoring();
    this.listeners.length = 0;
  }
}

/**
 * 配置验证工具函数
 */
export const configUtils = {
  /**
   * 检查API密钥格式
   */
  isValidApiKey(key: string): boolean {
    return typeof key === 'string' && key.length > 10 && !key.includes('your_');
  },

  /**
   * 检查URL格式
   */
  isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * 检查数值范围
   */
  isInRange(value: number, min: number, max: number): boolean {
    return typeof value === 'number' && value >= min && value <= max;
  },

  /**
   * 格式化配置值
   */
  formatConfigValue(key: string, value: unknown): string {
    if (key === 'glmApiKey' && typeof value === 'string') {
      return value.substring(0, 8) + '...';
    }
    
    if (typeof value === 'boolean') {
      return value ? '✅ 已启用' : '❌ 已禁用';
    }
    
    if (typeof value === 'number') {
      if (key.includes('Timeout') || key.includes('Delay')) {
        return `${value}ms`;
      }
      if (key.includes('Duration')) {
        return `${value}分钟`;
      }
    }
    
    return String(value || '未设置');
  },

  /**
   * 获取配置建议
   */
  getConfigSuggestions(config: EnvironmentConfig): string[] {
    const suggestions: string[] = [];
    
    if (!config.glmApiKey) {
      suggestions.push('建议配置GLM API密钥以启用AI功能');
    }
    
    if (!config.glmEnableCache) {
      suggestions.push('建议启用缓存以提高响应速度');
    }
    
    if (config.glmTimeout && config.glmTimeout < 10000) {
      suggestions.push('建议将超时时间设置为10秒以上，避免频繁超时');
    }
    
    if (config.glmRateLimit && config.glmRateLimit > 100) {
      suggestions.push('建议将速率限制设置为合理范围，避免触发API限制');
    }
    
    return suggestions;
  }
};

// 创建默认配置管理实例
export const defaultConfigManager = new ConfigManager();

// 在应用启动时自动开始监控
if (typeof window !== 'undefined') {
  setTimeout(() => {
    defaultConfigManager.startMonitoring();
  }, 2000);
}

export default ConfigManager;