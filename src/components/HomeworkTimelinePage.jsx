// src/components/HomeworkTimelinePage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import AddHomeworkModal from './AddHomeworkModal'; // Import the new modal component
import './HomeworkTimelinePage.css'; // Add a CSS file for styling

// HomeworkTimelinePage now accepts props from its parent (App.jsx)
// This ensures that the data is loaded from and saved to Firestore.
const HomeworkTimelinePage = ({ homeworkTasks, onAddHomework, onDeleteHomework }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('deadline');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Memoized sorting logic
  const sortedTasks = useMemo(() => {
    const sorted = [...homeworkTasks];
    if (sortBy === 'deadline') {
      sorted.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortBy === 'subject') {
      sorted.sort((a, b) => a.subject.localeCompare(b.subject));
    }
    return sorted;
  }, [homeworkTasks, sortBy]);

  // Utility functions to calculate time and progress
  const getTimeRemaining = (deadline) => {
    const end = new Date(deadline);
    const diff = end - currentTime;
    if (diff <= 0) return 'Overdue';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s left`;
  };

  const calculateProgress = (assignedDate, deadline) => {
    const start = new Date(assignedDate);
    const end = new Date(deadline);
    const now = currentTime;

    if (now > end) {
      return 100;
    }

    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = now.getTime() - start.getTime();

    if (totalDuration <= 0) {
      return 0;
    }

    const percentElapsed = (elapsedDuration / totalDuration) * 100;
    return Math.min(100, Math.max(0, percentElapsed));
  };

  const getUrgencyColor = (daysLeft, hoursLeft) => {
    if (daysLeft < 1 && hoursLeft < 12) return 'bg-red-600';
    if (daysLeft < 1) return 'bg-red-400';
    if (daysLeft <= 3) return 'bg-orange-400';
    return 'bg-green-500';
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
          Homework Timeline
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all"
        >
          Add Homework
        </button>
      </div>

      <div className="flex justify-start items-center mb-6">
        <span className="text-sm text-gray-600 dark:text-gray-400 mr-4">
          Sort by:
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => setSortBy('deadline')}
            className={`px-4 py-2 text-sm rounded-full transition-all ${
              sortBy === 'deadline'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            By Deadline
          </button>
          <button
            onClick={() => setSortBy('subject')}
            className={`px-4 py-2 text-sm rounded-full transition-all ${
              sortBy === 'subject'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            By Subject
          </button>
      </div>
      </div>
      <ul className="space-y-6">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((hw) => {
            const deadlineDate = new Date(hw.deadline);
            const now = currentTime;
            const diff = deadlineDate - now;
            const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
            const hoursLeft = Math.ceil(diff / (1000 * 60 * 60));
            const isOverdue = diff <= 0;
            const urgencyColor = getUrgencyColor(daysLeft, hoursLeft);
            const progress = calculateProgress(hw.assignedDate, hw.deadline);
            const remainingTimeText = getTimeRemaining(hw.deadline);
            const isPulsing = hoursLeft < 12 && hoursLeft > 0;

            return (
              <li
                key={hw.id}
                className={`p-6 rounded-xl border border-gray-300 dark:border-gray-600 transition-shadow duration-300 ${
                  isOverdue
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'bg-white dark:bg-gray-800 hover:shadow-lg'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p
                      className={`text-gray-900 dark:text-gray-100 font-medium text-xl ${
                        isOverdue
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : ''
                      }`}
                    >
                      {hw.title}
                    </p>
                    <p
                      className={`text-sm ${
                        isOverdue
                          ? 'text-gray-500 dark:text-gray-400'
                          : 'text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {hw.subject}
                      </span>{' '}
                      - Due on{' '}
                      <span className="font-mono">
                        {new Date(hw.deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteHomework(hw.id)}
                    className="p-2 ml-4 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500 transition-colors"
                    title="Delete Task"
                  >
                    <svg
                      xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {!isOverdue && (
                  <div className="flex items-center space-x-4 mt-4">
                    <p
                      className={`text-sm font-mono text-gray-600 dark:text-gray-400 w-36 flex-shrink-0 ${
                        isPulsing ? 'text-red-500 dark:text-red-400' : ''
                      }`}
                    >
                      {remainingTimeText}
                    </p>
                    <div className="flex-1 h-3 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${urgencyColor} ${
                          isPulsing ? 'pulse-animation' : ''
                        }`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {isOverdue && (
                  <p className="text-red-500 dark:text-red-400 text-sm font-bold mt-2">
                    This task is overdue.
                  </p>
                )}
              </li>
            );
          })
        ) : (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p className="mb-4">No homework tasks added yet. 🥳</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
            >
              Add Your First Homework
            </button>
          </div>
        )}
      </ul>
      <AddHomeworkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={onAddHomework}
      />
    </div>
  );
};

export default HomeworkTimelinePage;