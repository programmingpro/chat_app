import React from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom'; // Для навигации

// Импортируем кастомные иконки
import CameraIcon from '../assets/CameraIcon.svg'; // Путь к вашему SVG
import SettingsIcon from '../assets/SettingsIcon.svg'; // Путь к вашему SVG

const Root = styled(Box)({
  width: '100%',
  minHeight: '100vh', // Полная высота экрана
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#F9FAFB',
});

const Container = styled(Box)({
  width: '580px', 
  height: '368px', 
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(229, 231, 235, 0.8)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ProfileIcon = styled(Avatar)({
  width: '92px',
  height: '92px',
  borderRadius: '46px',
  backgroundImage: 'url("https://via.placeholder.com/92")', // Замените на реальный URL аватара
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  border: '1px solid transparent'
});

const IconButtonStyled = styled(IconButton)({
  backgroundColor: '#3B82F6', // Синий цвет
  color: '#ffffff', // Белый цвет иконки
  borderRadius: '50%',
  padding: '8px',
  '&:hover': {
    backgroundColor: '#2563EB',
  },
});

const IconsContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  marginLeft: '-20px', // Сдвигаем иконки влево, ближе к аватару
});

const InputSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const InputWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
});

const StyledTextField = styled(TextField)({
  width: '100%',
  '& .MuiInputBase-root': {
    fontSize: '16px',
    lineHeight: '24px',
    minHeight: '40px',
    '& input': {
      padding: '8px 14px',
    },
  },
});

const ChatButton = styled(Button)({
  backgroundColor: '#3B82F6', // Синий цвет
  color: '#ffffff', // Белый текст
  borderRadius: '8px',
  padding: '8px 16px',
  width: '262px', 
  height: '40px', 
  textTransform: 'none', 
  '&:hover': {
    backgroundColor: '#2563EB', // Темно-синий цвет при наведении
  },
});

function ProfilePage() {
  const navigate = useNavigate(); // Хук для навигации

  const handleChatListClick = () => {
    navigate('/chat-list'); // Переход на страницу списка чатов
  };

  const handleChangeAvatar = () => {
    // Логика для изменения аватара
    console.log('Change Avatar');
  };

  const handleSettingsClick = () => {
    // Логика для перехода к настройкам
    console.log('Settings Click');
  };

  return (
    <Root>
      <Container>
        <Header>
          <ProfileIcon variant="square" />
          <Box display="flex" gap="8px">
            {/* Используем кастомную иконку для Camera */}
            <IconButton onClick={handleChangeAvatar}>
              <img src={CameraIcon} alt="Camera" style={{ width: '24px', height: '24px' }} />
            </IconButton>
            {/* Используем кастомную иконку для Settings */}
            <IconButton onClick={handleSettingsClick}>
              <img src={SettingsIcon} alt="Settings" style={{ width: '24px', height: '24px' }} />
            </IconButton>
          </Box>
        </Header>
        <InputSection>
          <InputWrapper>
            <Box flex={1}>
              <Typography variant="caption" color="textSecondary">
                Имя
              </Typography>
              <StyledTextField variant="outlined" defaultValue="Ярополк" />
            </Box>
            <Box flex={1}>
              <Typography variant="caption" color="textSecondary">
                Фамилия
              </Typography>
              <StyledTextField variant="outlined" defaultValue="Иванов" />
            </Box>
          </InputWrapper>
          <InputWrapper>
            <Box flex={1}>
              <Typography variant="caption" color="textSecondary">
                Email
              </Typography>
              <StyledTextField variant="outlined" defaultValue="ivanov@yandex.ru" />
            </Box>
            <Box flex={1}>
              <Typography variant="caption" color="textSecondary">
                Имя аккаунта
              </Typography>
              <StyledTextField variant="outlined" defaultValue="Yaropolk" />
            </Box>
          </InputWrapper>
        </InputSection>
        <ChatButton variant="contained" onClick={handleChatListClick}>
          Список чатов
        </ChatButton>
      </Container>
    </Root>
  );
}

export default ProfilePage;