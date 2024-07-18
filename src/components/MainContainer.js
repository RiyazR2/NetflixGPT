import React from "react";
import { useSelector } from "react-redux";
import VideoTitle from "./VideoTitle";
import BackgroundVideo from "./BackgroundVideo";

const MainContainer = () => {
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);
  if (!movies) return; // AKA Early Return

  const mainMovie = movies[0];
  // console.log("Main Movie", mainMovie);
  const { original_title, overview, id } = mainMovie;

  return (
    <div className=" bg-black ">
      <VideoTitle title={original_title} overview={overview} />
      <BackgroundVideo movieId={id} />
    </div>
  );
};

export default MainContainer;
