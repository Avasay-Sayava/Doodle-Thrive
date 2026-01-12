import React from 'react';

import Logo from "../../components/Logo";
import SearchBar from './SearchBar';
import ProfilePicture from './ProfilePicture';

import './style.css';
import SettingsIcon from './SettingsIcon';
import Logout from './Logout';

function Header() {
    return (
        <header className="drive-header">
            <div className="header-left">
                <Logo />
                <span className="app-name">Drive</span>
            </div>

            <div className="header-middle">
                <SearchBar />
            </div>

            <div className="header-right">
                <div className="icon-group">
                    <div>
                        <SettingsIcon/>
                    </div>
                    <div>
                        <Logout />
                    </div>
                </div>
                <div className="profile-picture-container">
                    <ProfilePicture />
                </div>
            </div>
        </header>
    )
}

export default Header;