// src/components/PieChart.jsx

import React, { useState } from 'react';

// Helper function to calculate duration in hours
const calculateDuration = (start, end) => {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const startDate = new Date(0, 0, 0, startHour, startMinute);
  const endDate = new Date(0, 0, 0, endHour, endMinute);
  const diff = endDate - startDate;
  return diff / (1000 * 60 * 60); // duration in hours
};

// Colors for the pie chart slices
const categoryColors = {
  'GATE': '#EF4444',
  'Placements': '#3B82F6',
  'Health': '#10B981',
  'Personal': '#A855F7',
  'College': '#F97316',
  'Other': '#6B7280'
};

const PieChart = ({ data }) => {
  const totalHours = 24;
  const [activeSlice, setActiveSlice] = useState(null);

  const getPieSlicePath = (startPercentage, endPercentage) => {
    const startAngle = startPercentage * 360 - 90;
    const endAngle = endPercentage * 360 - 90;
    const startX = 50 + 45 * Math.cos((Math.PI / 180) * startAngle);
    const startY = 50 + 45 * Math.sin((Math.PI / 180) * startAngle);
    const endX = 50 + 45 * Math.cos((Math.PI / 180) * endAngle);
    const endY = 50 + 45 * Math.sin((Math.PI / 180) * endAngle);
    const largeArcFlag = endPercentage - startPercentage > 0.5 ? 1 : 0;
    return `M 50,50 L ${startX},${startY} A 45,45 0 ${largeArcFlag},1 ${endX},${endY} Z`;
  };

  let cumulativePercentage = 0;
  const chartData = data.map(item => {
    const durationInHours = calculateDuration(item.start, item.end);
    const percentage = durationInHours / totalHours;
    const startPercentage = cumulativePercentage;
    cumulativePercentage += percentage;
    return { ...item, percentage, startPercentage };
  });

  const unallocatedPercentage = 1 - cumulativePercentage;
  if (unallocatedPercentage > 0) {
    chartData.push({
      title: 'Unallocated Time',
      category: 'Other',
      percentage: unallocatedPercentage,
      startPercentage: cumulativePercentage,
    });
  }

  return (
    <div className="relative w-48 h-48 mx-auto my-4 flex items-center justify-center group">
      <svg viewBox="0 0 100 100" className="w-full h-full transform transition-transform duration-300">
        {chartData.map((item, index) => {
          const startPercentage = item.startPercentage;
          const endPercentage = item.startPercentage + item.percentage;
          const pathD = getPieSlicePath(startPercentage, endPercentage);
          const color = categoryColors[item.category] || categoryColors['Other'];

          return (
            <path
              key={index}
              d={pathD}
              fill={color}
              className="transition-all duration-300 ease-in-out cursor-pointer hover:scale-105"
              onMouseEnter={() => setActiveSlice(item)}
              onMouseLeave={() => setActiveSlice(null)}
            />
          );
        })}
      </svg>
      <div className="absolute text-center text-gray-200">
        <div className="text-xl font-bold">Daily</div>
        <div className="text-sm">Progress</div>
      </div>
      {activeSlice && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-2 rounded-lg shadow-lg pointer-events-none transition-opacity duration-300 opacity-100 group-hover:opacity-100">
          <p className="text-xs font-semibold text-gray-100">{activeSlice.title}</p>
          <p className="text-xs text-gray-400">{activeSlice.percentage ? `${(activeSlice.percentage * 24).toFixed(1)} hrs` : ''}</p>
        </div>
      )}
    </div>
  );
};

export default PieChart;