import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const Contact = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="Frame3341" style={{ alignSelf: 'stretch', height: '156px', padding: '32px 330px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '16px', display: 'flex', backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>
      <div style={{ textAlign: 'center', backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', color: isDarkMode ? '#FFFFFF' : '#1F2937', fontSize: '24px', fontFamily: 'Roboto', fontWeight: '700', lineHeight: '32px', wordWrap: 'break-word' }}>Контактная информация</div>
      <div className="Frame3364" style={{ alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '16px', display: 'inline-flex' }}>
        <div className="Frame3361" style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', display: 'inline-flex' }}>
          <div style={{ alignSelf: 'stretch', backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', color: isDarkMode ? '#FFFFFF' : '#1F2937', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '16px', wordWrap: 'break-word' }}>Адрес:</div>
          <div className="25" style={{ alignSelf: 'stretch', backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', color: isDarkMode ? '#FFFFFF' : '#1F2937', fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '24px', wordWrap: 'break-word' }}>Москва, ул. Примерная, д. 25</div>
        </div>
        <div className="Frame3362" style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', display: 'inline-flex' }}>
          <div style={{ alignSelf: 'stretch', backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', color: isDarkMode ? '#FFFFFF' : '#1F2937', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '16px', wordWrap: 'break-word' }}>Телефон:</div>
          <div className="74951234567" style={{ alignSelf: 'stretch', backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', color: isDarkMode ? '#FFFFFF' : '#1F2937', fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '24px', wordWrap: 'break-word' }}>+7 495 123-45-67</div>
        </div>
        <div className="Frame3363" style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', display: 'inline-flex' }}>
          <div className="Email" style={{ alignSelf: 'stretch', backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', color: isDarkMode ? '#FFFFFF' : '#1F2937', fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '16px', wordWrap: 'break-word' }}>Email:</div>
          <div className="InfoCyapRu" style={{ alignSelf: 'stretch', backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', color: isDarkMode ? '#FFFFFF' : '#1F2937', fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '24px', wordWrap: 'break-word' }}>info@cyap.ru</div>
        </div>
      </div>
    </div>
  );
};

export default Contact;