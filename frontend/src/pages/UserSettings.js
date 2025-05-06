import React, { useState, useContext } from 'react'; 
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
} from '@mui/material';
import { ArrowBack, Notifications } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../pages/ThemeContext';
import Background from '../components/Background/Background';

const UserSettings = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  
  const handleGoBack = () => {
    navigate('/profile'); 
  };

  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);

  // Обработчик для переключения состояния чекбокса
  const handlePushNotificationsChange = (event) => {
    setPushNotificationsEnabled(event.target.checked);
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
      {/* Добавляем Background */}
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
          <IconButton>
            <Notifications sx={{ fontSize: 24, color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)' }} />
          </IconButton>
          <Avatar
            src="https://via.placeholder.com/40" // Замените на реальный URL аватара
            sx={{ width: 40, height: 40 }}
          />
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
            label="Существующий пароль"
            defaultValue="*******"
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
            label="Новый пароль"
            defaultValue="*******"
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
            label="Повторите пароль"
            defaultValue="*******"
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
          <FormControlLabel
            control={
              <Checkbox 
                defaultChecked 
                sx={{
                  color: isDarkMode ? '#3B82F6' : 'primary', 
                  '&.Mui-checked': {
                    color: isDarkMode ? '#3B82F6' : 'primary', 
                  },
                }}
              />
            }
            label="Двухфакторная аутентификация"
            sx={{ color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)' }} 
          />
        </FormGroup>

        {/* Раздел "Уведомления" */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2, color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)' }}> 
          Уведомления
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={pushNotificationsEnabled} 
                onChange={handlePushNotificationsChange} 
                sx={{
                  color: isDarkMode ? '#3B82F6' : 'primary', 
                  '&.Mui-checked': {
                    color: isDarkMode ? '#3B82F6' : 'primary', 
                  },
                }}
              />
            }
            label="Пуш-уведомления"
            sx={{ color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)' }} 
          />
          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  color: isDarkMode ? '#3B82F6' : 'primary', 
                  '&.Mui-checked': {
                    color: isDarkMode ? '#3B82F6' : 'primary', 
                  },
                }}
              />
            }
            label="Звук уведомлений"
            sx={{ color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)' }} 
          />
        </FormGroup>

        {/* Переключатель для темной темы */}
        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2, color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)' }}>
            Тёмная тема
          </Typography>
          <Switch 
            checked={isDarkMode}
            onChange={toggleDarkMode} 
          />
        </Box>
      </Box>
    </Box>
  );
};

export default UserSettings;