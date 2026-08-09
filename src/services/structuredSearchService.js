import openai from "../utils/openai";
import { API_OPTIONS } from "../utils/constant";

// TMDB Genre IDs mapping
const GENRE_MAP = {
  action: 28,
  adventure: 12,
  animation: 16,
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "science fiction": 878,
  "sci-fi": 878,
  "sci fi": 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

// Bollywood movie library by genre
const BOLLYWOOD_MOVIES = {
  action: [
    "Pathaan",
    "War",
    "Tiger Zinda Hai",
    "Dhoom 3",
    "Baaghi",
    "Singham",
    "Dabangg",
    "Don",
    "Ghajini",
    "Krrish 3",
  ],
  comedy: [
    "3 Idiots",
    "Hera Pheri",
    "Andaz Apna Apna",
    "Munna Bhai MBBS",
    "Chupke Chupke",
    "Golmaal",
    "Fukrey",
    "Hungama",
  ],
  romance: [
    "Dilwale Dulhania Le Jayenge",
    "Kabhi Khushi Kabhie Gham",
    "Veer-Zaara",
    "Jab We Met",
    "Yeh Jawaani Hai Deewani",
    "Rockstar",
  ],
  drama: [
    "Dangal",
    "Taare Zameen Par",
    "Pink",
    "Article 15",
    "Barfi",
    "Piku",
    "October",
    "Masaan",
  ],
  thriller: [
    "Drishyam",
    "Kahaani",
    "Talaash",
    "A Wednesday",
    "Special 26",
    "Baby",
    "Raazi",
  ],
};

// Filter extraction prompt
const FILTER_EXTRACTION_PROMPT = `Extract movie search filters from user queries and return valid JSON.

Extract these fields:
- genres: array of genre names (action, comedy, drama, etc.)
- year_min: minimum release year (number or null)
- year_max: maximum release year (number or null)
- rating_min: minimum TMDB rating 0-10 (number or null)
- mood: user's mood/emotion if mentioned (string or null)
- region: "bollywood" if user mentions bollywood/hindi/indian movies, else null

Examples:
"action movies from 2020" → {"genres":["action"],"year_min":2020,"year_max":2020,"rating_min":null,"mood":null,"region":null}
"bollywood action movies" → {"genres":["action"],"year_min":null,"year_max":null,"rating_min":null,"mood":null,"region":"bollywood"}
"hindi romantic films" → {"genres":["romance"],"year_min":null,"year_max":null,"rating_min":null,"mood":null,"region":"bollywood"}
"I'm feeling sad, need uplifting movies" → {"genres":[],"year_min":null,"year_max":null,"rating_min":null,"mood":"sad, need uplifting","region":null}

Return ONLY the JSON object, no explanations.`;

/**
 * Extract structured filters from natural language query
 */
export const extractFilters = async (userQuery) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: FILTER_EXTRACTION_PROMPT },
        { role: "user", content: userQuery },
      ],
      temperature: 0, // Make it precise, not creative
      response_format: { type: "json_object" },
    });

    const filters = JSON.parse(response.choices[0].message.content);
    return filters;
  } catch (error) {
    console.error("Error extracting filters:", error);
    return {
      genres: [],
      year_min: null,
      year_max: null,
      rating_min: null,
      mood: null,
      region: null,
    };
  }
};

/**
 * Search movies using TMDB Discover API with filters
 */
export const searchMoviesWithFilters = async (filters) => {
  try {
    // Convert genre names to TMDB IDs
    const genreIds = filters.genres
      ?.map((genre) => GENRE_MAP[genre.toLowerCase()])
      .filter((id) => id !== undefined)
      .join(",");

    // Build TMDB discover query
    let url =
      "https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=false&page=1";

    if (genreIds) {
      url += `&with_genres=${genreIds}`;
    }

    if (filters.year_min) {
      url += `&primary_release_date.gte=${filters.year_min}-01-01`;
    }

    if (filters.year_max) {
      url += `&primary_release_date.lte=${filters.year_max}-12-31`;
    }

    if (filters.rating_min) {
      url += `&vote_average.gte=${filters.rating_min}`;
    }

    // Fetch movies
    const response = await fetch(url, API_OPTIONS);
    const data = await response.json();

    return data.results || [];
  } catch (error) {
    console.error("Error searching movies with filters:", error);
    return [];
  }
};

