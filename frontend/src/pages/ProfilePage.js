import React, { useContext } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom'; 
import CameraIcon from '../assets/CameraIcon.svg'; 
import SettingsIcon from '../assets/SettingsIcon.svg'; 
import { ThemeContext } from './ThemeContext';

const Root = styled(Box)({
  width: '100%',
  minHeight: '100vh', 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column', 
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
  position: 'relative', // Добавляем relative для позиционирования иконки
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
  backgroundColor: '#3B82F6', 
  color: '#ffffff', 
  borderRadius: '50%', 
  padding: '8px',
  width: '40px', 
  height: '40px', 
  '&:hover': {
    backgroundColor: '#2563EB',
  },
  '& img': {
    width: '24px', // Размер иконки внутри кнопки
    height: '24px', // Размер иконки внутри кнопки
  },
});

const SettingsIconStyled = styled(IconButton)({
  backgroundColor: '#3B82F6', 
  color: '#ffffff', 
  borderRadius: '8px', 
  padding: '8px',
  width: '40px', // Размер кнопки
  height: '40px', // Размер кнопки
  '&:hover': {
    backgroundColor: '#2563EB',
  },
  '& img': {
    width: '24px', 
    height: '24px', 
  },
});

const CameraIconWrapper = styled(Box)({
  position: 'absolute', 
  left: '70px', 
  top: '79%', 
  transform: 'translateY(-50%)', 
});

const IconsContainer = styled(Box)({
  position: 'absolute', 
  right: '24px', 
  top: '0px', 
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
  backgroundColor: '#3B82F6', 
  color: '#ffffff', 
  borderRadius: '8px',
  padding: '8px 16px',
  width: '262px', 
  height: '40px', 
  textTransform: 'none',   
  fontWeight: 'bold', 
  fontSize: '16px', 
  lineHeight: '24px',
  marginBottom: '32px',
  marginTop: 'auto',
  '&:hover': {
    backgroundColor: '#2563EB', 
  },
});

const StyledTypography = styled(Typography)({
  color: 'rgba(31, 41, 55, 1)', 
  fontFamily: 'Roboto, sans-serif', 
  fontSize: '30px', 
  fontWeight: 700, 
  lineHeight: '36px',  
  marginTop: '32px',
  marginBottom: '24px',
  width: '630px',
  textAlign: 'left',
});

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const handleChatListClick = () => {
    navigate('/chat-list'); // Переход на страницу списка чатов
  };

  const handleChangeAvatar = () => {
    // Логика для изменения аватара
    console.log('Change Avatar');
  };

  const handleSettingsClick = () => {
    // Логика для перехода к настройкам
    navigate('/settings');
  };

  return (
    <Root sx={{ backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB' }}>
      <StyledTypography sx={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>
        Профиль
      </StyledTypography>        
      <Container>        
        <Header>
          <Box position="relative"> {/* Обертка для аватара и иконки камеры */}
            <ProfileIcon variant="square" />
            <CameraIconWrapper>
              <IconButtonStyled onClick={handleChangeAvatar}>
                <img src={CameraIcon} alt="Camera"/>
              </IconButtonStyled>
            </CameraIconWrapper>
          </Box>
          <IconsContainer>
            <SettingsIconStyled onClick={handleSettingsClick}>
              <img src={SettingsIcon} alt="Settings"/>
            </SettingsIconStyled>
          </IconsContainer>
        </Header>
        <InputSection>
          <InputWrapper>
            <Box flex={1}>
              <Typography variant="caption" color={isDarkMode ? 'textSecondary' : 'textPrimary'}>
                Имя
              </Typography>
              <StyledTextField variant="outlined" defaultValue="Ярополк" />
            </Box>
            <Box flex={1}>
              <Typography variant="caption" color={isDarkMode ? 'textSecondary' : 'textPrimary'}>
                Фамилия
              </Typography>
              <StyledTextField variant="outlined" defaultValue="Иванов" />
            </Box>
          </InputWrapper>
          <InputWrapper>
            <Box flex={1}>
              <Typography variant="caption" color={isDarkMode ? 'textSecondary' : 'textPrimary'}>
                Email
              </Typography>
              <StyledTextField variant="outlined" defaultValue="ivanov@yandex.ru" />
            </Box>
            <Box flex={1}>
              <Typography variant="caption" color={isDarkMode ? 'textSecondary' : 'textPrimary'}>
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
};

export default ProfilePage;