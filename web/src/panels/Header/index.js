import React from "react";

import Logo from "../../components/Logo";
import SearchBar from "./SearchBar";
import ProfilePicture from "./ProfilePicture";
import HeaderButton from "./HeaderButton";
import IconSettings from "../../Drive/components/icons/IconSettings";
import IconLogout from "../../Drive/components/icons/IconLogout";
import { useNavigate } from "react-router-dom";

import "./style.css";

function Header({ openSettings }) {
  const navigate = useNavigate();

  return (
    <header className="drive-header">
      <div className="header-left">
        <Logo />
        <span className="app-name">Drive</span>
      </div>

      <div className="header-middle" data-tutorial="search-bar">
        <SearchBar />
      </div>

      <div className="header-right">
        <div className="icon-group">
          <div data-tutorial="settings-button">
            <HeaderButton
              icon={<IconSettings />}
              onClick={openSettings}
              text="Settings"
            />
          </div>
          <div>
            <HeaderButton
              icon={<IconLogout />}
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/signin");
              }}
              text="Sign Out"
            />
          </div>
        </div>
        <div className="profile-picture-container">
          <ProfilePicture />
        </div>
      </div>
    </header>
  );
}

export default Header;
