import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Список публичных маршрутов, которые не требуют авторизации
const publicRoutes = ['/login', '/register', '/'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Если маршрут публичный, пропускаем проверку
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Если нет токена и маршрут не публичный, перенаправляем на страницу логина
  if (!token) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Указываем, для каких маршрутов применять middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - uploads (загруженные файлы)
     * - assets (статические ресурсы)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|uploads|assets).*)',
  ],
}; 