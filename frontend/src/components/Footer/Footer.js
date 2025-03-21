import React, { useContext } from 'react';
import { ThemeContext } from '../../pages/ThemeContext'; 

const Footer = () => {
  const { isDarkMode } = useContext(ThemeContext); 

  return (
    <div
      className="Frame3341"
      style={{
        alignSelf: 'stretch',
        height: '156px',
        padding: '32px 330px',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: '16px',
        display: 'flex',
        backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', 
        color: isDarkMode ? '#FFFFFF' : '#1F2937', 
      }}
    >
      <div style={{ textAlign: 'center', fontSize: '24px', fontFamily: "'Inter', sans-serif", fontWeight: 700, lineHeight: '32px' }}>
        Контактная информация
      </div>
      <div className="Frame3364" style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '16px', display: 'inline-flex' }}>
        <div className="Frame3361" style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', display: 'inline-flex' }}>
          <div style={{ alignSelf: 'stretch', color: isDarkMode ? '#9CA3AF' : '#4B5563', fontSize: '12px', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: '16px' }}>
            Адрес:
          </div>
          <div style={{ alignSelf: 'stretch', fontSize: '16px', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: '24px' }}>
            Москва, ул. Примерная, д. 25
          </div>
        </div>
        <div className="Frame3362" style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', display: 'inline-flex' }}>
          <div style={{ alignSelf: 'stretch', color: isDarkMode ? '#9CA3AF' : '#4B5563', fontSize: '12px', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: '16px' }}>
            Телефон:
          </div>
          <div style={{ alignSelf: 'stretch', fontSize: '16px', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: '24px' }}>
            +7 495 123-45-67
          </div>
        </div>
        <div className="Frame3363" style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', display: 'inline-flex' }}>
          <div style={{ alignSelf: 'stretch', color: isDarkMode ? '#9CA3AF' : '#4B5563', fontSize: '12px', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: '16px' }}>
            Email:
          </div>
          <div style={{ alignSelf: 'stretch', fontSize: '16px', fontFamily: "'Inter', sans-serif", fontWeight: 400, lineHeight: '24px' }}>
            info@cyap.ru
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;