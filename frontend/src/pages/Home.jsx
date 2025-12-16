import React, { useState } from "react";
import "../styles/Home.css";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import ChatInput from "../components/chat/ChatInput";

const Home = () => {
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "ai" },
  ]);
  const [previousChats, setPreviousChats] = useState([
    { id: 1, title: "React Project Help", date: "Today" },
    { id: 2, title: "Debug Python Script", date: "Yesterday" },
    { id: 3, title: "Recipe Ideas", date: "Last Week" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSubmitting(true);

    // Mock AI Response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: "I am a mock AI response. I received your message: " + input,
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="chat-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chats={previousChats}
      />

      <main className="chat-main">
        <ChatHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        <MessageList messages={messages} />

        <ChatInput
          input={input}
          setInput={setInput}
          onSend={handleSend}
          submitting={submitting}
        />
      </main>
    </div>
  );
};

export default Home;
