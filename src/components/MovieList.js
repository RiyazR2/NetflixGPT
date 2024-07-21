import { Link } from "react-router-dom";
import MovieCard from "./MovieCard";
// import BackgroundVideo from "./BackgroundVideo";

const MovieList = ({ title, movies }) => {
  // console.log("NowPlayingMovies", movies);
  return (
    <div className="px-6 ">
      <h1 className="text-lg md:text-3xl py-4 text-white">
        {title} and Name Related Movies
      </h1>
      <div className="flex overflow-x-scroll scrollbar-none">
        <div className="flex">
          {movies?.map((movie) => (
            /* <Link key={movie.id} to={"/cardinfo/"+movie?.id}></Link> */
            /* { <Link key={movie.id} to={"/cardinfo/" + movie?.id}>
              
            </Link> }*/
            <a href={"/cardinfo/" + movie?.id}>
              <MovieCard posterPath={movie.poster_path} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieList;

// {
//   "adult": false,
//   "backdrop_path": "/fDmci71SMkfZM8RnCuXJVDPaSdE.jpg",
//   "belongs_to_collection": {
//     "id": 86066,
//     "name": "Despicable Me Collection",
//     "poster_path": "/95prV91f4DxkBnLU43YjLbU1m3q.jpg",
//     "backdrop_path": "/37xamYKRUGCRux532lKcZdVGYuR.jpg"
//   },
//   "budget": 100000000,
//   "genres": [
//     {
//       "id": 16,
//       "name": "Animation"
//     },
//     {
//       "id": 10751,
//       "name": "Family"
//     },
//     {
//       "id": 35,
//       "name": "Comedy"
//     },
//     {
//       "id": 28,
//       "name": "Action"
//     }
//   ],
//   "homepage": "https://www.despicable.me",
//   "id": 519182,
//   "imdb_id": "tt7510222",
//   "origin_country": [
//     "US"
//   ],
//   "original_language": "en",
//   "original_title": "Despicable Me 4",
//   "overview": "Gru and Lucy and their girls — Margo, Edith and Agnes — welcome a new member to the Gru family, Gru Jr., who is intent on tormenting his dad. Meanwhile, Gru faces a new nemesis in Maxime Le Mal and his femme fatale girlfriend Valentina, forcing the family to go on the run.",
//   "popularity": 4308.263,
//   "poster_path": "/dbtxg1bQYYuWMQvtEuoiUe4uvFJ.jpg",
//   "production_companies": [
//     {
//       "id": 6704,
//       "logo_path": "/fOG2oY4m1YuYTQh4bMqqZkmgOAI.png",
//       "name": "Illumination",
//       "origin_country": "US"
//     },
//     {
//       "id": 33,
//       "logo_path": "/8lvHyhjr8oUKOOy2dKXoALWKdp0.png",
//       "name": "Universal Pictures",
//       "origin_country": "US"
//     }
//   ],
//   "production_countries": [
//     {
//       "iso_3166_1": "US",
//       "name": "United States of America"
//     }
//   ],
//   "release_date": "2024-06-20",
//   "revenue": 453139626,
//   "runtime": 94,
//   "spoken_languages": [
//     {
//       "english_name": "English",
//       "iso_639_1": "en",
//       "name": "English"
//     }
//   ],
//   "status": "Released",
//   "tagline": "Things just got a little more despicable.",
//   "title": "Despicable Me 4",
//   "video": false,
//   "vote_average": 7.395,
//   "vote_count": 315
// }
