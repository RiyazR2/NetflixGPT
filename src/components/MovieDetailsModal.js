import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { getSimilarMoviesTMDB } from "../services/similarMoviesService";
import { addGptMovieResult, setShowGptSearch } from "../utils/gptSlice";

const MovieDetailsModal = ({ movieId, onClose }) => {
  const dispatch = useDispatch();
  const [movieDetails, setMovieDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [findingSimilar, setFindingSimilar] = useState(false);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) return;

      try {
        setLoading(true);

        // Fetch movie details
        const detailsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          API_OPTIONS,
        );
        const detailsData = await detailsResponse.json();

        // Fetch credits (cast & crew)
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/credits`,
          API_OPTIONS,
        );
        const creditsData = await creditsResponse.json();

        setMovieDetails(detailsData);
        setCredits(creditsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (!movieId) return null;

  const director = credits?.crew?.find((person) => person.job === "Director");
  const topCast = credits?.cast?.slice(0, 6) || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* Backdrop Image - Only show if available */}
            {movieDetails?.backdrop_path ? (
              <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
                <img
                  src={`https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}`}
                  alt={movieDetails.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Title Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                    {movieDetails.title}
                  </h2>
                  {movieDetails.tagline && (
                    <p className="text-gray-300 text-sm md:text-base italic">
                      "{movieDetails.tagline}"
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* No backdrop - Show title in header instead */
              <div className="p-6 md:p-8 bg-gradient-to-r from-gray-900 to-black rounded-t-2xl border-b border-gray-800">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                  {movieDetails?.title || "Movie Details"}
                </h2>
                {movieDetails?.tagline && (
                  <p className="text-gray-400 text-sm md:text-base italic">
                    "{movieDetails.tagline}"
                  </p>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Ratings & Info - Only show if data available */}
              {(movieDetails?.vote_average ||
                movieDetails?.release_date ||
                movieDetails?.runtime) && (
                <div className="flex flex-wrap items-center gap-4">
                  {movieDetails?.vote_average > 0 && (
                    <div className="flex items-center gap-2 bg-yellow-600/20 px-3 py-1.5 rounded-lg">
                      <svg
                        className="w-5 h-5 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-white font-bold">
                        {movieDetails.vote_average.toFixed(1)}/10
                      </span>
                    </div>
                  )}
                  {movieDetails?.release_date && (
                    <span className="text-gray-400">
                      {movieDetails.release_date.split("-")[0]}
                    </span>
                  )}
                  {movieDetails?.runtime && (
                    <span className="text-gray-400">
                      {movieDetails.runtime} min
                    </span>
                  )}
                </div>
              )}

              {/* Genres - Only show if available */}
              {movieDetails?.genres && movieDetails.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movieDetails.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-red-400 text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Find Similar Button */}
              <div className="flex gap-3">
                <button
                  onClick={async () => {
                    setFindingSimilar(true);
                    try {
                      const similarMovies = await getSimilarMoviesTMDB(movieId);

                      // Split into categories
                      const categories = [];
                      const categoryNames = [];
                      const moviesPerCategory = 5;

                      for (let i = 0; i < 4; i++) {
                        const start = i * moviesPerCategory;
                        const categoryMovies = similarMovies.slice(
                          start,
                          start + moviesPerCategory,
                        );
                        if (categoryMovies.length > 0) {
                          categories.push(categoryMovies);
                          categoryNames.push(
                            `Similar to "${movieDetails.title}" #${i + 1}`,
                          );
                        }
                      }

                      // Add to Redux
                      dispatch(
                        addGptMovieResult({
                          movieNames: categoryNames,
                          movieResults: categories,
                        }),
                      );

                      // Show GPT search page
                      dispatch(setShowGptSearch(true));

                      // Close modal
                      onClose();
                    } catch (error) {
                      console.error("Error finding similar movies:", error);
                    } finally {
                      setFindingSimilar(false);
                    }
                  }}
                  disabled={findingSimilar}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  {findingSimilar ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Finding Similar...
                    </>
                  ) : (
                    <>
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
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                      Find Similar Movies
                    </>
                  )}
                </button>
              </div>

              {/* Description - Only show if available */}
              {movieDetails?.overview && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Overview
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {movieDetails.overview}
                  </p>
                </div>
              )}

              {/* Director - Only show if available */}
              {director && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    Director
                  </h3>
                  <p className="text-gray-400">{director.name}</p>
                </div>
              )}

              {/* Cast */}
              {topCast.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Top Cast
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {topCast.map((actor) => (
                      <div
                        key={actor.id}
                        className="flex items-center gap-3 bg-gray-800/50 rounded-lg p-2"
                      >
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-gray-400">
                            {actor.name[0]}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold truncate">
                            {actor.name}
                          </p>
                          <p className="text-gray-400 text-xs truncate">
                            {actor.character}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieDetailsModal;
