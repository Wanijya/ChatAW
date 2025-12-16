import React from "react";
import "../../styles/ChatInput.css";

const ChatInput = ({ input, setInput, onSend, submitting }) => {
  return (
    <div className="input-container">
      <form onSubmit={onSend} className="input-wrapper">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message AI..."
          className="chat-input"
          disabled={submitting}
        />
        <button
          type="submit"
          className="send-btn"
          disabled={submitting || !input.trim()}
        >
          Send
        </button>
      </form>
      <p className="disclaimer">
        AI can make mistakes. Consider checking important information.
      </p>
    </div>
  );
};

export default ChatInput;
