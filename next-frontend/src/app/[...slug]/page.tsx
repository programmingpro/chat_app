'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function CatchAllRoute() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Проверяем, что путь не является корневым
    if (pathname && pathname !== '/') {
      // Удаляем начальный слеш и разбиваем путь на сегменты
      const segments = pathname.slice(1).split('/');
      
      // Если у нас есть сегменты, перенаправляем на соответствующий маршрут
      if (segments.length > 0) {
        const targetPath = `/${segments.join('/')}`;
        if (targetPath !== pathname) {
          router.replace(targetPath);
        }
      }
    }
  }, [pathname, router]);

  return null;
} 