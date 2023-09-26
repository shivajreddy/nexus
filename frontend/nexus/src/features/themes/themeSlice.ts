import { createSlice } from "@reduxjs/toolkit";
import { IThemeOptions } from "@/types";
import { RootState } from "@/redux/store";


const initialState: IThemeOptions = { value: "nexus-theme-light" }

const themeSlice = createSlice({
  name: "theme",
  initialState,

  reducers: {

    updateTheme(state, action) {  // + action
      state.value = action.payload
    }
  },

});



export default themeSlice.reducer;

export const { updateTheme } = themeSlice.actions;
export const selectTheme = (state: RootState) => state.theme;
