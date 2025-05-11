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
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

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

  const fetchMessages = async () => {
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
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data.messages.reverse()); // Переворачиваем массив, чтобы новые сообщения были внизу
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
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

        const response = await fetch(`${API_URL}/chats/${chatId}`, {
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
        console.log('Full avatar URL:', `${API_URL}${data.avatarUrl}`);
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

  const handleSendMessage = async () => {
    if (!message.trim() && !uploadedFile) return;
    try {
      setSending(true);
      const requestData = {
        content: message.trim() || null,
        fileUrl: uploadedFile?.fileUrl || null,
        fileName: uploadedFile?.fileName || null,
      };
      const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
      setMessage('');
      setUploadedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await fetchMessages();
    } catch (error) {
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