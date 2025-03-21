import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage'; 
import HomePage from './pages/HomePage'; 
import RegistrationPage from './pages/RegistrationPage';
import ProfilePage from './pages/ProfilePage';
import UserSettings from './pages/UserSettings'
import './App.css';
import { ThemeProvider } from './pages/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
    <Router>
      <Routes>
        {/* Главная страница */}
        <Route path="/" element={<HomePage />} />

        {/* Страница входа */}
        <Route path="/login" element={<LoginPage />} />

        {/* Страница регистрации */}
        <Route path="/register" element={<RegistrationPage />} />

        {/* Страница пользователя */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* Страница настроек пользователя*/}
        <Route path="/settings" element={<UserSettings />} />
      </Routes>
    </Router>
    </ThemeProvider>
  );
};

export default App;