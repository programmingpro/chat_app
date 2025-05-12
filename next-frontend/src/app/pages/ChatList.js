import React, { useState, useContext, useEffect, useRef } from 'react';
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
  styled,
  Container,
  CircularProgress,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  Checkbox
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ThemeContext } from './ThemeContext';
import Background from '../components/Background/Background';
import { useRouter } from 'next/navigation';
import { authService } from '../services/api';
import Image from 'next/image';
import { Add as AddIcon } from '@mui/icons-material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const SvgIcon = styled('svg')({
  fill: 'none',
  stroke: 'white',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

const NotificationBox = styled(Box)(({ theme, isdarkmode }) => ({
  backgroundColor: isdarkmode === 'true' ? '#1F2937' : '#FFFFFF',
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
    <NotificationBox isdarkmode={isDarkMode.toString()}>
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

const BACKEND_URL = 'http://localhost:3000';

const SearchResultsPopup = ({ results, isDarkMode, onClose, onChatClick, isLoading }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
        marginTop: '8px',
        zIndex: 1000,
        maxHeight: '400px',
        overflowY: 'auto',
        opacity: 1,
        transform: 'translateY(0)',
        transition: 'all 0.2s ease-in-out',
        visibility: 'visible',
      }}
    >
      {isLoading ? (
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress size={24} />
        </Box>
      ) : results ? (
        <>
          {/* Сообщения */}
          {results.messages && results.messages.length > 0 && (
            <Box sx={{ p: 2 }}>
              <Typography
                sx={{
                  color: isDarkMode ? '#9CA3AF' : '#6B7280',
                  fontSize: '14px',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Сообщения
              </Typography>
              {results.messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    p: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                    },
                    borderRadius: '8px',
                  }}
                  onClick={() => onChatClick(message.chatId)}
                >
                  <Typography
                    sx={{
                      color: isDarkMode ? '#E5E7EB' : '#1F2937',
                      fontSize: '14px',
                    }}
                  >
                    {message.content}
                  </Typography>
                  <Typography
                    sx={{
                      color: isDarkMode ? '#9CA3AF' : '#6B7280',
                      fontSize: '12px',
                      mt: 0.5,
                    }}
                  >
                    В чате: {message.chatName}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Пользователи */}
          {results.users && results.users.length > 0 && (
            <Box sx={{ p: 2 }}>
              <Typography
                sx={{
                  color: isDarkMode ? '#9CA3AF' : '#6B7280',
                  fontSize: '14px',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Пользователи
              </Typography>
              {results.users.map((user) => (
                <Box
                  key={user.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                    },
                    borderRadius: '8px',
                  }}
                  onClick={() => onChatClick(user.id)}
                >
                  {user.avatarUrl ? (
                    <Box sx={{
                      width: 32,
                      height: 32,
                      position: 'relative',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      mr: 1
                    }}>
                      <Image
                        src={`${BACKEND_URL}${user.avatarUrl}`}
                        alt={`${user.firstName} ${user.lastName}`}
                        fill
                        style={{
                          objectFit: 'cover',
                        }}
                        unoptimized
                      />
                    </Box>
                  ) : (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mr: 1,
                        bgcolor: isDarkMode ? '#3B82F6' : '#2563EB',
                      }}
                    >
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </Avatar>
                  )}
                  <Typography
                    sx={{
                      color: isDarkMode ? '#E5E7EB' : '#1F2937',
                      fontSize: '14px',
                    }}
                  >
                    {user.firstName} {user.lastName}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* Чаты */}
          {results.chats && results.chats.length > 0 && (
            <Box sx={{ p: 2 }}>
              <Typography
                sx={{
                  color: isDarkMode ? '#9CA3AF' : '#6B7280',
                  fontSize: '14px',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Чаты
              </Typography>
              {results.chats.map((chat) => (
                <Box
                  key={chat.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                    },
                    borderRadius: '8px',
                  }}
                  onClick={() => onChatClick(chat.id)}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1,
                      bgcolor: isDarkMode ? '#3B82F6' : '#2563EB',
                    }}
                  >
                    {chat.name?.[0]}
                  </Avatar>
                  <Typography
                    sx={{
                      color: isDarkMode ? '#E5E7EB' : '#1F2937',
                      fontSize: '14px',
                    }}
                  >
                    {chat.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {(!results.messages?.length && !results.chats?.length && !results.users?.length) && (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography
                sx={{
                  color: isDarkMode ? '#9CA3AF' : '#6B7280',
                  fontSize: '14px',
                }}
              >
                Ничего не найдено
              </Typography>
            </Box>
          )}
        </>
      ) : null}
    </Box>
  );
};

const SearchComponent = React.memo(({ isDarkMode, onChatClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setSearchResults(null);
        setIsSearching(false);
        return;
      }

      try {
        setIsSearching(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Поиск по сообщениям и чатам
        const chatResponse = await fetch(`${BACKEND_URL}/chats/advanced-search?query=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Поиск по пользователям
        const userResponse = await fetch(`${BACKEND_URL}/users/search?query=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!chatResponse.ok || !userResponse.ok) {
          throw new Error('Failed to fetch search results');
        }

        const chatData = await chatResponse.json();
        const userData = await userResponse.json();

        // Объединяем результаты поиска
        setSearchResults({
          messages: chatData.messages || [],
          chats: chatData.chats || [],
          users: userData.users || []
        });
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults(null);
      } finally {
        setIsSearching(false);
      }
    };

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.search-container')) {
      setSearchResults(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <Box className="search-container" sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Поиск по сообщениям или чатам"
        value={searchQuery}
        onChange={handleSearchChange}
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
      {(searchResults || isSearching) && (
        <SearchResultsPopup
          results={searchResults}
          isDarkMode={isDarkMode}
          onClose={() => setSearchResults(null)}
          onChatClick={onChatClick}
          isLoading={isSearching}
        />
      )}
    </Box>
  );
});

const ChatList = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [isParticipantsDialogOpen, setIsParticipantsDialogOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return false;
    }
    return true;
  };

    const fetchChats = async () => {
    if (!checkAuth()) return;
    
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

      const response = await fetch(`${BACKEND_URL}/chats`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
          throw new Error('Failed to fetch chats');
        }

        const data = await response.json();
      
      // Сортируем чаты по дате последнего непрочитанного сообщения
      const sortedChats = data.sort((a, b) => {
        // Если у чата есть непрочитанные сообщения, он должен быть выше
        if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
        if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
        
        // Если у обоих чатов есть непрочитанные сообщения, сортируем по дате последнего сообщения
        if (a.unreadCount > 0 && b.unreadCount > 0) {
          const dateA = a.messages?.[0]?.createdAt ? new Date(a.messages[0].createdAt) : new Date(0);
          const dateB = b.messages?.[0]?.createdAt ? new Date(b.messages[0].createdAt) : new Date(0);
          return dateB - dateA;
        }
        
        // Если у обоих чатов нет непрочитанных сообщений, сортируем по дате последнего сообщения
        const dateA = a.messages?.[0]?.createdAt ? new Date(a.messages[0].createdAt) : new Date(0);
        const dateB = b.messages?.[0]?.createdAt ? new Date(b.messages[0].createdAt) : new Date(0);
        return dateB - dateA;
      });

      setChats(sortedChats);
      } catch (error) {
        console.error('Error fetching chats:', error);
        setError(error.message);
      if (error.message === 'Not authenticated') {
        router.push('/login');
      }
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
      fetchChats();
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!checkAuth()) return;
      
      try {
        const response = await authService.getProfile();
        console.log('User profile data:', response);
        setUserData(response);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        if (error.message === 'Not authenticated') {
          router.push('/login');
        }
      }
    };

    fetchUserData();
  }, [router]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      setUnreadCount(0);
    }
  };

  const handleNewChatClick = () => {
    router.push('/create-chat');
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleChatClick = (chatId) => {
    router.push(`/chat/${chatId}`);
  };

  const handleMenuClick = async (event, chat) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    
    try {
      const token = localStorage.getItem('token');
      // Получаем участников чата
      const participantsResponse = await fetch(`${BACKEND_URL}/chats/${chat.id}/participants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!participantsResponse.ok) {
        throw new Error('Failed to fetch chat participants');
      }

      const participants = await participantsResponse.json();
      // Устанавливаем selectedChat с актуальными данными об участниках
      setSelectedChat({
        ...chat,
        participants: participants
      });
    } catch (error) {
      console.error('Error fetching chat participants:', error);
      setSelectedChat(chat);
    }
  };

  const handleMenuClose = (event) => {
    event?.stopPropagation();
    setAnchorEl(null);
    setSelectedChat(null);
  };

  const handleMarkAsRead = async (event) => {
    event.stopPropagation();
    if (!selectedChat) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/chats/${selectedChat.id}/messages/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to mark chat as read');
      }

      // Обновляем список чатов
      setChats(chats.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, unreadCount: 0 }
          : chat
      ));
      handleMenuClose();
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  };

  const handleMarkAsUnread = async (event) => {
    event.stopPropagation();
    if (!selectedChat) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/chats/${selectedChat.id}/messages/unread`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to mark chat as unread');
      }

      // Обновляем список чатов
      setChats(chats.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, unreadCount: 1 }
          : chat
      ));
      handleMenuClose();
    } catch (error) {
      console.error('Error marking chat as unread:', error);
    }
  };

  const handleDeleteChat = async (event) => {
    event.stopPropagation();
    if (!selectedChat) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/chats/${selectedChat.id}/leave`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to leave chat');
      }

      // Удаляем чат из списка
      setChats(chats.filter(chat => chat.id !== selectedChat.id));
      handleMenuClose();
    } catch (error) {
      console.error('Error leaving chat:', error);
    }
  };

  const handleRenameChat = async () => {
    if (!selectedChat || !newChatName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/chats/${selectedChat.id}/name`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newChatName.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to rename chat');
      }

      // Обновляем список чатов
      setChats(chats.map(chat => 
        chat.id === selectedChat.id 
          ? { ...chat, name: newChatName.trim() }
          : chat
      ));
      setIsRenameDialogOpen(false);
      setNewChatName('');
      handleMenuClose();
    } catch (error) {
      console.error('Error renaming chat:', error);
    }
  };

  const handleOpenParticipantsDialog = async () => {
    if (!selectedChat) return;

    try {
      const token = localStorage.getItem('token');
      // Получаем участников чата
      const participantsResponse = await fetch(`${BACKEND_URL}/chats/${selectedChat.id}/participants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!participantsResponse.ok) {
        throw new Error('Failed to fetch chat participants');
      }

      const participants = await participantsResponse.json();
      // Обновляем selectedChat с актуальными данными об участниках
      setSelectedChat(prev => ({
        ...prev,
        participants: participants
      }));
      setAvailableUsers([]); // Очищаем список доступных пользователей
      setSelectedUsers([]); // Сбрасываем выбранных пользователей
      setIsParticipantsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching chat participants:', error);
    }
  };

  const handleSearchUsers = async (query) => {
    if (!query.trim() || !selectedChat) {
      setAvailableUsers([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/users/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to search users');
      }

      const users = await response.json();
      console.log('Search results:', users); // Для отладки

      // Проверяем, что полученные данные являются массивом
      if (!Array.isArray(users)) {
        console.error('Invalid response format:', users);
        setAvailableUsers([]);
        return;
      }

      // Получаем ID текущих участников
      const currentParticipantIds = selectedChat?.participants?.map(p => p.user.id) || [];
      console.log('Current participant IDs:', currentParticipantIds); // Для отладки

      // Фильтруем пользователей, исключая текущих участников
      const filteredUsers = users.filter(user => !currentParticipantIds.includes(user.id));
      console.log('Filtered users:', filteredUsers); // Для отладки

      // Обновляем состояние
      setAvailableUsers(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      setAvailableUsers([]);
    }
  };

  const handleUpdateParticipants = async () => {
    if (!selectedChat || selectedUsers.length === 0) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/chats/${selectedChat.id}/participants`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participants: selectedUsers.map(userId => ({
            userId,
            role: 'member'
          }))
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update participants');
      }

      // Получаем обновленный список участников
      const participantsResponse = await fetch(`${BACKEND_URL}/chats/${selectedChat.id}/participants`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!participantsResponse.ok) {
        throw new Error('Failed to fetch updated participants');
      }

      const updatedParticipants = await participantsResponse.json();
      
      // Обновляем локальное состояние
      setSelectedChat(prev => ({
        ...prev,
        participants: updatedParticipants
      }));
      
      // Очищаем выбранных пользователей и список доступных пользователей
      setSelectedUsers([]);
      setAvailableUsers([]);
      
      // Убираем закрытие диалога
      // setIsParticipantsDialogOpen(false);
      // handleMenuClose();
    } catch (error) {
      console.error('Error updating participants:', error);
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    if (!selectedChat) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/chats/${selectedChat.id}/participants`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([participantId])
      });

      if (!response.ok) {
        throw new Error('Failed to remove participant');
      }

      // Обновляем локальное состояние
      const updatedParticipants = selectedChat.participants.filter(p => p.user.id !== participantId);
      setSelectedChat(prev => ({
        ...prev,
        participants: updatedParticipants
      }));
    } catch (error) {
      console.error('Error removing participant:', error);
    }
  };

  const handleUpdateParticipantRole = async (userId, newRole) => {
    if (!selectedChat) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/chats/${selectedChat.id}/participants`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participants: [{
            userId,
            role: newRole
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update participant role');
      }

      // Обновляем локальное состояние
      const updatedParticipants = selectedChat.participants.map(p => 
        p.user.id === userId ? { ...p, role: newRole } : p
      );
      setSelectedChat(prev => ({
        ...prev,
        participants: updatedParticipants
      }));
    } catch (error) {
      console.error('Error updating participant role:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: isDarkMode ? '#111827' : '#ffffff'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: isDarkMode ? '#111827' : '#ffffff',
        color: isDarkMode ? '#E5E7EB' : '#000000'
      }}>
        <Typography>Error: {error}</Typography>
      </Box>
    );
  }

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
          overflow: 'hidden',
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
            zIndex: 1,
            overflow: 'hidden'
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
              zIndex: 1,
              flexShrink: 0
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

                <IconButton onClick={handleProfileClick}>
                  {userData?.avatarUrl ? (
                    <Box sx={{
                      width: 40,
                      height: 40,
                      position: 'relative',
                      borderRadius: '50%',
                      overflow: 'hidden'
                    }}>
                      <Image
                        src={`http://localhost:3000${userData.avatarUrl}`}
                        alt={`${userData.firstName} ${userData.lastName}`}
                        fill
                        style={{
                          objectFit: 'cover',
                        }}
                        unoptimized
                      />
                    </Box>
                  ) : (
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: isDarkMode ? '#3B82F6' : '#2563EB',
                        color: '#FFFFFF'
                      }}
                    >
                      {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                    </Avatar>
                  )}
                </IconButton>
              </Box>
            </Box>

            {/* Строка поиска */}
            <SearchComponent 
              isDarkMode={isDarkMode} 
              onChatClick={handleChatClick}
            />
          </Box>

          {/* Контентная область с чатами */}
          <Box
            sx={{
              flex: 1,
              pt: 2,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              height: 'calc(100vh - 200px)'
            }}
          >
            {/* Список чатов */}
            <Box sx={{
              backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              maxHeight: '100%'
            }}>
              {loading ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  padding: '24px'
                }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  padding: '24px',
                  color: isDarkMode ? '#F9FAFB' : '#111827'
                }}>
                  <Typography color="error">{error}</Typography>
                </Box>
              ) : chats.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  padding: '24px',
                  color: isDarkMode ? '#9CA3AF' : '#6B7280'
                }}>
                  <Typography>
                    У вас пока нет чатов
                  </Typography>
                </Box>
              ) : (
                <Box sx={{
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    display: 'block'
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'transparent',
                    margin: '4px 0'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: isDarkMode ? '#374151' : '#D1D5DB',
                    borderRadius: '4px',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box'
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: isDarkMode ? '#4B5563' : '#9CA3AF',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box'
                  }
                }}>
                  {chats.map((chat, index) => (
                    <Box
                      key={chat.id}
                      onClick={() => handleChatClick(chat.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
                        },
                        borderBottom: index < chats.length - 1 ? 
                          `1px solid ${isDarkMode ? '#374151' : '#E5E7EB'}` : 'none'
                      }}
                    >
                      {/* Кнопка меню */}
                      <IconButton
                        onClick={(e) => handleMenuClick(e, chat)}
                        sx={{
                          color: isDarkMode ? '#9CA3AF' : '#6B7280',
                          mr: 1,
                          '&:hover': {
                            backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
                          }
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>

                      {chat.avatarUrl ? (
                        <Box sx={{
                          width: 40,
                          height: 40,
                          position: 'relative',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          mr: 2
                        }}>
                          <Image
                            src={`${BACKEND_URL}${chat.avatarUrl}`}
                            alt={chat.name}
                            fill
                            style={{
                              objectFit: 'cover',
                            }}
                            unoptimized
                          />
                        </Box>
                      ) : (
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            mr: 2,
                            bgcolor: isDarkMode ? '#3B82F6' : '#2563EB',
                            color: '#FFFFFF'
                          }}
                        >
                          {chat.name?.[0]}
                        </Avatar>
                      )}
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography sx={{
                          width: '216px',
                          height: '24px',
                          fontFamily: 'Inter',
                          fontStyle: 'normal',
                          fontWeight: 700,
                          fontSize: '16px',
                          lineHeight: '24px',
                          color: isDarkMode ? '#E5E7EB' : '#1F2937',
                          flex: 'none',
                          order: 0,
                          flexGrow: 1,
                          marginBottom: '4px'
                        }}>
                          {chat.name}
                        </Typography>
                        {/* Последнее сообщение */}
                        <Typography sx={{
                          fontSize: 14,
                          color: isDarkMode ? '#D1D5DB' : '#4B5563',
                          lineHeight: '20px',
                          fontStyle: 'italic',
                          maxWidth: '220px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {chat.messages && chat.messages.length > 0
                            ? (chat.messages[0].content
                                ? chat.messages[0].content
                                : chat.messages[0].fileName
                                  ? `Файл: ${chat.messages[0].fileName}`
                                  : '')
                            : ''}
                        </Typography>
                      </Box>
                      {/* Счетчик непрочитанных сообщений */}
                      {chat.unreadCount > 0 && (
                        <Box sx={{
                          minWidth: '24px',
                          height: '24px',
                          borderRadius: '12px',
                          backgroundColor: isDarkMode ? '#374151' : '#9CA3AF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          ml: 'auto'
                        }}>
                          <Typography sx={{
                            color: '#FFFFFF',
                            fontSize: '12px',
                            fontWeight: 600,
                            lineHeight: '16px'
                          }}>
                            {chat.unreadCount}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {/* Кнопка нового чата */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
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
      </Box>

      {/* Меню настроек чата */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
            minWidth: '180px',
          }
        }}
      >
        {selectedChat?.participants?.find(p => p.user.id === userData?.id)?.role === 'admin' ? [
          <MenuItem 
            key="rename"
            onClick={() => {
              setNewChatName(selectedChat.name);
              setIsRenameDialogOpen(true);
            }}
            sx={{
              color: isDarkMode ? '#E5E7EB' : '#1F2937',
              '&:hover': {
                backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
              }
            }}
          >
            Изменить название
          </MenuItem>,
          <MenuItem 
            key="participants"
            onClick={handleOpenParticipantsDialog}
            sx={{
              color: isDarkMode ? '#E5E7EB' : '#1F2937',
              '&:hover': {
                backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
              }
            }}
          >
            Управление участниками
          </MenuItem>
        ] : null}
        <MenuItem 
          onClick={handleMarkAsRead}
          sx={{
            color: isDarkMode ? '#E5E7EB' : '#1F2937',
            '&:hover': {
              backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
            }
          }}
        >
          Пометить прочитанным
        </MenuItem>
        <MenuItem 
          onClick={handleMarkAsUnread}
          sx={{
            color: isDarkMode ? '#E5E7EB' : '#1F2937',
            '&:hover': {
              backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
            }
          }}
        >
          Пометить непрочитанным
        </MenuItem>
        <MenuItem 
          onClick={handleDeleteChat}
          sx={{
            color: '#EF4444',
            '&:hover': {
              backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
            }
          }}
        >
          Удалить чат
        </MenuItem>
      </Menu>

      {/* Диалог изменения названия чата */}
      <Dialog 
        open={isRenameDialogOpen} 
        onClose={() => setIsRenameDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
            borderRadius: '12px',
          }
        }}
      >
        <DialogTitle sx={{ color: isDarkMode ? '#F9FAFB' : '#1F2937' }}>
          Изменить название чата
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                color: isDarkMode ? '#F9FAFB' : '#1F2937',
                '& fieldset': {
                  borderColor: isDarkMode ? '#374151' : '#D1D5DB',
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? '#4B5563' : '#9CA3AF',
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setIsRenameDialogOpen(false)}
            sx={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleRenameChat}
            variant="contained"
            sx={{
              backgroundColor: '#3B82F6',
              '&:hover': {
                backgroundColor: '#2563EB',
              },
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог управления участниками */}
      <Dialog 
        open={isParticipantsDialogOpen} 
        onClose={() => {
          setIsParticipantsDialogOpen(false);
          setSelectedUsers([]);
          setAvailableUsers([]);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
            borderRadius: '12px',
          }
        }}
      >
        <DialogTitle sx={{ color: isDarkMode ? '#F9FAFB' : '#1F2937' }}>
          Управление участниками
        </DialogTitle>
        <DialogContent>
          {/* Текущие участники */}
          <Typography
            sx={{
              color: isDarkMode ? '#9CA3AF' : '#6B7280',
              fontSize: '14px',
              fontWeight: 600,
              mb: 2,
              mt: 1
            }}
          >
            Текущие участники
          </Typography>
          <List>
            {selectedChat?.participants?.map((participant) => (
              <ListItem 
                key={participant.user.id}
                secondaryAction={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {participant.user.id !== userData?.id && (
                      <>
                        {selectedChat?.participants?.find(p => p.user.id === userData?.id)?.role === 'admin' && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleUpdateParticipantRole(
                              participant.user.id,
                              participant.role === 'admin' ? 'member' : 'admin'
                            )}
                            sx={{
                              color: isDarkMode ? '#9CA3AF' : '#6B7280',
                              borderColor: isDarkMode ? '#374151' : '#D1D5DB',
                              '&:hover': {
                                borderColor: isDarkMode ? '#4B5563' : '#9CA3AF',
                              },
                              mr: 1
                            }}
                          >
                            {participant.role === 'admin' ? 'Снять админа' : 'Сделать админом'}
                          </Button>
                        )}
                        <IconButton 
                          edge="end" 
                          onClick={() => handleRemoveParticipant(participant.user.id)}
                          sx={{ color: '#EF4444' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                }
              >
                <ListItemAvatar>
                  {participant.user.avatarUrl ? (
                    <Box sx={{
                      width: 40,
                      height: 40,
                      position: 'relative',
                      borderRadius: '50%',
                      overflow: 'hidden'
                    }}>
                      <Image
                        src={`${BACKEND_URL}${participant.user.avatarUrl}`}
                        alt={`${participant.user.firstName} ${participant.user.lastName}`}
                        fill
                        style={{
                          objectFit: 'cover',
                        }}
                        unoptimized
                      />
                    </Box>
                  ) : (
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: isDarkMode ? '#3B82F6' : '#2563EB',
                      }}
                    >
                      {participant.user.firstName?.[0]}{participant.user.lastName?.[0]}
                    </Avatar>
                  )}
                </ListItemAvatar>
                <ListItemText 
                  primary={`${participant.user.firstName} ${participant.user.lastName}`}
                  secondary={
                    <Typography
                      component="span"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: isDarkMode ? '#9CA3AF' : '#6B7280',
                        fontSize: '14px'
                      }}
                    >
                      <span>
                        {participant.role === 'admin' ? 'Администратор' : 'Участник'}
                      </span>
                      {participant.user.id === userData?.id && (
                        <span style={{ fontSize: '12px', fontStyle: 'italic' }}>
                          (Вы)
                        </span>
                      )}
                    </Typography>
                  }
                  sx={{
                    '& .MuiListItemText-primary': {
                      color: isDarkMode ? '#F9FAFB' : '#1F2937',
                    },
                    '& .MuiListItemText-secondary': {
                      color: isDarkMode ? '#9CA3AF' : '#6B7280',
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>

          {/* Поиск и добавление новых участников */}
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{
                color: isDarkMode ? '#9CA3AF' : '#6B7280',
                fontSize: '14px',
                fontWeight: 600,
                mb: 2
              }}
            >
              Добавить участников
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Поиск пользователей"
              onChange={(e) => {
                const query = e.target.value;
                if (query.trim()) {
                  handleSearchUsers(query);
                } else {
                  setAvailableUsers([]);
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(255, 255, 255, 0.7)',
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
            {availableUsers && availableUsers.length > 0 && (
              <List>
                {availableUsers.map((user) => (
                  <ListItem key={user.id}>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                      sx={{
                        color: isDarkMode ? '#9CA3AF' : '#6B7280',
                        '&.Mui-checked': {
                          color: '#3B82F6',
                        },
                      }}
                    />
                    <ListItemAvatar>
                      {user.avatarUrl ? (
                        <Box sx={{
                          width: 40,
                          height: 40,
                          position: 'relative',
                          borderRadius: '50%',
                          overflow: 'hidden'
                        }}>
                          <Image
                            src={`${BACKEND_URL}${user.avatarUrl}`}
                            alt={`${user.firstName} ${user.lastName}`}
                            fill
                            style={{
                              objectFit: 'cover',
                            }}
                            unoptimized
                          />
                        </Box>
                      ) : (
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: isDarkMode ? '#3B82F6' : '#2563EB',
                          }}
                        >
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </Avatar>
                      )}
                    </ListItemAvatar>
                    <ListItemText 
                      primary={`${user.firstName} ${user.lastName}`}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: isDarkMode ? '#F9FAFB' : '#1F2937',
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setIsParticipantsDialogOpen(false);
              setSelectedUsers([]);
              setAvailableUsers([]);
            }}
            sx={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}
          >
            Отмена
          </Button>
          <Button 
            onClick={handleUpdateParticipants}
            variant="contained"
            disabled={selectedUsers.length === 0}
            sx={{
              backgroundColor: '#3B82F6',
              '&:hover': {
                backgroundColor: '#2563EB',
              },
            }}
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatList;