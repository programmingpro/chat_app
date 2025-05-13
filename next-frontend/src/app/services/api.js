import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Добавляем интерсептор для запросов
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Проверяем срок действия токена
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // конвертируем в миллисекунды
        if (Date.now() >= expirationTime) {
          // Токен истек, удаляем его
          localStorage.removeItem('token');
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
          window.location.href = '/login';
          return Promise.reject('Token expired');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
        window.location.href = '/login';
        return Promise.reject('Invalid token');
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Добавляем интерсептор для ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Удаляем токен при получении 401 ошибки
      localStorage.removeItem('token');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        document.cookie = `token=${response.data.token}; path=/; max-age=86400; SameSite=Strict`;
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      console.log('Sending login request to:', `${API_URL}/auth/login`);
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      console.log('Login response:', response.data);
      
      if (response.data && response.data.token) {
        console.log('Token received:', response.data.token);
        
        // Сохраняем токен в localStorage
        localStorage.setItem('token', response.data.token);
        
        // Сохраняем токен в cookies с правильными параметрами
        document.cookie = `token=${response.data.token}; path=/; max-age=86400; SameSite=Strict`;
        
        // Проверяем, что токен сохранился
        const savedToken = localStorage.getItem('token');
        console.log('Token after saving:', savedToken);
        
        if (savedToken === response.data.token) {
          console.log('Token successfully saved to localStorage and cookies');
        } else {
          console.error('Token was not saved correctly');
        }
        
        return { success: true, token: response.data.token };
      }
      console.log('No token in response data');
      return { success: false };
    } catch (error) {
      console.error('Login request failed:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      return { success: false };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict';
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Проверяем, что токен не истек
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // конвертируем в миллисекунды
      return Date.now() < expirationTime;
    } catch (error) {
      console.error('Error checking token:', error);
      return false;
    }
  },

  async getProfile() {
    try {
      const token = localStorage.getItem('token');
      console.log('Token before profile request:', token);
      
      if (!token) {
        console.error('No token found in localStorage');
        throw new Error('Not authenticated');
      }
      
      const response = await api.get('/users/profile');
      console.log('Profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      console.log('Sending profile update request:', userData);
      const response = await api.patch('/users/profile', userData);
      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      throw error;
    }
  },

  updateAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await api.patch('/users/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async updatePassword(passwordData) {
    try {
      console.log('Sending password update request:', {
        currentPasswordLength: passwordData.currentPassword?.length,
        newPasswordLength: passwordData.newPassword?.length
      });
      
      const response = await api.patch('/users/password', passwordData);
      console.log('Password update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating password:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update password');
    }
  }
};

export { authService }; 