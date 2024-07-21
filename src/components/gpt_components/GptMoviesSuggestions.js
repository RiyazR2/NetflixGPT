import React from "react";
import { useSelector } from "react-redux";
import MovieList from "../../components/MovieList";

const GptMoviesSuggestions = () => {
  const { movieResults, movieNames } = useSelector((store) => store.gpt);
  if (!movieNames) return null;

  return (
    <div className="p-4  mt-2 bg-black text-white bg-opacity-85 w-screen aspect-video">
      <div>
        {movieNames?.map((movieName, index) => (
          <MovieList
            key={movieName}
            title={movieName}
            movies={movieResults?.[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default GptMoviesSuggestions;
