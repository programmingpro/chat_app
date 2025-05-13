import React, { useContext, useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Paper, 
  Badge,
  Avatar,
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
  ListItem,
  ListItemAvatar,
  ListItemText,
  Checkbox
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ThemeContext } from './ThemeContext';
import Background from '../components/Background/Background';
import { styled } from '@mui/system';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Image from 'next/image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import io from 'socket.io-client';

const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  width: '780px',
  padding: '16px 0',  
  position: 'relative'
});

const ChatContainer = styled(Paper)({
  width: '780px',
  height: '500px',
  borderRadius: '12px',
  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column'
});

const ChatMessage = styled(Box)({
  borderRadius: '8px 8px 8px 2px',
  padding: '12px',
  marginBottom: '12px',
});

const ChatReply = styled(Box)({
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '12px',
});

const UserAvatar = styled(Avatar)({
  width: 44,
  height: 44,
  marginRight: '16px',
  '& img': {
    objectFit: 'cover'
  }
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const ChatPage = ({ chatId }) => {
  const { isDarkMode } = useContext(ThemeContext);
  const router = useRouter();
  const [chat, setChat] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isParticipantsDialogOpen, setIsParticipantsDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [socket, setSocket] = useState(null);

  // Проверяем авторизацию при загрузке компонента
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found, redirecting to login');
      router.push('/login');
      return false;
    }
    return true;
  };

  const fetchMessages = async () => {
    if (!checkAuth()) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      console.log('Fetched messages:', data.messages);
      // Сортируем сообщения по времени создания
      const sortedMessages = data.messages.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      console.log('Sorted messages:', sortedMessages);
      setMessages(sortedMessages);

      // Отмечаем сообщения как прочитанные после получения новых сообщений
      await fetch(`${API_URL}/chats/${chatId}/messages/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(error.message);
      if (error.message === 'Not authenticated') {
        router.push('/login');
      }
    }
  };

  // Добавляем загрузку профиля
  useEffect(() => {
    const fetchProfile = async () => {
      if (!checkAuth()) return;
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
        if (error.message === 'Not authenticated') {
          router.push('/login');
        }
      }
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    const fetchChat = async () => {
      if (!checkAuth()) return;

      try {
        console.log('Fetching chat with ID:', chatId);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${API_URL}/chats/${chatId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch chat');
        }

        const data = await response.json();
        console.log('Chat data received:', data);
        console.log('Avatar URL:', data.avatarUrl);
        console.log('Full avatar URL:', `${API_URL}${data.avatarUrl}`);
        setChat(data);
      } catch (error) {
        console.error('Error fetching chat:', error);
        setError(error.message);
        if (error.message === 'Not authenticated') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      fetchChat();
    } else {
      console.error('No chatId provided');
      setError('No chat ID provided');
      setLoading(false);
    }
  }, [chatId, router]);

  useEffect(() => {
    if (chat?.id) {
      fetchMessages();
    }
  }, [chat?.id]);

  useEffect(() => {
    // Подключаемся к вебсокету при монтировании компонента
    const newSocket = io(`${API_URL}/chat`, {
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      autoConnect: true,
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket, socket ID:', newSocket.id);
      // Присоединяемся к комнате чата
      newSocket.emit('joinChat', chatId);
      console.log('Joining chat room:', chatId);
    });

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    newSocket.on('newMessage', (message) => {
      console.log('New message received:', message);
      setMessages(prevMessages => {
        // Проверяем, нет ли уже такого сообщения по ID и времени создания
        const isDuplicate = prevMessages.some(m => 
          m.id === message.id || 
          (m.content === message.content && 
           m.senderId === message.senderId && 
           Math.abs(new Date(m.createdAt).getTime() - new Date(message.createdAt).getTime()) < 1000)
        );

        if (isDuplicate) {
          console.log('Duplicate message detected, skipping:', message);
          return prevMessages;
        }

        console.log('Adding new message to state');
        // Добавляем новое сообщение в конец массива
        const updatedMessages = [...prevMessages, message];
        // Сортируем сообщения по времени создания
        const sortedMessages = updatedMessages.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        console.log('Updated messages:', sortedMessages);
        return sortedMessages;
      });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket, reason:', reason);
      if (reason === 'io server disconnect') {
        // Сервер принудительно отключил клиента
        newSocket.connect();
      }
    });

    // Добавляем обработчик для всех входящих событий для отладки
    newSocket.onAny((eventName, ...args) => {
      console.log('Received event:', eventName, args);
    });

    setSocket(newSocket);

    // Отключаемся от вебсокета при размонтировании компонента
    return () => {
      if (newSocket) {
        console.log('Leaving chat room:', chatId);
        newSocket.emit('leaveChat', chatId);
        newSocket.disconnect();
      }
    };
  }, [chatId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleGoBack = () => {
    router.push('/chat-list');
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Ошибка загрузки файла');
    }
    return await response.json(); // { fileUrl, fileName }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setFileUploading(true);
      const { fileUrl, fileName } = await uploadFile(file);
      setUploadedFile({ fileUrl, fileName });
    } catch (error) {
      setError(error.message);
    } finally {
      setFileUploading(false);
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current.click();
  };

  const handleSendMessage = async (e) => {
    if (!message.trim() && !uploadedFile) return;

    try {
      let messageData = {
        content: message.trim()
      };

      if (uploadedFile) {
        messageData = {
          fileUrl: uploadedFile.fileUrl,
          fileName: uploadedFile.fileName
        };
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_URL}/chats/${chat.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const sentMessage = await response.json();
      console.log('Message sent successfully:', sentMessage);

      setMessage('');
      setUploadedFile(null);
      
      // Добавляем отправленное сообщение в состояние только если его еще нет
      setMessages(prevMessages => {
        const isDuplicate = prevMessages.some(m => 
          m.id === sentMessage.id || 
          (m.content === sentMessage.content && 
           m.senderId === sentMessage.senderId && 
           Math.abs(new Date(m.createdAt).getTime() - new Date(sentMessage.createdAt).getTime()) < 1000)
        );

        if (isDuplicate) {
          console.log('Duplicate message detected, skipping:', sentMessage);
          return prevMessages;
        }

        const updatedMessages = [...prevMessages, sentMessage];
        return updatedMessages.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      
      // Отмечаем сообщения как прочитанные после отправки
      fetch(`${API_URL}/chats/${chat.id}/messages/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    event?.stopPropagation();
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (event) => {
    event.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/chats/${chatId}/messages/read`, {
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

      handleMenuClose();
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  };

  const handleMarkAsUnread = async (event) => {
    event.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/chats/${chatId}/messages/unread`, {
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

      handleMenuClose();
    } catch (error) {
      console.error('Error marking chat as unread:', error);
    }
  };

  const handleDeleteChat = async (event) => {
    event.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/chats/${chatId}/leave`, {
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

      handleMenuClose();
      router.push('/chat-list');
    } catch (error) {
      console.error('Error leaving chat:', error);
    }
  };

  const handleUpdateParticipantRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/chats/${chat.id}/participants`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participants: [{
            userId: userId,
            role: newRole
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update participant role');
      }

      // Обновляем список участников сразу после изменения роли
      setChat(prevChat => ({
        ...prevChat,
        participants: prevChat.participants.map(p => 
          p.user.id === userId ? { ...p, role: newRole } : p
        )
      }));

      handleMenuClose();
    } catch (error) {
      console.error('Error updating participant role:', error);
    }
  };

  const handleRemoveParticipant = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/chats/${chat.id}/participants`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([userId])
      });

      if (!response.ok) {
        throw new Error('Failed to remove participant');
      }

      // Обновляем список участников сразу после удаления
      setChat(prevChat => ({
        ...prevChat,
        participants: prevChat.participants.filter(p => p.user.id !== userId)
      }));

      handleMenuClose();
    } catch (error) {
      console.error('Error removing participant:', error);
    }
  };

  const handleSearchUsers = async (query) => {
    if (!query.trim()) {
      setAvailableUsers([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/users/search?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
          'Accept-Language': 'ru,en;q=0.9',
          'Connection': 'keep-alive',
          'Origin': 'http://localhost:3001',
          'Referer': 'http://localhost:3001/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to search users');
      }

      const data = await response.json();
      console.log('Search results:', data);

      // Проверяем, что data является массивом
      if (!Array.isArray(data)) {
        console.error('Invalid response format:', data);
        setAvailableUsers([]);
        return;
      }

      // Фильтруем пользователей, которые уже есть в чате
      const currentParticipantIds = chat?.participants?.map(p => p.user.id) || [];
      const filteredUsers = data.filter(user => !currentParticipantIds.includes(user.id));
      console.log('Filtered users:', filteredUsers);
      setAvailableUsers(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      setAvailableUsers([]);
    }
  };

  // Добавляем debounce для поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearchUsers(searchQuery);
      } else {
        setAvailableUsers([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleUpdateParticipants = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/chats/${chat.id}/participants`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participants: selectedUsers.map(userId => ({
            userId: userId,
            role: 'member'
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update participants');
      }

      // Обновляем данные чата после добавления участников
      const updatedChatResponse = await fetch(`${API_URL}/chats/${chat.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (updatedChatResponse.ok) {
        const updatedChatData = await updatedChatResponse.json();
        setChat(updatedChatData);
      }

      // Очищаем только выбранных пользователей и результаты поиска
      setSelectedUsers([]);
      setAvailableUsers([]);
      setSearchQuery('');
    } catch (error) {
      console.error('Error updating participants:', error);
    }
  };

  if (loading || !profile) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: isDarkMode ? '#111827' : 'white'
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
        backgroundColor: isDarkMode ? '#111827' : 'white',
        color: isDarkMode ? '#F9FAFB' : '#111827'
      }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!chat) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: isDarkMode ? '#111827' : 'white',
        color: isDarkMode ? '#F9FAFB' : '#111827'
      }}>
        <Typography>Чат не найден</Typography>
      </Box>
    );
  }

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
          zIndex: 1
        }}>
        <Header>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          transform: 'translateX(-30px)', 
            border: '1px solid transparent',
            width: 'auto'
        }}>
            <IconButton onClick={handleGoBack}>
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
              {chat.name}
            </Typography>
          </Box>
          <Box sx={{
            position: 'absolute',
            right: 0,
            display: 'flex',
            gap: '12px',
            width: 'auto',
            alignItems: 'center'
          }}>
            <IconButton 
              onClick={() => router.push('/profile')}
              sx={{ cursor: 'pointer' }}
            >
              {profile?.avatarUrl ? (
                <Box sx={{
                  width: 40,
                  height: 40,
                  position: 'relative',
                  borderRadius: '50%',
                  overflow: 'hidden'
                }}>
                  <Image
                    src={`${API_URL}${profile.avatarUrl}`}
                    alt={profile.username}
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
                  {profile?.username?.[0]}
                </Avatar>
              )}
            </IconButton>
          </Box>
        </Header>

        <ChatContainer sx={{
          backgroundColor: isDarkMode ? '#111827' : '#ffffff',
          border: isDarkMode ? '1px solid #374151' : 'none',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            p: '12px 24px',
            borderBottom: isDarkMode ? '1px solid #374651' : '1px solid #E5E7EB',
            bgcolor: isDarkMode ? '#0F1827' : '#FFFFFF',
            width: '100%'
          }}>
            {chat.chatType === 'group' ? (
                chat.avatarUrl ? (
                    <Box sx={{
                      width: 40,
                      height: 40,
                      position: 'relative',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      mr: 2
                    }}>
                      <Image
                          src={`${API_URL}${chat.avatarUrl}`}
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
                )
            ) : (
                chat.participants.find(p => p.user.id !== profile?.id)?.user.avatarUrl ? (
                    <Box sx={{
                      width: 40,
                      height: 40,
                      position: 'relative',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      mr: 2
                    }}>
                      <Image
                          src={`${API_URL}${chat.participants.find(p => p.user.id !== profile.id).user.avatarUrl}`}
                          alt={chat.participants.find(p => p.user.id !== profile.id).user.firstName}
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
                          bgcolor: chat.chatType === 'private' ? 'transparent' : isDarkMode ? '#3B82F6' : '#2563EB',
                          color: chat.chatType === 'private' ? 'inherit' : '#FFFFFF'
                        }}
                        src={
                          chat.chatType === 'private' && chat.participants?.length > 0
                            ? chat.participants.find(p => p.user?.id !== profile?.id)?.user?.avatarUrl
                              ? `${API_URL}${chat.participants.find(p => p.user?.id !== profile?.id).user.avatarUrl}`
                              : undefined
                            : undefined
                        }
                    >
                      {chat.chatType === 'private' && chat.participants?.length > 0
                        ? chat.participants.find(p => p.user?.id !== profile?.id)?.user?.firstName?.[0]
                        : chat.name?.[0]}
                    </Avatar>
                )
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
                {chat.chatType === 'group' ? chat.name : chat.participants.find(p => p.user.id !== profile.id).user.firstName + " " + chat.participants.find(p => p.user.id !== profile.id).user.lastName }
              </Typography>
              <Typography sx={{
                fontSize: 14,
                color: isDarkMode ? '#9CA3AF' : '#6B7280',
                lineHeight: '20px'
              }}>
                {chat.chatType === 'group' ? 'Групповой чат' : 'Личный чат'}
              </Typography>
            </Box>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon sx={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }} />
            </IconButton>
          </Box>

          <Box sx={{
            flex: 1,
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  flexDirection: 'row'
                }}
              >
                {msg.senderId === profile?.id ? (
                  profile?.avatarUrl ? (
                    <Box sx={{
                      width: 40,
                      height: 40,
                      position: 'relative',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <Image
                        src={`${API_URL}${profile.avatarUrl}`}
                        alt={`${profile.firstName} ${profile.lastName}`}
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
                        color: '#FFFFFF',
                        flexShrink: 0
                      }}
                    >
                      {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                    </Avatar>
                  )
                ) : (
                  msg.user?.avatarUrl ? (
                    <Box sx={{
                      width: 40,
                      height: 40,
                      position: 'relative',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}>
                      <Image
                        src={`${API_URL}${msg.user.avatarUrl}`}
                        alt={`${msg.user.firstName} ${msg.user.lastName}`}
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
                        color: '#FFFFFF',
                        flexShrink: 0
                      }}
                    >
                      {msg.user?.firstName?.[0]}{msg.user?.lastName?.[0]}
                    </Avatar>
                  )
                )}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      flexDirection: 'column',
                      backgroundColor: msg.senderId === profile?.id
                        ? (isDarkMode ? '#064E3B' : '#F0FDF4')
                        : (isDarkMode ? '#1E3A8A' : '#EFF6FF'),
                      borderRadius: '12px',
                      padding: '12px 16px',
                      color: isDarkMode ? '#F9FAFB' : '#111827',
                      fontSize: '14px',
                      lineHeight: '20px',
                      width: 'fit-content',
                      maxWidth: '80%'
                    }}
                  >
                    <Typography
                      sx={{
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
                      }}
                    >
                      {msg.senderId === profile?.id
                        ? `${profile?.firstName} ${profile?.lastName}`
                        : `${msg.user?.firstName} ${msg.user?.lastName}`
                      }
                    </Typography>
                    {msg.content && (
                      <Typography sx={{ wordBreak: 'break-word' }}>
                        {msg.content}
                      </Typography>
                    )}
                    {msg.fileUrl && msg.fileName && (
                      <Box sx={{ mt: 1 }}>
                        {/\.(jpe?g|png|gif|webp|bmp|svg)$/i.test(msg.fileName) ? (
                          <img
                            src={`${API_URL}${msg.fileUrl}`}
                            alt={msg.fileName}
                            style={{ maxWidth: 300, maxHeight: 300, borderRadius: 8, display: 'block' }}
                          />
                        ) : /\.(mp3|wav|ogg)$/i.test(msg.fileName) ? (
                          <audio controls style={{ maxWidth: 300 }}>
                            <source src={`${API_URL}${msg.fileUrl}`} />
                            Ваш браузер не поддерживает аудио.
                          </audio>
                        ) : /\.(mp4|webm|ogg)$/i.test(msg.fileName) ? (
                          <video controls style={{ maxWidth: 300 }}>
                            <source src={`${API_URL}${msg.fileUrl}`} />
                            Ваш браузер не поддерживает видео.
                          </video>
                        ) : (
                          <a
                            href={`${API_URL}${msg.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#1976d2', textDecoration: 'underline' }}
                          >
                            📎 {msg.fileName}
                          </a>
                        )}
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
        </ChatContainer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
              color: isDarkMode ? '#F9FAFB' : '#111827',
              '& .MuiMenuItem-root': {
                color: isDarkMode ? '#F9FAFB' : '#111827',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                },
              },
            },
          }}
        >
          {chat?.participants?.find(p => p.user.id === profile?.id)?.role === 'admin' && (
            <MenuItem onClick={() => {
              handleMenuClose();
              setIsParticipantsDialogOpen(true);
            }}>
              Управление участниками
            </MenuItem>
          )}
          <MenuItem onClick={handleMarkAsRead}>
            Отметить как прочитанное
          </MenuItem>
          <MenuItem onClick={handleMarkAsUnread}>
            Отметить как непрочитанное
          </MenuItem>
          <MenuItem 
            onClick={() => {
              handleMenuClose();
              setIsDeleteDialogOpen(true);
            }}
            sx={{ color: '#EF4444' }}
          >
            Удалить чат
          </MenuItem>
        </Menu>

        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
              color: isDarkMode ? '#F9FAFB' : '#111827',
            },
          }}
        >
          <DialogTitle>Удалить чат?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить этот чат? Это действие нельзя отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setIsDeleteDialogOpen(false)}
              sx={{ 
                color: isDarkMode ? '#9CA3AF' : '#6B7280',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                },
              }}
            >
              Отмена
            </Button>
            <Button 
              onClick={handleDeleteChat}
              color="error"
              variant="contained"
            >
              Удалить
            </Button>
          </DialogActions>
        </Dialog>

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
              {chat?.participants?.map((participant) => (
                <ListItem 
                  key={participant.user.id}
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {participant.user.id !== profile?.id && (
                        <>
                          {chat?.participants?.find(p => p.user.id === profile?.id)?.role === 'admin' && (
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
                          src={`${API_URL}${participant.user.avatarUrl}`}
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
                        {participant.user.id === profile?.id && (
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
                placeholder="Поиск пользователей..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
                    '& fieldset': {
                      borderColor: isDarkMode ? '#4B5563' : '#D1D5DB',
                    },
                    '&:hover fieldset': {
                      borderColor: isDarkMode ? '#6B7280' : '#9CA3AF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: isDarkMode ? '#3B82F6' : '#2563EB',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: isDarkMode ? '#F9FAFB' : '#111827',
                  },
                }}
              />

              {availableUsers.length > 0 ? (
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
                              src={`${API_URL}${user.avatarUrl}`}
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
              ) : searchQuery.trim() ? (
                <Typography sx={{ color: isDarkMode ? '#9CA3AF' : '#6B7280', textAlign: 'center', mt: 2 }}>
                  Пользователи не найдены
                </Typography>
              ) : null}
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

        <Box 
          sx={{
            display: 'flex', 
            alignItems: 'center', 
            width: '780px',
            mt: 3,
            backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
            borderRadius: '8px',
            padding: '8px',
            border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
          }}
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <IconButton 
            onClick={handleAttachClick}
            type="button"
            sx={{ 
              color: 'primary.main',
              '&:hover': {
                bgcolor: 'action.hover',
              }
            }}
          >
            <AttachFileIcon />
          </IconButton>
          {selectedFile && (
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {selectedFile.name}
            </Typography>
          )}
          {uploadedFile && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {uploadedFile.fileName}
              </Typography>
              {fileUploading && (
                <CircularProgress size={20} sx={{ ml: 1 }} />
              )}
              <IconButton
                size="small"
                onClick={() => {
                  setUploadedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                sx={{ ml: 1 }}
                disabled={fileUploading}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'background.paper',
              },
            }}
          />
          <IconButton 
            type="submit"
            color="primary"
            disabled={(!message.trim() && !uploadedFile) || sending}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Container>
    </>
  );
};

export default ChatPage;