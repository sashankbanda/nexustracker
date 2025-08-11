// src/components/RewardModal.jsx

import React from 'react';

const RewardModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm mx-4 text-center transition-colors duration-300">
        <h3 className="text-3xl font-bold text-yellow-500 mb-4 animate-bounce">🎉 You did it! 🎉</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">All tasks for the day are complete. Great job!</p>
        <button
          onClick={onClose}
          className="px-6 py-2 rounded-lg text-white font-semibold bg-green-600 hover:bg-green-700 transition-colors"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
};

export default RewardModal;