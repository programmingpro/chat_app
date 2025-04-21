import React, { useState, useContext } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Avatar,
  CssBaseline,
  TextField,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Badge,
  styled
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import { ThemeContext } from './ThemeContext';
import Background from '../components/Background/Background';
import { useNavigate } from 'react-router-dom';

const SvgIcon = styled('svg')({
  fill: 'none',
  stroke: 'white',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

const NotificationBox = styled(Box)(({ isDarkMode }) => ({
  backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
  borderRadius: 12,
  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
  width: 400,
  paddingTop: 12,
  paddingBottom: 12,
  overflow: 'hidden',
}));

const Notification = ({ title, message, time, isDarkMode }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '6px 16px',
      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
      '&:hover': {
        backgroundColor: isDarkMode ? '#374151' : '#F9FAFB'
      }
    }}
  >
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography
        sx={{
          color: isDarkMode ? '#F9FAFB' : 'rgba(31, 41, 55, 1)',
          fontSize: '14px',
          fontWeight: 700,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: isDarkMode ? '#D1D5DB' : 'rgba(75, 85, 99, 1)',
          fontSize: '12px',
        }}
      >
        {message}
      </Typography>
    </Box>
    <Typography sx={{ 
      color: isDarkMode ? '#9CA3AF' : 'rgba(155, 163, 175, 1)', 
      fontSize: '12px' 
    }}>
      {time}
    </Typography>
  </Box>
);

const NotificationList = ({ isDarkMode }) => {
  const notifications = [
    {
      id: 1,
      title: "Приглашение в чат",
      message: "Вас приглашают в новый групповой чат «Ремесленный град»",
      time: "15:04"
    },
    {
      id: 2,
      title: "Смена прав администратора",
      message: "Вы назначены администратором чата «Тайный совет». Управляйте мудро!",
      time: "14:10"
    },
    {
      id: 3,
      title: "Заголовок уведомления",
      message: "Совещание в чате «Беседы у очага» завершено. Протокол доступен для скачивания.",
      time: "14:00"
    },
    {
      id: 4,
      title: "Сбои подключения",
      message: "Были замечены временные перебои в работе чата «Славянские мемы». Сейчас всё стабильно.",
      time: "12:00"
    }
  ];  

  return (
    <NotificationBox isDarkMode={isDarkMode}>
      {notifications.map((notification, index) => (
        <React.Fragment key={notification.id}>
          <Notification 
            title={notification.title}
            message={notification.message}
            time={notification.time}
            isDarkMode={isDarkMode}
          />
          {index < notifications.length - 1 && (
            <Divider sx={{ 
              backgroundColor: isDarkMode ? '#374151' : 'rgba(209, 213, 219, 1)' 
            }} />
          )}
        </React.Fragment>
      ))}
    </NotificationBox>
  );
};

