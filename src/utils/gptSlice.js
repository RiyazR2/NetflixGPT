import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showGptSearch: false,
  movieResults: null,
  movieNames: null,
};

const gptSlice = createSlice({
  name: "gpt",
  initialState,
  reducers: {
    toggleGptSearchView: (state, action) => {
      state.showGptSearch = !state.showGptSearch;
    },
    addGptMovieResult: (state, action) => {
      const { movieNames, movieResults } = action.payload;
      state.movieNames = movieNames;
      state.movieResults = movieResults;
    },
    resetGptState: () => initialState,
  },
});

export const { toggleGptSearchView, addGptMovieResult, resetGptState } =
  gptSlice.actions;

export default gptSlice.reducer;
