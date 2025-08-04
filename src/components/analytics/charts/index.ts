// 导出所有图表组件
export { default as LineChart } from './LineChart';
export { default as BarChart } from './BarChart';
export { default as PieChart } from './PieChart';

// 图表数据类型定义
export interface ChartDataPoint {
  x: number | string;
  y: number;
  label?: string;
}

export interface BarDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface PieDataPoint {
  label: string;
  value: number;
  color?: string;
}

// 图表配置类型
export interface ChartConfig {
  width?: number;
  height?: number;
  color?: string;
  animate?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  className?: string;
}

// 图表工具函数
export const chartUtils = {
  /**
   * 生成默认颜色
   */
  getDefaultColors: (): string[] => [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
    '#EC4899', '#6366F1', '#14B8A6', '#F43F5E'
  ],

  /**
   * 格式化数值
   */
  formatValue: (value: number, type: 'number' | 'percentage' | 'currency' = 'number'): string => {
    switch (type) {
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'currency':
        return `¥${value.toLocaleString()}`;
      default:
        return value.toLocaleString();
    }
  },

  /**
   * 计算百分比
   */
  calculatePercentage: (value: number, total: number): number => {
    return total > 0 ? (value / total) * 100 : 0;
  },

  /**
   * 生成趋势线数据
   */
  generateTrendData: (data: number[], labels?: string[]): ChartDataPoint[] => {
    return data.map((value, index) => ({
      x: labels ? labels[index] : index,
      y: value,
      label: labels ? labels[index] : `Point ${index + 1}`
    }));
  },

  /**
   * 数据平滑处理
   */
  smoothData: (data: ChartDataPoint[], factor: number = 0.3): ChartDataPoint[] => {
    if (data.length < 3) return data;
    
    const smoothed = [...data];
    for (let i = 1; i < data.length - 1; i++) {
      const prev = typeof data[i - 1].y === 'number' ? data[i - 1].y : 0;
      const curr = typeof data[i].y === 'number' ? data[i].y : 0;
      const next = typeof data[i + 1].y === 'number' ? data[i + 1].y : 0;
      
      smoothed[i] = {
        ...data[i],
        y: curr * (1 - factor) + (prev + next) / 2 * factor
      };
    }
    
    return smoothed;
  },

  /**
   * 计算移动平均
   */
  calculateMovingAverage: (data: ChartDataPoint[], period: number = 3): ChartDataPoint[] => {
    if (data.length < period) return data;
    
    const result: ChartDataPoint[] = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1)
        .reduce((acc, point) => acc + (typeof point.y === 'number' ? point.y : 0), 0);
      
      result.push({
        ...data[i],
        y: sum / period
      });
    }
    
    return result;
  },

  /**
   * 数据归一化
   */
  normalizeData: (data: ChartDataPoint[], min: number = 0, max: number = 100): ChartDataPoint[] => {
    const values = data.map(d => typeof d.y === 'number' ? d.y : 0);
    const dataMin = Math.min(...values);
    const dataMax = Math.max(...values);
    const range = dataMax - dataMin;
    
    if (range === 0) return data;
    
    return data.map(point => ({
      ...point,
      y: min + ((typeof point.y === 'number' ? point.y : 0) - dataMin) / range * (max - min)
    }));
  },

  /**
   * 检测异常值
   */
  detectOutliers: (data: ChartDataPoint[], threshold: number = 2): number[] => {
    const values = data.map(d => typeof d.y === 'number' ? d.y : 0);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    const outliers: number[] = [];
    
    values.forEach((value, index) => {
      if (Math.abs(value - mean) > threshold * stdDev) {
        outliers.push(index);
      }
    });
    
    return outliers;
  },

  /**
   * 生成模拟数据
   */
  generateMockData: (
    count: number,
    type: 'trend' | 'random' | 'seasonal' = 'random',
    range: [number, number] = [0, 100]
  ): ChartDataPoint[] => {
    const data: ChartDataPoint[] = [];
    const [min, max] = range;
    
    for (let i = 0; i < count; i++) {
      let value: number;
      
      switch (type) {
        case 'trend':
          value = min + (max - min) * (i / count) + (Math.random() - 0.5) * (max - min) * 0.1;
          break;
        case 'seasonal':
          value = min + (max - min) * 0.5 + Math.sin(i * Math.PI * 2 / 12) * (max - min) * 0.3 + (Math.random() - 0.5) * (max - min) * 0.1;
          break;
        default:
          value = Math.random() * (max - min) + min;
      }
      
      data.push({
        x: i,
        y: Math.round(value),
        label: `Day ${i + 1}`
      });
    }
    
    return data;
  }
};

// 预设图表主题
export const chartThemes = {
  default: {
    colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    gridColor: '#E5E7EB',
    textColor: '#6B7280',
    backgroundColor: '#FFFFFF'
  },
  
  dark: {
    colors: ['#60A5FA', '#34D399', '#FBBF24', '#F87171'],
    gridColor: '#374151',
    textColor: '#D1D5DB',
    backgroundColor: '#1F2937'
  },
  
  colorful: {
    colors: ['#EC4899', '#8B5CF6', '#06B6D4', '#84CC16'],
    gridColor: '#E5E7EB',
    textColor: '#6B7280',
    backgroundColor: '#FFFFFF'
  },
  
  minimal: {
    colors: ['#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB'],
    gridColor: '#F3F4F6',
    textColor: '#6B7280',
    backgroundColor: '#FFFFFF'
  }
};

// 图表动画配置
export const chartAnimations = {
  fadeIn: {
    duration: 300,
    easing: 'ease-in-out'
  },
  
  scaleIn: {
    duration: 500,
    easing: 'ease-out'
  },
  
  slideIn: {
    duration: 400,
    easing: 'ease-in-out'
  }
};