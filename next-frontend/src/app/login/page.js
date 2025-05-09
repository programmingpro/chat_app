"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginPage from '../pages/LoginPage';
import { authService } from '../services/api';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/chat-list';

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    const token = localStorage.getItem('token');
    console.log('Current token in localStorage:', token);
    if (token) {
      console.log('Token found, redirecting to:', from);
      router.push(from);
    }
  }, [router, from]);

  const handleLogin = async (email, password) => {
    try {
      console.log('Attempting login with:', { email, password });
      const response = await authService.login({ email, password });
      console.log('Login response:', response);
      
      if (response.success && response.token) {
        console.log('Saving token to localStorage:', response.token);
        localStorage.setItem('token', response.token);
        
        // Проверяем, что токен сохранился
        const savedToken = localStorage.getItem('token');
        console.log('Saved token:', savedToken);
        
        console.log('Redirecting to:', from);
        router.push(from);
        return true;
      }
      console.log('Login failed');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  return <LoginPage onLogin={handleLogin} />;
} 