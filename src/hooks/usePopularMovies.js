import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addPopularMovies } from "../utils/moviesSlice";

// Fetching Popular Movies from TMDB and putting it into the Store
const usePopularMovies = () => {
  const dispatch = useDispatch();

  // Doing for Memoization
  const popularMovies = useSelector((store) => store.movies.popularMovies);

  const getPopularMovies = async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/popular?page=1",
      API_OPTIONS
    );
    const json = await data.json();
    // console.log("getPopularMovies", json.results);
    dispatch(addPopularMovies(json.results));
  };

  useEffect(() => {
    // call only when popularMovies is not present(memoization)
    // if (!popularMovies) getPopularMovies();

    !popularMovies && getPopularMovies();
  }, []);
};

export default usePopularMovies;
