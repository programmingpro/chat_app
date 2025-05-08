import React, { useContext } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import { ThemeContext } from './ThemeContext';
import { useRouter } from 'next/navigation';
import { useNavigate } from 'react-router-dom';
import Background from '../components/Background/Background';
import cyapLogo from '../assets/cyap_logo_2.svg';

const SidebarHeader = styled(Box)(({ isDarkMode }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 20px',
  backgroundColor: isDarkMode ? '#1F2937' : '#f6f6f6',
  position: 'sticky',
  top: 0,
  zIndex: 1,
  height: '56px',
  borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
}));

const NavigationBar = styled(Box)(({ isDarkMode }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: isDarkMode ? '#1F2937' : 'white',
  padding: '8px 40px',
  position: 'sticky',
  bottom: 0,
  zIndex: 1,
  borderTop: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
}));

const SidebarContainer = styled(Box)(({ isDarkMode }) => ({
  width: '335px',
  height: '100vh',
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  padding: '8px 20px',
  backgroundColor: isDarkMode ? '#111827' : '#fff',
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 1000,
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
}));

const SidebarItem = styled(Box)(({ isDarkMode }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 0',
  cursor: 'pointer',
  color: isDarkMode ? '#E5E7EB' : '#111827',
  '&:hover': {
    backgroundColor: isDarkMode ? '#1F2937' : '#f6f6f6',
  },
}));

const Divider = styled('hr')(({ isDarkMode }) => ({
  width: '100%',
  margin: '0',
  border: 'none',
  borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #d1d9e5',
}));

const Overlay = styled(Box)(({ isDarkMode }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(249, 250, 251, 0.5)',
  zIndex: 999,
}));

function BurgerMenu() {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  const handleNewChat = () => {
    navigate('/create-chat');
  };

  const handleAllChats = () => {
    navigate('/chat-list');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
      overflow: 'hidden',
    }}>
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        overflow: 'hidden'
      }}>
        <Background />
      </Box>
      <Overlay isDarkMode={isDarkMode} />
      <SidebarContainer isDarkMode={isDarkMode}>
        <SidebarHeader isDarkMode={isDarkMode}>
          <Box
            component="img"
            src={cyapLogo}
            alt="Cyap Logo"
            sx={{
              height: '32px',
              width: 'auto'
            }}
          />
          <IconButton 
            onClick={handleClose}
            sx={{ 
              color: isDarkMode ? '#E5E7EB' : '#111827',
              padding: '8px',
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
              }
            }}
          >
            <CloseIcon sx={{ fontSize: '24px' }} />
          </IconButton>
        </SidebarHeader>
        
        <SidebarItem 
          isDarkMode={isDarkMode}
          onClick={handleAllChats}
        >
          <ChatIcon sx={{ color: isDarkMode ? '#E5E7EB' : '#111827' }} />
          <Typography 
            variant="body1" 
            sx={{ 
              marginLeft: '8px',
              color: isDarkMode ? '#E5E7EB' : '#111827',
              fontSize: '16px'
            }}
          >
            Все чаты
          </Typography>
        </SidebarItem>

        <Divider isDarkMode={isDarkMode} />

        <SidebarItem 
          isDarkMode={isDarkMode}
          onClick={handleNewChat}
        >
          <AddIcon sx={{ color: isDarkMode ? '#E5E7EB' : '#111827' }} />
          <Typography 
            variant="body1" 
            sx={{ 
              marginLeft: '8px',
              color: isDarkMode ? '#E5E7EB' : '#111827',
              fontSize: '16px'
            }}
          >
            Новый чат
          </Typography>
        </SidebarItem>

        <Divider isDarkMode={isDarkMode} />

        <SidebarItem 
          isDarkMode={isDarkMode}
          onClick={handleProfile}
        >
          <PersonIcon sx={{ color: isDarkMode ? '#E5E7EB' : '#111827' }} />
          <Typography 
            variant="body1" 
            sx={{ 
              marginLeft: '8px',
              color: isDarkMode ? '#E5E7EB' : '#111827',
              fontSize: '16px'
            }}
          >
            Профиль
          </Typography>
        </SidebarItem>

        <Box sx={{ flexGrow: 1 }} />
      </SidebarContainer>
    </Box>
  );
}

export default BurgerMenu;
