import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showGptSearch: false,
  movieResults: null,
  movieNames: null,
  isLoading: false,
  // Conversational Memory Feature
  chatHistory: [
    {
      role: "system",
      content:
        "You are a helpful movie recommendation assistant. Keep responses concise and suggest exactly 5 movies based on user preferences. Return only movie names separated by commas.",
    },
  ],
  conversationActive: false,
};

const gptSlice = createSlice({
  name: "gpt",
  initialState,
  reducers: {
    toggleGptSearchView: (state, action) => {
      state.showGptSearch = !state.showGptSearch;
    },
    setShowGptSearch: (state, action) => {
      state.showGptSearch = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    addGptMovieResult: (state, action) => {
      const { movieNames, movieResults } = action.payload;
      state.movieNames = movieNames;
      state.movieResults = movieResults;
      state.isLoading = false;
    },
    resetGptState: (state) => {
      // Only reset search results, not the showGptSearch state
      state.movieResults = null;
      state.movieNames = null;
      state.isLoading = false;
    },
    // Conversational Memory Actions
    addMessageToHistory: (state, action) => {
      const { role, content } = action.payload;
      state.chatHistory.push({ role, content });
      state.conversationActive = true;
    },
    clearChatHistory: (state) => {
      state.chatHistory = [
        {
          role: "system",
          content:
            "You are a helpful movie recommendation assistant. Keep responses concise and suggest exactly 5 movies based on user preferences. Return only movie names separated by commas.",
        },
      ];
      state.conversationActive = false;
      state.movieResults = null;
      state.movieNames = null;
    },
    trimChatHistory: (state) => {
      // Keep only system message + last 10 messages to avoid token limits
      const systemMessage = state.chatHistory[0];
      const recentMessages = state.chatHistory.slice(-10);
      if (recentMessages[0]?.role !== "system") {
        state.chatHistory = [systemMessage, ...recentMessages];
      } else {
        state.chatHistory = recentMessages;
      }
    },
  },
});

export const {
  toggleGptSearchView,
  setShowGptSearch,
  setLoading,
  addGptMovieResult,
  resetGptState,
  addMessageToHistory,
  clearChatHistory,
  trimChatHistory,
} = gptSlice.actions;

export default gptSlice.reducer;
