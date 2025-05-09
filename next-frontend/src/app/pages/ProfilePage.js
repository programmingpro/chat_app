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
import { styled } from '@mui/system';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ThemeContext } from './ThemeContext';
import { authService } from '../services/api';

const backgroundShapes = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
  zIndex: 0,
  '& > div': {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.15,
  },
  '& > div:nth-of-type(1)': {
    top: '-10%',
    left: '-10%',
    width: '500px',
    height: '500px',
    background: 'linear-gradient(45deg, #3B82F6, #2563EB)',
  },
  '& > div:nth-of-type(2)': {
    top: '40%',
    right: '-10%',
    width: '400px',
    height: '400px',
    background: 'linear-gradient(45deg, #10B981, #059669)',
  },
  '& > div:nth-of-type(3)': {
    bottom: '-10%',
    left: '20%',
    width: '300px',
    height: '300px',
    background: 'linear-gradient(45deg, #F59E0B, #D97706)',
  },
  '& > div:nth-of-type(4)': {
    top: '20%',
    left: '30%',
    width: '200px',
    height: '200px',
    background: 'linear-gradient(45deg, #8B5CF6, #7C3AED)',
  },
};

const ProfilePage = () => {
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    avatarUrl: ''
  });
  const [icons, setIcons] = useState({
    CameraIcon: '/assets/CameraIcon.svg',
    SettingsIcon: '/assets/SettingsIcon.svg',
    loading: false
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const data = await authService.getProfile();
        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          username: data.username || '',
          avatarUrl: data.avatarUrl || ''
        });
      } catch (err) {
        setError('Не удалось загрузить данные профиля');
        console.error('Ошибка загрузки профиля:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await authService.updateProfile(userData);
      setError(null);
    } catch (err) {
      setError('Не удалось сохранить изменения');
      console.error('Ошибка сохранения профиля:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setUserData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleChatListClick = () => {
    router.push('/chat-list');
  };

  const handleChangeAvatar = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          setError('Файл слишком большой. Максимальный размер - 5MB');
          return;
        }

        try {
          setIcons(prev => ({ ...prev, loading: true }));
          const response = await authService.updateAvatar(file);
          setUserData(prev => ({ ...prev, avatarUrl: response.avatarUrl }));
          setError(null);
        } catch (error) {
          setError('Не удалось обновить аватар');
          console.error('Ошибка при обновлении аватара:', error);
        } finally {
          setIcons(prev => ({ ...prev, loading: false }));
        }
      }
    };
    input.click();
  };

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  if (loading) {
    return (
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDarkMode ? '#1F2937' : 'white'
      }}>
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
      {/* Фоновые фигуры */}
      <Box sx={backgroundShapes}>
        <Box />
        <Box />
        <Box />
        <Box />
      </Box>

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
          ...(isDarkMode && {
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
              zIndex: -1,
              opacity: 0.3
            }
          }),
          boxShadow: !isDarkMode ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'
        }}>
          {/* Шапка с аватаром и иконками */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
            position: 'relative'
          }}>
            {/* Аватар */}
            <Box sx={{ position: 'relative' }}>
              {userData.avatarUrl ? (
                <Box sx={{
                  width: isMobile ? 72 : 92,
                  height: isMobile ? 72 : 92,
                  position: 'relative',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '1px solid transparent'
                }}>
                  <Image
                    src={`http://localhost:3000${userData.avatarUrl}`}
                    alt="User avatar"
                    fill
                    style={{
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ) : (
                <Avatar
                  sx={{
                    width: isMobile ? 72 : 92,
                    height: isMobile ? 72 : 92,
                    borderRadius: '50%',
                    border: '1px solid transparent',
                    backgroundColor: '#3B82F6',
                    fontSize: '24px'
                  }}
                >
                  {userData.firstName?.[0]}{userData.lastName?.[0]}
                </Avatar>
              )}
              {/* Кнопка смены аватара */}
              <IconButton
                onClick={handleChangeAvatar}
                sx={{
                  backgroundColor: '#3B82F6',
                  color: '#ffffff',
                  borderRadius: '50%',
                  padding: '8px',
                  width: '40px',
                  height: '40px',
                  position: 'absolute',
                  left: isMobile ? 50 : 70,
                  top: isMobile ? 50 : 79,
                  '&:hover': {
                    backgroundColor: '#2563EB',
                  },
                  '& img': {
                    width: '24px',
                    height: '24px',
                  },
                }}
              >
                {icons.loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <img src={icons.CameraIcon} alt="Camera" style={{ width: '24px', height: '24px' }} />
                )}
              </IconButton>
            </Box>

            {/* Кнопка настроек */}
            <IconButton
              onClick={handleSettingsClick}
              sx={{
                backgroundColor: '#3B82F6',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '8px',
                width: '40px',
                height: '40px',
                '&:hover': {
                  backgroundColor: '#2563EB',
                },
                '& img': {
                  width: '24px',
                  height: '24px',
                },
              }}
            >
              {icons.loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <img src={icons.SettingsIcon} alt="Settings" style={{ width: '24px', height: '24px' }} />
              )}
            </IconButton>
          </Box>

          {/* Поля ввода */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Имя и фамилия */}
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography component="span" variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 0.5 }}>
                  Имя
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={userData.firstName}
                  onChange={handleInputChange('firstName')}
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
                <Typography component="span" variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 0.5 }}>
                  Фамилия
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={userData.lastName}
                  onChange={handleInputChange('lastName')}
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

            {/* Email и имя аккаунта */}
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography component="span" variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 0.5 }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={userData.email}
                  onChange={handleInputChange('email')}
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
                <Typography component="span" variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 0.5 }}>
                  Имя аккаунта
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={userData.username}
                  onChange={handleInputChange('username')}
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

          {/* Кнопки */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleUpdateProfile}
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
            >
              Обновить
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleChatListClick}
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
            >
              Список чатов
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Уведомления об ошибках */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProfilePage;