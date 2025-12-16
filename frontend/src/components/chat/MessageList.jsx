import React from "react";
import "../../styles/MessageList.css";

const MessageList = ({ messages }) => {
  return (
    <div className="messages-container">
      {messages.map((msg) => (
        <div key={msg.id} className={`message ${msg.sender}`}>
          <div className="message-content">
            {msg.sender === "ai" && <div className="message-avatar">AI</div>}
            <div className="message-bubble">{msg.text}</div>
            {msg.sender === "user" && <div className="message-avatar">U</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
