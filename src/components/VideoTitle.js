import React from "react";

const VideoTitle = ({ title, overview }) => {
  const truncateOverview = (overview) => {
    const words = overview.split(" ");
    return words.slice(0, 25).join(" ") + (words.length > 25 ? "..." : "");
  };
  return (
    <div className="pt-[20%] px-6 md:px-24 absolute text-white w-screen aspect-video bg-gradient-to-r from-black">
      <h1 className="text-2xl md:text-6xl font-bold">{title}</h1>
      {/* <p className="hidden md:inline-block py-6 text-lg w-1/3">{overview}</p> */}
      <p className="hidden md:inline-block py-6 text-lg w-1/3">
        {truncateOverview(overview)}
      </p>
      <div className="my-4 md:m-0 flex gap-3">
        {/* Play Button */}
        <button className="group hidden md:flex items-center gap-3 bg-white text-black py-3 px-8 text-lg font-bold rounded-lg hover:bg-opacity-90 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300">
          <svg
            className="w-6 h-6 group-hover:scale-110 transition-transform"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
          <span>Play</span>
        </button>

        {/* More Info Button */}
        <button className="group hidden md:flex items-center gap-3 bg-gray-700 bg-opacity-70 backdrop-blur-sm text-white py-3 px-8 text-lg font-semibold rounded-lg hover:bg-opacity-80 border border-gray-500 hover:border-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-300">
          <svg
            className="w-6 h-6 group-hover:rotate-12 transition-transform"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>More Info</span>
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
