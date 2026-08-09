import React, { useState } from "react";
import { useSelector } from "react-redux";
import MovieList from "../../components/MovieList";
import MovieDetailsModal from "../../components/MovieDetailsModal";
import ShimmerUI from "../../components/ShimmerUI";
import lang from "../../utils/languageConstants";

const GptMoviesSuggestions = () => {
  const { movieResults, movieNames, isLoading } = useSelector(
    (store) => store.gpt,
  );
  const langKey = useSelector((store) => store.config.lang);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Show shimmer while loading
  if (isLoading) {
    return <ShimmerUI />;
  }

  if (!movieNames) return null;

  const handleMovieClick = (movieId) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  return (
    <div className="bg-gray-900/30 rounded-2xl border border-gray-800/50 p-4 backdrop-blur-sm">
      {/* Results Header - More Subtle */}
      <div className="mb-4 text-center">
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-red-600/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
          <svg
            className="w-5 h-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <h2 className="text-lg md:text-xl font-semibold text-white">
            {lang[langKey].aiRecommendations}
          </h2>
        </div>
        <p className="text-gray-500 mt-2 text-xs md:text-sm">
          {movieNames?.length} {lang[langKey].categoriesFound}
        </p>
      </div>

      {/* Movie Lists - Card Based Layout */}
      <div className="space-y-4">
        {movieNames?.map((movieName, index) => (
          <div
            key={movieName}
            className="animate-fadeIn bg-gray-800/30 rounded-xl border border-gray-700/30 p-3 backdrop-blur-sm hover:border-red-900/30 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-800/50">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-red-600 to-pink-600 rounded-lg text-white font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-bold text-white line-clamp-1">
                  {movieName}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {movieResults?.[index]?.length || 0}{" "}
                  {lang[langKey].moviesCount}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-red-600/10 rounded-full">
                <svg
                  className="w-3.5 h-3.5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-semibold text-red-500">
                  {lang[langKey].aiPick}
                </span>
              </div>
            </div>

            {/* Movie Cards Container */}
            <div className="relative">
              <MovieList
                title=""
                movies={movieResults?.[index]}
                onMovieClick={handleMovieClick}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Movie Details Modal */}
      {selectedMovieId && (
        <MovieDetailsModal
          movieId={selectedMovieId}
          onClose={handleCloseModal}
        />
      )}

      {/* No Results Message */}
      {movieResults &&
        movieResults.every((result) => !result || result.length === 0) && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl text-gray-300 mb-2">No movies found</h3>
            <p className="text-gray-500">Try a different search term</p>
          </div>
        )}
    </div>
  );
};

export default GptMoviesSuggestions;
