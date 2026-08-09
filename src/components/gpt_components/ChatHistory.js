import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearChatHistory,
  addMessageToHistory,
  trimChatHistory,
  addGptMovieResult,
  setLoading,
} from "../../utils/gptSlice";
import lang from "../../utils/languageConstants";
import {
  extractFilters,
  searchMoviesWithFilters,
  getMoodBasedMovies,
} from "../../services/structuredSearchService";

const ChatHistory = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const chatHistory = useSelector((store) => store.gpt.chatHistory);
  const conversationActive = useSelector(
    (store) => store.gpt.conversationActive,
  );
  const chatEndRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Handle search from sidebar (same logic as main search)
  const handleSearch = async () => {
    const userQuery = inputValue.trim();
    if (!userQuery || isSearching) return;

    try {
      setIsSearching(true);
      dispatch(setLoading(true));

      // Add user message to chat history
      dispatch(addMessageToHistory({ role: "user", content: userQuery }));
      dispatch(trimChatHistory());

      // Extract structured filters from query
      const filters = await extractFilters(userQuery);

      let movieResults = [];
      let movieNames = [];

      // Check if mood-based or filter-based search
      if (filters.mood && filters.genres.length === 0) {
        // Mood-based search
        const moodMovies = await getMoodBasedMovies(filters.mood);

        // Split into 4 categories
        const moviesPerCategory = 5;
        const categories = [];
        const categoryNames = [];

        for (let i = 0; i < 4; i++) {
          const start = i * moviesPerCategory;
          const categoryMovies = moodMovies.slice(
            start,
            start + moviesPerCategory,
          );
          if (categoryMovies.length > 0) {
            categories.push(categoryMovies);
            categoryNames.push(`Mood Recommendations #${i + 1}`);
          }
        }

        movieResults = categories;
        movieNames = categoryNames;

        dispatch(
          addMessageToHistory({
            role: "assistant",
            content: `Based on your mood, here are some uplifting recommendations`,
          }),
        );
      } else {
        // Filter-based structured search
        const filteredMovies = await searchMoviesWithFilters(filters);

        // Group movies by category
        const moviesPerCategory = 5;
        const categories = [];
        const categoryNames = [];

        let categoryName = "";
        if (filters.genres.length > 0) {
          categoryName = filters.genres.join(" & ") + " Movies";
        } else {
          categoryName = "Recommended Movies";
        }

        if (filters.year_min || filters.year_max) {
          if (filters.year_min === filters.year_max) {
            categoryName += ` (${filters.year_min})`;
          } else {
            categoryName += ` (${filters.year_min || ""}${filters.year_min && filters.year_max ? "-" : ""}${filters.year_max || ""})`;
          }
        }

        if (filters.rating_min) {
          categoryName += ` - Rated ${filters.rating_min}+`;
        }

        for (let i = 0; i < 4; i++) {
          const start = i * moviesPerCategory;
          const categoryMovies = filteredMovies.slice(
            start,
            start + moviesPerCategory,
          );
          if (categoryMovies.length > 0) {
            categories.push(categoryMovies);
            categoryNames.push(`${categoryName} #${i + 1}`);
          }
        }

        movieResults = categories;
        movieNames = categoryNames;

        const filterSummary = `Found movies with: ${filters.genres.length > 0 ? filters.genres.join(", ") : "any genre"}${filters.year_min ? `, from ${filters.year_min}` : ""}${filters.rating_min ? `, rated ${filters.rating_min}+` : ""}`;

        dispatch(
          addMessageToHistory({
            role: "assistant",
            content: filterSummary,
          }),
        );
      }

      dispatch(addGptMovieResult({ movieNames, movieResults }));

      // Clear input
      setInputValue("");
    } catch (error) {
      console.error("Error in search:", error);
      dispatch(setLoading(false));
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  // Don't show if no conversation started
  if (!conversationActive || chatHistory.length <= 1) {
    return null;
  }

  // Filter out system messages for display
  const displayMessages = chatHistory.filter((msg) => msg.role !== "system");

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-4 h-fit max-h-[calc(100vh-200px)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <h3 className="text-white font-semibold text-sm">
            {lang[langKey]?.conversationHistory || "Conversation History"}
          </h3>
        </div>
        <button
          onClick={() => dispatch(clearChatHistory())}
          className="group flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200 cursor-pointer"
          title={lang[langKey]?.clearChat || "Clear"}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 pr-2">
        {displayMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`group max-w-[90%] ${
                message.role === "user"
                  ? "bg-gradient-to-r from-red-600/80 to-pink-600/80"
                  : "bg-gray-800/70"
              } backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border ${
                message.role === "user"
                  ? "border-red-500/20"
                  : "border-gray-700/30"
              } transition-all duration-200`}
            >
              {/* Message Content */}
              <p
                className={`text-xs leading-relaxed ${
                  message.role === "user" ? "text-white" : "text-gray-200"
                }`}
              >
                <span
                  className={`font-semibold ${
                    message.role === "user" ? "text-white/90" : "text-gray-400"
                  }`}
                >
                  {message.role === "user"
                    ? lang[langKey]?.you || "You"
                    : lang[langKey]?.ai || "AI"}
                  :{" "}
                </span>
                {message.content}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Search Input at Bottom */}
      <div className="mt-3 pt-3 border-t border-gray-800">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={lang[langKey]?.gptSearchPlaceholder || "Search..."}
            disabled={isSearching}
            className="w-full px-3 py-2 pr-10 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all disabled:opacity-50"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          💡{" "}
          {lang[langKey]?.chatTip ||
            "AI remembers your conversation. Refine naturally!"}
        </p>
      </div>
    </div>
  );
};

export default ChatHistory;
