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
      <div className="my-4 md:m-0 ">
        <button className="hidden md:inline-block bg-white text-black py-1 md:p-4 px-3 md:px-12 text-lg rounded-lg hover:bg-opacity-80">
          ▶ Play
        </button>
        <button className="hidden md:inline-block mx-2 bg-gray-500 text-white p-4 px-12 text-xl bg-opacity-50 rounded-lg hover:bg-opacity-80">
          ℹ️ More Info
        </button>
      </div>
    </div>
  );
};

export default VideoTitle;
