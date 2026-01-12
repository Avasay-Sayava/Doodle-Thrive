import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconLogout from '../../../Drive/components/icons/IconLogout';
import './style.css';

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    navigate('/signin');
  };

  return (
    <div className="logout-icon-circle" onClick={handleLogout} title="Logout">
      <IconLogout />
    </div>
  );
}

export default Logout;
