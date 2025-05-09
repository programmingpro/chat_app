import React, { useContext, useState, useEffect } from 'react';
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
  Badge,
  Avatar,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { styled } from '@mui/system';
import { ThemeContext } from './ThemeContext';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Background from '../components/Background/Background';
import { authService } from '../services/api';

const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '780px',
  padding: '16px 0',  
});

const PageContent = styled(Paper)({
  width: '780px',       
  height: '348px',     
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.05)',
});

const InputContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '24px',
});

const СreatingСhat = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [chatName, setChatName] = useState('Тайный совет');
  const [chatType, setChatType] = useState('Групповой');
  const [selectedRole, setSelectedRole] = useState('Администратор');
  const [participants, setParticipants] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authService.getProfile();
        setUserData(response);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery) {
        setUsers([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3000/users/search?query=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error searching users:', error);
        setError('Failed to load users');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleGoBack = () => {
    router.push('/chat-list'); 
  };
  
  const handleCreateChat = async () => {
    if (!selectedUser) {
      setSnackbar({
        open: true,
        message: 'Пожалуйста, выберите участника',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: chatName,
          chatType: chatType === 'Групповой' ? 'group' : 'private',
          participants: [
            {
              userId: selectedUser.id,
              role: selectedRole === 'Администратор' ? 'admin' : 'member'
            },
            {
              userId: userData.id,
              role: 'admin'
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create chat');
      }

      const chat = await response.json();
      setSnackbar({
        open: true,
        message: 'Чат успешно создан',
        severity: 'success'
      });
      
      // Перенаправляем на страницу чата
      router.push(`/chat/${chat.id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Ошибка при создании чата',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleUserSelect = (event, newValue) => {
    setSelectedUser(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
        }}
      >
        <Header>
          <IconButton 
            onClick={handleGoBack}
            sx={{ 
              color: isDarkMode ? '#E5E7EB' : '#111827',
              marginRight: '16px'
            }}
          >
            <ArrowBack />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ 
              color: isDarkMode ? '#E5E7EB' : '#111827',
              flexGrow: 1
            }}
          >
            Создание чата
          </Typography>
          <Box sx={{ display: 'flex', gap: '12px' }}>
            <IconButton>
              <Badge badgeContent={2} color="error">
                <NotificationsIcon sx={{ color: isDarkMode ? '#E5E7EB' : '#111827' }} />
              </Badge>
            </IconButton>
            <IconButton onClick={handleProfileClick}>
              <Avatar
                src={userData?.avatarUrl ? `http://localhost:3000${userData.avatarUrl}` : undefined}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: isDarkMode ? '#374151' : '#E5E7EB',
                  color: isDarkMode ? '#E5E7EB' : '#111827',
                  fontSize: '1rem'
                }}
              >
                {!userData?.avatarUrl && userData ? `${userData.firstName?.[0]}${userData.lastName?.[0]}` : ''}
              </Avatar>
            </IconButton>
          </Box>
        </Header>
        
        <PageContent 
          sx={{
            backgroundColor: isDarkMode ? '#111827' : '#ffffff',
            border: isDarkMode ? '1px solid #374151' : 'none',
          }}
        >
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
                  value={chatType}
                  onChange={(e) => setChatType(e.target.value)}
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
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
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
                <Autocomplete
                  value={selectedUser}
                  onChange={handleUserSelect}
                  inputValue={searchQuery}
                  onInputChange={(event, newValue) => setSearchQuery(newValue)}
                  options={users || []}
                  getOptionLabel={(option) => option ? `${option.firstName || ''} ${option.lastName || ''} (${option.username || ''})` : ''}
                  loading={loading}
                  noOptionsText={error || "No users found"}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
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
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    return (
                      <li key={key} {...otherProps}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar
                            src={option.avatarUrl ? `http://localhost:3000${option.avatarUrl}` : undefined}
                            sx={{
                              width: 32,
                              height: 32,
                              bgcolor: isDarkMode ? '#374151' : '#E5E7EB',
                              color: isDarkMode ? '#E5E7EB' : '#111827',
                              fontSize: '0.875rem'
                            }}
                          >
                            {!option.avatarUrl ? `${option.firstName?.[0]}${option.lastName?.[0]}` : ''}
                          </Avatar>
                          <Box>
                            <Typography sx={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}>
                              {option.firstName} {option.lastName}
                            </Typography>
                            <Typography variant="body2" sx={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                              {option.username}
                            </Typography>
                          </Box>
                        </Box>
                      </li>
                    );
                  }}
                  sx={{
                    '& .MuiAutocomplete-listbox': {
                      backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
                      '& .MuiAutocomplete-option': {
                        '&:hover': {
                          backgroundColor: isDarkMode ? '#374151' : '#F3F4F6'
                        }
                      }
                    }
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
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
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
                onClick={() => {
                  if (selectedUser) {
                    setParticipants([...participants, { user: selectedUser, role: selectedRole }]);
                    setSelectedUser(null);
                    setSearchQuery('');
                  }
                }}
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
            disabled={loading}
            sx={{
              backgroundColor: '#3B82F6',
              color: '#FFFFFF',
              '&:hover': {
                backgroundColor: '#2563EB',
              }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Создать чат'}
          </Button>
        </PageContent>
      </Container> 

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </> 
  );
};

export default СreatingСhat;