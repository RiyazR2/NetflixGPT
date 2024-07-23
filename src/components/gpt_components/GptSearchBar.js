import React, { useRef } from "react";
import lang from "../../utils/languageConstants";
import { useDispatch, useSelector } from "react-redux";
import openai from "../../utils/openai";
import { API_OPTIONS } from "../../utils/constant";
import { addGptMovieResult } from "../../utils/gptSlice";

const GptSearchBar = () => {
  const dispatch = useDispatch();
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);

  // Searching Movie in this TMDB-API
  const searchMovieTMDB = async (movie) => {
    const data = await fetch(
      "https://api.themoviedb.org/3/search/movie?query=" +
        movie +
        "&include_adult=false&language=en-US&page=1",
      API_OPTIONS
    );
    const json = await data.json();
    // console.log("json.results:", json);
    return json.results;
    // console.log("first", json);
  };

  searchMovieTMDB();

  const handleGptSearchClick = async () => {
    console.log(searchText.current.value);

    const gptQuery =
      "Act as Movie Recommendation System and Suggest some Movies for the Query : " +
      searchText.current.value +
      ". only give me names of 5 movies, comma seperated like the example result given ahead. Example Result: Gadar, Sholay, Don, Golmaal, Koi Mil Gaya";

    // make an API call to GPT-API and get movie results
    const gptResults = await openai.chat.completions.create({
      messages: [{ role: "user", content: gptQuery }],
      model: "gpt-3.5-turbo",
    });

    if (!gptResults.choices) {
      // Handle Error
      console.log("The Movies are not available!!!!!!!!!!!!!!!!!!!!!!!!");
    }

    const gptMovies = gptResults.choices?.[0]?.message?.content.split(",");
    console.log("gptResults.choices GetMovies:", gptMovies);
    // console.log("gptResults.choices GetMovies:", gptMovies);

    // for each movie we will search TMDB-API
    const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));
    // here in "promiseArray" we are getting  5 promise i.e. for 5 movies

    //Promise.all() it takes array of promises it will only finish once all these 5 promises are resolved
    const tmdbResults = await Promise.all(promiseArray);
    console.log("tmdbResults:", tmdbResults);

    dispatch(
      addGptMovieResult({ movieNames: gptMovies, movieResults: tmdbResults })
    );
  };

  return (
    <div className="pt-[42%]  md:p-[10%] flex justify-center ">
      <form
        className="w-full md:w-1/2 bg-black grid grid-cols-12 rounded-lg"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={searchText}
          className="p-4 m-4 md:m-4 col-span-9 text-xs md:text-lg rounded-lg"
          type="text"
          placeholder={lang[langKey].gptSearchPlaceholder}
        />
        <button
          className="sm:py-2 pl-0 py-0 m-4 col-span-3 sm:px-1 md:px-4 bg-red-700 text-white rounded-lg  "
          onClick={handleGptSearchClick}
        >
          {lang[langKey].search}
        </button>
      </form>
    </div>
  );
};

export default GptSearchBar;
