import React from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle, AlertTriangle, XCircle, Award, TrendingUp, TrendingDown } from 'lucide-react';

interface QualityIndicatorProps {
  score: number; // 0-100
  grade?: 'A' | 'B' | 'C' | 'D' | 'F';
  size?: 'small' | 'medium' | 'large';
  showScore?: boolean;
  showGrade?: boolean;
  showIcon?: boolean;
  showTrend?: boolean;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
    isImprovement: boolean;
  };
  className?: string;
  animated?: boolean;
  onClick?: () => void;
}

const QualityIndicator: React.FC<QualityIndicatorProps> = ({
  score,
  grade,
  size = 'medium',
  showScore = true,
  showGrade = true,
  showIcon = true,
  showTrend = false,
  trend,
  className = '',
  animated = true,
  onClick
}) => {
  // 根据分数确定等级
  const calculatedGrade = grade || getGradeFromScore(score);
  
  // 根据分数确定颜色和状态
  const getQualityConfig = (score: number, grade: string) => {
    if (score >= 90 || grade === 'A') {
      return {
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        borderColor: 'border-green-300',
        icon: Award,
        label: '优秀',
        description: '质量很高'
      };
    } else if (score >= 80 || grade === 'B') {
      return {
        color: 'blue',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800',
        borderColor: 'border-blue-300',
        icon: CheckCircle,
        label: '良好',
        description: '质量不错'
      };
    } else if (score >= 70 || grade === 'C') {
      return {
        color: 'yellow',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
        borderColor: 'border-yellow-300',
        icon: AlertTriangle,
        label: '一般',
        description: '需要改进'
      };
    } else if (score >= 60 || grade === 'D') {
      return {
        color: 'orange',
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        borderColor: 'border-orange-300',
        icon: AlertTriangle,
        label: '待改进',
        description: '有待提升'
      };
    } else {
      return {
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        borderColor: 'border-red-300',
        icon: XCircle,
        label: '需重写',
        description: '质量较差'
      };
    }
  };

  const config = getQualityConfig(score, calculatedGrade);
  const Icon = config.icon;

  // 尺寸配置
  const sizeConfig = {
    small: {
      container: 'px-2 py-1',
      text: 'text-xs',
      icon: 'w-3 h-3',
      score: 'text-sm font-medium',
      grade: 'text-xs font-bold'
    },
    medium: {
      container: 'px-3 py-2',
      text: 'text-sm',
      icon: 'w-4 h-4',
      score: 'text-lg font-semibold',
      grade: 'text-sm font-bold'
    },
    large: {
      container: 'px-6 py-4',
      text: 'text-base',
      icon: 'w-8 h-8',
      score: 'text-3xl font-bold',
      grade: 'text-lg font-bold'
    }
  };

  const currentSize = sizeConfig[size];

  // 圆形进度条组件
  const CircularProgress = ({ value, size: circularSize = 60, strokeWidth = 4 }: {
    value: number;
    size?: number;
    strokeWidth?: number;
  }) => {
    const radius = (circularSize - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg
          className={animated ? 'transform -rotate-90 transition-all duration-1000' : 'transform -rotate-90'}
          width={circularSize}
          height={circularSize}
        >
          {/* 背景圆 */}
          <circle
            cx={circularSize / 2}
            cy={circularSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200"
          />
          {/* 进度圆 */}
          <circle
            cx={circularSize / 2}
            cy={circularSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? offset : circumference - (value / 100) * circumference}
            strokeLinecap="round"
            className={`text-${config.color}-600 transition-all duration-1000 ease-out`}
          />
        </svg>
        {/* 中心内容 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {showScore && (
              <div className={cn(currentSize.score, config.textColor)}>
                {Math.round(score)}
              </div>
            )}
            {showGrade && size !== 'small' && (
              <div className={cn(currentSize.grade, 'text-gray-600')}>
                {calculatedGrade}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 线性进度条组件
  const LinearProgress = () => (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        {showScore && (
          <span className={cn(currentSize.score, config.textColor)}>
            {Math.round(score)}分
          </span>
        )}
        {showGrade && (
          <span className={cn(currentSize.grade, config.textColor)}>
            {calculatedGrade}级
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn(
            `bg-${config.color}-600 h-2 rounded-full transition-all duration-1000 ease-out`,
            animated ? 'transform-gpu' : ''
          )}
          style={{ 
            width: animated ? `${score}%` : `${score}%`,
            transition: animated ? 'width 1000ms ease-out' : 'none'
          }}
        />
      </div>
    </div>
  );

  // 徽章样式组件
  const Badge = () => (
    <div
      className={cn(
        'inline-flex items-center space-x-2 rounded-full border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        currentSize.container,
        onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '',
        animated ? 'transform hover:scale-105 transition-transform' : '',
        className
      )}
      onClick={onClick}
    >
      {showIcon && <Icon className={currentSize.icon} />}
      <div className="flex items-center space-x-1">
        {showScore && (
          <span className={currentSize.score}>
            {Math.round(score)}
          </span>
        )}
        {showGrade && (
          <span className={currentSize.grade}>
            {calculatedGrade}
          </span>
        )}
      </div>
      {showTrend && trend && (
        <div className="flex items-center space-x-1">
          {trend.direction === 'up' ? (
            <TrendingUp className={cn(
              currentSize.icon,
              trend.isImprovement ? 'text-green-600' : 'text-red-600'
            )} />
          ) : trend.direction === 'down' ? (
            <TrendingDown className={cn(
              currentSize.icon,
              trend.isImprovement ? 'text-red-600' : 'text-green-600'
            )} />
          ) : null}
          <span className="text-xs">
            {Math.abs(trend.value)}%
          </span>
        </div>
      )}
    </div>
  );

  // 卡片样式组件
  const Card = () => (
    <div
      className={cn(
        'bg-white rounded-lg border shadow-sm p-4',
        config.borderColor,
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showIcon && (
            <div className={cn('p-2 rounded-full', config.bgColor)}>
              <Icon className={cn(currentSize.icon, config.textColor)} />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              {showScore && (
                <span className={cn(currentSize.score, 'text-gray-900')}>
                  {Math.round(score)}分
                </span>
              )}
              {showGrade && (
                <span className={cn(currentSize.grade, config.textColor)}>
                  {calculatedGrade}级
                </span>
              )}
            </div>
            <p className={cn(currentSize.text, 'text-gray-600 mt-1')}>
              {config.description}
            </p>
          </div>
        </div>
        
        {size === 'large' && (
          <CircularProgress value={score} size={80} />
        )}
        
        {showTrend && trend && (
          <div className="text-right">
            <div className={cn(
              'flex items-center justify-end space-x-1',
              trend.isImprovement ? 'text-green-600' : 'text-red-600'
            )}>
              {trend.direction === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : trend.direction === 'down' ? (
                <TrendingDown className="w-4 h-4" />
              ) : null}
              <span className="text-sm font-medium">
                {trend.direction !== 'stable' ? `${Math.abs(trend.value)}%` : '持平'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {trend.isImprovement ? '比上次提升' : '比上次下降'}
            </p>
          </div>
        )}
      </div>
      
      {size !== 'small' && (
        <div className="mt-3">
          <LinearProgress />
        </div>
      )}
    </div>
  );

  // 根据大小决定渲染方式
  if (size === 'large') {
    return <Card />;
  } else if (size === 'medium') {
    return <Badge />;
  } else {
    return <Badge />;
  }
};

// 辅助函数：根据分数计算等级
function getGradeFromScore(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

// 辅助函数：获取质量描述
export function getQualityDescription(score: number): string {
  if (score >= 90) return '优秀 - 质量很高，符合学术标准';
  if (score >= 80) return '良好 - 质量不错，有小幅改进空间';
  if (score >= 70) return '一般 - 基本合格，需要一些改进';
  if (score >= 60) return '待改进 - 质量有待提升，需要重点改进';
  return '需重写 - 质量较差，建议重新撰写';
}

// 辅助函数：获取改进建议
export function getImprovementSuggestion(score: number): string[] {
  if (score >= 90) {
    return ['保持当前水平', '可以考虑更深入的学术探讨'];
  } else if (score >= 80) {
    return ['注意细节完善', '检查引用格式', '优化表达方式'];
  } else if (score >= 70) {
    return ['加强论证逻辑', '补充相关证据', '改善语言表达', '规范学术格式'];
  } else if (score >= 60) {
    return ['重新梳理结构', '增强内容深度', '修正语法错误', '完善引用规范'];
  } else {
    return ['重新规划内容结构', '深入研究主题', '大幅改善语言质量', '严格遵循学术规范'];
  }
}

export default QualityIndicator;