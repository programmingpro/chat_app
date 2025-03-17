import React from 'react';
import Header from '../components/Header/Header';
import MainContent from '../components/MainContent/MainContent';
import About from './About';
import Help from './Help';
import Contact from './Contact';
import Background from '../components/Background/Background';
//import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="LoginPage">
      <Background />
      <div className="Frame2923">
        <div className="Frame3161">
          <div className="Frame3165">
            <Header />
            <MainContent />
          </div>
        </div>
      </div>
      <About />
      <Help />
      <Contact />
    </div>
  );
};

export default HomePage;