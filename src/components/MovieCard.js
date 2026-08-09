import React from "react";
import { TMDB_IMG_CDN_URL } from "../utils/constant";

const MovieCard = ({ posterPath, title, movieId, onClick }) => {
  if (!posterPath) return null;

  // Check if posterPath is full URL (OMDb) or path only (TMDB)
  const posterUrl = posterPath.startsWith("http")
    ? posterPath
    : TMDB_IMG_CDN_URL + posterPath;

  return (
    <div
      className="group w-36 md:w-56 pr-4 transition-all duration-300 ease-in-out cursor-pointer"
      onClick={() => onClick && onClick(movieId)}
    >
      {/* Card Container with Shadow and Hover Effects */}
      <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-b from-gray-900 to-black">
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={posterUrl}
            alt={title || "Movie Poster"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Play Button Overlay (appears on hover) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white bg-opacity-90 rounded-full p-3 md:p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300 hover:bg-red-600 hover:bg-opacity-100">
              <svg
                className="w-6 h-6 md:w-8 md:h-8 text-black hover:text-white transition-colors"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>

          {/* Rating Badge (top right corner) */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 backdrop-blur-sm px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-1">
              <svg
                className="w-3 h-3 md:w-4 md:h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white text-xs font-semibold">HD</span>
            </div>
          </div>
        </div>

        {/* Title Section (optional, shows on hover) */}
        {title && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h3 className="text-white text-xs md:text-sm font-semibold line-clamp-2 drop-shadow-lg">
              {title}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
