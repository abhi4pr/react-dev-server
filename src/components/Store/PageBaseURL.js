import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../utils/config";

export const PageBaseURL = createApi({
  baseQuery: fetchBaseQuery({ baseUrl }),
  reducerPath: "PageBaseURL",
  tagTypes: ["profileList", "categoryList"],
  endpoints: (builder) => ({
    getAllProfileList: builder.query({
      query: () => `v1/profile_type`,
      providesTags: ["profileList"],
    }),
    addProfileType: builder.mutation({
      query: (data) => ({
        url: `v1/profile_type`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["profileList"],
    }),
    updateProfileType: builder.mutation({
      query: (data) => ({
        url: `v1/profile_type/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["profileList"],
    }),
    addPageCategory: builder.mutation({
      query: (data) => ({
        url: `v1/page_category`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categoryList"],
    }),
    getAllPageCategory: builder.query({
      // query: () => `getPageCatgList`,
      query: () => `v1/page_category`,
      providesTags: ["categoryList"],
    }),
    updatePageCategory: builder.mutation({
      query: (data) => ({
        url: `v1/page_category/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["categoryList"],
    }),

    //price List
    getAllPriceList: builder.query({
      query: () => `getPriceList`,
    }),

    // Platform Price
    addPlatformPrice: builder.mutation({
      query: (data) => ({
        url: `v1/pagePriceType`,
        method: "POST",
        body: data,
      }),
    }),
    getPlatformPrice: builder.query({
      query: () => `v1/pagePriceType`,
    }),
    updatePlatformPrice: builder.mutation({
      query: (data) => ({
        url: `v1/pagePriceType/${data._id}`,
        method: "PUT",
        body: data,
      }),
    }),

    //Page
    getAllPageList: builder.query({
      query: () => `v1/pageMaster`,
    }),

    //Page price Multiple
    getMultiplePagePrice: builder.query({
      query: (data) => `v1/pagePriceMultipleByPageId/${data}`,
      transformResponse: (response) => response.data,
    }),

    // getpagePriceType
    getpagePriceType: builder.query({
      query: () => `v1/pagePriceType`,
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetAllProfileListQuery,
  useAddProfileTypeMutation,
  useUpdateProfileTypeMutation,
  useAddPageCategoryMutation,
  useGetAllPageCategoryQuery,
  useUpdatePageCategoryMutation,
  useGetAllPriceListQuery,
  useAddPlatformPriceMutation,
  useGetPlatformPriceQuery,
  useUpdatePlatformPriceMutation,
  useGetAllPageListQuery,
  useGetMultiplePagePriceQuery,
  useGetpagePriceTypeQuery,
} = PageBaseURL;
