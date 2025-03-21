import React, { useContext } from 'react';
import Header from '../components/Header/Header';
import MainContent from '../components/MainContent/MainContent';
import About from './About';
import Help from './Help';
import Contact from './Contact';
import Background from '../components/Background/Background';
import { ThemeContext } from './ThemeContext';


const HomePage = () => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div className="LoginPage" style={{ backgroundColor: isDarkMode ? '#1F2937' : '#F9FAFB' }}>
      <Background />
      <div className="Frame2923">
        <div className="Frame3161">
          <div className="Frame3165">
            <Header isDarkMode={isDarkMode}/>
            <MainContent isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
      <About isDarkMode={isDarkMode} />
      <Help isDarkMode={isDarkMode} />
      <Contact isDarkMode={isDarkMode} />
    </div>
  );
};

export default HomePage;