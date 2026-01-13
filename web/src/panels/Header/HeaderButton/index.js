import React from "react";
import "./style.css";

function HeaderButton({ onClick, icon, text, ...props }) {
  return (
    <div className="header-button" onClick={onClick} {...props}>
      {icon}
      {text && <span className="header-button-text">{text}</span>}
    </div>
  );
}

export default HeaderButton;
