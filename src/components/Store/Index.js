import { configureStore } from "@reduxjs/toolkit";
import executon from "./Executon-Slice";
import PageOverview from "./PageOverview";
import { reduxBaseURL } from "./reduxBaseURL";
import { setupListeners } from "@reduxjs/toolkit/query";
import vendorMaster from "./VendorMaster";
import SalesAccountApi from "./API/SalesAccountApi";
import SalesAccountTypeApi from "./API/SalesAccountTypeApi";
import CompanyTypeApi from "./API/CompanyTypeApi";
import BrandCategoryTypeApi from "./API/BrandCategoryTypeApi";

const store = configureStore({
  reducer: {
    [reduxBaseURL.reducerPath]: reduxBaseURL.reducer,
    executon,
    PageOverview,
    vendorMaster,
    [SalesAccountApi.reducerPath]: SalesAccountApi.reducer,
    [SalesAccountTypeApi.reducerPath]: SalesAccountTypeApi.reducer,
    [CompanyTypeApi.reducerPath]: CompanyTypeApi.reducer,
    [BrandCategoryTypeApi.reducerPath]: BrandCategoryTypeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(reduxBaseURL.middleware)
      .concat(SalesAccountApi.middleware)
      .concat(SalesAccountTypeApi.middleware)
      .concat(CompanyTypeApi.middleware)
      .concat(BrandCategoryTypeApi.middleware),
});

setupListeners(store.dispatch);

export default store;
