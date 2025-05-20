import React, { useState, useContext, useEffect } from 'react'; 
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Switch,
  Button,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ThemeContext } from '../pages/ThemeContext';
import Background from '../components/Background/Background';
import { authService } from '../services/api';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const UserSettings = () => {
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [settings, setSettings] = useState({
    darkTheme: false
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Проверяем наличие токена
        const token = localStorage.getItem('token');
        console.log('Token in UserSettings:', token);
        
        if (!token) {
          console.error('No token found, redirecting to login');
          router.push('/login');
          return;
        }
        
        const response = await authService.getProfile();
        console.log('User profile data:', response);
        setUserData(response);
        
        // Обновляем настройки из профиля, используя значения с сервера
        setSettings({
          darkTheme: response.darkTheme ?? false
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Не удалось загрузить данные профиля');
        if (error.message === 'Not authenticated') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    if (settings.darkTheme !== isDarkMode) {
      toggleTheme();
    }
  }, [settings.darkTheme, isDarkMode, toggleTheme]);

  const handleGoBack = () => {
    router.push('/profile'); 
  };

  const handleSettingChange = (setting) => (event) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswords(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Если пароли заполнены, сначала меняем пароль
      if (passwords.currentPassword && passwords.newPassword && passwords.confirmPassword) {
        if (passwords.newPassword !== passwords.confirmPassword) {
          setError('Новые пароли не совпадают');
          return;
        }

        try {
          await authService.updatePassword({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword
          });
          // Очищаем поля паролей после успешного изменения
          setPasswords({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          setSuccess('Пароль успешно обновлен');
        } catch (error) {
          console.error('Error updating password:', error);
          setError(error.message || 'Не удалось изменить пароль');
          return;
        }
      }

      // Затем сохраняем остальные настройки
      console.log('Saving settings:', settings);
      const response = await authService.updateProfile(settings);
      console.log('Settings update response:', response);
      
      if (!passwords.currentPassword) {
        setSuccess('Настройки успешно сохранены');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Не удалось сохранить настройки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100vw', 
        height: '100vh', 
        backgroundColor: isDarkMode ? '#1F2937' : '#f9fafb',
        p: 4,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden', 
      }}
    >
      {loading ? (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDarkMode ? '#1F2937' : 'white',
          zIndex: 1000
        }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Background />

          {/* Навигационная панель */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 40,
              position: 'relative', 
              zIndex: 1, 
            }}
          >
            {/* Кнопка "Назад" и текст "Настройки" */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Стрелка */}
              <IconButton
                onClick={handleGoBack}
                sx={{
                  position: 'absolute',
                  left: 'calc((100% - 870px) / 2)', 
                }}
              >
                <ArrowBack
                  sx={{
                    fontSize: 24,
                    color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)', 
                  }}
                />
              </IconButton>

              {/* Текст "Настройки" */}
              <Typography
                variant="h6"
                component="span"
                sx={{
                  position: 'absolute',
                  left: 'calc((100% - 870px) / 2 + 40px)',
                  color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)', 
                }}
              >
                Настройки
              </Typography>
            </Box>

            {/* Иконки уведомлений и аватара */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                position: 'absolute',
                right: 'calc((100% - 840px) / 2)', 
              }}
            >
              {userData?.avatarUrl ? (
                <Box sx={{
                  width: 40,
                  height: 40,
                  position: 'relative',
                  borderRadius: '50%',
                  overflow: 'hidden'
                }}>
                  <Image
                    src={`${API_URL}${userData.avatarUrl}`}
                    alt={`${userData.firstName} ${userData.lastName}`}
                    fill
                    style={{
                      objectFit: 'cover',
                    }}
                    unoptimized
                  />
                </Box>
              ) : (
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: isDarkMode ? '#3B82F6' : '#2563EB',
                    color: '#FFFFFF'
                  }}
                >
                  {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                </Avatar>
              )}
            </Box>
          </Box>

          {/* Основной контент страницы (карточка с настройками) */}
          <Box
            sx={{
              width: 780,
              margin: 'auto',
              mt: 4,
              p: 4,
              borderRadius: 2,
              boxShadow: '0 4px 8px rgba(229, 231, 235, 1)',
              backgroundColor: isDarkMode ? '#111827' : '#ffffff', 
              zIndex: 1, 
              position: 'relative', 
            }}
          >
            {/* Раздел "Пароль" */}
            <FormGroup>
              <Typography variant="h6" sx={{ mb: 2, color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)' }}> 
                Пароль
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="password"
                label="Существующий пароль"
                value={passwords.currentPassword}
                onChange={handlePasswordChange('currentPassword')}
                sx={{ 
                  mb: 3,
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)', 
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#374151' : 'rgba(31, 41, 55, 1)', 
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#9CA3AF' : 'rgba(31, 41, 55, 1)', 
                  },
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="password"
                label="Новый пароль"
                value={passwords.newPassword}
                onChange={handlePasswordChange('newPassword')}
                sx={{ 
                  mb: 3,
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)', 
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#374151' : 'rgba(31, 41, 55, 1)', 
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#9CA3AF' : 'rgba(31, 41, 55, 1)', 
                  },
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="password"
                label="Повторите пароль"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange('confirmPassword')}
                sx={{ 
                  mb: 3,
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)', 
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: isDarkMode ? '#374151' : 'rgba(31, 41, 55, 1)', 
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDarkMode ? '#9CA3AF' : 'rgba(31, 41, 55, 1)', 
                  },
                }}
              />
            </FormGroup>

            {/* Переключатель для темной темы */}
            <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ mr: 2, color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)' }}>
                Тёмная тема
              </Typography>
              <Switch 
                checked={settings.darkTheme}
                onChange={handleSettingChange('darkTheme')}
              />
            </Box>

            {/* Кнопка сохранения */}
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={handleSaveSettings}
                disabled={loading}
                sx={{
                  bgcolor: '#3B82F6',
                  color: '#FFFFFF',
                  '&:hover': {
                    bgcolor: '#2563EB',
                  },
                  minWidth: '120px',
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Сохранить'}
              </Button>
            </Box>
          </Box>
        </>
      )}

      {/* Уведомления об ошибках и успехе */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess(false)}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserSettings;