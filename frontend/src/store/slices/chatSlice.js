import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [],
  activeChatId: null,
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createChat: (state, action) => {
      const { title, _id } = action.payload;
      state.chats.unshift({ title: title || "New Chat", _id, messages: [] });
      state.activeChatId = _id;
      state.messages = []; // Clear messages for new chat
    },
    setActiveChat: (state, action) => {
      state.activeChatId = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
    },
  },
});

export const {
  createChat,
  setActiveChat,
  addMessage,
  setMessages,
  setChats,
  setActiveChatId,
} = chatSlice.actions;
export default chatSlice.reducer;
