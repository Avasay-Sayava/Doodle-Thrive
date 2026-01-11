import react from 'react';

import './style.css';
import logoImage from './logo.png';
import { useNavigate } from 'react-router-dom';

function Logo() {
    const navigate = useNavigate();

    function handleLogoClick() {
        navigate('/drive');
    }
    return (
        <div className='logo-container' onClick={handleLogoClick}>
            <img  src={logoImage} className='logo' alt='logo'/>
        </div>
    );
}

export default Logo;