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
  CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { ThemeContext } from './ThemeContext';
import Background from '../components/Background/Background';
import { styled } from '@mui/system';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Image from 'next/image';

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

const BACKEND_URL = 'http://localhost:3000';

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${BACKEND_URL}/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        console.log('Fetching chat with ID:', chatId);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${BACKEND_URL}/chats/${chatId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch chat');
        }

        const data = await response.json();
        console.log('Chat data received:', data);
        console.log('Avatar URL:', data.avatarUrl);
        console.log('Full avatar URL:', `${BACKEND_URL}${data.avatarUrl}`);
        setChat(data);
      } catch (error) {
        console.error('Error fetching chat:', error);
        setError(error.message);
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
  }, [chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${BACKEND_URL}/chats/${chatId}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        setMessages(data.messages.reverse()); // Переворачиваем массив, чтобы новые сообщения были внизу
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError(error.message);
      }
    };

    if (chatId) {
      fetchMessages();
    }
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

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${BACKEND_URL}/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: message })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const newMessage = await response.json();
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
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
            <IconButton>
              <Badge badgeContent={2} color="error">
                <NotificationsIcon sx={{ color: isDarkMode ? '#E5E7EB' : '#000000' }} />
              </Badge>
            </IconButton>
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
                    src={`${BACKEND_URL}${profile.avatarUrl}`}
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
              <Typography sx={{
                fontSize: 14,
                color: isDarkMode ? '#9CA3AF' : '#6B7280',
                lineHeight: '20px'
              }}>
                {chat.type === 'group' ? 'Групповой чат' : 'Личный чат'}
              </Typography>
            </Box>
            <IconButton>
              <MoreVertIcon sx={{ color: isDarkMode ? '#E5E7EB' : '#6B7280' }} />
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
                        src={`${BACKEND_URL}${profile.avatarUrl}`}
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
                  (() => {
                    const participant = chat.participants.find(p => p.user.id === msg.senderId);
                    return participant?.user.avatarUrl ? (
                      <Box sx={{
                        width: 40,
                        height: 40,
                        position: 'relative',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        flexShrink: 0
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
                          color: '#FFFFFF',
                          flexShrink: 0
                        }}
                      >
                        {participant?.user.firstName?.[0]}{participant?.user.lastName?.[0]}
                      </Avatar>
                    );
                  })()
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
                        : (() => {
                            const participant = chat.participants.find(p => p.user.id === msg.senderId);
                            return `${participant?.user.firstName} ${participant?.user.lastName}`;
                          })()
                      }
                    </Typography>
                    <Typography sx={{ wordBreak: 'break-word' }}>
                      {msg.content}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
        </ChatContainer>

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
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Напишите сообщение..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
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
          
          <IconButton 
            onClick={handleSendMessage}
            disabled={sending || !message.trim()}
            sx={{ 
              minWidth: '40px',
              minHeight: '40px',
              backgroundColor: '#3B82F6',
              borderRadius: '8px',
              marginLeft: '8px',
              '&:hover': {
                backgroundColor: '#2563EB',
              },
              '&:disabled': {
                backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
              }
            }}
          >
            {sending ? (
              <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
            ) : (
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
            )}
          </IconButton>
        </Box>
      </Container>
    </>
  );
};

export default ChatPage;