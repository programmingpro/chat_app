import React, { useContext } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Paper, 
  Badge,
  Avatar,
  Container 
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import Background from '../components/Background/Background';
import { styled } from '@mui/system';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '780px',
  padding: '16px 0',  
});

const ChatContainer = styled(Paper)(({ isDarkMode }) => ({
  width: '780px',
  height: '500px',
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.05)',
  backgroundColor: isDarkMode ? '#111827' : '#ffffff',
  border: isDarkMode ? '1px solid #374151' : 'none',
  overflowY: 'auto',
  overflowX: 'hidden',
}));

const ChatMessage = styled(Box)(({ isDarkMode }) => ({
  background: isDarkMode ? '#1F2937' : '#f4f7ff',
  borderRadius: '8px 8px 8px 2px',
  padding: '12px',
  marginBottom: '12px',
  color: isDarkMode ? '#F9FAFB' : '#111827',
}));

const ChatReply = styled(Box)(({ isDarkMode }) => ({
  background: isDarkMode ? '#2E3B4E' : 'rgba(255, 247, 237, 1)',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '12px',
  color: isDarkMode ? '#F9FAFB' : '#111827',
}));

const UserAvatar = styled(Avatar)({
  width: 44,
  height: 44,
  marginRight: '16px',
});

const ChatPage = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
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
          transform: 'translateX(-30px)', 
          border: '1px solid transparent' 
        }}>
            <IconButton 
              onClick={handleGoBack}>
              <ArrowBack sx={{ color: isDarkMode ? '#E5E7EB' : '#000000' }} />
            </IconButton>
            <Typography 
              variant="h4" 
              sx={{ 
                color: isDarkMode ? '#E5E7EB' : '#000000',
                fontWeight: 700,
                fontFamily: 'Roboto',
                fontSize: '24px',
                marginLeft: '16px',
              }}
            >
              Групповой чат
            </Typography>
          </Box>
          <Box sx={{
            position: 'absolute',
            right: '170px',
            display: 'flex',
            gap: '12px'
          }}>
            <IconButton>
              <Badge badgeContent={2} color="error">
                <NotificationsIcon sx={{ color: isDarkMode ? '#E5E7EB' : '#000000' }} />
              </Badge>
            </IconButton>
            <UserAvatar 
              sx={{ backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }}
            />
          </Box>
        </Header>

        <ChatContainer isDarkMode={isDarkMode}>          
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            p: '12px 24px',
            borderBottom: isDarkMode ? '1px solid #374651' : '1px solid #E5E7EB',
            bgcolor: isDarkMode ? '#0F1827' : '#FFFFFF',
            marginLeft: '-50px', 
            marginRight: '-24px', 
            width: 'calc(100% + 18px)', 
            marginBottom: '16px', 
            paddingLeft: '48px'
          }}>
            <Avatar 
              sx={{ 
                width: 44, 
                height: 44, 
                mr: 2,
                bgcolor: isDarkMode ? '#4B5563' : '#E5E7EB'
              }} 
            />
            <Box flexGrow={1}>
              <Typography sx={{
                fontSize: 16,
                fontWeight: 700,
                color: isDarkMode ? '#E5E7EB' : '#1F2937',
                lineHeight: '24px'
              }}>
                Совет пиршеств
              </Typography>
              <Typography sx={{
                fontSize: 14,
                color: isDarkMode ? '#9CA3AF' : '#6B7280',
                lineHeight: '20px'
              }}>
                Емеля печатает...
              </Typography>
            </Box>
            <IconButton>
              <MoreVertIcon sx={{ color: isDarkMode ? '#E5E7EB' : '#6B7280' }} />
            </IconButton>
          </Box>

          <Box display="flex" alignItems="flex-start" mb={3}>
            <UserAvatar 
              sx={{ backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }}
            />
            <Box flex={1}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600,
                  color: isDarkMode ? '#F9FAFB' : '#111827',
                  marginBottom: '4px'
                }}
              >
                Купец Гордий
              </Typography>
              <ChatReply isDarkMode={isDarkMode}>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Боярыня Лада:
                </Typography>
                Друзья, время пиров зимних близится! Надобно нам сие застолье обустроить так, дабы слава о нём ширилась по окрестным землям!
              </ChatReply>
              <ChatMessage isDarkMode={isDarkMode}>
                И если нужно, я достану сушёную рыбу и хмельные мёды.
              </ChatMessage>
            </Box>
          </Box>
        </ChatContainer>

        <Box 
          display="flex" 
          alignItems="center" 
          width="780px"
          mt={3}
          sx={{
            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
            borderRadius: '8px',
            padding: '8px',
            border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
          }}
        >
          {/* Поле ввода с новыми стилями */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Напишите сообщение..."
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '40px',
                backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                borderRadius: '4px',
                '& fieldset': {
                  borderColor: isDarkMode ? '#374151' : '#E5E7EB',
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? '#3B82F6' : '#2563EB',
                  borderWidth: '1px',
                },
              },
              '& .MuiInputBase-input': {
                color: isDarkMode ? '#F9FAFB' : '#111827',
                padding: '0 14px',
                fontSize: '14px',
                '&::placeholder': {
                  color: isDarkMode ? '#9CA3AF' : '#6B7280',
                  opacity: 1,
                },
              },
            }}
          />
          
          {/* Кнопка отправки (обновленная) */}
          <IconButton 
            sx={{ 
              minWidth: '40px',
              minHeight: '40px',
              backgroundColor: '#3B82F6',
              borderRadius: '8px',
              marginLeft: '8px',
              '&:hover': {
                backgroundColor: '#2563EB',
              }
            }}
          >
            <Box 
              component="svg"
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              fill="none"
              sx={{
                stroke: '#FFFFFF',
                strokeWidth: '1.5',
              }}
            >
              <path d="M3 10L0 0C7.17267 2.14085 13.9365 5.52277 20 10C13.9369 14.4771 7.17339 17.8591 0.0011 20L3 10Z"/>
            </Box>
          </IconButton>
        </Box>
      </Container>
    </>
  );
};

export default ChatPage;