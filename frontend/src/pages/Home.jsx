import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createChat,
  addMessage,
  setChats,
  setActiveChatId,
  setMessages,
} from "../store/slices/chatSlice";
import "../styles/Home.css";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import MessageList from "../components/chat/MessageList";
import ChatInput from "../components/chat/ChatInput";
import WelcomeScreen from "../components/chat/WelcomeScreen";
import { io } from "socket.io-client";
import axios from "axios";

const Home = () => {
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const dispatch = useDispatch();

  // Use Redux state
  const {
    chats,
    activeChatId,
    messages: reduxMessages,
  } = useSelector((state) => state.chat);

  const handleNewChat = async () => {
    let title = window.prompt("Enter a name for your new chat:");
    if (title) title = title.trim();
    if (!title) return;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/chat/",
        { title },
        { withCredentials: true }
      );
      // console.log(response.data);
      getMessages(response.data.chat._id);

      dispatch(
        createChat({
          title: response.data.chat.title,
          _id: response.data.chat._id,
        })
      );
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  const handleOpenChat = (chatId) => {
    dispatch(setActiveChatId(chatId));
    setIsSidebarOpen(false); // Close sidebar on mobile
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/chat/", { withCredentials: true })
      .then((res) => {
        if (res.data.chats) {
          dispatch(setChats(res.data.chats.reverse()));
        }
      })
      .catch((err) => {
        console.error(err);
      });

    const tempSocket = io("http://localhost:3000", {
      withCredentials: true,
    });
    tempSocket.on("ai-response", (messagePayload) => {
      // console.log("AI Response:", messagePayload);
      dispatch(
        addMessage({
          id: Date.now(),
          text: messagePayload.content,
          sender: "ai",
        })
      );
      // Only update activeChatId if the backend specifically requests a switch and provides a valid ID
      if (messagePayload.activeChatId) {
        dispatch(setActiveChatId(messagePayload.activeChatId));
      }
    });
    setSocket(tempSocket);

    return () => tempSocket.disconnect();
  }, [dispatch]);

  // Modified to handle both form submission events and direct text input
  const handleSend = async (arg) => {
    let text = arg;

    // Check if the argument is an event (has preventDefault)
    if (arg && typeof arg !== "string" && arg.preventDefault) {
      arg.preventDefault();
      text = input;
    }

    const trimmed = typeof text === "string" ? text.trim() : "";

    // Debug logging
    // console.log("Attempting to send:", { trimmed, activeChatId, isSending });

    if (!trimmed || !activeChatId || isSending) {
      console.warn("Send aborted. Missing text, chat ID, or already sending.", {
        trimmed,
        activeChatId,
        isSending,
      });
      return;
    }

    setIsSending(true);

    const userMsg = { sender: "user", text: trimmed, id: Date.now() };
    dispatch(addMessage(userMsg));

    setInput("");

    if (socket) {
      socket.emit("ai-message", {
        chat: activeChatId,
        content: trimmed,
      });
    }

    setIsSending(false);
  };

  const getMessages = async (chatId) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/chat/messages/${chatId}`,
        { withCredentials: true }
      );
      // console.log("Messages:", response.data.messages);
      // dispatch(setMessages(response.data.messages));
      dispatch(
        setMessages(
          response.data.messages.map((m) => ({
            sender: m.role === "user" ? "user" : "ai",
            text: m.content,
            id: m._id,
          }))
        )
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="chat-layout">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chats={chats}
        onNewChat={handleNewChat}
        onOpenChat={handleOpenChat}
        getMessages={getMessages}
      />

      <main className="chat-main">
        <ChatHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

        {reduxMessages.length === 0 ? (
          <WelcomeScreen
            onSend={(text) => handleSend(text)}
            showInput={!!activeChatId}
          />
        ) : (
          <>
            <MessageList messages={reduxMessages} />

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
