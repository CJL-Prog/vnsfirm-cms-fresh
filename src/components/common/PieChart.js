import React from 'react';

/**
 * PieChart component
 * Simple SVG pie chart for data visualization
 * 
 * @param {Array} data - Array of data objects with label, value, percentage, and color
 * @param {number} size - Size of the chart in pixels
 */
const PieChart = React.memo(({ data, size = 200 }) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 10;
  
  let cumulativePercentage = 0;
  
  // Create SVG path for a pie slice
  const createPath = (percentage) => {
    const startAngle = cumulativePercentage * 2 * Math.PI;
    const endAngle = (cumulativePercentage + percentage) * 2 * Math.PI;
    
    const startX = centerX + radius * Math.cos(startAngle - Math.PI / 2);
    const startY = centerY + radius * Math.sin(startAngle - Math.PI / 2);
    const endX = centerX + radius * Math.cos(endAngle - Math.PI / 2);
    const endY = centerY + radius * Math.sin(endAngle - Math.PI / 2);
    
    const largeArc = percentage > 0.5 ? 1 : 0;
    
    cumulativePercentage += percentage;
    
    // Special case for 100% to create a full circle
    if (percentage === 1) {
      return `M ${centerX + radius} ${centerY} A ${radius} ${radius} 0 1 1 ${centerX + radius - 0.01} ${centerY}`;
    }
    
    return `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
  };
  
  // Reset for actual rendering
  cumulativePercentage = 0;
  
  return (
    <div className="pie-chart-container">
      <svg width={size} height={size} aria-label="Pie chart" role="img">
        {data.map((segment, index) => {
          const path = createPath(segment.percentage);
          return (
            <path
              key={index}
              d={path}
              fill={segment.color}
              stroke="#fff"
              strokeWidth="2"
              aria-label={`${segment.label}: ${Math.round(segment.percentage * 100)}%`}
            />
          );
        })}
      </svg>
      <div className="pie-chart-legend">
        {data.map((segment, index) => (
          <div key={index} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: segment.color }}
              aria-hidden="true"
            ></div>
            <span className="legend-label">
              {segment.label}: ${segment.value.toLocaleString()} ({Math.round(segment.percentage * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

export default PieChart;