import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  IconButton,
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import cyapLogo from '../assets/cyap-logo.svg';
import VkIcon from '../assets/vk-icon.svg';
import GIcon from '../assets/G-icon.svg';
import { ThemeContext } from './ThemeContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
              <img src={cyapLogo} alt="CyaP Logo" style={{ width: 75, height: 40 }} />
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
              <img src={cyapLogo} alt="CyaP Logo" style={{ width: 75, height: 40 }} />
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
              У вас ещё нет аккаунта?
            </Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography 
                sx={{ 
                  color: 'rgba(59, 130, 246, 1)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Зарегистрироваться
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
            Вход в аккаунт
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: '#6B7180', fontSize: 12 }}>
              Email или логин
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="ivanov@yandex.ru"
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

          <Box sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#6B7180', fontSize: 12 }}>
              Пароль
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              type="password"
              placeholder="******"
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

          <Typography 
            variant="body2" 
            align="right" 
            sx={{ 
              color: '#6B7180',
              fontSize: 12,
              mb: 2
            }}
          >
            Забыли пароль?
          </Typography>

          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#3B82F6',
              borderRadius: 1.5,
              fontWeight: 700,
              fontSize: '16px',
              color: '#FFFFFF',
              textTransform: 'none',
              py: 1,
              ':hover': {
                backgroundColor: '#1769aa',
              },
            }}
            onClick={() => navigate('/profile')}
          >
            Войти
          </Button>

          <Typography 
            variant="body2" 
            align="center" 
            sx={{ 
              color: '#6B7180',
              my: 2
            }}
          >
            Войти с помощью
          </Typography>

          <Grid container justifyContent="center" spacing={2}>
            <Grid item>
              <IconButton aria-label="vk" sx={{ color: 'rgba(0, 119, 255, 1)' }}>
                <img src={VkIcon} alt="VK" style={{ width: 32, height: 32 }} />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton aria-label="gmail" sx={{ color: 'rgba(220, 78, 65, 1)' }}>
                <img src={GIcon} alt="gmail" style={{ width: 32, height: 32 }} />
              </IconButton>
            </Grid>
          </Grid>
        </Box>

        {/* Ссылка на регистрацию (только для мобильных) */}
        {isMobile && (
          <Box sx={{ 
            textAlign: 'center',
            width: '100%'
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#6B7180',
                display: 'inline'
              }}
            >
              У вас ещё нет аккаунта?{' '}
            </Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography 
                component="span" 
                sx={{ 
                  color: '#3B82F6',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Зарегистрироваться
              </Typography>
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default LoginPage;