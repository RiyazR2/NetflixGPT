import React from "react";
import { useSelector } from "react-redux";
import VideoTitle from "./VideoTitle";
import BackgroundVideo from "./BackgroundVideo";

// MainContainer Contain on 1 movie to show movie title and background trailer
const MainContainer = React.memo(() => {
  // this movies contain 20 movies but we only need one
  const movies = useSelector((store) => store.movies?.nowPlayingMovies);
  if (!movies) return; // AKA Early Return

  const mainMovie = movies[3];
  // console.log("Main Movie", mainMovie);
  const { original_title, overview, id } = mainMovie;

  return (
    <div className="pt-[30%] md:pt-0 bg-black ">
      {/* {console.log("MainContainer")} */}
      <VideoTitle title={original_title} overview={overview} />
      <BackgroundVideo movieId={id} />
    </div>
  );
});

export default MainContainer;
