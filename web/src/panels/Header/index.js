import React, { useState } from 'react';

import Logo from "../../components/Logo";
import SearchBar from './SearchBar';
import NewFile from '../../Drive/utils/newFile';
import ProfilePicture from './ProfilePicture';

import './style.css';
import newFile from '../../Drive/utils/newFile';
import SettingsIcon from './SettingsIcon';



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
                    <div style={{ padding: '20px' }}>
                        <SettingsIcon/>
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