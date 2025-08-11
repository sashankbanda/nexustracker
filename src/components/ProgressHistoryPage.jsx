// src/components/ProgressHistoryPage.jsx
import React from 'react';

const ProgressHistoryPage = ({ dailyProgressHistory }) => {
  const getProgressColor = (completed, total) => {
    if (total === 0) return 'bg-gray-400';
    const percentage = (completed / total) * 100;
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAchievementIcon = (completed, total) => {
    if (total === 0) return '😴';
    const percentage = (completed / total) * 100;
    if (percentage === 100) return '🎉';
    if (percentage >= 75) return '✅';
    if (percentage >= 50) return '💪';
    return '⚠️';
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 transition-colors duration-300">
        Progress History 📈
      </h2>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Past Performance</h3>
        {dailyProgressHistory.length > 0 ? (
          <ul className="space-y-4">
            {dailyProgressHistory
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((progress) => {
                const totalTasks = progress.total || 0;
                const completedTasks = progress.completed || 0;
                const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                const progressColor = getProgressColor(completedTasks, totalTasks);
                const achievementIcon = getAchievementIcon(completedTasks, totalTasks);

                return (
                  <li
                    key={progress.id}
                    className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 transition-colors duration-300 flex items-center space-x-4"
                  >
                    <div className="text-4xl">{achievementIcon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {new Date(progress.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        Completed {completedTasks} of {totalTasks} tasks.
                      </p>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ease-out ${progressColor}`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {progressPercentage.toFixed(0)}%
                      </span>
                    </div>
                  </li>
                );
              })}
          </ul>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="mb-2">No history available yet.</p>
            <p>Complete some tasks and come back tomorrow to see your first entry!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressHistoryPage;