import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tagCategories: [],
  platforms: [],
  showTagCategoriesModal: false,
};

const pageOverviewSlice = createSlice({
  name: "pageOverview",
  initialState,
  reducers: {
    setTagCategories(state, action) {
      state.tagCategories = action.payload;
    },
    closeTagCategoriesModal(state) {
      state.showTagCategoriesModal = false;
    },
    openTagCategoriesModal(state) {
      state.showTagCategoriesModal = true;
    },
    setPlatform(state, action) {
      state.platforms = action.payload;
    },
  },
});

export const { setTagCategories , closeTagCategoriesModal , openTagCategoriesModal, setPlatform } = pageOverviewSlice.actions;
export default pageOverviewSlice.reducer;
