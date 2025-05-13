'use client';

import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Инициализация темы при монтировании
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme === 'true') {
      setIsDarkMode(true);
    }
    setMounted(true);
  }, []);

  // Сохранение темы в localStorage при изменении
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('darkTheme', isDarkMode.toString());
      // Обновляем тему в профиле пользователя
      const updateThemeInProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            await fetch('/api/users/profile', {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ darkTheme: isDarkMode })
            });
          }
        } catch (error) {
          console.error('Error updating theme in profile:', error);
        }
      };
      updateThemeInProfile();
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Предотвращаем рендеринг до монтирования компонента
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};