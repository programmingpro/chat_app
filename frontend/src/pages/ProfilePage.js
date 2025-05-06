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
  useTheme
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [icons, setIcons] = useState({
    CameraIcon: null,
    SettingsIcon: null,
    loading: true
  });

  // Стили для фоновых фигур
  const backgroundShapes = {
    position: 'fixed',
    zIndex: -1,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
    filter: 'blur(100px)',
    opacity: isDarkMode ? 0.3 : 0.5,
    '& > div': {
      position: 'absolute',
      borderRadius: '50%',
    },
    '& > :nth-of-type(1)': {
      width: '500px',
      height: '500px',
      backgroundColor: 'rgba(37, 99, 235, 0.5)',
      transform: 'rotate(45deg)',
      left: '-250px',
      top: '20%',
    },
    '& > :nth-of-type(2)': {
      width: '400px',
      height: '400px',
      backgroundColor: 'rgba(37, 99, 235, 0.5)',
      transform: 'rotate(135deg)',
      right: '-100px',
      top: '50%',
    },
    '& > :nth-of-type(3)': {
      width: '600px',
      height: '600px',
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      transform: 'rotate(-45deg)',
      left: '30%',
      top: '-150px',
    },
    '& > :nth-of-type(4)': {
      width: '550px',
      height: '550px',
      backgroundColor: 'rgba(245, 158, 11, 0.5)',
      transform: 'rotate(75deg)',
      right: '50%',
      top: '30%',
    }
  };

  // Ленивая загрузка иконок
  useEffect(() => {
    let isMounted = true;

    const loadIcons = async () => {
      try {
        const [cameraIcon, settingsIcon] = await Promise.all([
          import('../assets/CameraIcon.svg').then(module => module.default),
          import('../assets/SettingsIcon.svg').then(module => module.default)
        ]);

        if (isMounted) {
          setIcons({
            CameraIcon: cameraIcon,
            SettingsIcon: settingsIcon,
            loading: false
          });
        }
      } catch (error) {
        console.error('Error loading icons:', error);
        if (isMounted) {
          setIcons(prev => ({ ...prev, loading: false }));
        }
      }
    };

    loadIcons();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChatListClick = () => {
    navigate('/chat-list');
  };

  const handleChangeAvatar = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Файл слишком большой. Максимальный размер - 5MB');
          return;
        }

        try {
          const { updateUserAvatar } = await import('../utils/api');
          const response = await updateUserAvatar(file);
          console.log('Аватар успешно обновлен:', response);
          alert('Аватар успешно обновлен!');
        } catch (error) {
          console.error('Ошибка при обновлении аватара:', error);
          alert('Не удалось обновить аватар');
        }
      }
    };
    input.click();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

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
              <Avatar
                src="https://via.placeholder.com/92"
                sx={{
                  width: isMobile ? 72 : 92,
                  height: isMobile ? 72 : 92,
                  borderRadius: '50%',
                  border: '1px solid transparent'
                }}
              />
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
                <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 0.5 }}>
                  Имя
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  defaultValue="Ярополк"
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
                  defaultValue="Иванов"
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
                <Typography variant="caption" sx={{ color: '#9CA3AF', display: 'block', mb: 0.5 }}>
                  Email
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  defaultValue="ivanov@yandex.ru"
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
                  Имя аккаунта
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  defaultValue="Yaropolk"
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

          {/* Кнопка списка чатов */}
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
              mt: 3,
              '&:hover': {
                backgroundColor: '#2563EB',
              },
            }}
            onClick={handleChatListClick}
          >
            Список чатов
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;