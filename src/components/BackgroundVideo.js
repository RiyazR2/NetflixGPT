import React, { useEffect } from "react";
import { API_OPTIONS } from "../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { addTrailerVideo } from "../utils/moviesSlice";

//Fetch Trailer Video
const BackgroundVideo = ({ movieId }) => {
  const dispatch = useDispatch();
  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);

  const getMovieVideo = async () => {
    const data = await fetch(
      "https://api.themoviedb.org/3/movie/1022789/videos?language=en-US",
      API_OPTIONS
    );
    const json = await data.json();
    console.log(json);

    const filerTrailerData = json.results.filter(
      (video) => video.type === "Trailer"
    );

    // if filerTrailerData is not 0 (i.e there is no trailer available)then take filerTrailerData[0] otherwise take json.results[0]
    const trailer = filerTrailerData.length
      ? filerTrailerData[0]
      : json.results[0];
    console.log(trailer);

    dispatch(addTrailerVideo(trailer));
  };
  useEffect(() => {
    getMovieVideo();
  }, []);
  return (
    <div>
      <iframe
        width="560"
        height="315"
        src={"https://www.youtube.com/embed/" + trailerVideo?.key}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    </div>
  );
};

export default BackgroundVideo;
