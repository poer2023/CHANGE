/**
 * 系统状态监控Hook
 * 集成API健康监控、配置管理、性能监控等功能
 */

import { useState, useEffect, useCallback } from 'react';
import { defaultHealthMonitor } from '../services/api-health-monitor';
import { defaultConfigManager } from '../services/config-manager';
import { defaultGLMClient } from '../services/glm-client';
import type { 
  HealthCheckResult, 
  ConfigChangeEvent
} from '../services';
import type { 
  EnvironmentConfig,
  GLMClientStatus
} from '../types';

export interface SystemStatus {
  api: HealthCheckResult;
  config: {
    isValid: boolean;
    isMonitoring: boolean;
    issues: string[];
    recommendations: string[];
    environment: EnvironmentConfig;
  };
  client: GLMClientStatus | null;
  overall: {
    status: 'healthy' | 'degraded' | 'failed';
    message: string;
    canUseAPI: boolean;
    canUseFallback: boolean;
  };
}

export interface SystemMonitorOptions {
  enableAutoRefresh: boolean;
  refreshInterval: number;
  enableNotifications: boolean;
  trackPerformance: boolean;
}

/**
 * 系统状态监控Hook
 */
export const useSystemMonitor = (options: Partial<SystemMonitorOptions> = {}) => {
  const {
    enableAutoRefresh = true,
    refreshInterval = 30000, // 30秒
    enableNotifications = true,
    trackPerformance = true
  } = options;

  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    api: {
      status: 'failed',
      connections: { glm: { success: false, latency: 0 } },
      recommendedMode: 'fallback',
      lastCheck: 0,
      nextCheck: 0
    },
    config: {
      isValid: false,
      isMonitoring: false,
      issues: [],
      recommendations: [],
      environment: {} as EnvironmentConfig
    },
    client: null,
    overall: {
      status: 'failed',
      message: '系统初始化中...',
      canUseAPI: false,
      canUseFallback: false
    }
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(0);

  /**
   * 更新系统状态
   */
  const updateSystemStatus = useCallback(async () => {
    try {
      // 获取API健康状态
      const apiStatus = defaultHealthMonitor.getHealthStatus();
      
      // 获取配置状态
      const configStatus = defaultConfigManager.getConfigStatus();
      const configData = defaultConfigManager.getConfig();
      
      // 获取客户端状态
      const clientStatus = defaultHealthMonitor.getGLMClientStatus();
      
      // 计算整体状态
      const overall = calculateOverallStatus(apiStatus, configStatus, clientStatus);
      
      const newStatus: SystemStatus = {
        api: apiStatus,
        config: {
          isValid: configStatus.isValid,
          isMonitoring: configStatus.isMonitoring,
          issues: configStatus.issues,
          recommendations: configStatus.recommendations,
          environment: configData
        },
        client: clientStatus,
        overall
      };

      setSystemStatus(newStatus);
      setLastUpdate(Date.now());

      // 如果启用通知，检查是否需要通知用户
      if (enableNotifications) {
        checkAndNotify(newStatus);
      }

    } catch (error) {
      console.error('更新系统状态失败:', error);
      
      setSystemStatus(prev => ({
        ...prev,
        overall: {
          status: 'failed',
          message: '系统状态更新失败',
          canUseAPI: false,
          canUseFallback: true
        }
      }));
    }
  }, [enableNotifications]);

  /**
   * 计算整体状态
   */
  const calculateOverallStatus = useCallback((
    apiStatus: HealthCheckResult,
    configStatus: { isValid: boolean },
    clientStatus: GLMClientStatus | null
  ) => {
    let status: 'healthy' | 'degraded' | 'failed' = 'failed';
    let message = '';
    let canUseAPI = false;
    let canUseFallback = false;

    // 检查配置有效性
    if (!configStatus.isValid) {
      status = 'failed';
      message = '配置无效，请检查环境变量设置';
      canUseFallback = true;
    }
    // 检查API健康状态
    else if (apiStatus.status === 'healthy') {
      status = 'healthy';
      message = '系统运行正常，所有服务可用';
      canUseAPI = true;
      canUseFallback = true;
    }
    else if (apiStatus.status === 'degraded') {
      status = 'degraded';
      message = 'API响应较慢，建议使用降级模式';
      canUseAPI = true;
      canUseFallback = true;
    }
    else {
      status = 'degraded';
      message = 'API不可用，已切换到降级模式';
      canUseAPI = false;
      canUseFallback = true;
    }

    // 检查客户端状态
    if (clientStatus && clientStatus.performanceMetrics.errorRate > 0.5) {
      status = 'degraded';
      message += ' (错误率较高)';
    }

    return { status, message, canUseAPI, canUseFallback };
  }, []);

  /**
   * 检查并发送通知
   */
  const checkAndNotify = useCallback((status: SystemStatus) => {
    // 这里可以实现通知逻辑，比如：
    // - 状态从健康变为失败时通知
    // - 配置问题时通知
    // - 性能问题时通知
    
    if (status.overall.status === 'failed' && status.config.issues.length > 0) {
      console.warn('系统配置存在问题:', status.config.issues);
    }
    
    if (status.client && status.client.performanceMetrics.errorRate > 0.3) {
      console.warn('API错误率较高:', status.client.performanceMetrics.errorRate);
    }
  }, []);

  /**
   * 手动刷新状态
   */
  const refreshStatus = useCallback(async () => {
    await updateSystemStatus();
  }, [updateSystemStatus]);

  /**
   * 强制健康检查
   */
  const forceHealthCheck = useCallback(async () => {
    await defaultHealthMonitor.performHealthCheck();
    await updateSystemStatus();
  }, [updateSystemStatus]);

  /**
   * 获取诊断报告
   */
  const getDiagnosticReport = useCallback(() => {
    const configReport = defaultConfigManager.generateDiagnosticReport();
    const healthStatus = defaultHealthMonitor.getHealthStatus();
    const clientStatus = defaultHealthMonitor.getGLMClientStatus();
    
    let report = '# 系统诊断报告\n\n';
    report += `**生成时间**: ${new Date().toLocaleString()}\n`;
    report += `**整体状态**: ${systemStatus.overall.status.toUpperCase()}\n`;
    report += `**状态信息**: ${systemStatus.overall.message}\n\n`;
    
    // API状态
    report += '## API健康状态\n\n';
    report += `- **状态**: ${healthStatus.status}\n`;
    report += `- **推荐模式**: ${healthStatus.recommendedMode}\n`;
    report += `- **GLM连接**: ${healthStatus.connections.glm.success ? '✅ 正常' : '❌ 失败'}\n`;
    if (healthStatus.connections.glm.error) {
      report += `- **错误信息**: ${healthStatus.connections.glm.error}\n`;
    }
    report += `- **延迟**: ${healthStatus.connections.glm.latency}ms\n\n`;
    
    // 客户端状态
    if (clientStatus) {
      report += '## 客户端状态\n\n';
      report += `- **配置状态**: ${clientStatus.isConfigured ? '✅ 已配置' : '❌ 未配置'}\n`;
      report += `- **速率限制**: ${clientStatus.rateLimitStatus.current}/${clientStatus.rateLimitStatus.limit}\n`;
      report += `- **缓存大小**: ${clientStatus.cacheStatus.size}\n`;
      report += `- **平均延迟**: ${clientStatus.performanceMetrics.averageLatency.toFixed(0)}ms\n`;
      report += `- **错误率**: ${(clientStatus.performanceMetrics.errorRate * 100).toFixed(1)}%\n\n`;
    }
    
    // 配置报告
    report += configReport;
    
    return report;
  }, [systemStatus]);

  /**
   * 获取性能指标
   */
  const getPerformanceMetrics = useCallback(() => {
    const clientStatus = defaultHealthMonitor.getGLMClientStatus();
    if (!clientStatus) return null;
    
    return {
      ...clientStatus.performanceMetrics,
      cacheHitRate: clientStatus.cacheStatus.size > 0 ? 0.8 : 0, // 估算值
      uptime: Date.now() - (systemStatus.api.lastCheck || Date.now()),
      memoryUsage: typeof performance !== 'undefined' && 'memory' in performance 
        ? {
            used: (performance as any).memory.usedJSHeapSize,
            total: (performance as any).memory.totalJSHeapSize,
            limit: (performance as any).memory.jsHeapSizeLimit
          }
        : null
    };
  }, [systemStatus]);

  /**
   * 导出状态数据
   */
  const exportStatusData = useCallback(() => {
    return {
      timestamp: Date.now(),
      systemStatus,
      diagnosticReport: getDiagnosticReport(),
      performanceMetrics: getPerformanceMetrics()
    };
  }, [systemStatus, getDiagnosticReport, getPerformanceMetrics]);

  // 初始化监控
  useEffect(() => {
    if (!isMonitoring) {
      setIsMonitoring(true);
      updateSystemStatus();
    }
  }, [isMonitoring, updateSystemStatus]);

  // 定期刷新
  useEffect(() => {
    if (!enableAutoRefresh) return;

    const interval = setInterval(() => {
      updateSystemStatus();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [enableAutoRefresh, refreshInterval, updateSystemStatus]);

  // 监听配置变化
  useEffect(() => {
    const unsubscribe = defaultConfigManager.addListener((event: ConfigChangeEvent) => {
      console.info('配置变化事件:', event);
      updateSystemStatus();
    });

    return unsubscribe;
  }, [updateSystemStatus]);

  // 监听API健康状态变化
  useEffect(() => {
    const handleHealthChange = () => {
      updateSystemStatus();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('api-health-change', handleHealthChange);
      return () => window.removeEventListener('api-health-change', handleHealthChange);
    }
  }, [updateSystemStatus]);

  return {
    // 状态数据
    systemStatus,
    isMonitoring,
    lastUpdate,
    
    // 操作方法
    refreshStatus,
    forceHealthCheck,
    getDiagnosticReport,
    getPerformanceMetrics,
    exportStatusData,
    
    // 便捷属性
    isHealthy: systemStatus.overall.status === 'healthy',
    canUseAPI: systemStatus.overall.canUseAPI,
    canUseFallback: systemStatus.overall.canUseFallback,
    hasConfigIssues: systemStatus.config.issues.length > 0,
    
    // 配置快捷方式
    configManager: defaultConfigManager,
    healthMonitor: defaultHealthMonitor
  };
};

/**
 * 轻量级系统状态Hook - 仅获取基本状态
 */
export const useSystemStatus = () => {
  const [status, setStatus] = useState<'healthy' | 'degraded' | 'failed'>('failed');
  const [canUseAPI, setCanUseAPI] = useState(false);
  const [message, setMessage] = useState('检查中...');

  useEffect(() => {
    const updateStatus = () => {
      const healthStatus = defaultHealthMonitor.getHealthStatus();
      const configStatus = defaultConfigManager.getConfigStatus();
      
      if (!configStatus.isValid) {
        setStatus('failed');
        setCanUseAPI(false);
        setMessage('配置无效');
      } else if (healthStatus.status === 'healthy') {
        setStatus('healthy');
        setCanUseAPI(true);
        setMessage('系统正常');
      } else if (healthStatus.status === 'degraded') {
        setStatus('degraded');
        setCanUseAPI(healthStatus.recommendedMode === 'api');
        setMessage('性能降级');
      } else {
        setStatus('failed');
        setCanUseAPI(false);
        setMessage('API不可用');
      }
    };

    updateStatus();
    
    const interval = setInterval(updateStatus, 10000); // 10秒更新一次
    return () => clearInterval(interval);
  }, []);

  return { status, canUseAPI, message };
};

export default useSystemMonitor;