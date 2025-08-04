import React, { useRef, useEffect } from 'react';

interface DataPoint {
  x: number | string;
  y: number;
  label?: string;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  showDots?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  className?: string;
  yAxisLabel?: string;
  xAxisLabel?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 400,
  height = 200,
  color = '#3B82F6',
  strokeWidth = 2,
  showDots = true,
  showGrid = true,
  showTooltip = true,
  className = '',
  yAxisLabel,
  xAxisLabel
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xValues = data.map((d, i) => typeof d.x === 'string' ? i : d.x);
  const yValues = data.map(d => d.y);

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues, 0);
  const yMax = Math.max(...yValues);

  const xScale = (x: number) => ((x - xMin) / (xMax - xMin)) * chartWidth;
  const yScale = (y: number) => chartHeight - ((y - yMin) / (yMax - yMin)) * chartHeight;

  const pathData = data.map((d, i) => {
    const x = xScale(xValues[i]);
    const y = yScale(d.y);
    return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!showTooltip || !tooltipRef.current) return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = event.clientX - rect.left - padding.left;
    const dataIndex = Math.round((mouseX / chartWidth) * (data.length - 1));
    
    if (dataIndex >= 0 && dataIndex < data.length) {
      const point = data[dataIndex];
      const tooltip = tooltipRef.current;
      
      tooltip.style.display = 'block';
      tooltip.style.left = `${event.clientX + 10}px`;
      tooltip.style.top = `${event.clientY - 10}px`;
      tooltip.innerHTML = `
        <div class="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg">
          <div>${point.label || point.x}</div>
          <div class="font-semibold">${point.y}</div>
        </div>
      `;
    }
  };

  const handleMouseLeave = () => {
    if (tooltipRef.current) {
      tooltipRef.current.style.display = 'none';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.2} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* 网格线 */}
        {showGrid && (
          <g className="opacity-30">
            {/* 水平网格线 */}
            {Array.from({ length: 5 }, (_, i) => {
              const y = padding.top + (i * chartHeight) / 4;
              return (
                <line
                  key={`h-grid-${i}`}
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth={1}
                />
              );
            })}
            
            {/* 垂直网格线 */}
            {Array.from({ length: 6 }, (_, i) => {
              const x = padding.left + (i * chartWidth) / 5;
              return (
                <line
                  key={`v-grid-${i}`}
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + chartHeight}
                  stroke="#E5E7EB"
                  strokeWidth={1}
                />
              );
            })}
          </g>
        )}

        {/* Y轴 */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={padding.top + chartHeight}
          stroke="#6B7280"
          strokeWidth={1}
        />

        {/* X轴 */}
        <line
          x1={padding.left}
          y1={padding.top + chartHeight}
          x2={padding.left + chartWidth}
          y2={padding.top + chartHeight}
          stroke="#6B7280"
          strokeWidth={1}
        />

        {/* Y轴标签 */}
        {Array.from({ length: 5 }, (_, i) => {
          const value = yMin + (i * (yMax - yMin)) / 4;
          const y = padding.top + chartHeight - (i * chartHeight) / 4;
          return (
            <text
              key={`y-label-${i}`}
              x={padding.left - 10}
              y={y + 4}
              textAnchor="end"
              className="text-xs fill-gray-600"
            >
              {Math.round(value)}
            </text>
          );
        })}

        {/* X轴标签 */}
        {data.map((d, i) => {
          if (i % Math.ceil(data.length / 6) !== 0) return null;
          const x = padding.left + xScale(xValues[i]);
          return (
            <text
              key={`x-label-${i}`}
              x={x}
              y={padding.top + chartHeight + 20}
              textAnchor="middle"
              className="text-xs fill-gray-600"
            >
              {typeof d.x === 'string' ? d.x : d.x.toString()}
            </text>
          );
        })}

        {/* 填充区域 */}
        <path
          d={`${pathData} L ${padding.left + xScale(xValues[xValues.length - 1])} ${padding.top + chartHeight} L ${padding.left + xScale(xValues[0])} ${padding.top + chartHeight} Z`}
          fill={`url(#gradient-${color})`}
        />

        {/* 线条 */}
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 数据点 */}
          {showDots && data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(xValues[i])}
              cy={yScale(d.y)}
              r={3}
              fill={color}
              stroke="white"
              strokeWidth={2}
              className="hover:r-4 transition-all cursor-pointer"
            />
          ))}
        </g>

        {/* 坐标轴标题 */}
        {yAxisLabel && (
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
      </svg>

      {/* 工具提示 */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute pointer-events-none z-10"
          style={{ display: 'none' }}
        />
      )}
    </div>
  );
};

export default LineChart;