import React from 'react';

import "./style.css";
import Logo from "../../components/Logo";
import SearchBar from './SearchBar';

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