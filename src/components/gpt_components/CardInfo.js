import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_OPTIONS } from "../../utils/constant";
import BackgroundVideo from "../BackgroundVideo";

const CardInfo = () => {
  const { id } = useParams();
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    const data = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits`,
      API_OPTIONS
    );
    const json = await data.json();
    setCast(json.cast);
    setCrew(json.crew);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div>
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="sticky top-0 bg-gray-800 p-4 flex justify-between z-10 shadow-md">
          <button
            onClick={() => navigate(-1)}
            className="text-white bg-blue-500 px-4 rounded hover:bg-blue-700"
          >
            Back
          </button>
          <h2 className="text-5xl font-bold mb-2 text-center">
            Movie Cast & Crew
          </h2>
          <Link
            to="/"
            className="text-white bg-blue-500 px-4 py-4 rounded hover:bg-blue-700"
          >
            Home
          </Link>
        </div>
        <BackgroundVideo movieId={id} />
        <div className="container mx-auto pt-16 p-8">
          <div className="mb-12">
            <hr className="border-solid mb-2 " />
            <h3 className="text-4xl font-semibold  text-center">Cast</h3>
            <hr className="border-solid my-4 " />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {cast.map((member) => (
                <div
                  key={member.id}
                  className="bg-gray-800 p-2 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl"
                >
                  <img
                    src={
                      member.profile_path
                        ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                        : "https://wallpapercave.com/wp/wp9566427.jpg" // Default placeholder image
                    }
                    alt={member.name}
                    className="w-full object-cover rounded-t-lg"
                  />
                  <div className="p-2 text-center">
                    <p className="text-2xl font-bold">{member.name}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {member.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <hr className="border-solid mb-2 " />
          <h3 className="text-4xl font-semibold  text-center">Crew</h3>
          <hr className="border-solid my-4 " />
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {crew.map((member) => (
                <div
                  key={member.id}
                  className="bg-gray-800 p-2 rounded-lg shadow-lg transform transition duration-500 hover:scale-105 hover:shadow-xl"
                >
                  <img
                    src={
                      member.profile_path
                        ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                        : "https://wallpapercave.com/wp/wp9566427.jpg" // Default placeholder image
                    }
                    alt={member.name}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="p-2 text-center">
                    <p className="text-2xl font-bold">{member.name}</p>
                    <p className="text-gray-400 text-sm mt-2">{member.job}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
