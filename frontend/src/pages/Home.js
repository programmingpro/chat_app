import React, { useContext } from 'react';
import Header from '../components/Header/Header';
import MainContent from '../components/MainContent/MainContent';
import { ThemeContext } from './ThemeContext';

const Home = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="LoginPage" style={{ width: '1440px', height: '896px', background: isDarkMode ? '#1F2937' : '#F9FAFB', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex', position: 'relative' }}>
      <Header isDarkMode={isDarkMode}/>
      <MainContent isDarkMode={isDarkMode}/>
    </div>
  );
};

export default Home;