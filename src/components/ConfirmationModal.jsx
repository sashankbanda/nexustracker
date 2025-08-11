// src/components/ConfirmationModal.jsx

import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm mx-4 transition-colors duration-300">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{message}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">This action cannot be undone.</p>
        <div className="flex justify-end space-x-4">
          <button 
            onClick={onClose} 
            className="px-6 py-2 rounded-lg text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="px-6 py-2 rounded-lg text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;