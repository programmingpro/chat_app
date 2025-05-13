import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const Help = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div style={{ 
      width: '100%',
      maxWidth: '780px', 
      padding: '32px 20px',      
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
        Помощь
      </h2>
      
      <p style={{
        fontSize: '16px',
        lineHeight: '24px',
        fontWeight: 400,
        fontFamily: 'Inter, sans-serif',
        textAlign: 'left',
        margin: 0,
        width: '100%',
        wordWrap: 'break-word'
      }}>
        Возникли вопросы? Ознакомьтесь с нашей базой знаний или обратитесь в службу поддержки, которая готова помочь 24/7. 🛠️
      </p>
    </div>
  );
};

export default Help;