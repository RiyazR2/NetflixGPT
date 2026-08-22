export const APP_LOGO = "/MovieFinder_Logo.png";

// Copyright-free, dynamically generated placeholder avatar (no third-party hotlinking)
export const USER_AVATAR =
  "https://ui-avatars.com/api/?name=User&background=E50914&color=fff&size=256&bold=true";

// Generates a copyright-free avatar URL with initials based on the given name
export const getAvatarUrl = (name) => {
  const safeName = name && name.trim() ? name.trim() : "User";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    safeName,
  )}&background=E50914&color=fff&size=256&bold=true`;
};

export const GIT_USER_AVATAR =
  "https://avatars.githubusercontent.com/u/68728529?v=4";

// Your Personal => API Read Access Token
export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",

    Authorization: "Bearer " + process.env.REACT_APP_TMDB_KEY,
  },
};

export const TMDB_IMG_CDN_URL = "https://image.tmdb.org/t/p/w780/";

// Used for full-screen background images (login page, GPT search page)
export const TMDB_BACKDROP_CDN_URL = "https://image.tmdb.org/t/p/original/";

export const OPENAI_KEY = process.env.REACT_APP_OPENAI_KEY;

export const SUPPORTED_LANGUAGES = [
  { identifier: "en", name: "English" },
  { identifier: "hindi", name: "Hindi" },
  { identifier: "marathi", name: "Marathi" },
  { identifier: "telgu", name: "Telgu" },
  { identifier: "tamil", name: "Tamil" },
  { identifier: "urdu", name: "Urdu" },
];
