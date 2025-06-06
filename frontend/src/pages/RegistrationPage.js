import React, { useContext } from 'react';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import cyapLogo from '../assets/cyap-logo.svg';
import { IconButton } from '@mui/material';
import VkIcon from '../assets/vk-icon.svg';
import GIcon from '../assets/G-icon.svg';
import { ThemeContext } from './ThemeContext';

const Container = styled(Box)({
  width: '580px',
  height: '736px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: '8px',
});

const LogoContainer = styled(Box)({
  width: '74.947px',
  height: '40px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
});

const Description = styled(Typography)({
  color: 'rgba(31, 41, 55, 1)',
  fontSize: '24px',
  lineHeight: '32px',
  textAlign: 'left',
  padding: '0 0 0 0',
  marginBottom: '40px',
});

const Frame = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '16px',
  width: '480px',
  padding: '0 0 0 0',
});

const RegisterFrame = styled(Box)({
  width: '480px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0px',
});

const RegisterLink = styled(Typography)({
  color: 'rgba(107, 114, 128, 1)',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'left',
});

const RegisterButton = styled(Typography)({
  color: 'rgba(59, 130, 246, 1)',
  fontSize: '14px',
  fontWeight: '700',
  lineHeight: '20px',
  marginTop: '16px',
  cursor: 'pointer',
});

// Стили для правой части (форма регистрации)
const StyledTextField = styled(TextField)({
  width: '322px',
  height: '40px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    backgroundColor: 'rgba(250, 250, 250, 1)',
    '& fieldset': {
      borderColor: 'rgba(209, 213, 219, 1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(156, 163, 175, 1)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'rgba(156, 163, 175, 1)',
    },
  },
});

const StyledButton = styled(Button)({
  width: '100%',
  color: 'white',
  backgroundColor: '#3B82F6',
  padding: '8px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: '#2563EB',
  },
});

const RegistrationPage = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isDarkMode ? '#1F2937' : 'white',
      overflow: 'auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {/* Фоновый SVG */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
      }}>
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
      </div>

      {/* Основной контент */}
      <div className="Frame3161" style={{ alignSelf: 'stretch', flex: '1 1 0', justifyContent: 'center', alignItems: 'center', gap: 20, display: 'inline-flex', position: 'relative', zIndex: 1 }}>
        {/* Левый блок */}
        <div className="Frame3162" style={{ width: 580, alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 8, display: 'inline-flex' }}>
          <Container>
            <LogoContainer>
              <img src={cyapLogo} alt="CyaP Logo" style={{ width: 75, height: 40 }} />
            </LogoContainer>
            <Frame>
              <Description>
                Организуйте свои чаты, держите связь с друзьями и коллегами, делитесь файлами, создавайте групповые обсуждения — всё в одном месте.
              </Description>
            </Frame>
            <RegisterFrame>
              <RegisterLink>Уже зарегестрированны?</RegisterLink>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <RegisterButton>Войти в аккаунт</RegisterButton>
              </Link>
            </RegisterFrame>
          </Container>
        </div>

        {/* Правый блок (форма регистрации) */}
        <Card sx={{ width: '380px', height: '634px', boxShadow: 1, borderRadius: 2, p: 3, justifyContent: 'space-between' }}>
          <CardContent>
            <Typography
              variant="h6"
              style={{
                color: 'rgba(31, 41, 55, 1)',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 700,
                fontSize: '24px',
                lineHeight: '32px',
                textAlign: 'left',
                padding: 0,
                margin: 0,
                marginBottom: 24,
              }}
            >
              Регистрация
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="#6B7180" sx={{ fontSize: 12 }}>
                  Имя
                </Typography>
                <StyledTextField variant="outlined" placeholder="Ярополк" />
              </Box>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="body2" color="#6B7180" sx={{ fontSize: 12 }}>
                  Фамилия
                </Typography>
                <StyledTextField variant="outlined" placeholder="Иванов" />
              </Box>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="body2" color="#6B7180" sx={{ fontSize: 12 }}>
                  Email
                </Typography>
                <StyledTextField variant="outlined" placeholder="ivanov@yandex.ru" />
              </Box>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="body2" color="#6B7180" sx={{ fontSize: 12 }}>
                  Придумайте пароль
                </Typography>
                <StyledTextField variant="outlined" type="password" placeholder="******" />
              </Box>
              <Box sx={{ mb: 0.5 }}>
                <Typography variant="body2" color="#6B7180" sx={{ fontSize: 12 }}>
                  Повторите пароль
                </Typography>
                <StyledTextField variant="outlined" type="password" placeholder="******" />
              </Box>
              <Box mt={5}>
                <StyledButton variant="contained">Зарегистрироваться</StyledButton>
              </Box>

            <Box mt={0}>
                <Typography variant="body2" color="#6B7180" align="center">
                  Регистрация с помощью
                </Typography>
                <Box display="flex" justifyContent="center" mt={0}>
                  <IconButton aria-label="vk" sx={{ color: 'rgba(0, 119, 255, 1)' }}>
                    <img src={VkIcon} alt="VK" style={{ width: 42.88, height: 32 }} />
                  </IconButton>
                  <IconButton aria-label="gmail" sx={{ color: 'rgba(220, 78, 65, 1)' }}>
                    <img src={GIcon} alt="gmail" style={{ width: 42.88, height: 32 }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationPage;