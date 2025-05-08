"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginPage from '../pages/LoginPage';
import { authService } from '../services/api';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Проверяем, авторизован ли пользователь
    const token = localStorage.getItem('token');
    if (token) {
      // Если есть токен, перенаправляем на страницу чатов
      router.push('/chat-list');
    }
  }, [router]);

  const handleLogin = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      if (response.token) {
        // Сохраняем токен
        localStorage.setItem('token', response.token);
        // Перенаправляем на страницу чатов
        router.push('/chat-list');
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      throw error;
    }
  };

  return <LoginPage onLogin={handleLogin} />;
} 