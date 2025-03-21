import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

const About = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="Frame3340" style={{ alignSelf: 'stretch', height: '160px', padding: '32px 330px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '16px', display: 'flex', backgroundColor:  isDarkMode ? '#1F2937' : '#F9FAFB', color: isDarkMode ? '#FFFFFF' : '#1F2937' }}>
      <div style={{ textAlign: 'center', backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', color: isDarkMode ? '#FFFFFF' : '#1F2937', fontSize: '24px', fontFamily: 'Roboto', fontWeight: '700', lineHeight: '32px', wordWrap: 'break-word' }}>О нас</div>
      <div className="Frame3364" style={{ alignSelf: 'stretch', height: '48px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '24px', display: 'flex' }}>
        <div className="Frame3361" style={{ alignSelf: 'stretch', height: '48px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', display: 'flex' }}>
          <div className="Cyap" style={{ alignSelf: 'stretch', backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB', color: isDarkMode ? '#FFFFFF' : '#1F2937', fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', lineHeight: '24px', wordWrap: 'break-word' }}>
            Cyap — это современный инструмент для общения и управления задачами. Мы ориентируемся на простоту и удобство использования, сохраняя безопасность данных. 🧑‍💻
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;