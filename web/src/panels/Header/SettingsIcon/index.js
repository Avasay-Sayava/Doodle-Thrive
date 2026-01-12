import React from 'react';
import { useNavigate } from 'react-router-dom';
import IconSettings from '../../../Drive/components/icons/IconSettings';

import './style.css';

import SettingsPage from '../pages/SettingsPage';

function SettingsIcon() {
  const navigator = useNavigate();
  const onClick = () => {
    const currentPath = window.location.pathname;
    navigator('/settings', { state: { from: currentPath } });
  }
  return (
    <div className="settings-icon-circle" onClick={onClick} title="Settings">
      <IconSettings />
    </div>
  );
}

export default SettingsIcon;