import React from "react";
import "../../styles/Sidebar.css";

const Sidebar = ({ isOpen, onClose, chats, onNewChat }) => {
  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`chat-sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={onNewChat}>
            + New Chat
          </button>
          {/* Close button for mobile */}
          <button className="mobile-close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="history-list">
          <div className="history-section-label">Recent</div>
          {chats.map((chat) => (
            <div key={chat.id} className="history-item">
              <span className="history-title">{chat.title}</span>
            </div>
          ))}
        </div>
        <div className="user-profile">
          <div className="user-avatar">U</div>
          <div className="user-info">
            <span className="user-name">User</span>
            <span className="user-plan">Free Plan</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
