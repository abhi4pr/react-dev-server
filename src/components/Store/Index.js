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
import DocumentTypeApi from "./API/Sales/DocumentTypeApi";
import PointOfContactApi from "./API/Sales/PointOfContactApi";
import AccountDocumentApi from "./API/Sales/AccountDocumentApi";
import SaleServiceApi from "./API/Sales/SalesServiceApi";
import DocumentOverviewApi from "./API/Sales/DocumentOverview";
import GetGstDetailApi from "./API/Sales/GetGstDetailApi";
import ExecutionApi from "./API/Sales/ExecutionApi";
import RecordServicesApi from "./API/Sales/RecordServicesApi";
import CreditApprovalApi from "./API/Sales/CreditApprovalApi";
import PageSlice from "./Page-slice";

const store = configureStore({
  reducer: {
    [reduxBaseURL.reducerPath]: reduxBaseURL.reducer,
    executon,
    PageOverview,
    vendorMaster,
    pageMaster,
    PageSlice,
    [SalesAccountApi.reducerPath]: SalesAccountApi.reducer,
    [SalesAccountTypeApi.reducerPath]: SalesAccountTypeApi.reducer,
    [CompanyTypeApi.reducerPath]: CompanyTypeApi.reducer,
    [BrandCategoryTypeApi.reducerPath]: BrandCategoryTypeApi.reducer,
    [PageBaseURL.reducerPath]: PageBaseURL.reducer,
    [SaleBookingApi.reducerPath]: SaleBookingApi.reducer,
    [BrandApi.reducerPath]: BrandApi.reducer,
    [DocumentTypeApi.reducerPath]: DocumentTypeApi.reducer,
    [PointOfContactApi.reducerPath]: PointOfContactApi.reducer,
    [AccountDocumentApi.reducerPath]: AccountDocumentApi.reducer,
    [SaleServiceApi.reducerPath]: SaleServiceApi.reducer,
    [DocumentOverviewApi.reducerPath]: DocumentOverviewApi.reducer,
    [GetGstDetailApi.reducerPath]: GetGstDetailApi.reducer,
    [ExecutionApi.reducerPath]: ExecutionApi.reducer,
    [RecordServicesApi.reducerPath]: RecordServicesApi.reducer,
    [CreditApprovalApi.reducerPath]: CreditApprovalApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(reduxBaseURL.middleware)
      .concat(SalesAccountApi.middleware)
      .concat(SalesAccountTypeApi.middleware)
      .concat(CompanyTypeApi.middleware)
      .concat(BrandCategoryTypeApi.middleware)
      .concat(PageBaseURL.middleware)
      .concat(SaleBookingApi.middleware)
      .concat(BrandApi.middleware)
      .concat(DocumentTypeApi.middleware)
      .concat(PointOfContactApi.middleware)
      .concat(AccountDocumentApi.middleware)
      .concat(SaleServiceApi.middleware)
      .concat(DocumentOverviewApi.middleware)
      .concat(GetGstDetailApi.middleware)
      .concat(ExecutionApi.middleware)
      .concat(RecordServicesApi.middleware)
      .concat(CreditApprovalApi.middleware),
});
setupListeners(store.dispatch);

export default store;
