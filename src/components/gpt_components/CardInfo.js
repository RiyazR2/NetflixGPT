import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API_OPTIONS } from "../../utils/constant";
import BackgroundVideo from "../BackgroundVideo";

const CardInfo = () => {
  const { id } = useParams();
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch movie details
        const detailsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}`,
          API_OPTIONS,
        );
        const detailsJson = await detailsResponse.json();
        setMovieDetails(detailsJson);

        // Fetch credits (cast & crew)
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/credits`,
          API_OPTIONS,
        );
        const creditsJson = await creditsResponse.json();
        setCast(creditsJson.cast?.slice(0, 12) || []); // Limit to 12 cast members
        setCrew(creditsJson.crew?.slice(0, 12) || []); // Limit to 12 crew members
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
      {/* Navigation Header */}
      <div className="sticky top-0 bg-black bg-opacity-90 backdrop-blur-md p-4 flex justify-between items-center z-50 shadow-lg border-b border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="text-white bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2"
        >
          <span>←</span> Back
        </button>
        <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-center mx-4 text-white">
          {movieDetails?.title || "Movie Details"}
        </h2>
        <Link
          to="/browse"
          className="text-white bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Home
        </Link>
      </div>

      {/* Movie Background Video */}
      <BackgroundVideo movieId={id} />

      {/* Movie Details Section */}
      {movieDetails && (
        <div className="container mx-auto px-4 md:px-8 pt-8 pb-12">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 mb-12 shadow-2xl border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Movie Poster */}
              <div className="flex justify-center md:justify-start">
                <img
                  src={
                    movieDetails.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image"
                  }
                  alt={movieDetails.title}
                  className="rounded-lg shadow-xl w-full max-w-sm object-cover"
                />
              </div>

              {/* Movie Info */}
              <div className="md:col-span-2 space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold text-red-500">
                  {movieDetails.title}
                </h1>

                {movieDetails.tagline && (
                  <p className="text-lg text-gray-400 italic">
                    "{movieDetails.tagline}"
                  </p>
                )}

                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-2xl">⭐</span>
                    <span className="text-xl font-bold">
                      {movieDetails.vote_average?.toFixed(1)}/10
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({movieDetails.vote_count} votes)
                    </span>
                  </div>
                  <span className="text-gray-400">|</span>
                  <span className="bg-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {movieDetails.runtime} min
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-300">
                    {new Date(movieDetails.release_date).getFullYear()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {movieDetails.genres?.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-600 transition"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-red-400">
                    Overview
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {movieDetails.overview}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Release Date:</span>
                    <p className="font-semibold">
                      {new Date(movieDetails.release_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <p className="font-semibold">{movieDetails.status}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Budget:</span>
                    <p className="font-semibold">
                      {movieDetails.budget > 0
                        ? `$${(movieDetails.budget / 1000000).toFixed(1)}M`
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Revenue:</span>
                    <p className="font-semibold">
                      {movieDetails.revenue > 0
                        ? `$${(movieDetails.revenue / 1000000).toFixed(1)}M`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cast Section */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-red-600"></div>
              <h3 className="text-3xl md:text-4xl font-bold text-center px-6">
                🎭 Cast
              </h3>
              <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-red-600"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {cast.map((member, index) => (
                <div
                  key={`${member.id}-${index}`}
                  className="bg-gray-800 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        member.profile_path
                          ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                          : "https://via.placeholder.com/500x750?text=No+Image"
                      }
                      alt={member.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-sm md:text-base font-bold truncate">
                      {member.name}
                    </p>
                    <p className="text-gray-400 text-xs mt-1 truncate">
                      {member.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Crew Section */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="h-1 flex-1 bg-gradient-to-r from-transparent to-purple-600"></div>
              <h3 className="text-3xl md:text-4xl font-bold text-center px-6">
                🎬 Crew
              </h3>
              <div className="h-1 flex-1 bg-gradient-to-l from-transparent to-purple-600"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {crew.map((member, index) => (
                <div
                  key={`${member.id}-${index}`}
                  className="bg-gray-800 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={
                        member.profile_path
                          ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                          : "https://via.placeholder.com/500x750?text=No+Image"
                      }
                      alt={member.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-sm md:text-base font-bold truncate">
                      {member.name}
                    </p>
                    <p className="text-gray-400 text-xs mt-1 truncate">
                      {member.job}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardInfo;
