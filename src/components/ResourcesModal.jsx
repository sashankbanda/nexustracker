// src/components/ResourcesModal.jsx

import React, { useState } from 'react';

const ResourcesModal = ({ isOpen, onClose, resources, onSave, onDelete }) => {
  const [newResource, setNewResource] = useState({ name: '', url: '' });
  const [urlError, setUrlError] = useState('');

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (newResource.name && newResource.url) {
      if (validateUrl(newResource.url)) {
        await onSave(newResource);
        setNewResource({ name: '', url: '' });
        setUrlError('');
      } else {
        setUrlError('Please enter a valid URL.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-lg mx-4 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Resources</h2>
        <div className="mb-6">
          <form onSubmit={handleAdd} className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0 mb-4">
            <input
              type="text"
              placeholder="Resource Name"
              value={newResource.name}
              onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
              className="flex-1 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-colors"
              required
            />
            <div className="flex-1 relative">
              <input
                type="url"
                placeholder="URL"
                value={newResource.url}
                onChange={(e) => { setNewResource({ ...newResource, url: e.target.value }); setUrlError(''); }}
                className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition-colors"
                required
              />
              {urlError && <p className="absolute -bottom-5 left-0 text-red-500 text-xs mt-1">{urlError}</p>}
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold hover:from-green-600 hover:to-teal-700 transition-all"
            >
              Add
            </button>
          </form>
          <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {resources.length > 0 ? resources.map((res, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md transition-colors duration-300">
                <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
                  {res.name}
                </a>
                <button
                  onClick={() => onDelete(res.id)}
                  className="ml-4 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            )) : (
              <p className="text-gray-400 text-center py-4">No resources added yet.</p>
            )}
          </ul>
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

export default ResourcesModal;