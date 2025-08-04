import React, { useState } from 'react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: DataPoint[];
  size?: number;
  innerRadius?: number;
  showLabels?: boolean;
  showPercentages?: boolean;
  showLegend?: boolean;
  className?: string;
  animate?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
  innerRadius = 0,
  showLabels = true,
  showPercentages = true,
  showLegend = true,
  className = '',
  animate = true
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const radius = size / 2 - 10;
  const center = size / 2;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const getDefaultColor = (index: number): string => {
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
      '#8B5CF6', '#06B6D4', '#84CC16', '#F97316',
      '#EC4899', '#6366F1', '#14B8A6', '#F43F5E'
    ];
    return colors[index % colors.length];
  };

  const createPath = (
    startAngle: number,
    endAngle: number,
    outerRadius: number,
    innerRadius: number
  ): string => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = center + outerRadius * Math.cos(startAngleRad);
    const y1 = center + outerRadius * Math.sin(startAngleRad);
    const x2 = center + outerRadius * Math.cos(endAngleRad);
    const y2 = center + outerRadius * Math.sin(endAngleRad);

    const x3 = center + innerRadius * Math.cos(endAngleRad);
    const y3 = center + innerRadius * Math.sin(endAngleRad);
    const x4 = center + innerRadius * Math.cos(startAngleRad);
    const y4 = center + innerRadius * Math.sin(startAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    if (innerRadius === 0) {
      return [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
    } else {
      return [
        `M ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
        'Z'
      ].join(' ');
    }
  };

  const getLabelPosition = (startAngle: number, endAngle: number, radiusOffset: number = 0) => {
    const angle = (startAngle + endAngle) / 2;
    const angleRad = (angle - 90) * (Math.PI / 180);
    const labelRadius = radius * 0.7 + radiusOffset;
    
    return {
      x: center + labelRadius * Math.cos(angleRad),
      y: center + labelRadius * Math.sin(angleRad)
    };
  };

  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    const isHovered = hoveredIndex === index;
    const segmentRadius = isHovered ? radius + 5 : radius;
    const segmentInnerRadius = isHovered ? innerRadius + 2 : innerRadius;
    
    const path = createPath(startAngle, endAngle, segmentRadius, segmentInnerRadius);
    const color = item.color || getDefaultColor(index);
    
    const labelPos = getLabelPosition(startAngle, endAngle, isHovered ? 10 : 0);
    
    currentAngle += angle;
    
    return {
      ...item,
      path,
      color,
      percentage,
      startAngle,
      endAngle,
      labelPos,
      index
    };
  });

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {/* 扇形区域 */}
          {segments.map((segment) => (
            <g key={segment.index}>
              <path
                d={segment.path}
                fill={segment.color}
                stroke="white"
                strokeWidth={2}
                className={`transition-all duration-300 cursor-pointer ${
                  animate ? 'animate-scale-in' : ''
                } hover:opacity-90`}
                style={{
                  animationDelay: animate ? `${segment.index * 100}ms` : '0ms',
                  transformOrigin: `${center}px ${center}px`
                }}
                onMouseEnter={() => setHoveredIndex(segment.index)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              
              {/* 百分比标签 */}
              {showPercentages && segment.percentage > 5 && (
                <text
                  x={segment.labelPos.x}
                  y={segment.labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-white pointer-events-none"
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                >
                  {segment.percentage.toFixed(1)}%
                </text>
              )}
            </g>
          ))}

          {/* 中心文本（如果是环形图） */}
          {innerRadius > 0 && (
            <g>
              <text
                x={center}
                y={center - 8}
                textAnchor="middle"
                className="text-lg font-bold fill-gray-700"
              >
                总计
              </text>
              <text
                x={center}
                y={center + 8}
                textAnchor="middle"
                className="text-sm fill-gray-600"
              >
                {total}
              </text>
            </g>
          )}
        </svg>

        {/* 悬停工具提示 */}
        {hoveredIndex !== null && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
            <div className="bg-gray-900 text-white text-xs rounded px-3 py-2 shadow-lg">
              <div className="font-semibold">{segments[hoveredIndex].label}</div>
              <div>值: {segments[hoveredIndex].value}</div>
              <div>占比: {segments[hoveredIndex].percentage.toFixed(1)}%</div>
            </div>
          </div>
        )}
      </div>

      {/* 图例 */}
      {showLegend && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {segments.map((segment) => (
            <div
              key={segment.index}
              className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded"
              onMouseEnter={() => setHoveredIndex(segment.index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-3 h-3 rounded mr-2 flex-shrink-0"
                style={{ backgroundColor: segment.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-gray-700 truncate">{segment.label}</div>
                {showLabels && (
                  <div className="text-gray-500">
                    {segment.value} ({segment.percentage.toFixed(1)}%)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PieChart;