import React from 'react';

import './style.css';

function DropDown({ results = [], loading, error }) {
    if (error) {     
        return <div className="search-dropdown">{error}</div>;
    }

    if (loading) {
        return <div className="search-dropdown">Searching…</div>;
    }

    if (!results.length) {
        return <div className="search-dropdown">No results found</div>;
    }

    return (
        <div className="search-dropdown">
            {results.map((item) => (
                <div key={item.id || item.name} className="search-dropdown-item">
                    {item.name || item.id}
                </div>
            ))}
        </div>
    );
}

export default DropDown;