// src/components/ProgressTracker.jsx

import React from 'react';

const ProgressTracker = ({ completedCount, remainingCount }) => {
  const totalTasks = completedCount + remainingCount;
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 transition-colors duration-300">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Today's Progress</h3>
      <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-sm mb-2">
        <span>Completed: {completedCount}</span>
        <span>Remaining: {remainingCount}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressTracker;