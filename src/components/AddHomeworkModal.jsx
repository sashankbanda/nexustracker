// src/components/AddHomeworkModal.jsx
import React, { useState } from 'react';
import './AddHomeworkModal.css'; // Add a CSS file for styling

const AddHomeworkModal = ({ isOpen, onClose, onAdd }) => {
  const [homeworkTitle, setHomeworkTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [subject, setSubject] = useState(''); // Added subject field

  const handleSubmit = (e) => {
    e.preventDefault();
    if (homeworkTitle && dueDate) {
      onAdd({
        title: homeworkTitle,
        deadline: dueDate,
        subject: subject || 'General', // Default to 'General' if not provided
      });
      // Reset form fields
      setHomeworkTitle('');
      setDueDate('');
      setSubject('');
      onClose(); // Close the modal
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 transition-colors duration-300">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 flex items-center justify-between">
          <span>Tasks & Deadlines 🚀</span>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            title="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Homework Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., 'Maths Homework'"
              value={homeworkTitle}
              onChange={(e) => setHomeworkTitle(e.target.value)}
              className="mt-1 block w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              required
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Subject (Optional)
            </label>
            <input
              id="subject"
              type="text"
              placeholder="e.g., 'Mathematics'"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>

          <div>
            <label
              htmlFor="due-date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Due Date
            </label>
            <input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1 block w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 p-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Add Homework
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddHomeworkModal;