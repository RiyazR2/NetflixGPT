import React, { useRef } from "react";
import lang from "../../utils/languageConstants";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../../utils/constant";
import {
  addGptMovieResult,
  addMessageToHistory,
  trimChatHistory,
  setLoading,
} from "../../utils/gptSlice";
import {
  extractFilters,
  searchMoviesWithFilters,
  getMoodBasedMovies,
  searchBollywoodMovies,
} from "../../services/structuredSearchService";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);

  // Searching Movie in this TMDB-API
  const searchMovieTMDB = async (movie) => {
    const data = await fetch(
      "https://api.themoviedb.org/3/search/movie?query=" +
        movie +
        "&include_adult=false&language=en-US&page=1",
      API_OPTIONS,
    );
    const json = await data.json();
    // console.log("json.results:", json);
    return json.results;
    // console.log("first", json);
  };

  searchMovieTMDB();

  const handleGptSearchClick = async () => {
    const userQuery = searchText.current.value;
    if (!userQuery || !userQuery.trim()) return;

    // Set loading state
    dispatch(setLoading(true));

    // Add user message to chat history
    dispatch(addMessageToHistory({ role: "user", content: userQuery }));

    // Trim history if getting too long (keep token limit in check)
    dispatch(trimChatHistory());

    try {
      // Step 1: Extract structured filters from query
      const filters = await extractFilters(userQuery);
      console.log("Extracted filters:", filters);

      let movieResults = [];
      let movieNames = [];

      // Step 2: Check if mood-based or filter-based search
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

        // Add AI response about mood
        dispatch(
          addMessageToHistory({
            role: "assistant",
            content: `Based on your mood, here are some uplifting recommendations`,
          }),
        );
      } else {
        // Check if Bollywood search
        let filteredMovies = [];

        if (filters.region === "bollywood") {
          // Use OMDb for Bollywood movies
          filteredMovies = await searchBollywoodMovies(filters);
        } else {
          // Use TMDB for regular movies
          filteredMovies = await searchMoviesWithFilters(filters);
        }

        // Group movies by category (take top 20, split into 4 categories)
        const moviesPerCategory = 5;
        const categories = [];
        const categoryNames = [];

        // Create category names based on filters
        let categoryName = "";
        if (filters.region === "bollywood") {
          categoryName = "Bollywood ";
        }

        if (filters.genres.length > 0) {
          categoryName += filters.genres.join(" & ") + " Movies";
        } else {
          categoryName += "Recommended Movies";
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

        // Split into multiple categories for better UX
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

        // Add AI response with filter summary
        let filterSummary =
          filters.region === "bollywood"
            ? "Bollywood movies with: "
            : "Found movies with: ";
        filterSummary += `${filters.genres.length > 0 ? filters.genres.join(", ") : "any genre"}${filters.year_min ? `, from ${filters.year_min}` : ""}${filters.rating_min ? `, rated ${filters.rating_min}+` : ""}`;

        dispatch(
          addMessageToHistory({
            role: "assistant",
            content: filterSummary,
          }),
        );
      }

      dispatch(addGptMovieResult({ movieNames, movieResults }));

      // Clear input for next query
      searchText.current.value = "";
    } catch (error) {
      console.error("Error in GPT search:", error);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="pt-[42%] md:pt-[15%] flex justify-center px-4">
      <form className="w-full max-w-3xl" onSubmit={(e) => e.preventDefault()}>
        {/* Modern Glass Morphism Card */}
        <div className="bg-gradient-to-br from-black/80 via-gray-900/80 to-red-900/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border border-white/10">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              {lang[langKey].aiMovieSearch}
            </h2>
            <p className="text-gray-300 text-sm md:text-base">
              {lang[langKey].aiSearchSubtitle}
            </p>
          </div>

          {/* Search Input Container */}
          <div className="relative flex flex-col md:flex-row gap-3">
            {/* Input Field */}
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl opacity-20 group-hover:opacity-40 blur transition-opacity duration-300" />
              <input
                ref={searchText}
                className="relative w-full px-5 py-4 pr-12 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 text-sm md:text-base backdrop-blur-sm"
                type="text"
                placeholder={lang[langKey].gptSearchPlaceholder}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <svg
                  className="w-5 h-5"
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
              </div>
            </div>

            {/* Search Button */}
            <button
              className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-red-500/50 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer"
              onClick={handleGptSearchClick}
            >
              <span className="flex items-center gap-2 text-sm md:text-base">
                <svg
                  className="w-5 h-5 group-hover:rotate-12 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                {lang[langKey].search}
              </span>
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-gray-400 text-sm font-semibold">
                {lang[langKey].suggestions}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-transparent"></div>
            </div>
            <div className="flex flex-wrap gap-2 justify-start">
              {[
                lang[langKey].suggestion1,
                lang[langKey].suggestion2,
                lang[langKey].suggestion3,
                lang[langKey].suggestion4,
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  className="px-4 py-2 bg-gray-800/60 hover:bg-gradient-to-r hover:from-red-600/40 hover:to-pink-600/40 text-gray-300 hover:text-white text-sm rounded-full border border-gray-700 hover:border-red-500/60 transition-all duration-200 transform hover:scale-105 cursor-pointer shadow-sm hover:shadow-red-500/20"
                  onClick={() => {
                    searchText.current.value = suggestion;
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GptSearchBar;
