'use client';

import React, { useContext, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
  Grid,
  IconButton
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ThemeContext } from './ThemeContext';
import { authService } from '../services/api';

const RegistrationPage = () => {
  const router = useRouter();
  const { isDarkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      await authService.register(registerData);
      router.push('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

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
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? 3 : 6,
        p: isMobile ? 0 : 4,
        zIndex: 1
      }}>
        {/* Левая часть с описанием */}
        {isMobile ? (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <img src="/assets/cyap-logo.svg" alt="CyaP Logo" style={{ width: 75, height: 40 }} />
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)',
                fontSize: '16px',
                lineHeight: '24px',
                mb: 3
              }}
            >
              Организуйте свои чаты, держите связь с друзьями и коллегами,
              делитесь файлами, создавайте групповые обсуждения — всё в одном месте.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: '50%', maxWidth: '580px' }}>
            <Box sx={{ display: 'flex', mb: 3 }}>
              <img src="/assets/cyap-logo.svg" alt="CyaP Logo" style={{ width: 75, height: 40 }} />
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)',
                fontSize: '24px',
                lineHeight: '32px',
                mb: 3
              }}
            >
              Организуйте свои чаты, держите связь с друзьями и коллегами,
              делитесь файлами, создавайте групповые обсуждения — всё в одном месте.
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(107, 114, 128, 1)',
                fontSize: '14px',
                mb: 1
              }}
            >
              Уже зарегистрированы?
            </Typography>
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: 'rgba(59, 130, 246, 1)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Войти в аккаунт
              </Typography>
            </Link>
          </Box>
        )}

        {/* Правая часть с формой */}
        <Box sx={{
          width: isMobile ? '100%' : '50%',
          maxWidth: '380px',
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
          <Typography
            variant="h6"
            sx={{
              color: isDarkMode ? '#FFFFFF' : 'rgba(31, 41, 55, 1)',
              fontWeight: 700,
              fontSize: '24px',
              mb: 3
            }}
          >
            Регистрация
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#6B7180', fontSize: 12 }}>
                Имя
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Ярополк"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                sx={{
                  mt: 1,
                  backgroundColor: isDarkMode ? '#111827' : 'white',
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: isDarkMode ? '#F9FAFB' : '#111827',
                      '&::placeholder': {
                        color: isDarkMode ? '#FFFFFF' : '#9CA3AF',
                        opacity: 1,
                      },
                    },
                    '& fieldset': {
                      borderColor: isDarkMode ? '#374151' : '#D1D5DB',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#4B5563' : '#9CA3AF',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#6B7180', fontSize: 12 }}>
                Фамилия
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Иванов"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                sx={{
                  mt: 1,
                  backgroundColor: isDarkMode ? '#111827' : 'white',
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: isDarkMode ? '#F9FAFB' : '#111827',
                      '&::placeholder': {
                        color: isDarkMode ? '#FFFFFF' : '#9CA3AF',
                        opacity: 1,
                      },
                    },
                    '& fieldset': {
                      borderColor: isDarkMode ? '#374151' : '#D1D5DB',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#4B5563' : '#9CA3AF',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#6B7180', fontSize: 12 }}>
                Email
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="ivanov@yandex.ru"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{
                  mt: 1,
                  backgroundColor: isDarkMode ? '#111827' : 'white',
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: isDarkMode ? '#F9FAFB' : '#111827',
                      '&::placeholder': {
                        color: isDarkMode ? '#FFFFFF' : '#9CA3AF',
                        opacity: 1,
                      },
                    },
                    '& fieldset': {
                      borderColor: isDarkMode ? '#374151' : '#D1D5DB',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#4B5563' : '#9CA3AF',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#6B7180', fontSize: 12 }}>
                Пароль
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="password"
                placeholder="••••••••"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{
                  mt: 1,
                  backgroundColor: isDarkMode ? '#111827' : 'white',
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: isDarkMode ? '#F9FAFB' : '#111827',
                      '&::placeholder': {
                        color: isDarkMode ? '#FFFFFF' : '#9CA3AF',
                        opacity: 1,
                      },
                    },
                    '& fieldset': {
                      borderColor: isDarkMode ? '#374151' : '#D1D5DB',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#4B5563' : '#9CA3AF',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#6B7180', fontSize: 12 }}>
                Подтвердите пароль
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                type="password"
                placeholder="••••••••"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                sx={{
                  mt: 1,
                  backgroundColor: isDarkMode ? '#111827' : 'white',
                  '& .MuiOutlinedInput-root': {
                    '& input': {
                      color: isDarkMode ? '#F9FAFB' : '#111827',
                      '&::placeholder': {
                        color: isDarkMode ? '#FFFFFF' : '#9CA3AF',
                        opacity: 1,
                      },
                    },
                    '& fieldset': {
                      borderColor: isDarkMode ? '#374151' : '#D1D5DB',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#4B5563' : '#9CA3AF',
                    },
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: '#3B82F6',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#2563EB',
                },
                '&:disabled': {
                  backgroundColor: '#93C5FD',
                },
              }}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>

            <Typography
              variant="body2"
              align="center"
              sx={{
                color: '#6B7180',
                my: 2
              }}
            >
              Регистрация с помощью
            </Typography>

            <Grid container justifyContent="center" spacing={2}>
              <Grid item>
                <IconButton 
                  aria-label="vk" 
                  sx={{ color: 'rgba(0, 119, 255, 1)' }}
                  disabled
                >
                  <img src="/assets/vk-icon.svg" alt="VK" style={{ width: 32, height: 32 }} />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton 
                  aria-label="gmail" 
                  sx={{ color: 'rgba(220, 78, 65, 1)' }}
                  disabled
                >
                  <img src="/assets/G-icon.svg" alt="gmail" style={{ width: 32, height: 32 }} />
                </IconButton>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RegistrationPage;