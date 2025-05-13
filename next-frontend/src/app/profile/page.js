'use client';

import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '../pages/ThemeContext';
import { authService } from '../services/api';

export default function Profile() {
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Проверяем наличие токена
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }

    // Получаем данные пользователя из localStorage
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      setUserData(JSON.parse(userDataStr));
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.replace('/login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Здесь будет логика сохранения изменений
      setIsEditing(false);
      // Обновляем данные в localStorage
      localStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      setError('Не удалось сохранить изменения');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isDarkMode ? '#1F2937' : 'white',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      p: isMobile ? 2 : 0
    }}>
      {/* Основной контент */}
      <Box sx={{
        maxWidth: isMobile ? '100%' : '1200px',
        width: '100%',
        margin: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        p: isMobile ? 0 : 4,
        zIndex: 1
      }}>
        {/* Заголовок */}
        <Typography 
          variant="h4" 
          sx={{
            color: isDarkMode ? '#FFFFFF' : '#1F2937',
            fontFamily: 'Roboto, sans-serif',
            fontSize: '30px',
            fontWeight: 700,
            lineHeight: '36px',
            mt: isMobile ? 0 : '32px',
            mb: '10px',
            width: isMobile ? '100%' : '630px',
            textAlign: 'left',            
            paddingLeft: isMobile ? 0 : '24px'
          }}
        >
          Профиль
        </Typography>

        {/* Карточка профиля */}
        <Box sx={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '580px',
          backgroundColor: isDarkMode ? '#111827' : 'white',
          borderRadius: 2,
          p: 3,
          border: isDarkMode ? '1px solid #374151' : 'none',
          position: 'relative',
          boxShadow: !isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
        }}>
          {/* Шапка с аватаром и кнопкой редактирования */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
            position: 'relative'
          }}>
            {/* Аватар */}
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: isMobile ? 72 : 92,
                  height: isMobile ? 72 : 92,
                  borderRadius: '50%',
                  border: '1px solid transparent',
                  bgcolor: '#3B82F6',
                  fontSize: '2rem'
                }}
              >
                {userData ? `${userData.firstName[0]}${userData.lastName[0]}` : ''}
              </Avatar>
            </Box>

            {/* Кнопка редактирования/сохранения */}
            <Button
              variant="contained"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              sx={{
                backgroundColor: isEditing ? '#10B981' : '#3B82F6',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '8px 16px',
                height: '40px',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                '&:hover': {
                  backgroundColor: isEditing ? '#059669' : '#2563EB',
                },
              }}
            >
              {isEditing ? 'Сохранить' : 'Редактировать'}
            </Button>
          </Box>

          {/* Поля ввода */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Имя и фамилия */}
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 0.5 }}>
                  Имя
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: '16px',
                      '& input': {
                        padding: '8px 14px',
                        color: isDarkMode ? '#F9FAFB' : '#111827',
                      },
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                      },
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 0.5 }}>
                  Фамилия
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: '16px',
                      '& input': {
                        padding: '8px 14px',
                        color: isDarkMode ? '#F9FAFB' : '#111827',
                      },
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Email */}
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 0.5 }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  sx={{
                    '& .MuiInputBase-root': {
                      fontSize: '16px',
                      '& input': {
                        padding: '8px 14px',
                        color: isDarkMode ? '#F9FAFB' : '#111827',
                      },
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                      },
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>

          {/* Кнопки действий */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: '#3B82F6',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '8px 16px',
                height: '40px',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                '&:hover': {
                  backgroundColor: '#2563EB',
                },
              }}
              onClick={() => router.push('/chat-list')}
            >
              Список чатов
            </Button>
            <Button
              fullWidth
              variant="outlined"
              sx={{
                borderColor: '#EF4444',
                color: '#EF4444',
                borderRadius: '8px',
                padding: '8px 16px',
                height: '40px',
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                '&:hover': {
                  borderColor: '#DC2626',
                  backgroundColor: 'rgba(239, 68, 68, 0.04)',
                },
              }}
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Уведомление об ошибке */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
} 