// src/components/EditTimetableModal.jsx

import React, { useState, useEffect } from 'react';

const categoryColors = {
  'GATE': '#EF4444',
  'Placements': '#3B82F6',
  'Health': '#10B981',
  'Personal': '#A855F7',
  'College': '#F97316',
  'Other': '#6B7280'
};

const EditTimetableModal = ({ isOpen, onClose, day, task, onSave, errorMessage }) => {
  const [editedTask, setEditedTask] = useState(() => 
    task ? { ...task, resources: [...task.resources] } : { day, start: '', end: '', title: '', category: '', resources: [] }
  );
  const [newResource, setNewResource] = useState({ type: 'link', content: '' });

  useEffect(() => {
    if (isOpen) {
      setEditedTask(task ? { ...task, resources: [...task.resources] } : { day, start: '', end: '', title: '', category: '', resources: [] });
    }
  }, [isOpen, task, day]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    setNewResource({ ...newResource, [name]: value });
  };

  const handleAddResource = () => {
    if (newResource.content.trim()) {
      const updatedResources = [...editedTask.resources, newResource];
      setEditedTask({ ...editedTask, resources: updatedResources });
      setNewResource({ type: 'link', content: '' });
    }
  };

  const handleRemoveResource = (index) => {
    const updatedResources = editedTask.resources.filter((_, i) => i !== index);
    setEditedTask({ ...editedTask, resources: updatedResources });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedTask, task);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {task ? 'Edit Task' : 'Add New Task'} for {editedTask.day}
        </h2>
        <form onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200 p-3 rounded-lg mb-4 text-sm transition-colors duration-300">
              {errorMessage}
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={editedTask.title}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Start Time</label>
              <input
                type="time"
                name="start"
                value={editedTask.start}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">End Time</label>
              <input
                type="time"
                name="end"
                value={editedTask.end}
                onChange={handleChange}
                className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-colors"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Category</label>
            <select
              name="category"
              value={editedTask.category}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            >
              <option value="">Select a category</option>
              {Object.keys(categoryColors).map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Resources</h3>
            <div className="flex space-x-2 mb-2">
              <select
                name="type"
                value={newResource.type}
                onChange={handleResourceChange}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600"
              >
                <option value="link">Link</option>
                <option value="note">Note</option>
              </select>
              <input
                type={newResource.type === 'link' ? 'url' : 'text'}
                name="content"
                placeholder={newResource.type === 'link' ? 'https://example.com' : 'Write a note...'}
                value={newResource.content}
                onChange={handleResourceChange}
                className="flex-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={handleAddResource} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">Add</button>
            </div>
            <ul className="space-y-2 max-h-32 overflow-y-auto pr-2">
              {editedTask.resources?.map((res, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm">
                  <span className="truncate text-gray-900 dark:text-gray-200">{res.content}</span>
                  <button type="button" onClick={() => handleRemoveResource(index)} className="ml-2 text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-end space-x-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 rounded-lg text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTimetableModal;