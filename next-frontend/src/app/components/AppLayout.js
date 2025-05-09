'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '../pages/ThemeContext';
import { authService } from '../services/api';
import { CircularProgress } from '@mui/material';

export default function AppLayout({ children }) {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [themeInitialized, setThemeInitialized] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || themeInitialized) return;

    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, redirecting to login');
          router.push('/login');
          return;
        }

        const profile = await authService.getProfile();
        console.log('Profile loaded:', profile);

        // Применяем тему из профиля только один раз при загрузке
        if (profile.darkTheme !== isDarkMode) {
          toggleTheme();
        }
        setThemeInitialized(true);
      } catch (error) {
        console.error('Error loading profile:', error);
        if (error.message === 'Not authenticated') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [mounted, themeInitialized]);

  if (!mounted) {
    return null;
  }

  if (loading) {
    const loadingStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDarkMode ? '#1F2937' : 'white'
    };

    return (
      <div style={loadingStyle}>
        <CircularProgress />
      </div>
    );
  }

  return children;
} 