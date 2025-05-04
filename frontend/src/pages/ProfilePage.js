import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';

// Стили (остаются без изменений)
const Root = styled(Box)({
  width: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
});

const BackgroundSvg = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 0,
  opacity: 1,
});

const Container = styled(Box)(({ isDarkMode }) => ({
  width: '580px',
  height: '368px',
  backgroundColor: isDarkMode ? '#111827' : '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(229, 231, 235, 0.8)',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  border: isDarkMode ? '1px solid #374151' : 'none',
  position: 'relative',
  zIndex: 2,
}));

const Header = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
});

const ProfileIcon = styled(Avatar)({
  width: '92px',
  height: '92px',
  borderRadius: '46px',
  backgroundImage: 'url("https://via.placeholder.com/92")',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  border: '1px solid transparent',
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
    width: '24px',
    height: '24px',
  },
});

const SettingsIconStyled = styled(IconButton)({
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

const StyledTextField = styled(TextField)(({ isDarkMode }) => ({
  width: '100%',
  '& .MuiInputBase-root': {
    fontSize: '16px',
    lineHeight: '24px',
    minHeight: '40px',
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
    color: isDarkMode ? '#F9FAFB' : '#111827',
  },
  '& .MuiInputLabel-root': {
    color: isDarkMode ? '#9CA3AF' : '#6B7280',
  },
}));

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
  const [icons, setIcons] = useState({
    CameraIcon: null,
    SettingsIcon: null,
    loading: true
  });

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
    <Root sx={{ backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB' }}>
      <BackgroundSvg>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <g opacity="0.3" filter="url(#filter0_f_45_293)">
            <path fillRule="evenodd" clipRule="evenodd" d="M-192.588 508.767C-158.672 433.342 -142.697 313.097 -44.5975 331.643C53.4468 350.178 102.766 494.875 182.857 579.743C257.51 658.848 365.085 711.423 401.86 804.726C445.018 914.227 464.516 1051.78 385.039 1092.71C306.222 1133.31 180.657 1005.84 72.7503 974.242C-13.1001 949.105 -101.128 1002.34 -171.107 929.876C-241.157 857.336 -200.279 769.214 -204.464 687.169C-207.758 622.602 -215.634 560.02 -192.588 508.767Z" fill="#2563EB"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M785.666 787.463C730.104 761.954 641.305 749.448 655.583 677.034C669.853 604.661 777.107 569.04 840.311 510.323C899.222 455.594 938.711 376.372 1007.9 349.727C1089.1 318.456 1190.9 304.839 1220.7 363.83C1250.26 422.331 1155.29 514.418 1131.31 594.006C1112.23 657.326 1151.08 722.71 1097.1 774.023C1043.07 825.387 978.16 794.658 917.483 797.276C869.732 799.337 823.422 804.797 785.666 787.463Z" fill="#2563EB"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M493.955 150.241C444.613 257.696 269.6 176.712 160.419 222.077C79.9477 255.512 40.4748 403.227 -41.0806 372.546C-125.103 340.937 -86.3359 209.327 -106.209 121.772C-116.986 74.2905 -140.971 30.508 -129.453 -16.8004C-117.673 -65.1848 -84.7817 -103.571 -44.2883 -132.55C1.58379 -165.378 52.5744 -188.757 108.963 -187.423C185.078 -185.621 262.066 -174.149 319.307 -123.945C403.994 -49.6688 540.966 47.861 493.955 150.241Z" fill="#10B981"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M884.023 227.768C884.231 134.843 848.375 -2.75011 935.361 -35.4384C1026.85 -69.817 1081.3 80.4688 1170.66 120.055C1232.71 147.544 1331.97 94.1454 1363.51 154.238C1395.32 214.842 1297.32 267.764 1283.37 334.772C1267.46 411.128 1329.31 500.188 1279.03 559.808C1222.02 627.402 1114.26 667.41 1033.86 630.595C955.314 594.627 964.502 482.964 934.384 401.993C912.475 343.092 883.883 290.612 884.023 227.768Z" fill="#F59E0B"/>
          </g>
          <defs>
            <filter id="filter0_f_45_293" x="-312.562" y="-287.477" width="1852.56" height="1488.09" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_45_293"/>
            </filter>
          </defs>
        </svg>
      </BackgroundSvg>
      
      <StyledTypography sx={{ color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>
        Профиль
      </StyledTypography>
      
      <Container isDarkMode={isDarkMode}>
        <Header>
          <Box position="relative">
            <ProfileIcon variant="square" />
            <CameraIconWrapper>
              <IconButtonStyled onClick={handleChangeAvatar}>
                {icons.loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <img src={icons.CameraIcon} alt="Camera" style={{ width: '24px', height: '24px' }} />
                )}
              </IconButtonStyled>
            </CameraIconWrapper>
          </Box>
          <IconsContainer>
            <SettingsIconStyled onClick={handleSettingsClick}>
              {icons.loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                <img src={icons.SettingsIcon} alt="Settings" style={{ width: '24px', height: '24px' }} />
              )}
            </SettingsIconStyled>
          </IconsContainer>
        </Header>
        
        <InputSection>
          <InputWrapper>
            <Box flex={1}>
              <Typography variant="caption" color={isDarkMode ? '#9CA3AF' : '#9CA3AF'}>
                Имя
              </Typography>
              <StyledTextField variant="outlined" defaultValue="Ярополк" isDarkMode={isDarkMode} />
            </Box>
            <Box flex={1}>
              <Typography variant="caption" color={isDarkMode ? '#9CA3AF' : '#9CA3AF'}>
                Фамилия
              </Typography>
              <StyledTextField variant="outlined" defaultValue="Иванов" isDarkMode={isDarkMode} />
            </Box>
          </InputWrapper>
          <InputWrapper>
            <Box flex={1}>
              <Typography variant="caption" color={isDarkMode ? '#9CA3AF' : '#9CA3AF'}>
                Email
              </Typography>
              <StyledTextField variant="outlined" defaultValue="ivanov@yandex.ru" isDarkMode={isDarkMode} />
            </Box>
            <Box flex={1}>
              <Typography variant="caption" color={isDarkMode ? '#9CA3AF' : '#9CA3AF'}>
                Имя аккаунта
              </Typography>
              <StyledTextField variant="outlined" defaultValue="Yaropolk" isDarkMode={isDarkMode} />
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