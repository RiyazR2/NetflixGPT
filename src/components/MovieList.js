import MovieCard from "./MovieCard";

const MovieList = ({ title, movies, onMovieClick }) => {
  return (
    <div className={title ? "px-4 md:px-8 py-4 mb-8" : "py-2"}>
      {/* Section Title with Modern Design - Only show if title exists */}
      {title && (
        <div className="flex items-center gap-3 mb-4">
          <div className="h-8 w-1 bg-red-600 rounded-full" />
          <h1 className="text-lg md:text-3xl font-bold text-white tracking-tight">
            {title}
          </h1>
          <div className="flex-1 h-[2px] bg-gradient-to-r from-red-600 via-red-400 to-transparent opacity-30" />
        </div>
      )}

      {/* Horizontal Scrollable Container with Custom Scrollbar */}
      <div className="relative group/list">
        {/* Left Gradient Fade */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none hidden md:block" />

        {/* Right Gradient Fade */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none hidden md:block" />

        {/* Scrollable Movie Cards */}
        <div className="flex overflow-x-scroll overflow-y-hidden scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-gray-800 hover:scrollbar-thumb-red-500 pb-4 scroll-smooth">
          <div className="flex gap-2 md:gap-4 px-2">
            {movies?.map((movie) => (
              <div key={movie.id} className="flex-shrink-0">
                <MovieCard
                  posterPath={movie.poster_path}
                  title={movie.title || movie.original_title}
                  movieId={movie.id}
                  onClick={onMovieClick}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Hint for Mobile */}
        <div className="md:hidden text-center mt-2 opacity-50">
          <p className="text-gray-400 text-xs">← Swipe to see more →</p>
        </div>
      </div>
    </div>
  );
};

export default MovieList;
