// src/components/TaskDetailsModal.jsx

import React from 'react';

// Helper function to format time
const formatTime = (time) => {
  const [hour, minute] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinute = minute < 10 ? `0${minute}` : minute;
  return `${displayHour}:${displayMinute} ${period}`;
};

const TaskDetailsModal = ({ isOpen, onClose, task }) => {
  if (!isOpen || !task) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{task.title}</h2>
        <div className="mb-4 text-gray-600 dark:text-gray-400">
          <p className="font-medium">Time: <span className="font-normal">{formatTime(task.start)} - {formatTime(task.end)}</span></p>
          <p className="font-medium">Category: <span className="font-normal">{task.category}</span></p>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Resources</h3>
          {task.resources && task.resources.length > 0 ? (
            <ul className="space-y-2">
              {task.resources.map((resource, index) => (
                <li key={index} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex items-center justify-between">
                  {resource.type === 'link' ? (
                    <a href={resource.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline truncate">{resource.content}</a>
                  ) : (
                    <p className="text-gray-900 dark:text-gray-200">{resource.content}</p>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">{resource.type}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No resources for this task.</p>
          )}
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsModal;