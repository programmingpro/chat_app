import { ThemeProvider } from '../context/ThemeContext';
import './globals.css';

export const metadata = {
  title: 'Cyap - Платформа общения нового поколения',
  description: 'Организуйте свои чаты, держите связь с друзьями и коллегами, делитесь файлами, создавайте групповые обсуждения — всё в одном месте.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 