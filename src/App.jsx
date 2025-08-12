// src/App.jsx

import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // 🚨 Updated: Added GoogleAuthProvider, signInWithPopup, and signOut
import { getFirestore, doc, setDoc, onSnapshot, updateDoc, collection, addDoc, getDocs, query, where, getDoc } from 'firebase/firestore'; // 🚨 Updated: Added getDoc

// Import the separated components
import ConfirmationModal from './components/ConfirmationModal';
import EditTimetableModal from './components/EditTimetableModal';
import PieChart from './components/PieChart';
import RewardModal from './components/RewardModal';
import TaskDetailsModal from './components/TaskDetailsModal';
import ResourcesModal from './components/ResourcesModal';
import ProgressTracker from './components/ProgressTracker';
import HomeworkTimelinePage from './components/HomeworkTimelinePage';
import ProgressHistoryPage from './components/ProgressHistoryPage';

// 🚨 New: Import the new login page and a router.
import LoginPage from './LoginPage';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// The firebaseConfig and appId variables are automatically provided by the Canvas environment.
// We use a fallback value for local development.
// const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
// const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
// const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const firebaseConfig = {
  apiKey: "AIzaSyC50s0u-pBORD98Np9pYsYiZoJHFsR24xU",
  authDomain: "multiplayerarcade-ff11f.firebaseapp.com",
  projectId: "multiplayerarcade-ff11f",
  storageBucket: "multiplayerarcade-ff11f.firebasestorage.app",
  messagingSenderId: "277613921204",
  appId: "1:277613921204:web:f780b926147c203aa0e8e1",
  measurementId: "G-VR5W9YEFL9"
};
const appId = "multiplayerarcade-ff11f";

