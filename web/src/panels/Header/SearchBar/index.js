import React, { useState, useRef, useEffect } from 'react';

import './style.css';

import DropDown from './DropDown';

function SearchBar() {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const onClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    return (
        <div className={`search-bar ${open ? 'open' : ''}`} ref={containerRef}>
            <input
                onFocus={() => setOpen(true)}
                type="text"
                placeholder="Search in Drive"
                className="search"
            />
            {open && <DropDown />}
        </div>
    );
}

export default SearchBar;