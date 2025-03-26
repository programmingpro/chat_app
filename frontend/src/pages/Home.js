import React, { useContext } from 'react';
import Header from '../components/Header/Header';
import MainContent from '../components/MainContent/MainContent';
import { ThemeContext } from './ThemeContext';

const Home = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div style={{ 
      width: '100vw',
      height: '100vh',            
      background: isDarkMode ? '#1F2937' : '#F9FAFB',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <Header isDarkMode={isDarkMode}/>
      <MainContent isDarkMode={isDarkMode}/>
    </div>
  );
};

export default Home;