// Initial data for new users
const initialTimetable = {
  Monday: [
    { id: '1', start: '06:00', end: '07:00', title: 'Gym', category: 'Health', resources: [], isCompleted: false },
    { id: '2', start: '07:00', end: '08:00', title: 'Bath & Breakfast', category: 'Personal', resources: [], isCompleted: false },
    { id: '3', start: '08:00', end: '08:50', title: 'GATE Mathematics basics', category: 'GATE', resources: [], isCompleted: false },
    { id: '4', start: '08:55', end: '09:45', title: 'College class', category: 'College', resources: [], isCompleted: false },
    { id: '5', start: '09:45', end: '11:35', title: 'GATE Technical subject', category: 'GATE', resources: [], isCompleted: false },
    { id: '6', start: '11:40', end: '12:30', title: 'College class', category: 'College', resources: [], isCompleted: false },
    { id: '7', start: '12:30', end: '13:30', title: 'DSA concepts', category: 'Placements', resources: [], isCompleted: false },
    { id: '8', start: '13:30', end: '15:30', title: 'Aptitude & reasoning', category: 'Placements', resources: false },
    { id: '9', start: '15:30', end: '18:30', title: 'GATE technical subject deep dive', category: 'GATE', resources: [], isCompleted: false },
    { id: '10', start: '18:30', end: '20:30', title: 'Mock questions + error analysis', category: 'GATE', resources: [], isCompleted: false },
    { id: '11', start: '20:30', end: '21:30', title: 'Job applications', category: 'Placements', resources: [], isCompleted: false },
    { id: '12', start: '21:30', end: '22:30', title: 'Parents’ time', category: 'Personal', resources: [], isCompleted: false },
    { id: '13', start: '22:30', end: '24:00', title: 'Light revision / flashcards', category: 'GATE', resources: [], isCompleted: false },
  ],
  Tuesday: [
    { id: '14', start: '06:00', end: '07:00', title: 'Gym', category: 'Health', resources: [], isCompleted: false },
    { id: '15', start: '07:00', end: '08:00', title: 'Bath', category: 'Personal', resources: [], isCompleted: false },
    { id: '16', start: '08:00', end: '08:50', title: 'GATE core subject', category: 'GATE', resources: [], isCompleted: false },
    { id: '17', start: '08:55', end: '09:45', title: 'College class', category: 'College', resources: [], isCompleted: false },
    { id: '18', start: '09:45', end: '11:45', title: 'DSA practice (coding platform)', category: 'Placements', resources: [], isCompleted: false },
    { id: '19', start: '11:45', end: '13:45', title: 'Aptitude (placements)', category: 'Placements', resources: [], isCompleted: false },
    { id: '20', start: '13:45', end: '14:45', title: 'Lunch', category: 'Personal', resources: [], isCompleted: false },
    { id: '21', start: '14:45', end: '17:45', title: 'GATE subject from scratch', category: 'GATE', resources: [], isCompleted: false },
    { id: '22', start: '17:45', end: '20:15', title: 'Practice + mock tests', category: 'GATE', resources: [], isCompleted: false },
    { id: '23', start: '20:15', end: '21:15', title: 'Job applications', category: 'Placements', resources: [], isCompleted: false },
    { id: '24', start: '21:30', end: '22:30', title: 'Parents’ time', category: 'Personal', resources: [], isCompleted: false },
    { id: '25', start: '22:30', end: '24:00', title: 'Light revision', category: 'GATE', resources: [], isCompleted: false },
  ],
  Wednesday: [
    { id: '26', start: '06:00', end: '07:00', title: 'Gym', category: 'Health', resources: [], isCompleted: false },
    { id: '27', start: '07:00', end: '08:00', title: 'Bath', category: 'Personal', resources: [], isCompleted: false },
    { id: '28', start: '08:00', end: '09:40', title: 'GATE subject basics', category: 'GATE', resources: [], isCompleted: false },
    { id: '29', start: '09:50', end: '10:40', title: 'College class', category: 'College', resources: [], isCompleted: false },
    { id: '30', start: '10:40', end: '12:40', title: 'DSA (problem solving)', category: 'Placements', resources: [], isCompleted: false },
    { id: '31', start: '12:40', end: '14:10', title: 'Lunch', category: 'Personal', resources: [], isCompleted: false },
    { id: '32', start: '14:10', end: '15:40', title: 'Aptitude', category: 'Placements', resources: [], isCompleted: false },
    { id: '33', start: '15:50', end: '17:30', title: 'College class', category: 'College', resources: [], isCompleted: false },
    { id: '34', start: '17:30', end: '20:30', title: 'GATE practice questions + mock test', category: 'GATE', resources: [], isCompleted: false },
    { id: '35', start: '20:30', end: '21:30', title: 'Job applications', category: 'Placements', resources: [], isCompleted: false },
    { id: '36', start: '21:30', end: '22:30', title: 'Parents’ time', category: 'Personal', resources: [], isCompleted: false },
    { id: '37', start: '22:30', end: '24:00', title: 'Revision', category: 'GATE', resources: [], isCompleted: false },
  ],
  Thursday: [
    { id: '38', start: '06:00', end: '07:00', title: 'Gym', category: 'Health', resources: [], isCompleted: false },
    { id: '39', start: '07:00', end: '08:00', title: 'Bath', category: 'Personal', resources: [], isCompleted: false },
    { id: '40', start: '08:00', end: '09:40', title: 'GATE technical subject', category: 'GATE', resources: [], isCompleted: false },
    { id: '41', start: '09:50', end: '10:40', title: 'College class', category: 'College', resources: [], isCompleted: false },
    { id: '42', start: '10:40', end: '12:40', title: 'DSA (mock interviews)', category: 'Placements', resources: [], isCompleted: false },
    { id: '43', start: '12:40', end: '13:40', title: 'Lunch', category: 'Personal', resources: [], isCompleted: false },
    { id: '44', start: '13:40', end: '17:40', title: 'GATE subject + numericals', category: 'GATE', resources: [], isCompleted: false },
    { id: '45', start: '17:40', end: '20:40', title: 'Aptitude & reasoning practice', category: 'Placements', resources: [], isCompleted: false },
    { id: '46', start: '20:40', end: '21:30', title: 'Job applications', category: 'Placements', resources: [], isCompleted: false },
    { id: '47', start: '21:30', end: '22:30', title: 'Parents’ time', category: 'Personal', resources: [], isCompleted: false },
    { id: '48', start: '22:30', end: '24:00', title: 'Light revision', category: 'GATE', resources: [], isCompleted: false },
  ],
  Friday: [
    { id: '49', start: '06:00', end: '07:00', title: 'Gym', category: 'Health', resources: [], isCompleted: false },
    { id: '50', start: '07:00', end: '08:00', title: 'Bath', category: 'Personal', resources: [], isCompleted: false },
    { id: '51', start: '08:00', end: '10:40', title: 'GATE technical subject', category: 'GATE', resources: [], isCompleted: false },
    { id: '52', start: '10:45', end: '13:20', title: 'College classes', category: 'College', resources: [], isCompleted: false },
    { id: '53', start: '13:20', end: '14:20', title: 'Lunch', category: 'Personal', resources: [], isCompleted: false },
    { id: '54', start: '14:20', end: '18:20', title: 'DSA + Aptitude mix', category: 'Placements', resources: [], isCompleted: false },
    { id: '55', start: '18:20', end: '20:20', title: 'GATE mock test & solutions', category: 'GATE', resources: [], isCompleted: false },
    { id: '56', start: '20:20', end: '21:20', title: 'Job applications', category: 'Placements', resources: [], isCompleted: false },
    { id: '57', start: '21:30', end: '22:30', title: 'Parents’ time', category: 'Personal', resources: [], isCompleted: false },
    { id: '58', start: '22:30', end: '24:00', title: 'Revision', category: 'GATE', resources: [], isCompleted: false },
  ],
  Saturday: [
    { id: '59', start: '06:00', end: '07:00', title: 'Gym', category: 'Health', resources: [], isCompleted: false },
    { id: '60', start: '07:00', end: '08:00', title: 'Bath', category: 'Personal', resources: [], isCompleted: false },
    { id: '61', start: '08:00', end: '12:00', title: 'GATE subject (intense learning)', category: 'GATE', resources: [], isCompleted: false },
    { id: '62', start: '12:00', end: '13:00', title: 'Lunch', category: 'Personal', resources: [], isCompleted: false },
    { id: '63', start: '13:00', end: '14:30', title: 'Aptitude & reasoning', category: 'Placements', resources: [], isCompleted: false },
    { id: '64', start: '15:00', end: '17:30', title: 'College class', category: 'College', resources: [], isCompleted: false },
    { id: '65', start: '17:30', end: '20:30', title: 'DSA problems + mock interview', category: 'Placements', resources: [], isCompleted: false },
    { id: '66', start: '20:30', end: '21:30', title: 'Job applications', category: 'Placements', resources: [], isCompleted: false },
    { id: '67', start: '21:30', end: '22:30', title: 'Parents’ time', category: 'Personal', resources: [], isCompleted: false },
    { id: '68', start: '22:30', end: '24:00', title: 'Revision', category: 'GATE', resources: [], isCompleted: false },
  ],
  Sunday: [
    { id: '69', start: '06:00', end: '07:00', title: 'Gym', category: 'Health', resources: [], isCompleted: false },
    { id: '70', start: '07:00', end: '08:00', title: 'Bath', category: 'Personal', resources: [], isCompleted: false },
    { id: '71', start: '08:00', end: '12:00', title: 'GATE full syllabus revision', category: 'GATE', resources: [], isCompleted: false },
    { id: '72', start: '12:00', end: '13:00', title: 'Lunch', category: 'Personal', resources: [], isCompleted: false },
    { id: '73', start: '13:00', end: '14:30', title: 'Aptitude', category: 'Placements', resources: [], isCompleted: false },
    { id: '74', start: '15:00', end: '17:30', title: 'College class', category: 'College', resources: [], isCompleted: false },
    { id: '75', start: '17:30', end: '20:30', title: 'DSA & coding contest practice', category: 'Placements', resources: [], isCompleted: false },
    { id: '76', start: '20:30', end: '21:30', title: 'Job applications', category: 'Placements', resources: [], isCompleted: false },
    { id: '77', start: '21:30', end: '22:30', title: 'Parents’ time', category: 'Personal', resources: [], isCompleted: false },
    { id: '78', start: '22:30', end: '24:00', title: 'Light revision', category: 'GATE', resources: [], isCompleted: false },
  ],
};

