import { configureStore } from "@reduxjs/toolkit";
import executon from "./Executon-Slice";
import PageOverview from "./PageOverview";
import { reduxBaseURL } from "./reduxBaseURL";
import { setupListeners } from "@reduxjs/toolkit/query";
import vendorMaster from "./VendorMaster";
import SalesAccountApi from "./API/Sales/SalesAccountApi";
import SalesAccountTypeApi from "./API/Sales/SalesAccountTypeApi";
import CompanyTypeApi from "./API/Sales/CompanyTypeApi";
import BrandCategoryTypeApi from "./API/Sales/BrandCategoryTypeApi";
import SaleBookingApi from "./API/Sales/SaleBookingApi";

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
    [SaleBookingApi.reducerPath]: SaleBookingApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(reduxBaseURL.middleware)
      .concat(SalesAccountApi.middleware)
      .concat(SalesAccountTypeApi.middleware)
      .concat(CompanyTypeApi.middleware)
      .concat(BrandCategoryTypeApi.middleware)
      .concat(SaleBookingApi.middleware),
});

setupListeners(store.dispatch);

export default store;
