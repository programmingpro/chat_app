import React from 'react';
import Header from '../components/Header/Header';
import MainContent from '../components/MainContent/MainContent';

const Home = () => {
  return (
    <div className="LoginPage" style={{ width: '1440px', height: '896px', background: '#F9FAFB', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex', position: 'relative' }}>
      <Header />
      <MainContent />
    </div>
  );
};

export default Home;