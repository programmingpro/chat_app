import React, { useState } from 'react'; 
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

const UserSettings = () => {
  const navigate = useNavigate();

  // Обработчик для перехода на страницу профиля
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
        width: '100%',
        height: '100%',
        backgroundColor: '#f9fafb',
        p: 4,
        boxSizing: 'border-box',
      }}
    >
      {/* Навигационная панель */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 40,
          position: 'relative', 
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
                color: 'rgba(31, 41, 55, 1)',
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
            <Notifications sx={{ fontSize: 24, color: 'rgba(31, 41, 55, 1)' }} />
          </IconButton>
          <Avatar
            src="https://via.placeholder.com/40" // Замените на реальный URL аватара
            sx={{ width: 40, height: 40 }}
          />
        </Box>
      </Box>

      {/* Основной контент страницы */}
      <Box
        sx={{
          width: 780,
          margin: 'auto',
          mt: 4,
          p: 4,
          borderRadius: 2,
          boxShadow: '0 4px 8px rgba(229, 231, 235, 1)',
          backgroundColor: '#ffffff',
        }}
      >
        {/* Раздел "Пароль" */}
        <FormGroup>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Пароль
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Существующий пароль"
            defaultValue="*******"
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Новый пароль"
            defaultValue="*******"
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Повторите пароль"
            defaultValue="*******"
            sx={{ mb: 3 }}
          />
          <FormControlLabel
            control={<Checkbox defaultChecked color="primary" />}
            label="Двухфакторная аутентификация"
          />
        </FormGroup>

        {/* Раздел "Уведомления" */}
        <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
          Уведомления
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={pushNotificationsEnabled} // Состояние чекбокса
                onChange={handlePushNotificationsChange} // Обработчик изменения
                color="primary"
              />
            }
            label="Пуш-уведомления"
          />
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Звук уведомлений"
          />
        </FormGroup>

        {/* Переключатель для темной темы */}
        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Тёмная тема
          </Typography>
          <Switch />
        </Box>
      </Box>
    </Box>
  );
};

export default UserSettings;