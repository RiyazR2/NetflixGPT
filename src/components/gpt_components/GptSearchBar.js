import React, { useRef } from "react";
import lang from "../../utils/languageConstants";
import { useSelector } from "react-redux";
import openai from "../../utils/openai";
import { API_OPTIONS } from "../../utils/constant";

const GptSearchBar = () => {
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);

  const searchMovieTMDB = async (MovieName) => {
    const data = await fetch(
      "https://api.themoviedb.org/3/search/movie?query=" +
        MovieName +
        "&include_adult=false&language=en-US&page=1",
      API_OPTIONS
    );

    const json = await data.json();
    console.log("json.results:", json);
    return json.results;
  };

  const handleGptSearchClick = async () => {
    console.log(searchText.current.value);
    // make an API call to GPT API and get movie results

    const gptQuery =
      "Act as Movie Recommendation System and Suggest some Movies for the Query : " +
      searchText.current.value +
      ". only give me names of 5 movies, comma seperated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";

    const gptResults = await openai.chat.completions.create({
      messages: [{ role: "user", content: gptQuery }],
      model: "gpt-3.5-turbo",
    });

    if (!gptResults.choices) {
      // Handle Error
      console.log("The Movies are not available!!!!!!!!!!!!!!!!!!!!!!!!");
    }

    const gptMovies = gptResults.choices?.[0]?.message?.content.split(", ");
    console.log("GetMovies:", gptMovies);

    // for each movie we will search TMDB API
    const promiseArray = gptMovies.map((MovieName) =>
      searchMovieTMDB(MovieName)
    );

    const tmdbResults = await Promise.all(promiseArray);
    console.log("tmdbResults:", tmdbResults);
  };

  return (
    <div className="pt-[10%] flex justify-center ">
      <form
        className="w-1/2 bg-black grid grid-cols-12 rounded-lg"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={searchText}
          className="p-4 m-4 col-span-9  rounded-lg"
          type="text"
          placeholder={lang[langKey].gptSearchPlaceholder}
        />
        <button
          className="py-2 m-4 col-span-3 px-4 bg-red-700 text-white rounded-lg"
          onClick={handleGptSearchClick}
        >
          {lang[langKey].search}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
