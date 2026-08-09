import { API_OPTIONS } from "../utils/constant";

// Get similar movies using TMDB Similar API
export const getSimilarMoviesTMDB = async (movieId) => {
  try {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`;
    const response = await fetch(url, API_OPTIONS);
    const data = await response.json();

    return data.results?.slice(0, 20) || [];
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    return [];
  }
};

// Get similar movies using embeddings (semantic similarity)
// Cosine similarity calculation
export const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));

  return dotProduct / (magnitudeA * magnitudeB);
};

// Generate embedding using Hugging Face API
export const generateEmbedding = async (text) => {
  try {
    // Using Hugging Face's free inference API
    const response = await fetch(
      "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: text,
          options: { wait_for_model: true },
        }),
      },
    );

    if (!response.ok) {
      console.error("HF API error:", response.statusText);
      return null;
    }

    const embedding = await response.json();
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
};

// Find similar movies using embeddings
export const getSimilarMoviesEmbeddings = async (targetMovie, moviePool) => {
  try {
    // Generate embedding for target movie's overview
    const targetText = `${targetMovie.title} ${targetMovie.overview || ""}`;
    const targetEmbedding = await generateEmbedding(targetText);

    if (!targetEmbedding) {
      console.log("Falling back to TMDB similar API");
      return await getSimilarMoviesTMDB(targetMovie.id);
    }

    // Calculate similarity with each movie in pool
    const similarities = await Promise.all(
      moviePool.map(async (movie) => {
        if (movie.id === targetMovie.id) return { movie, similarity: -1 }; // Skip same movie

        const movieText = `${movie.title} ${movie.overview || ""}`;
        const movieEmbedding = await generateEmbedding(movieText);

        if (!movieEmbedding) return { movie, similarity: 0 };

        const similarity = cosineSimilarity(targetEmbedding, movieEmbedding);
        return { movie, similarity };
      }),
    );

    // Sort by similarity (highest first)
    const sorted = similarities
      .filter((item) => item.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 20);

    return sorted.map((item) => item.movie);
  } catch (error) {
    console.error("Error in embeddings-based similarity:", error);
    // Fallback to TMDB API
    return await getSimilarMoviesTMDB(targetMovie.id);
  }
};

// Hybrid approach: TMDB + optional embeddings
export const getSimilarMoviesHybrid = async (targetMovie) => {
  try {
    // Method 1: Get TMDB similar movies (fast)
    const tmdbSimilar = await getSimilarMoviesTMDB(targetMovie.id);

    // Method 2: Optionally enhance with embeddings (for top 5)
    // This shows you know embeddings without slowing down UX
    // For now, just return TMDB results for better performance

    return tmdbSimilar;
  } catch (error) {
    console.error("Error in hybrid similar movies:", error);
    return [];
  }
};

const similarMoviesService = {
  getSimilarMoviesTMDB,
  getSimilarMoviesEmbeddings,
  getSimilarMoviesHybrid,
  cosineSimilarity,
  generateEmbedding,
};

export default similarMoviesService;
