import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: true, // true = light, false = dark
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = !state.mode;
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;