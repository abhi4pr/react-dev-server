import { createSlice } from "@reduxjs/toolkit";
import { set } from "date-fns";

const initialState = {
  tagCategories: [],
  platforms: [],
  showTagCategoriesModal: false,
  showPageHelathColumn: false,
  showWhatsappModal: false,
  whatsappLink:[],
  venodrRowData: [],
  showPageModal: false,
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
    setShowPageHealthColumn(state,action){
      state.showPageHelathColumn = action.payload;
    },
    setShowWhatsappModal(state){
      state.showWhatsappModal = true
    },
    setCloseWhatsappModal(state){
      state.showWhatsappModal = false
    },
    setWhatsappLink(state,action){
      state.whatsappLink = action.payload
    },
    setVendorRowData(state,action){
      state.venodrRowData = action.payload
    },
    setShowPageModal(state){
      state.showPageModal = true
    },
    setClosePageModal(state){
      state.showPageModal = false
    }
  },
});

export const { setTagCategories , closeTagCategoriesModal , openTagCategoriesModal, setPlatform, setShowPageHealthColumn, setShowWhatsappModal,setCloseWhatsappModal,setWhatsappLink,setVendorRowData, setShowPageModal,setClosePageModal } = pageOverviewSlice.actions;
export default pageOverviewSlice.reducer;
