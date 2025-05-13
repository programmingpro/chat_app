import { NextResponse } from 'next/server';

export function middleware(request) {
  // Получаем токен из cookies
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                    request.nextUrl.pathname.startsWith('/register');

  // Если это страница авторизации и есть токен, перенаправляем на чаты
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/chat-list', request.url));
  }

  // Если это защищенная страница и нет токена, перенаправляем на логин
  if (!isAuthPage && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Указываем, для каких путей применять middleware
export const config = {
  matcher: [
    '/chat-list/:path*',
    '/settings/:path*',
    '/login',
    '/register'
  ]
}; 