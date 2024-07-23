import React from "react";
import { TMDB_IMG_CDN_URL } from "../utils/constant";

const MovieCard = ({ posterPath }) => {
  if (!posterPath) return null;
  return (
    <div className="w-28 md:w-48 pr-4">
      <img src={TMDB_IMG_CDN_URL + posterPath} alt="Movie Card" />
    </div>
  );
};

export default MovieCard;
