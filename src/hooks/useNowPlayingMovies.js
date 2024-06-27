import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS } from "../utils/constant";
import { addNowPlayingMovies } from "../utils/moviesSlice";
import { useEffect } from "react";

const useNowPlayingMovies = () => {
  // Fetching Now Playing Movies from TMDB and putting it into the Store
  const dispatch = useDispatch();

  // Doing for Memoization
  const nowPlayingMovies = useSelector(
    (store) => store.movies.nowPlayingMovies
  );

  const getNowPlayingMovies = async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/now_playing?page=1",
      API_OPTIONS
    );
    const json = await data.json();
    // console.log("jsonn", json.results);
    dispatch(addNowPlayingMovies(json.results));
  };

  useEffect(() => {
    // call only when nowPlayingMovies is not present(memoization)
    // if (!nowPlayingMovies) getNowPlayingMovies();
    !nowPlayingMovies && getNowPlayingMovies(); // same as above code, both are same
  }, []);
};

export default useNowPlayingMovies;
