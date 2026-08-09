import React from "react";
import GptSearchBar from "./GptSearchBar";
import GptMoviesSuggestions from "./GptMoviesSuggestions";
import ChatHistory from "./ChatHistory";
import { BG_IMG_URL } from "../../utils/constant";
import { useSelector } from "react-redux";

const GptSearch = () => {
  const conversationActive = useSelector(
    (store) => store.gpt.conversationActive,
  );

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <img
          className="h-full w-full object-cover"
          src={BG_IMG_URL}
          alt="Bg-img"
        />
        {/* Dark Overlay to hide background behind content */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/85 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Search Bar - Full Width */}
        <GptSearchBar />

        {/* Two Column Layout: Movies (Left) + Chat (Right) */}
        {conversationActive ? (
          <div className="flex flex-col lg:flex-row gap-4 px-4 mt-6">
            {/* Left: Movie Results (70% width on desktop) */}
            <div className="flex-1 lg:w-[70%]">
              <GptMoviesSuggestions />
            </div>

            {/* Right: Chat History (30% width on desktop) */}
            <div className="lg:w-[30%] lg:sticky lg:top-24 lg:self-start">
              <ChatHistory />
            </div>
          </div>
        ) : (
          /* Full width when no conversation */
          <GptMoviesSuggestions />
        )}
      </div>
    </div>
  );
};

export default GptSearch;
