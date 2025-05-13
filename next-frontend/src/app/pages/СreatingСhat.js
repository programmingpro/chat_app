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
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction
} from '@mui/material';
import { styled } from '@mui/system';
import { ThemeContext } from './ThemeContext';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Background from '../components/Background/Background';
import { authService } from '../services/api';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Header = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '780px',
  padding: '16px 0',  
});

const PageContent = styled(Paper)({
  width: '780px',       
  minHeight: '500px',
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.05)',
  display: 'flex',
  flexDirection: 'column',
});

const InputContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '24px',
});

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [tempSelectedUser, setTempSelectedUser] = useState(null);
  const [tempSelectedRole, setTempSelectedRole] = useState('Пользователь');

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

  useEffect(() => {
    const fetchUserData = async () => {
      if (!checkAuth()) return;

      try {
        const response = await authService.getProfile();
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

  useEffect(() => {
    const searchUsers = async () => {
      if (!checkAuth()) return;

      if (!searchQuery) {
        setUsers([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/users/search?query=${encodeURIComponent(searchQuery)}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error searching users:', error);
        setError('Failed to load users');
        setUsers([]);
        if (error.message === 'Not authenticated') {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, router]);

  const handleGoBack = () => {
    router.push('/chat-list'); 
  };
  
  const handleChatTypeChange = (e) => {
    const newType = e.target.value;
    setChatType(newType);
    if (newType === 'Личный') {
      setSelectedRole('Пользователь');
      setChatName('');
      // Очищаем список пользователей при смене на личный чат
      setSelectedUsers([]);
    }
  };

  const handleAddUser = () => {
    if (!tempSelectedUser) {
      setSnackbar({
        open: true,
        message: 'Пожалуйста, выберите пользователя',
        severity: 'error'
      });
      return;
    }

    // Проверяем, не добавлен ли уже этот пользователь
    if (selectedUsers.some(user => user.id === tempSelectedUser.id)) {
      setSnackbar({
        open: true,
        message: 'Этот пользователь уже добавлен в чат',
        severity: 'error'
      });
      return;
    }

    // Для личного чата проверяем, что еще нет других пользователей
    if (chatType === 'Личный' && selectedUsers.length > 0) {
      setSnackbar({
        open: true,
        message: 'В личном чате может быть только один участник',
        severity: 'error'
      });
      return;
    }

    setSelectedUsers([...selectedUsers, {
      ...tempSelectedUser,
      role: tempSelectedRole
    }]);
    setTempSelectedUser(null);
    setTempSelectedRole('Пользователь');
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter(user => user.id !== userId));
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) {
      setSnackbar({
        open: true,
        message: 'Пожалуйста, добавьте хотя бы одного участника',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: chatType === 'Личный' ? '' : chatName,
          chatType: chatType === 'Личный' ? 'private' : 'group',
          participants: [
            ...selectedUsers.map(user => ({
              userId: user.id,
              role: chatType === 'Личный' ? 'member' : (user.role === 'Администратор' ? 'admin' : 'member')
            })),
            {
              userId: userData.id,
              role: chatType === 'Личный' ? 'member' : 'admin'
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
            <IconButton onClick={handleProfileClick}>
              <Avatar
                src={userData?.avatarUrl ? `${API_URL}${userData.avatarUrl}` : undefined}
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
            gap: '24px'
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
                  onChange={handleChatTypeChange}
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
                  <MenuItem value="Групповой">Групповой</MenuItem>
                  <MenuItem value="Личный">Личный</MenuItem>
                </Select>
              </Box>
              {chatType !== 'Личный' && (
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
              )}
            </Box>
          </InputContainer>

          <InputContainer>
            <Typography variant="h6" sx={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}>
              Участники чата
            </Typography>
            <Box display="flex" gap="16px">
              <Box flex={1}>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                  {chatType === 'Личный' ? 'Выберите собеседника' : 'Добавить участника'}
                </Typography>
                <Autocomplete
                  value={tempSelectedUser}
                  onChange={(event, newValue) => setTempSelectedUser(newValue)}
                  inputValue={searchQuery}
                  onInputChange={(event, newValue) => setSearchQuery(newValue)}
                  options={users || []}
                  getOptionLabel={(option) => option ? `${option.firstName || ''} ${option.lastName || ''} (${option.username || ''})` : ''}
                  loading={loading}
                  noOptionsText={error || "Пользователи не найдены"}
                  disabled={chatType === 'Личный' && selectedUsers.length > 0}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder={chatType === 'Личный' && selectedUsers.length > 0 ? 'Можно выбрать только одного собеседника' : ''}
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
                            src={option.avatarUrl ? `${API_URL}${option.avatarUrl}` : undefined}
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
                />
              </Box>
              {chatType !== 'Личный' && (
                <Box flex={1}>
                  <Typography variant="body2" sx={{ color: isDarkMode ? '#9CA3AF' : '#6B7280' }}>
                    Роль
                  </Typography>
                  <Select 
                    fullWidth 
                    variant="outlined" 
                    value={tempSelectedRole}
                    onChange={(e) => setTempSelectedRole(e.target.value)}
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
                    <MenuItem value="Администратор">Администратор</MenuItem>
                    <MenuItem value="Пользователь">Пользователь</MenuItem>
                  </Select>
                </Box>
              )}
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={handleAddUser}
                disabled={chatType === 'Личный' && selectedUsers.length > 0}
                sx={{
                  mt: 'auto',
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#2563EB',
                  }
                }}
              >
                Добавить
              </Button>
            </Box>

            <List sx={{ mt: 2, flex: 1, overflow: 'auto' }}>
              {selectedUsers.map((user) => (
                <ListItem
                  key={user.id}
                  sx={{
                    backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6',
                    borderRadius: '8px',
                    mb: 1
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={user.avatarUrl ? `${API_URL}${user.avatarUrl}` : undefined}
                      sx={{
                        bgcolor: isDarkMode ? '#374151' : '#E5E7EB',
                        color: isDarkMode ? '#E5E7EB' : '#111827',
                      }}
                    >
                      {!user.avatarUrl ? `${user.firstName?.[0]}${user.lastName?.[0]}` : ''}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.firstName} ${user.lastName}`}
                    secondary={
                      <Box 
                        component="span"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          color: isDarkMode ? '#9CA3AF' : '#6B7280'
                        }}
                      >
                        <span>{user.username}</span>
                        {chatType !== 'Личный' && (
                          <Box
                            component="span"
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              backgroundColor: user.role === 'Администратор' ? '#3B82F6' : '#9CA3AF',
                              color: '#FFFFFF',
                              padding: '0 8px',
                              borderRadius: '16px',
                              fontSize: '0.75rem',
                              height: '20px'
                            }}
                          >
                            {user.role}
                          </Box>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveUser(user.id)}
                      sx={{ color: isDarkMode ? '#E5E7EB' : '#111827' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </InputContainer>

          <Box sx={{ mt: 'auto' }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleCreateChat}
              disabled={loading}
              fullWidth
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
          </Box>
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