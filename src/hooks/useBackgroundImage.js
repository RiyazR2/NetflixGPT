import { useEffect, useState } from "react";
import { API_OPTIONS, TMDB_BACKDROP_CDN_URL } from "../utils/constant";

// Fetches a random popular-movie backdrop from TMDB to use as a full-screen
// background image. This replaces hotlinking any third-party brand's CDN.
// If the request fails, callers should fall back to a plain CSS gradient.
const useBackgroundImage = () => {
  const [bgImage, setBgImage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchBackground = async () => {
      try {
        const response = await fetch(
          "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
          API_OPTIONS,
        );
        const data = await response.json();
        const moviesWithBackdrop = (data?.results || []).filter(
          (movie) => movie.backdrop_path,
        );

        if (isMounted && moviesWithBackdrop.length > 0) {
          const randomMovie =
            moviesWithBackdrop[
              Math.floor(Math.random() * moviesWithBackdrop.length)
            ];
          setBgImage(TMDB_BACKDROP_CDN_URL + randomMovie.backdrop_path);
        }
      } catch (error) {
        // Silently ignore; component will use its CSS gradient fallback
      }
    };

    fetchBackground();

    return () => {
      isMounted = false;
    };
  }, []);

  return bgImage;
};

export default useBackgroundImage;
