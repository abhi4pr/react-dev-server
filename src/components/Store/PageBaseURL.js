import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../utils/config";

export const PageBaseURL = createApi({
  baseQuery: fetchBaseQuery({ baseUrl }),
  reducerPath: "PageBaseURL",
  tagTypes: ["profileList", "categoryList"],
  endpoints: (builder) => ({
    getAllProfileList: builder.query({
      query: () => `getProfileList`,
      providesTags: ["profileList"],
    }),
    addProfileType: builder.mutation({
      query: (data) => ({
        url: `addProfile`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["profileList"],
    }),
    updateProfileType: builder.mutation({
      query: (data) => ({
        url: `updateProfile/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["profileList"],
    }),
    addPageCategory: builder.mutation({
      query: (data) => ({
        url: `addPageCatg`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categoryList"],
    }),
    getAllPageCategory: builder.query({
      query: () => `getPageCatgList`,
      providesTags: ["categoryList"],
    }),
    updatePageCategory: builder.mutation({
      query: (data) => ({
        url: `updatePageCatg/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["categoryList"],
    }),

    //price List
    getAllPriceList: builder.query({
      query: () => `getPriceList`,
    }),

    //add Platform Price
    addPlatformPrice: builder.mutation({
      query: (data) => ({
        url: `addPlatformPrice`,
        method: "POST",
        body: data,
      }),
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
} = PageBaseURL;
