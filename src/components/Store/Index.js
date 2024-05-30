import { configureStore } from "@reduxjs/toolkit";
import executon from "./Executon-Slice";
import PageOverview from "./PageOverview";
import { reduxBaseURL } from "./reduxBaseURL";
import { setupListeners } from "@reduxjs/toolkit/query";
import vendorMaster from "./VendorMaster";
import pageMaster from "./PageMaster";
import { PageBaseURL } from "./PageBaseURL";
import SalesAccountApi from "./API/Sales/SalesAccountApi";
import SalesAccountTypeApi from "./API/Sales/SalesAccountTypeApi";
import CompanyTypeApi from "./API/Sales/CompanyTypeApi";
import BrandCategoryTypeApi from "./API/Sales/BrandCategoryTypeApi";
import SaleBookingApi from "./API/Sales/SaleBookingApi";
import BrandApi from "./API/Sales/BrandApi";
import AccountDocumentApi from "./API/Sales/SalesDocumentMasterApi";


const store = configureStore({
  reducer: {
    [reduxBaseURL.reducerPath]: reduxBaseURL.reducer,
    executon,
    PageOverview,
    vendorMaster,
    pageMaster,
    [SalesAccountApi.reducerPath]: SalesAccountApi.reducer,
    [SalesAccountTypeApi.reducerPath]: SalesAccountTypeApi.reducer,
    [CompanyTypeApi.reducerPath]: CompanyTypeApi.reducer,
    [BrandCategoryTypeApi.reducerPath]: BrandCategoryTypeApi.reducer,
    [PageBaseURL.reducerPath]: PageBaseURL.reducer,
    [SaleBookingApi.reducerPath]: SaleBookingApi.reducer,
    [BrandApi.reducerPath]: BrandApi.reducer,
    [AccountDocumentApi.reducerPath]: AccountDocumentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(reduxBaseURL.middleware)
      .concat(SalesAccountApi.middleware)
      .concat(SalesAccountTypeApi.middleware)
      .concat(CompanyTypeApi.middleware)
      .concat(BrandCategoryTypeApi.middleware).concat(PageBaseURL.middleware)
      .concat(SaleBookingApi.middleware)
      .concat(BrandApi.middleware)
      .concat(AccountDocumentApi.middleware),
});
    setupListeners(store.dispatch);


export default store;
