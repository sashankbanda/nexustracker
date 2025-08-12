// src/LoginPage.jsx
import React from 'react';
import { FaGoogle } from 'react-icons/fa'; // Assumes you have react-icons installed

const LoginPage = ({ onSignIn }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl text-center w-full max-w-sm">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Welcome Back!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Sign in to access your timetable and track your progress.</p>
        <button
          onClick={onSignIn}
          className="w-full flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg"
        >
          <FaGoogle className="mr-3" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;