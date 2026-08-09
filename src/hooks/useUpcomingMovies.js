import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addUpcomingMovies } from "../utils/moviesSlice";
import { useCallback, useEffect } from "react";

const useUpcomingMovies = () => {
  // Fetching Now Playing Movies from TMDB and putting it into the Store
  const dispatch = useDispatch();

  // Doing for Memoization
  const upcomingMovies = useSelector((store) => store.movies.upcomingMovies);

  const getUpcomingMovies = useCallback(async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/upcoming?page=1",
      API_OPTIONS
    );
    const json = await data.json();
    // console.log("jsonn", json.results);
    dispatch(addUpcomingMovies(json.results));
  }, [dispatch]);

  useEffect(() => {
    // call only when upcomingMovies is not present(memoization)
    // if (!upcomingMovies) getUpcomingMovies();
    !upcomingMovies && getUpcomingMovies();
  }, [upcomingMovies, getUpcomingMovies]);
};

export default useUpcomingMovies;