const ChatList = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const navigate = useNavigate();

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      setUnreadCount(0);
    }
  };

  const handleNewChatClick = () => {
    navigate('/create-chat'); // Переход на страницу создания чата
  };

  const chats = [
    {
      id: 1,
      name: 'Алексей Петров',
      lastMessage: 'Привет, как дела? Документы уже готовы к отправке...',
      time: '12:30',
      unread: 2,
      avatar: 'AP'
    },    
  ];

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDarkMode ? '#111827' : 'white',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Background />
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            margin: '0 auto',
            maxWidth: 'calc(100% - 460px)',
            px: '230px',
            '@media (max-width: 1200px)': {
              maxWidth: '100%',
              px: '30px'
            },
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* Навигационная панель */}
          <Box
            sx={{
              py: 2,
              bgcolor: isDarkMode ? 'rgba(17, 24, 39, 0.1)' : 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              position: 'sticky',
              top: 0,
              zIndex: 1
            }}
          >
            {/* Заголовок и иконки */}
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Typography
                variant="h6"
                sx={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: isDarkMode ? '#F9FAFB' : '#1F2938',
                  position: 'absolute',
                  left: '7%',
                  transform: 'translateX(-50%)'
                }}
              >
                Ваши чаты
              </Typography>

              <Box display="flex" alignItems="center" gap={1} ml="auto" position="relative">
                <IconButton onClick={toggleNotifications}>
                  <Badge 
                    badgeContent={unreadCount} 
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        right: -4,
                        top: 4,
                        backgroundColor: '#EF4444',
                        color: 'white'
                      }
                    }}
                  >
                    <NotificationsIcon 
                      sx={{ 
                        color: 'transparent',
                        stroke: isDarkMode ? '#F9FAFB' : 'black',
                        strokeWidth: 1.5,
                        '& path': {
                          fill: 'transparent',
                          stroke: isDarkMode ? '#F9FAFB' : 'black',
                          strokeWidth: 1.5
                        }
                      }} 
                    />
                  </Badge>
                </IconButton>

                {showNotifications && (
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: '56px',
                      zIndex: 10,
                    }}
                  >
                    <NotificationList isDarkMode={isDarkMode} />
                  </Box>
                )}

                <IconButton>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: isDarkMode ? '#3B82F6' : '#2563EB',
                      color: '#FFFFFF'
                    }}
                  />
                </IconButton>
              </Box>
            </Box>

            {/* Строка поиска */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Поиск по сообщениям или чатам"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.7)',
                  height: '48px',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#374151' : '#D1D5DB',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#4B5563' : '#9CA3AF',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: isDarkMode ? '#3B82F6' : '#2563EB',
                    borderWidth: 1,
                  },
                  '& input': {
                    color: isDarkMode ? '#F9FAFB' : '#1F2938',
                    '&::placeholder': {
                      color: isDarkMode ? '#9CA3AF' : '#9CA3AF',
                      opacity: 1,
                    },
                  },
                }
              }}
            />
          </Box>

          {/* Контентная область с чатами */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              py: 2,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            {/* Список чатов */}
            {chats.map((chat, index) => (
              <React.Fragment key={chat.id}>
                <ListItem
                  sx={{
                    bgcolor: isDarkMode ? '#111827' : 'white',
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    mb: 1,
                    '&:hover': {
                      bgcolor: isDarkMode ? '#1F2937' : '#F9FAFB'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: isDarkMode ? '#3B82F6' : '#2563EB',
                        color: 'white'
                      }}
                    >
                      {chat.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography
                          component="span"
                          variant="body1"
                          color={isDarkMode ? '#F9FAFB' : '#1F2938'}
                          fontWeight="500"
                        >
                          {chat.name}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color={isDarkMode ? '#9CA3AF' : '#6B7280'}
                        >
                          {chat.time}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography
                          component="span"
                          variant="body2"
                          color={isDarkMode ? '#9CA3AF' : '#6B7280'}
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '70%',
                          }}
                        >
                          {chat.lastMessage}
                        </Typography>
                        {chat.unread > 0 && (
                          <Badge 
                            badgeContent={chat.unread} 
                            color="primary"
                            sx={{
                              '& .MuiBadge-badge': {
                                right: -4,
                                top: 4,
                                backgroundColor: isDarkMode ? '#3B82F6' : '#2563EB',
                                color: '#FFFFFF'
                              }
                            }}
                          />
                        )}
                      </Box>
                    }
                    sx={{ my: 0 }}
                  />
                </ListItem>
                <Divider sx={{ borderColor: isDarkMode ? '#374151' : '#E5E7EB' }} />
              </React.Fragment>
            ))}

            {/* Кнопка нового чата */}
            <Box
              sx={{
                position: 'sticky',
                bottom: 16,
                right: 16,
                alignSelf: 'flex-end',
                marginTop: 'auto',
                zIndex: 2
              }}
            >
              <IconButton
                onClick={handleNewChatClick}
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 1)',
                  borderRadius: '50%',
                  width: 56,
                  height: 56,
                  '&:hover': {
                    backgroundColor: 'rgba(37, 99, 235, 1)'
                  }
                }}
              >
                <SvgIcon
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path d="M18 2.75L20.06 0.68C20.49 0.24 21.08 0 21.69 0C22.3 0 22.89 0.24 23.32 0.68C23.76 1.11 24 1.7 24 2.31C24 2.92 23.76 3.51 23.32 3.94L5.64 21.62C4.99 22.27 4.19 22.75 3.3 23.02L0 24L0.98 20.7C1.25 19.81 1.73 19.01 2.38 18.36L18 2.75Z" />
                </SvgIcon>
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ChatList;