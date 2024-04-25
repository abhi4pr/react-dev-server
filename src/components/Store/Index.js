import { configureStore } from "@reduxjs/toolkit";
import ExecutonSlice from "./Executon-Slice";


 const store = configureStore({
  reducer: {
    executon: ExecutonSlice,
  },
});

export default store;