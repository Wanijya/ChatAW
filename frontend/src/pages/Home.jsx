import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createChat, addMessage } from "../store/slices/chatSlice";
import "../styles/Home.css";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import ChatInput from "../components/chat/ChatInput";
import WelcomeScreen from "../components/chat/WelcomeScreen";

const Home = () => {
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { chats, messages } = useSelector((state) => state.chat);

  const handleNewChat = () => {
    const title = window.prompt("Enter a name for your new chat:");
    if (title && title.trim()) {
      dispatch(
        createChat({ id: Date.now(), title: title.trim(), date: "Just now" })
      );
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false); // Close sidebar on mobile after selection
      }
    }
  };

  // Modified to optionally accept text directly (for WelcomeScreen)
  const handleSend = (e, textOverride = null) => {
    if (e) e.preventDefault();

    // Determine the text content
    const textToSend = textOverride !== null ? textOverride : input;

    if (!textToSend.trim()) return;

    const userMessage = { id: Date.now(), text: textToSend, sender: "user" };
    dispatch(addMessage(userMessage));
    setInput(""); // Clear generic input
    setSubmitting(true);

    // Mock AI Response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: "I am a mock AI response. I received your message: " + textToSend,
        sender: "ai",
      };
      dispatch(addMessage(aiMessage));
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="chat-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chats={chats}
        onNewChat={handleNewChat}
      />

      <main className="chat-main">
        <ChatHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        {messages.length === 0 ? (
          <WelcomeScreen onSend={(text) => handleSend(null, text)} />
        ) : (
          <>
            <MessageList messages={messages} />
            <ChatInput
              input={input}
              setInput={setInput}
              onSend={handleSend}
              submitting={submitting}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
