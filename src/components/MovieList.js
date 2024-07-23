import MovieCard from "./MovieCard";
// import BackgroundVideo from "./BackgroundVideo";

const MovieList = ({ title, movies }) => {
  // console.log("NowPlayingMovies", movies);
  return (
    <div className="px-6 ">
      <h1 className="text-[15px] font-semibold md:text-3xl py-4 text-white">
        {title}
      </h1>

      {/* to hide scrollbar-none  */}
      <div className="flex overflow-x-scroll ">
        <div className="flex">
          {movies?.map((movie) => (
            /* <Link key={movie.id} to={"/cardinfo/"+movie?.id}></Link> */
            /* { <Link key={movie.id} to={"/cardinfo/" + movie?.id}>
            </Link> }*/
            <a key={movie.id} href={"/cardinfo/" + movie?.id}>
              <MovieCard posterPath={movie.poster_path} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;
