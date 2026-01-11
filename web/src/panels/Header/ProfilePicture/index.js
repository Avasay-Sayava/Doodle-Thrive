import React from "react";

import { useState, useEffect } from "react";

import { replace, useNavigate } from 'react-router-dom';

import "./style.css";
const API_BASE = 'http://localhost:3300';


function ProfilePicture() {
    const [picture, setPicture] = useState();
    const [data, setData] = useState({});
    const navigate = useNavigate();
    const id = localStorage.getItem("id");
    const jwt = localStorage.getItem("token");

    useEffect(() => {
        if (!jwt) {
            localStorage.removeItem('token');
            localStorage.removeItem('id');
            navigate('/signin', { replace: true });
            return;
        }

        (async () => {
            const res = await fetch(`${API_BASE}/api/users/${id}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${jwt}` },
            });
            const userData = await res.json();
            setData(userData);
            setPicture(userData.info?.image);
        })();
    }, [jwt, id, navigate]);

    const putProfilePicture = () => {
        if (picture) {
            return <img src={picture} alt="Profile" className="profile-image" />;
        } else {
            const initial = data.username ? data.username.charAt(0).toUpperCase() : 'U';
            return <div className="profile-initial">{initial}</div>;
        }
    };

    return (
        <div title={data.info?.description || 'No description'} className="profile-picture-button">
            {putProfilePicture()}
        </div>
    )
}

export default ProfilePicture;