import React from "react";

import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import Avatar from "../../../Drive/components/Avatar";
import useUserId from "../../../Drive/utils/useUserId";

import "./style.css";
const API_BASE = "http://localhost:3300";

function ProfilePicture() {
  const [picture, setPicture] = useState();
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const id = useUserId();
  const jwt = localStorage.getItem("token");

  useEffect(() => {
    if (!jwt) {
      localStorage.removeItem("token");
      navigate("/signin", { replace: true });
      return;
    }

    // wait for user id
    if (!id) return;

    (async () => {
      const res = await fetch(`${API_BASE}/api/users/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const userData = await res.json();
      setUsername(userData.username || "User");
      setDescription(userData.info?.description || "No description");
      setPicture(userData.info?.image);
    })();
  }, [jwt, id, navigate]);

  return (
    <div title={description} className="profile-picture-button">
      <Avatar username={username} imageUrl={picture} size={38} />
    </div>
  );
}

export default ProfilePicture;
