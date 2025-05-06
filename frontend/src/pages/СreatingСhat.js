import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  Button, 
  IconButton, 
  Container, 
  Paper, 
  Badge 
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { styled } from '@mui/system';
import { ThemeContext } from './ThemeContext';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Background from '../components/Background/Background'; 

const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '780px',
  padding: '16px 0',  
});

const PageContent = styled(Paper)(({ isDarkMode }) => ({
  width: '780px',       
  height: '348px',     
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.05)',
  backgroundColor: isDarkMode ? '#111827' : '#ffffff',
  border: isDarkMode ? '1px solid #374151' : 'none',
}));

const InputContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '24px',
});

const СreatingСhat = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/chat-list'); 
  };
  
  const handleCreateChat = () => {
    navigate('/chat-page'); 
  };

  return (
  <>
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: isDarkMode ? '#111827' : 'white',
        zIndex: -1
      }}
    />
    <Background isDarkMode={isDarkMode}/>
    <Container 
      maxWidth="lg" 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', 
        position: 'relative', 
        backgroundColor: 'transparent',
        minHeight: '100vh',
        padding: '24px',
        zIndex: 1,
      }}>
      <Header>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',                 
      }}>
        <IconButton
         color={isDarkMode ? '#1F2937' : '#f9fafb'} 
         onClick={handleGoBack}
         sx={{ 
          position: 'relative',
          left: '-30px', 
      }}
         >               
          <ArrowBack sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }} />
        </IconButton>
        <Typography 
        variant="h4" 
        sx={{ 
          color: isDarkMode ? '#FFFFFF' : '#000000',
          fontWeight: 700,
          fontFamily: 'Roboto',
          lineHeight: '32px',
          fontSize: '24px',
          letterSpacing: '0%',
          textDecoration: 'none',
          textTransform: 'none',
          marginLeft: '-15px',           
          }}>
          Создание чата
        </Typography>
        </Box>

        <Box 
        sx={{ 
          marginLeft: 'auto', 
          display: 'flex', 
          gap: '8px',
          marginRight: '-30px'
          }}>
                
          <IconButton>
            <Badge badgeContent={2} color="error">
              <NotificationsIcon sx={{ color: isDarkMode ? '#FFFFFF' : '#000000' }} />
            </Badge>
          </IconButton>
          <IconButton>
            <Paper sx={{ 
              height: 40, 
              width: 40, 
              borderRadius: '50%', 
              overflow: 'hidden',
              backgroundColor: isDarkMode ? '#374151' : '#E5E7EB'
            }}>              
            </Paper>
          </IconButton>
        </Box>
      </Header>
      
      <PageContent isDarkMode={isDarkMode}>
        <InputContainer>
          <Typography variant="h6" sx={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}>
            Основные
          </Typography>
          <Box display="flex" gap="16px">
            <Box flex={1}>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                Тип чата
              </Typography>
              <Select 
                fullWidth 
                variant="outlined" 
                defaultValue="Групповой" 
                displayEmpty
                sx={{
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  color: isDarkMode ? '#F9FAFB' : '#111827',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                  },
                }}
              >
                <MenuItem value="Групповой" sx={{ 
                  backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
                  color: isDarkMode ? '#F9FAFB' : '#111827',
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6'
                  }
                }}>
                  Групповой
                </MenuItem>
              </Select>
            </Box>
            <Box flex={1}>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                Название
              </Typography>
              <TextField 
                fullWidth 
                variant="outlined" 
                defaultValue="Тайный совет"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? '#F9FAFB' : '#111827',
                    '& fieldset': {
                      borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                    },
                  },
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                }}
              />
            </Box>
          </Box>
        </InputContainer>

        <InputContainer>
          <Typography variant="h6" sx={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}>
            Роли
          </Typography>
          <Box display="flex" gap="16px">
            <Box flex={1}>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                Участник
              </Typography>
              <TextField 
                fullWidth 
                variant="outlined" 
                defaultValue="Ведунья Милана"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: isDarkMode ? '#F9FAFB' : '#111827',
                    '& fieldset': {
                      borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                    },
                  },
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                }}
              />
            </Box>
            <Box flex={1}>
              <Typography variant="body2" sx={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                Роль
              </Typography>
              <Select 
                fullWidth 
                variant="outlined" 
                defaultValue="Администратор" 
                displayEmpty
                sx={{
                  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                  color: isDarkMode ? '#F9FAFB' : '#111827',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                  },
                }}
              >
                <MenuItem value="Администратор" sx={{ 
                  backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
                  color: isDarkMode ? '#F9FAFB' : '#111827',
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6'
                  }
                }}>
                  Администратор
                </MenuItem>
                <MenuItem value="Пользователь" sx={{ 
                  backgroundColor: isDarkMode ? '#111827' : '#FFFFFF',
                  color: isDarkMode ? '#F9FAFB' : '#111827',
                  '&:hover': {
                    backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6'
                  }
                }}>
                  Пользователь
                </MenuItem>
              </Select>
            </Box>
            <Button 
              variant="outlined" 
              color="primary"
              sx={{
                alignSelf: 'flex-end',
                color: isDarkMode ? '#3B82F6' : '#2563EB',
                borderColor: isDarkMode ? '#3B82F6' : '#2563EB',
                '&:hover': {
                  borderColor: isDarkMode ? '#2563EB' : '#1D4ED8',
                }
              }}
            >
              Выдать роль
            </Button>
          </Box>
        </InputContainer>

        <Button 
          variant="contained" 
          color="primary"
          onClick={handleCreateChat}
          sx={{
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#2563EB',
            }
          }}
        >
          Создать чат
        </Button>
      </PageContent>
    </Container> 
  </> 
  );
};

export default СreatingСhat;