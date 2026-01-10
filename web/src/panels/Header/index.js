import React from 'react';

import Logo from "../../components/Logo";
import SearchBar from './SearchBar';
import NewFile from '../../Drive/utils/newFile';

import './style.css';
import newFile from '../../Drive/utils/newFile';

function Header() {
    return (
    <header className="drive-header">
        <div className="header-left">
            <Logo/>
            <span className="app-name">Drive</span>
        </div>

        <div className="header-middle">
            <SearchBar/>
        </div>

        <div className="header-right">
            <div className="icon-group">
                <button className="icon-button">
                    <span className="material-icons">settings</span>
                </button>
                <div className="profile-circle">J</div>
            </div>
        </div>
    </header>
    )
}

export default Header;