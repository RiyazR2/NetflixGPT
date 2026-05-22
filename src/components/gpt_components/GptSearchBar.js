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
      API_OPTIONS,
    );
    const json = await data.json();
    // console.log("json.results:", json);
    return json.results;
    // console.log("first", json);
  };

  searchMovieTMDB();

  const handleGptSearchClick = async () => {
    // console.log(searchText.current.value);

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
      // console.log("The Movies are not available!!!!!!!!!!!!!!!!!!!!!!!!");
    }

    const gptMovies = gptResults.choices?.[0]?.message?.content.split(",");
    // console.log("gptResults.choices GetMovies:", gptMovies);
    // console.log("gptResults.choices GetMovies:", gptMovies);

    // for each movie we will search TMDB-API
    const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));
    // here in "promiseArray" we are getting  5 promise i.e. for 5 movies

    //Promise.all() it takes array of promises it will only finish once all these 5 promises are resolved
    const tmdbResults = await Promise.all(promiseArray);
    // console.log("tmdbResults:", tmdbResults);

    dispatch(
      addGptMovieResult({ movieNames: gptMovies, movieResults: tmdbResults }),
    );
  };

  return (
    <div className="pt-[35%] md:pt-[10%] flex justify-center px-4">
      <div className="w-full md:w-2/3 lg:w-1/2">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            🎬 GPT Movie Search
          </h2>
          <p className="text-gray-300 text-sm md:text-base">
            Ask AI to recommend movies based on your preferences
          </p>
        </div>

        <form
          className="bg-black bg-opacity-70 backdrop-blur-sm p-6 rounded-xl shadow-2xl border border-gray-700"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <input
              ref={searchText}
              className="flex-1 p-4 bg-gray-800 bg-opacity-80 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-sm md:text-base"
              type="text"
              placeholder={lang[langKey].gptSearchPlaceholder}
            />
            <button
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-semibold rounded-lg transition duration-200 transform hover:scale-105 shadow-lg"
              onClick={handleGptSearchClick}
            >
              {lang[langKey].search}
            </button>
          </div>

          <div className="mt-4 text-gray-400 text-xs md:text-sm">
            <p>
              💡 Try: "Suggest action movies like Mission Impossible" or
              "Romantic comedies for date night"
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GptSearchBar;