const initialHomework = [
  { id: 'hw1', title: 'Finish DSA Chapter 5', deadline: '2025-08-20', assignedDate: '2025-08-11', subject: 'Placements' },
  { id: 'hw2', title: 'Write GATE Mock Test Summary', deadline: '2025-08-25', assignedDate: '2025-08-11', subject: 'GATE' },
  { id: 'hw3', title: 'Update Resume for Job Applications', deadline: '2025-09-01', assignedDate: '2025-08-11', subject: 'Placements' },
];

const categoryColors = {
  'GATE': '#EF4444',
  'Placements': '#3B82F6',
  'Health': '#10B981',
  'Personal': '#A855F7',
  'College': '#F97316',
  'Other': '#6B7280'
};

const getTodayDayName = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

const formatTime = (time) => {
  const [hour, minute] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  const displayMinute = minute < 10 ? `0${minute}` : minute;
  return `${displayHour}:${displayMinute} ${period}`;
};

const calculateDuration = (start, end) => {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  const startDate = new Date(0, 0, 0, startHour, startMinute);
  const endDate = new Date(0, 0, 0, endHour, endMinute);
  const diff = endDate - startDate;
  return diff / (1000 * 60 * 60);
};

const AppContent = () => { // 🚨 New: Extracted main App logic into a new component
  const navigate = useNavigate();

  // States to manage application data
  const [timetable, setTimetable] = useState(initialTimetable);
  const [homeworkTasks, setHomeworkTasks] = useState(initialHomework);
  const [resources, setResources] = useState([]);
  const [dailyProgressHistory, setDailyProgressHistory] = useState([]);
  const [currentView, setCurrentView] = useState('daily');
  const [currentDay, setCurrentDay] = useState(getTodayDayName());

  // States for UI modals and messages
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);

  // States for selected/editing items
  const [selectedTask, setSelectedTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // States for notifications and UI settings
  const [editModalErrorMessage, setEditModalErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState({ text: '', type: '' });
  const [notification, setNotification] = useState(null);
  const [notifiedTasks, setNotifiedTasks] = useState(new Set());
  const [darkMode, setDarkMode] = useState(true);

  // States for Firebase/user
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // States for progress tracking
  const [completedCount, setCompletedCount] = useState(0);
  const [remainingCount, setRemainingCount] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(null);

  // 1. Firebase Initialization & Authentication
  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const appAuth = getAuth(app);
      setDb(firestore);
      setAuth(appAuth);

      const unsubscribe = onAuthStateChanged(appAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
          // 🚨 New: Redirect to dashboard if already logged in
          if (window.location.pathname === '/' || window.location.pathname === '/login') {
            navigate('/dashboard');
          }
        } else {
          setUserId(null);
          // 🚨 New: Redirect to login page if not logged in
          if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
            navigate('/login');
          }
        }
        setIsAuthReady(true);
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase initialization failed:", e);
      setInfoMessage({ text: "Error: Failed to initialize Firebase. Data won't be saved.", type: 'error' });
      setLoading(false);
    }
  }, [navigate]);

  // 2. Data Loading and Real-time Listeners
  // This useEffect will run only after the user is authenticated (isAuthReady is true)
  useEffect(() => {
    if (db && userId) {
      const userTimetableRef = doc(db, 'artifacts', appId, 'users', userId, 'data', 'timetable');
      const userResourcesRef = doc(db, 'artifacts', appId, 'users', userId, 'data', 'resources');
      const userHomeworkRef = doc(db, 'artifacts', appId, 'users', userId, 'data', 'homework');
      const dailyProgressColRef = collection(db, 'artifacts', appId, 'users', userId, 'dailyProgress');

      // Listen for changes to the timetable
      const unsubscribeTimetable = onSnapshot(userTimetableRef, (docSnap) => {
        if (docSnap.exists()) {
          const fetchedTimetable = docSnap.data().schedule;
          setTimetable(fetchedTimetable);
          const todayTasks = fetchedTimetable[getTodayDayName()] || [];
          calculateProgress(todayTasks);
        } else {
          // If no timetable exists, create a new one with initial data
          setDoc(userTimetableRef, { schedule: initialTimetable });
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching timetable:", error);
        setInfoMessage({ text: "Error: Could not load timetable data.", type: 'error' });
      });

      // Listen for changes to the resources
      const unsubscribeResources = onSnapshot(userResourcesRef, (docSnap) => {
        if (docSnap.exists()) {
          setResources(docSnap.data().list);
        } else {
          setDoc(userResourcesRef, { list: [] });
        }
      }, (error) => {
        console.error("Error fetching resources:", error);
      });

      // Listen for changes to the homework tasks
      const unsubscribeHomework = onSnapshot(userHomeworkRef, (docSnap) => {
        if (docSnap.exists()) {
          setHomeworkTasks(docSnap.data().list);
        } else {
          // If no homework exists, create a new one with initial data
          setDoc(userHomeworkRef, { list: initialHomework });
        }
      }, (error) => {
        console.error("Error fetching homework:", error);
      });

      // Listen for changes to the daily progress history
      const unsubscribeDailyProgress = onSnapshot(dailyProgressColRef, (snapshot) => {
        const progress = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDailyProgressHistory(progress);
      }, (error) => {
        console.error("Error fetching daily progress history:", error);
      });

      // Check for daily reset
      const storedLastResetDate = localStorage.getItem('lastResetDate');
      const today = new Date().toDateString();

      if (storedLastResetDate !== today) {
        setLastResetDate(storedLastResetDate);
        resetDailyCompletionStatus(storedLastResetDate);
      } else {
        setLastResetDate(today);
      }

      // Cleanup listeners on component unmount
      return () => {
        unsubscribeTimetable();
        unsubscribeResources();
        unsubscribeHomework();
        unsubscribeDailyProgress();
      };
    }
  }, [db, userId, isAuthReady]);

  // Handle daily reset
  const resetDailyCompletionStatus = async (resetDate) => {
    if (!db || !userId) {
      console.log("Database not ready for reset.");
      return;
    }

    const today = new Date().toDateString();

    // Check if the reset was already performed today
    if (resetDate === today) {
      return;
    }

    const newTimetable = { ...timetable };

    // Save previous day's progress
    if (resetDate) {
      const dailyProgressRef = collection(db, 'artifacts', appId, 'users', userId, 'dailyProgress');
      await addDoc(dailyProgressRef, {
        date: resetDate,
        completed: completedCount,
        total: completedCount + remainingCount,
        timestamp: new Date().toISOString(),
      });
    }

    // Reset all tasks for all days to not completed
    const resetTimetable = Object.keys(newTimetable).reduce((acc, day) => {
      acc[day] = newTimetable[day].map(task => ({ ...task, isCompleted: false }));
      return acc;
    }, {});

    try {
      const userDocRef = doc(db, 'artifacts', appId, 'users', userId, 'data', 'timetable');
      await updateDoc(userDocRef, { schedule: resetTimetable });
      setLastResetDate(today);
      localStorage.setItem('lastResetDate', today);
      setInfoMessage({ text: 'Daily tasks have been reset!', type: 'success' });
    } catch (e) {
      console.error("Error resetting daily tasks:", e);
    }
  };

  const calculateProgress = (tasks) => {
    const completed = tasks.filter(task => task.isCompleted).length;
    const remaining = tasks.length - completed;
    setCompletedCount(completed);
    setRemainingCount(remaining);
  };

  useEffect(() => {
    const currentDayData = timetable[currentDay] || [];
    const allTasksCompleted = currentDayData.length > 0 && currentDayData.every(task => task.isCompleted);

    if (allTasksCompleted) {
      setIsRewardModalOpen(true);
    }
  }, [timetable, currentDay]);

  useEffect(() => {
    const checkTasks = () => {
      const now = new Date();
      const currentDay = getTodayDayName();
      const currentTasks = timetable[currentDay] || [];

      currentTasks.forEach(task => {
        if (!task.isCompleted) {
          const [hour, minute] = task.start.split(':').map(Number);
          const taskTime = new Date();
          taskTime.setHours(hour, minute, 0);

          const timeDiff = taskTime.getTime() - now.getTime();

          if (timeDiff > 0 && timeDiff <= 5 * 60 * 1000 && !notifiedTasks.has(task.id)) {
            setNotification({
              message: `Your task "${task.title}" is starting soon!`,
              id: task.id,
            });
            setNotifiedTasks(prev => new Set(prev).add(task.id));
          }
        }
      });
    };

    const interval = setInterval(checkTasks, 60000);
    return () => clearInterval(interval);
  }, [timetable, notifiedTasks]);

  const closeNotification = () => setNotification(null);

  const updateTimetable = async (newTimetable) => {
    if (db && userId) {
      try {
        const userDocRef = doc(db, 'artifacts', appId, 'users', userId, 'data', 'timetable');
        await updateDoc(userDocRef, { schedule: newTimetable });
        setInfoMessage({ text: 'Timetable updated successfully!', type: 'success' });
        calculateProgress(newTimetable[currentDay]);
      } catch (e) {
        console.error("Error updating timetable:", e);
        setInfoMessage({ text: "Error: Could not save timetable.", type: 'error' });
      }
    }
  };

  const handleEditTask = async (editedTask, originalTask) => {
    const startHour = parseInt(editedTask.start.split(':')[0]);
    const endHour = parseInt(editedTask.end.split(':')[0]);

    if (endHour <= startHour) {
      setEditModalErrorMessage("End time must be after start time.");
      return;
    }

    const newTimetable = { ...timetable };
    const dayTasks = newTimetable[editedTask.day] || [];

    const hasOverlap = dayTasks.some(task => {
      if (originalTask && task.id === originalTask.id) {
        return false;
      }
      const newStart = new Date(0, 0, 0, startHour, parseInt(editedTask.start.split(':')[1]));
      const newEnd = new Date(0, 0, 0, endHour, parseInt(editedTask.end.split(':')[1]));
      const existingStart = new Date(0, 0, 0, parseInt(task.start.split(':')[0]), parseInt(task.start.split(':')[1]));
      const existingEnd = new Date(0, 0, 0, parseInt(task.end.split(':')[0]), parseInt(task.end.split(':')[1]));

      return (newStart < existingEnd && newEnd > existingStart);
    });

    if (hasOverlap) {
      setEditModalErrorMessage("The new task overlaps with an existing task. Please choose a different time.");
      return;
    }

    let updatedTasks;
    if (originalTask) {
      updatedTasks = dayTasks.map(task => {
        if (task.id === originalTask.id) {
          return {
            ...task,
            start: editedTask.start,
            end: editedTask.end,
            title: editedTask.title,
            category: editedTask.category,
            resources: editedTask.resources,
          };
        }
        return task;
      });
    } else {
      const newTaskWithId = { ...editedTask, id: Date.now().toString() };
      updatedTasks = [...dayTasks, newTaskWithId];
    }

    updatedTasks.sort((a, b) => a.start.localeCompare(b.start));
    newTimetable[editedTask.day] = updatedTasks;
    await updateTimetable(newTimetable);
    setIsEditModalOpen(false);
    setEditModalErrorMessage('');
  };

  const handleDeleteTask = (day, taskToDelete) => {
    setTaskToDelete({ day, task: taskToDelete });
    setIsConfirmationModalOpen(true);
  };

  const confirmDelete = async () => {
    const newTimetable = { ...timetable };
    const { day, task } = taskToDelete;
    if (task && task.id) {
      newTimetable[day] = newTimetable[day].filter(t => t.id !== task.id);
      await updateTimetable(newTimetable);
    }
    setIsConfirmationModalOpen(false);
    setTaskToDelete(null);
  };

  const handleToggleComplete = async (day, taskToToggle) => {
    const newTimetable = { ...timetable };
    newTimetable[day] = newTimetable[day].map(task =>
      task.id === taskToToggle.id ? { ...task, isCompleted: !task.isCompleted } : task
    );
    await updateTimetable(newTimetable);
  };

  const handleAddResource = async (resource) => {
    if (db && userId) {
      try {
        const resourcesDocRef = doc(db, 'artifacts', appId, 'users', userId, 'data', 'resources');
        const newResources = [...resources, { ...resource, id: Date.now().toString() }];
        await updateDoc(resourcesDocRef, { list: newResources });
        setInfoMessage({ text: 'Resource added successfully!', type: 'success' });
      } catch (e) {
        console.error("Error adding resource:", e);
        setInfoMessage({ text: "Error: Could not add resource.", type: 'error' });
      }
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (db && userId) {
      try {
        const resourcesDocRef = doc(db, 'artifacts', appId, 'users', userId, 'data', 'resources');
        const newResources = resources.filter(res => res.id !== resourceId);
        await updateDoc(resourcesDocRef, { list: newResources });
        setInfoMessage({ text: 'Resource deleted successfully!', type: 'success' });
      } catch (e) {
        console.error("Error deleting resource:", e);
        setInfoMessage({ text: "Error: Could not delete resource.", type: 'error' });
      }
    }
  };

  const handleAddHomework = async (newHw) => {
    if (db && userId) {
      try {
        const homeworkDocRef = doc(db, 'artifacts', appId, 'users', userId, 'data', 'homework');
        const updatedHomework = [...homeworkTasks, { ...newHw, assignedDate: new Date().toISOString(), id: Date.now().toString() }];
        await updateDoc(homeworkDocRef, { list: updatedHomework });
      } catch(e) {
        console.error("Error adding homework:", e);
      }
    }
  };

  const handleDeleteHomework = async (id) => {
    if (db && userId) {
      try {
        const homeworkDocRef = doc(db, 'artifacts', appId, 'users', userId, 'data', 'homework');
        const updatedHomework = homeworkTasks.filter(hw => hw.id !== id);
        await updateDoc(homeworkDocRef, { list: updatedHomework });
      } catch(e) {
        console.error("Error deleting homework:", e);
      }
    }
  };

  // 🚨 New: Logout function
  const handleLogout = async () => {
    if (auth) {
      await signOut(auth);
      navigate('/login');
    }
  };

  const renderDailyTracker = () => {
    const dayData = timetable[currentDay] || [];
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 transition-colors duration-300">Daily Progress</h2>
          <select
            value={currentDay}
            onChange={(e) => setCurrentDay(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg p-2 border-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {Object.keys(timetable).map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        <ProgressTracker completedCount={completedCount} remainingCount={remainingCount} />
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:space-x-8">
          <div className="w-full lg:w-1/3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6 transition-colors duration-300">
              <PieChart data={dayData} />
              <div className="mt-4 space-y-2">
                {Object.keys(categoryColors).map(category => {
                  const categoryTasks = dayData.filter(task => task.category === category);
                  const totalDuration = categoryTasks.reduce((sum, task) => sum + calculateDuration(task.start, task.end), 0);
                  if (totalDuration === 0) return null;
                  return (
                    <div key={category} className="flex items-center space-x-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: categoryColors[category] }}></span>
                      <span className="text-gray-600 dark:text-gray-300 text-sm">{category}</span>
                      <span className="ml-auto text-gray-500 dark:text-gray-400 text-sm">{totalDuration.toFixed(1)} hrs</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-2/3">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Timetable</h3>
                <button
                  onClick={() => { setEditTask(null); setIsEditModalOpen(true); }}
                  className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
                >
                  Add Task
                </button>
              </div>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {dayData.length > 0 ? dayData.map((task, index) => (
                  <li key={index} className="py-4 flex items-center justify-between group" onClick={() => { setSelectedTask(task); setIsTaskDetailsModalOpen(true); }}>
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => handleToggleComplete(currentDay, task)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 transition-colors duration-300 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-16 text-right flex-shrink-0">{formatTime(task.start)}</span>
                      <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: categoryColors[task.category] }}></span>
                      <div className="flex flex-col">
                        <span className={`font-medium text-gray-900 dark:text-gray-100 ${task.isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>{task.title}</span>
                        <span className={`text-gray-500 dark:text-gray-400 text-sm ${task.isCompleted ? 'line-through' : ''}`}>{formatTime(task.start)} - {formatTime(task.end)}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditTask({ ...task, day: currentDay }); setIsEditModalOpen(true); }}
                        className="p-1 rounded-full text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500 transition-colors"
                        title="Edit Task"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteTask(currentDay, task); }}
                        className="p-1 rounded-full text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-500 transition-colors"
                        title="Delete Task"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </li>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No tasks scheduled for this day.</p>
                    <button
                      onClick={() => { setEditTask(null); setIsEditModalOpen(true); }}
                      className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
                    >
                      Add Your First Task
                    </button>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeeklyTracker = () => {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 transition-colors duration-300">Weekly Timetable</h2>
          <button
            onClick={() => { setCurrentView('daily'); setCurrentDay(getTodayDayName()); }}
            className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold hover:from-green-600 hover:to-teal-700 transition-all"
          >
            Go to Today
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.keys(timetable).map(day => (
              <div key={day} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl shadow-md transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{day}</h3>
                <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {timetable[day].length > 0 ? timetable[day].map((task, index) => (
                    <li key={index} className="py-2 cursor-pointer" onClick={() => { setSelectedTask(task); setIsTaskDetailsModalOpen(true); }}>
                      <div className="flex items-start space-x-3 text-gray-600 dark:text-gray-300">
                        <span className="h-2 w-2 mt-2 rounded-full flex-shrink-0" style={{ backgroundColor: categoryColors[task.category] }}></span>
                        <div className="flex flex-col">
                          <span className={`font-medium text-gray-900 dark:text-white ${task.isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>{task.title}</span>
                          <span className={`text-gray-500 dark:text-gray-400 text-sm ${task.isCompleted ? 'line-through' : ''}`}>{formatTime(task.start)} - {formatTime(task.end)}</span>
                        </div>
                      </div>
                    </li>
                  )) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No tasks.</p>
                  )}
                </ul>
                <button
                  onClick={(e) => { e.stopPropagation(); setEditTask(null); setIsEditModalOpen(true); }}
                  className="mt-4 w-full px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all"
                >
                  Add Task
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMonthlyTracker = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

    const allDays = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      allDays.push(null);
    }

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 1; i <= daysInMonth; i++) {
      const dayOfWeekIndex = (firstDayOfWeek + i - 1) % 7;
      const dayOfWeekName = weekDays[dayOfWeekIndex];
      allDays.push({ day: i, schedule: timetable[dayOfWeekName] });
    }

    return (
      <div className="p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 transition-colors duration-300">Monthly Tracker</h2>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg transition-colors duration-300">
          <div className="text-center text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {today.toLocaleString('default', { month: 'long' })} {currentYear}
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-gray-500 dark:text-gray-400 font-bold mb-4">
            {weekDays.map(day => <div key={day} className="hidden md:block">{day.substring(0, 3)}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {allDays.map((day, index) => (
              <div key={index} className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg p-2 flex flex-col justify-between overflow-hidden relative transition-colors duration-300">
                {day ? (
                  <>
                    <span className="text-gray-900 dark:text-gray-100 font-bold">{day.day}</span>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {day.schedule.map((task, taskIndex) => (
                        <span
                          key={taskIndex}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: categoryColors[task.category] || '#6B7280' }}
                          title={task.title}
                        ></span>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading || !isAuthReady) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-300">Loading data...</p>
        </div>
      );
    }
    switch (currentView) {
      case 'daily':
        return renderDailyTracker();
      case 'weekly':
        return renderWeeklyTracker();
      case 'monthly':
        return renderMonthlyTracker();
      case 'homework':
        return <HomeworkTimelinePage homeworkTasks={homeworkTasks} onAddHomework={handleAddHomework} onDeleteHomework={handleDeleteHomework} />;
      case 'history':
        return <ProgressHistoryPage dailyProgressHistory={dailyProgressHistory} />;
      default:
        return null;
    }
  };

  return (
    <div className={`font-sans antialiased min-h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <div className="fixed inset-y-0 left-0 w-24 md:w-64 bg-white dark:bg-gray-800 shadow-xl z-20 flex flex-col p-4 transition-colors duration-300">
        <div className="flex-shrink-0 text-center md:text-left">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
            Nexus
          </span>
          <span className="block text-gray-500 dark:text-gray-400 text-xs mt-1 transition-colors duration-300">Timetable Tracker</span>
        </div>

        <nav className="flex-grow mt-8 space-y-2">
          <button
            onClick={() => setCurrentView('daily')}
            className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${currentView === 'daily' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h.01M16 11h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden md:block">Daily</span>
          </button>
          <button
            onClick={() => setCurrentView('weekly')}
            className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${currentView === 'weekly' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h.01M16 11h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden md:block">Weekly</span>
          </button>
          <button
            onClick={() => setCurrentView('monthly')}
            className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${currentView === 'monthly' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 01-2 2h-6a2 2 0 01-2-2m-8 0v8a2 2 0 002 2h12a2 2 0 002-2v-8m-14 0h14" />
            </svg>
            <span className="hidden md:block">Monthly</span>
          </button>
          <button
            onClick={() => setCurrentView('homework')}
            className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${currentView === 'homework' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.485 9.385 5 7.9 5 4.093 5 1 8.271 1 12c0 3.73 3.093 7 6.9 7 1.485 0 2.932-.485 4.1-.75" />
            </svg>
            <span className="hidden md:block">Homework</span>
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${currentView === 'history' ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <span className="hidden md:block">History</span>
          </button>
          <button
            onClick={() => setIsResourcesModalOpen(true)}
            className="w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="hidden md:block">Resources</span>
          </button>
        </nav>

        <div className="mt-auto space-y-2">
          {/* 🚨 New: User profile and logout button */}
          {auth && auth.currentUser && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <img
                  src={auth.currentUser.photoURL || `https://ui-avatars.com/api/?name=${auth.currentUser.displayName || auth.currentUser.email}&background=random`}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{auth.currentUser.displayName || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{auth.currentUser.email}</p>
                </div>
              </div>
            </div>
          )}
          {/* 🚨 New: Logout button */}
          <button
            onClick={handleLogout}
            className="w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-200"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden md:block">Logout</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
            title="Toggle Dark/Light Mode"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {darkMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              )}
            </svg>
            <span className="hidden md:block">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>

      <main className="flex-1 ml-24 md:ml-64 p-4 lg:p-8 overflow-y-auto transition-colors duration-300">
        {infoMessage.text && (
          <div className={`p-4 rounded-lg mb-4 text-center ${infoMessage.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'}`}>
            {infoMessage.text}
          </div>
        )}
        {renderContent()}
      </main>

      {notification && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white p-4 rounded-lg shadow-xl z-50 animate-fade-in-up">
          <p>{notification.message}</p>
          <button onClick={() => setNotification(null)} className="absolute top-1 right-2 text-white/50 hover:text-white">&times;</button>
        </div>
      )}

      <TaskDetailsModal
        isOpen={isTaskDetailsModalOpen}
        onClose={() => setIsTaskDetailsModalOpen(false)}
        task={selectedTask}
      />
      <EditTimetableModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditModalErrorMessage(''); }}
        day={currentDay}
        task={editTask}
        onSave={handleEditTask}
        errorMessage={editModalErrorMessage}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete the task "${taskToDelete?.task?.title}"?`}
      />

      <ResourcesModal
        isOpen={isResourcesModalOpen}
        onClose={() => setIsResourcesModalOpen(false)}
        resources={resources}
        onSave={handleAddResource}
        onDelete={handleDeleteResource}
      />

      <RewardModal isOpen={isRewardModalOpen} onClose={() => setIsRewardModalOpen(false)} />
    </div>
  );
};

// 🚨 New: The main App component now handles routing and authentication checks
const App = () => {
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [db, setDb] = useState(null);

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const appAuth = getAuth(app);
      setDb(firestore);
      setAuth(appAuth);

      // 🚨 New: Set persistence to 'session'
      appAuth.setPersistence('session');

      const unsubscribe = onAuthStateChanged(appAuth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase initialization failed:", e);
      setLoading(false);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    if (!auth || !db) {
      console.error("Firebase not initialized.");
      return;
    }
    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      const userDocRef = doc(db, 'artifacts', appId, 'users', googleUser.uid, 'profile', 'data');
      const userDocSnap = await getDoc(userDocRef);

      const userData = {
        uid: googleUser.uid,
        displayName: googleUser.displayName,
        email: googleUser.email,
        profilePhoto: googleUser.photoURL,
        lastLogin: new Date().toISOString(),
      };

      if (userDocSnap.exists()) {
        // User exists, update their lastLogin timestamp
        await updateDoc(userDocRef, {
          lastLogin: userData.lastLogin,
        });
      } else {
        // New user, create a new document
        await setDoc(userDocRef, {
          ...userData,
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error.code, error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onSignIn={handleGoogleSignIn} />} />
        <Route
          path="/dashboard/*"
          element={user ? <AppContent /> : <Navigate to="/login" />}
        />
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;