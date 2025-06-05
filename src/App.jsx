// App.jsx
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StatisticsPage from './pages/StatisticsPage';  // 你的統計頁元件路徑
import HabitCalendar from './pages/HabitCalendar';
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/statistics" element={<StatisticsPage />} />
        <Route path="/calendar/:habitId" element={<HabitCalendar />} />

      </Routes>

      <ToastContainer />
    </AuthProvider>
    </Router>
  );
}

export default App;