/**
 * Get movie recommendations based on mood (fallback for mood-based queries)
 */
export const getMoodBasedMovies = async (mood) => {
  try {
    // Map moods to genres for better results
    const moodToGenreMap = {
      sad: ["comedy", "family", "animation"], // Uplifting genres
      happy: ["comedy", "romance", "family"],
      stressed: ["comedy", "animation", "family"],
      angry: ["action", "thriller"],
      bored: ["adventure", "action", "sci-fi"],
      lonely: ["romance", "drama", "family"],
      excited: ["action", "adventure", "thriller"],
      tired: ["comedy", "animation"],
      anxious: ["comedy", "family", "animation"],
    };

    // Detect mood keywords
    const moodLower = mood.toLowerCase();
    let suggestedGenres = [];

    // Check for mood keywords
    for (const [moodKey, genres] of Object.entries(moodToGenreMap)) {
      if (moodLower.includes(moodKey)) {
        suggestedGenres = genres;
        break;
      }
    }

    // Default to comedy if no specific mood detected
    if (suggestedGenres.length === 0) {
      suggestedGenres = ["comedy", "family"];
    }

    // Use genre-based search for better results
    const allMovies = [];

    for (const genre of suggestedGenres) {
      const genreId = GENRE_MAP[genre];
      if (!genreId) continue;

      const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&sort_by=vote_average.desc&vote_count.gte=1000&language=en-US&page=1`;

      const response = await fetch(url, API_OPTIONS);
      const data = await response.json();

      // Take top 7 from each genre
      if (data.results) {
        allMovies.push(...data.results.slice(0, 7));
      }
    }

    // Remove duplicates and return top 20
    const uniqueMovies = Array.from(
      new Map(allMovies.map((m) => [m.id, m])).values(),
    );

    return uniqueMovies.slice(0, 20);
  } catch (error) {
    console.error("Error getting mood-based movies:", error);
    return [];
  }
};

/**
 * Search Bollywood movies using OMDb API
 */
export const searchBollywoodMovies = async (filters) => {
  try {
    const OMDB_KEY = process.env.REACT_APP_OMDB_KEY;

    // Get genre-specific movies or default action movies
    const primaryGenre = filters.genres?.[0]?.toLowerCase() || "action";
    const movieTitles =
      BOLLYWOOD_MOVIES[primaryGenre] || BOLLYWOOD_MOVIES.action;

    // Fetch details from OMDb for each movie
    const moviePromises = movieTitles.slice(0, 10).map(async (title) => {
      const url = `https://www.omdbapi.com/?apikey=${OMDB_KEY}&t=${encodeURIComponent(title)}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "True") {
        // Convert OMDb format to TMDB-like format
        return {
          id: data.imdbID,
          title: data.Title,
          overview:
            data.Plot !== "N/A" ? data.Plot : "No description available",
          poster_path: data.Poster !== "N/A" ? data.Poster : null,
          vote_average:
            data.imdbRating !== "N/A" ? parseFloat(data.imdbRating) : 0,
          release_date: data.Year !== "N/A" ? `${data.Year}-01-01` : null,
          isOMDb: true, // Flag to identify OMDb movies
        };
      }
      return null;
    });

    const movies = await Promise.all(moviePromises);
    return movies.filter((m) => m !== null);
  } catch (error) {
    console.error("Error searching Bollywood movies:", error);
    return [];
  }
};

const structuredSearchService = {
  extractFilters,
  searchMoviesWithFilters,
  getMoodBasedMovies,
  searchBollywoodMovies,
  GENRE_MAP,
};

export default structuredSearchService;
