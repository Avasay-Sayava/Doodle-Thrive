import React, { useState, useRef, useEffect } from 'react';

import './style.css';

import DropDown from './DropDown';
import { useNavigate } from 'react-router-dom';

// Assume auth is already handled (e.g., via proxy or global fetch wrapper)
const API_BASE = 'http://localhost:3300';

function SearchBar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return undefined;
        }

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const jwt = localStorage.getItem('token');
                if (!jwt) {
                    localStorage.removeItem('token');
                    setResults([]);
                    navigate('/signin');
                    return;
                }

                const res = await fetch(`${API_BASE}/api/search/${query}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${jwt}`,                       
                    }
                });

                const data = await res.json();
                const list = Object.values(data || {});
                setResults(list);
            } catch (err) {
                if (err.name === 'AbortError') return;
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 250); // debounce a bit

        return () => {
            controller.abort();
            clearTimeout(timer);
        };
    }, [query]);

    return (
        <div className={`search-bar ${open ? 'open' : ''}`} ref={containerRef}>
            <input
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                type="text"
                placeholder="Search in Drive"
                className="search"
            />
            {open && (
                <DropDown
                    results={results}
                    loading={loading}
                />
            )}
        </div>
    );
}

export default SearchBar;