import React from "react";
import MovieList from "./MovieList";
import { useSelector } from "react-redux";

const SecondaryContainer = () => {
  const movies = useSelector((store) => store.movies);
  // console.log("movies 1", movies);

  return (
    movies.nowPlayingMovies && (
      <div className=" bg-black w-screen aspect-video mt-11">
        <div className="mt-0 md:-mt-80 pl-4 md:pl-12 relative z-20">
          <MovieList title={"Now Playing"} movies={movies.nowPlayingMovies} />
          <MovieList
            title={"Top Rated Movies"}
            movies={movies.topRatedMovies}
          />
          <MovieList title={"Popular Movies"} movies={movies.popularMovies} />
          <MovieList title={"Upcoming Movies"} movies={movies.upcomingMovies} />
        </div>
      </div>
    )
  );
};

export default SecondaryContainer;
