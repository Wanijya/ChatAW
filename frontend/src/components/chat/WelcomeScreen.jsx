import React, { useState } from "react";
import "../../styles/WelcomeScreen.css";

const WelcomeScreen = ({ onSend, showInput }) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        onSend(inputValue);
      }
    }
  };

  return (
    <div className="welcome-container">
      {/* Header */}
      <div className="welcome-header">
        <div className="welcome-greeting">
          <span className="greeting-icon">✦</span>
          <span>Hi UserName</span>
        </div>
        <h1 className="welcome-title">
          {showInput ? "Where should we start?" : "Select a chat to start"}
        </h1>
      </div>

      {/* Large Input Box */}
      {showInput && (
        <div className="welcome-input-container">
          <textarea
            className="welcome-input-field"
            placeholder="Ask ChatAW"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />

          <div className="input-footer">
            <div className="input-actions-left">
              <button className="icon-btn" title="Add Attachment">
                ＋
              </button>
            </div>
            <div className="input-actions-right">
              <button
                className="icon-btn send-icon-btn"
                onClick={() => inputValue.trim() && onSend(inputValue)}
                disabled={!inputValue.trim()}
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;
