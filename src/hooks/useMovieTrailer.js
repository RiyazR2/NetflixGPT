import { useEffect } from "react";
import { API_OPTIONS } from "../utils/constant";
import { addTrailerVideo } from "../utils/moviesSlice";
import { useDispatch } from "react-redux";

const useMovieTrailer = (movieId) => {
  const dispatch = useDispatch();
  // fetch trailer video & updating the store with trailer video data
  const getMovieVideo = async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/" +
        movieId +
        "/videos?language=en-US",
      API_OPTIONS
    );
    const json = await data.json();
    // console.log(json);

    const filerTrailerData = json.results.filter(
      (video) => video.type === "Trailer"
    );

    // if filerTrailerData is not 0 (i.e there is no trailer available)then take filerTrailerData[0] otherwise take json.results[0]
    const trailer = filerTrailerData.length
      ? filerTrailerData[0]
      : json.results[0];
    // console.log(trailer);

    dispatch(addTrailerVideo(trailer));
  };
  useEffect(() => {
    getMovieVideo();
  }, []);
};

export default useMovieTrailer;
