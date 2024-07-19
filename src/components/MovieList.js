import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";

const MovieList = ({ title, movies }) => {
  // console.log("NowPlayingMovies", movies);
  return (
    <div className="px-6 ">
      <h1 className="text-lg md:text-3xl py-4 text-white">{title}</h1>
      <div className="flex overflow-x-scroll scrollbar-none">
        <div className="flex">
          {movies?.map((movie) => (
            /* <Link key={movie.id} to={"/cardinfo/"+movie?.id}></Link> */
            <Link key={movie.id} to={"/cardinfo"}>
              <MovieCard posterPath={movie.poster_path} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
