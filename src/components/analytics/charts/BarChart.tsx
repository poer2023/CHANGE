import React, { useRef } from 'react';

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  horizontal?: boolean;
  showValues?: boolean;
  showGrid?: boolean;
  className?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
  animate?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 400,
  height = 300,
  horizontal = false,
  showValues = true,
  showGrid = true,
  className = '',
  yAxisLabel,
  xAxisLabel,
  animate = true
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const padding = { top: 20, right: 30, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const values = data.map(d => d.value);
  const maxValue = Math.max(...values, 0);
  const minValue = Math.min(...values, 0);

  const getBarColor = (index: number, customColor?: string): string => {
    if (customColor) return customColor;
    
    const colors = [
      '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
      '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
    ];
    return colors[index % colors.length];
  };

  const renderVerticalBars = () => {
    const barWidth = chartWidth / data.length * 0.8;
    const barSpacing = chartWidth / data.length * 0.2;

    return data.map((item, index) => {
      const barHeight = Math.abs(item.value / maxValue) * chartHeight;
      const x = padding.left + index * (barWidth + barSpacing) + barSpacing / 2;
      const y = item.value >= 0 
        ? padding.top + chartHeight - barHeight
        : padding.top + chartHeight;

      return (
        <g key={index}>
          {/* 柱形 */}
          <rect
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill={getBarColor(index, item.color)}
            rx={2}
            className={`${animate ? 'animate-scale-in' : ''} hover:opacity-80 transition-opacity cursor-pointer`}
            style={{
              animationDelay: animate ? `${index * 100}ms` : '0ms',
              transformOrigin: 'bottom'
            }}
          />

          {/* 数值标签 */}
          {showValues && (
            <text
              x={x + barWidth / 2}
              y={item.value >= 0 ? y - 5 : y + barHeight + 15}
              textAnchor="middle"
              className="text-xs fill-gray-700 font-medium"
            >
              {item.value}
            </text>
          )}

          {/* 标签 */}
          <text
            x={x + barWidth / 2}
            y={padding.top + chartHeight + 20}
            textAnchor="middle"
            className="text-xs fill-gray-600"
            transform={data.length > 6 ? `rotate(-45, ${x + barWidth / 2}, ${padding.top + chartHeight + 20})` : ''}
          >
            {item.label}
          </text>
        </g>
      );
    });
  };

  const renderHorizontalBars = () => {
    const barHeight = chartHeight / data.length * 0.8;
    const barSpacing = chartHeight / data.length * 0.2;

    return data.map((item, index) => {
      const barWidth = Math.abs(item.value / maxValue) * chartWidth;
      const x = item.value >= 0 ? padding.left : padding.left + chartWidth - barWidth;
      const y = padding.top + index * (barHeight + barSpacing) + barSpacing / 2;

      return (
        <g key={index}>
          {/* 柱形 */}
          <rect
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill={getBarColor(index, item.color)}
            rx={2}
            className={`${animate ? 'animate-scale-in' : ''} hover:opacity-80 transition-opacity cursor-pointer`}
            style={{
              animationDelay: animate ? `${index * 100}ms` : '0ms',
              transformOrigin: 'left'
            }}
          />

          {/* 数值标签 */}
          {showValues && (
            <text
              x={item.value >= 0 ? x + barWidth + 5 : x - 5}
              y={y + barHeight / 2 + 4}
              textAnchor={item.value >= 0 ? 'start' : 'end'}
              className="text-xs fill-gray-700 font-medium"
            >
              {item.value}
            </text>
          )}

          {/* 标签 */}
          <text
            x={padding.left - 10}
            y={y + barHeight / 2 + 4}
            textAnchor="end"
            className="text-xs fill-gray-600"
          >
            {item.label}
          </text>
        </g>
      );
    });
  };

  const renderGrid = () => {
    if (!showGrid) return null;

    const lines = [];
    const gridCount = 5;

    if (horizontal) {
      // 垂直网格线（水平条形图）
      for (let i = 0; i <= gridCount; i++) {
        const x = padding.left + (i * chartWidth) / gridCount;
        lines.push(
          <line
            key={`grid-v-${i}`}
            x1={x}
            y1={padding.top}
            x2={x}
            y2={padding.top + chartHeight}
            stroke="#E5E7EB"
            strokeWidth={1}
            opacity={0.5}
          />
        );
      }
    } else {
      // 水平网格线（垂直条形图）
      for (let i = 0; i <= gridCount; i++) {
        const y = padding.top + (i * chartHeight) / gridCount;
        lines.push(
          <line
            key={`grid-h-${i}`}
            x1={padding.left}
            y1={y}
            x2={padding.left + chartWidth}
            y2={y}
            stroke="#E5E7EB"
            strokeWidth={1}
            opacity={0.5}
          />
        );
      }
    }

    return <g>{lines}</g>;
  };

  const renderAxes = () => {
    return (
      <g>
        {/* Y轴 */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="#6B7280"
          strokeWidth={2}
        />

        {/* X轴 */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke="#6B7280"
          strokeWidth={2}
        />

        {/* 刻度标签 */}
        {!horizontal && (
          // 垂直条形图的Y轴标签
          Array.from({ length: 6 }, (_, i) => {
            const value = (maxValue * i) / 5;
            const y = padding.top + chartHeight - (i * chartHeight) / 5;
            return (
              <text
                key={`y-tick-${i}`}
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-600"
              >
                {Math.round(value)}
              </text>
            );
          })
        )}

        {horizontal && (
          // 水平条形图的X轴标签
          Array.from({ length: 6 }, (_, i) => {
            const value = (maxValue * i) / 5;
            const x = padding.left + (i * chartWidth) / 5;
            return (
              <text
                key={`x-tick-${i}`}
                x={x}
                y={padding.top + chartHeight + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {Math.round(value)}
              </text>
            );
          })
        )}
      </g>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      >
        {renderGrid()}
        {renderAxes()}
        {horizontal ? renderHorizontalBars() : renderVerticalBars()}

        {/* 坐标轴标题 */}
        {yAxisLabel && !horizontal && (
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90, 15, ${height / 2})`}
            className="text-sm fill-gray-700 font-medium"
          >
            {yAxisLabel}
          </text>
        )}

        {xAxisLabel && (
          <text
            x={width / 2}
            y={height - 5}
            textAnchor="middle"
            className="text-sm fill-gray-700 font-medium"
          >
            {xAxisLabel}
          </text>
        )}

        {yAxisLabel && horizontal && (
          <text
            x={15}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90, 15, ${height / 2})`}
            className="text-sm fill-gray-700 font-medium"
          >
            {yAxisLabel}
          </text>
        )}
      </svg>

      {/* 图例 */}
      {data.some(d => d.color) && (
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {data.map((item, index) => (
            <div key={index} className="flex items-center text-xs">
              <div
                className="w-3 h-3 rounded mr-2"
                style={{ backgroundColor: getBarColor(index, item.color) }}
              />
              <span className="text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BarChart;