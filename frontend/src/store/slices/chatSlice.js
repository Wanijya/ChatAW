import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: [
    { id: 1, title: "React Project Help", date: "Today" },
    { id: 2, title: "Debug Python Script", date: "Yesterday" },
    { id: 3, title: "Recipe Ideas", date: "Last Week" },
  ],
  currentChat: null,
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    createChat: (state, action) => {
      const newChat = action.payload;
      state.chats.unshift(newChat);
      state.currentChat = newChat;
      state.messages = []; // Clear messages for new chat
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
      // In a real app, we would load messages for this chat here or via an async thunk
      // For now, we'll just clear them or keep them if we were storing them by ID
      // The user request "create state variable for messages" implies a single list for the view.
      // If we switch chats, we technically lose the old messages unless we save them.
      // I'll add a 'saveMessages' reducer or handle it in the component.
      // For this step, I'll assume starting fresh or simulated.
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { createChat, setCurrentChat, addMessage, setMessages } =
  chatSlice.actions;
export default chatSlice.reducer;
