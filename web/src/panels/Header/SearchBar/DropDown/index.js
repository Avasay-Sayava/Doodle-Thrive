import React from 'react';

import './style.css';

function DropDown() {
    return (
        <div className="search-dropdown">
            <div className="search-dropdown-item">Recent</div>
            <div className="search-dropdown-item">Starred</div>
            <div className="search-dropdown-item">Trash</div>
        </div>
    );
}

export default DropDown;