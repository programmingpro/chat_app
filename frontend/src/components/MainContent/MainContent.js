import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainContent.css';

const MainContent = ({ isDarkMode }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  return (
    <div className={`Frame3356 ${isDarkMode ? 'dark' : ''}`}>
      <div className={`Buttons ${isDarkMode ? 'dark' : ''}`} onClick={handleSignUpClick}>
        <div className="Button">Создать аккаунт</div>
      </div>
      <div className={`Buttons ${isDarkMode ? 'dark' : ''}`} onClick={handleLoginClick}>
        <div className="Button">Войти</div>
      </div>
    </div>
  );
};

export default MainContent;