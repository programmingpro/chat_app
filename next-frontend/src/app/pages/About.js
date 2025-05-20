import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const About = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div style={{ 
      width: '100%',
      maxWidth: '780px', 
      padding: '5px 20px',      
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
      color: isDarkMode ? '#FFFFFF' : '#1F2937',
      margin: '0 auto',
      boxSizing: 'border-box'
    }}>
      
      <h2 style={{
        fontSize: '24px',
        fontWeight: 700,
        fontFamily: 'Roboto, sans-serif',
        textAlign: 'left', 
        margin: '0 0 16px 0',
        width: '100%'
      }}>
        О нас
      </h2>
      
      {/* Текст описания */}
      <p style={{
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: 400,
        fontFamily: 'Inter, sans-serif',
        textAlign: 'left', // Выравнивание по левому краю
        margin: 0,
        width: '100%',
        wordWrap: 'break-word'
      }}>
        Суар — это современный инструмент для общения и управления задачами. Мы ориентируемся на простоту и удобство использования, сохраняя безопасность данных. 🧑‍💻
      </p>
    </div>
  );
};

export default About;