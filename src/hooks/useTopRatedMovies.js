import { useCallback, useEffect } from "react";
import { API_OPTIONS } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addTopRatedMovies } from "../utils/moviesSlice";

// Fetching TopRatedMovies from TMDB and putting it into the Store
const useTopRatedMovies = () => {
  const dispatch = useDispatch();

  // Doing for Memoization
  const topRatedMovies = useSelector((store) => store.movies.topRatedMovies);

  const getTopRatedMovies = useCallback(async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/top_rated?page=1",
      API_OPTIONS
    );
    const json = await data.json();
    // console.log("getTopRatedMovies", json.results);
    dispatch(addTopRatedMovies(json.results));
  }, [dispatch]);

  useEffect(() => {
    // call only when topRatedMovies is not present(memoization)
    // if (!topRatedMovies) getTopRatedMovies();
    !topRatedMovies && getTopRatedMovies();
  }, [topRatedMovies, getTopRatedMovies]);
};

export default useTopRatedMovies;
