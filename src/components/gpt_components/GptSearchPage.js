import React from "react";
import GptSearchBar from "./GptSearchBar";
import GptMoviesSuggestions from "./GptMoviesSuggestions";
import { BG_IMG_URL } from "../../utils/constant";

const GptSearch = () => {
  return (
    <>
      <div className="fixed -z-10">
        <img
          className="h-screen object-cover md:w-screen"
          src={BG_IMG_URL}
          alt="Bg-img"
        />
      </div>
      <div>
        <GptSearchBar />
        <GptMoviesSuggestions />
      </div>
    </>
  );
};

export default GptSearch;
