import React, { useState } from "react";
import MovieList from "./MovieList";
import MovieDetailsModal from "./MovieDetailsModal";
import { useSelector } from "react-redux";

const SecondaryContainer = () => {
  const movies = useSelector((store) => store.movies);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const handleMovieClick = (movieId) => {
    setSelectedMovieId(movieId);
  };

  const handleCloseModal = () => {
    setSelectedMovieId(null);
  };

  return (
    movies.nowPlayingMovies && (
      <>
        <div className=" bg-black w-screen aspect-video -mt-10 md:mt-11">
          <div className=" md:-mt-80 pl-4 md:pl-12 relative z-20">
            <MovieList
              title={"Now Playing"}
              movies={movies.nowPlayingMovies}
              onMovieClick={handleMovieClick}
            />
            <MovieList
              title={"Top Rated Movies"}
              movies={movies.topRatedMovies}
              onMovieClick={handleMovieClick}
            />
            <MovieList
              title={"Popular Movies"}
              movies={movies.popularMovies}
              onMovieClick={handleMovieClick}
            />
            <MovieList
              title={"Upcoming Movies"}
              movies={movies.upcomingMovies}
              onMovieClick={handleMovieClick}
            />
          </div>
        </div>

        {/* Movie Details Modal */}
        {selectedMovieId && (
          <MovieDetailsModal
            movieId={selectedMovieId}
            onClose={handleCloseModal}
          />
        )}
      </>
    )
  );
};

export default SecondaryContainer;
