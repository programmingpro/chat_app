import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MainContent.css'; 

const MainContent = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignUpClick = () => {
    navigate('/register');
  };

  return (
    <div className="Frame3356">
      <div className="Buttons" onClick={handleSignUpClick}>
        <div className="Button">Создать аккаунт</div>
      </div>
      <div className="Buttons" onClick={handleLoginClick}>
        <div className="Button">Войти</div>
      </div>
    </div>
  );
};

export default MainContent;