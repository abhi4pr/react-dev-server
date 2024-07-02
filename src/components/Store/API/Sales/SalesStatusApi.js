import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const SaleStatusApi = createApi({
  reducerPath: "saleStatusApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAccountWiseStatus: builder.query({
      query: () => "sales/account_outstanding",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24, // Cache data for 24 hours
    }),
    getUserWiseStatus: builder.query({
      query: () => "sales/sales_executive_outstanding",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24, // Cache data for 24 hours
    }),
  }),
});

export const { useGetAccountWiseStatusQuery, useGetUserWiseStatusQuery } =
  SaleStatusApi;
export default SaleStatusApi;
