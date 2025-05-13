import React from 'react';
import { useRouter } from 'next/navigation';
import './MainContent.css';

const MainContent = ({ isDarkMode }) => {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push('/login');
    };

    const handleSignUpClick = () => {
        router.push('/register');
    };

    return (
        <div className={`Frame3356 ${isDarkMode ? 'dark' : ''}`} style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            margin: '0 auto',
            padding: '0 20px'
        }}>
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