import { configureStore } from "@reduxjs/toolkit";
import executon from "./Executon-Slice";
import PageOverview from "./PageOverview";

 const store = configureStore({
  reducer: {
    executon,
    PageOverview,
  },
});

export default store;