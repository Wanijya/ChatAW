import React from "react";
import "../../styles/ChatHeader.css";

const ChatHeader = ({ onOpenSidebar }) => {
  return (
    <div className="mobile-header">
      <button className="menu-btn" onClick={onOpenSidebar}>
        ☰
      </button>
      <span className="mobile-logo">ChatAW</span>
    </div>
  );
};

export default ChatHeader;
