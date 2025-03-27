import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const Contact = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div style={{
      width: '100%',
      maxWidth: '780px',
      padding: '0px 20px',
      margin: '0 auto 40px auto',
      backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB',
      color: isDarkMode ? '#FFFFFF' : '#1F2937',
      boxSizing: 'border-box'
    }}>
      <h2 style={{
        fontSize: '24px',
        fontWeight: 700,
        fontFamily: 'Roboto, sans-serif',
        margin: '0 0 16px 0',
        textAlign: 'left'
      }}>
        Контактная информация
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        <div>
          <div style={{
            fontSize: '12px',
            color: isDarkMode ? '#9CA3AF' : '#4B5563',
            marginBottom: '4px'
          }}>
            Адрес:
          </div>
          <div style={{ fontSize: '16px' }}>
            Москва, ул. Примерная, д. 25
          </div>
        </div>

        <div>
          <div style={{
            fontSize: '12px',
            color: isDarkMode ? '#9CA3AF' : '#4B5563',
            marginBottom: '4px'
          }}>
            Телефон:
          </div>
          <div style={{ fontSize: '16px' }}>
            +7 495 123-45-67
          </div>
        </div>

        <div>
          <div style={{
            fontSize: '12px',
            color: isDarkMode ? '#9CA3AF' : '#4B5563',
            marginBottom: '4px'
          }}>
            Email:
          </div>
          <div style={{ fontSize: '16px' }}>
            info@cyap.ru
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;