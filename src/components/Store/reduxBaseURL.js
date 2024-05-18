import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../utils/config";

export const reduxBaseURL = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  tagTypes: ["addVendor","addPaycycle","addPlatform","addPayMethod"],
  endpoints: (builder) => ({
    getnotAssignedVendors: builder.query({
      query: () => `notAssignedToPageVendors`,
    }),
    AddPmsVendorType: builder.mutation({
      query: (data) => ({
        url: `addVendor`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["addVendor"],
    }),
    getAllVendor: builder.query({
      query: () => `getAllVendor`,
      providesTags: ["addVendor"],
    }),
    updateVendorType: builder.mutation({
      query: (data) => ({
        url: `updateVendor/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["addVendor"],
      
    }),
    addPmsPlatform: builder.mutation({
      query: (data) => ({
        url: `addPlatform`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['addPlatform']
    }),

    getPmsPlatform: builder.query({
      query: () => `getAllPlatform`,
      providesTags: ['addPlatform']
    }),
    updatePmsPlatform: builder.mutation({
      query: (data) => ({
        url: `updatePlatform/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['addPlatform']
    }),
    addPmsPaymentMethod: builder.mutation({
      query: (data) => ({
        url: `addpayMethod`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['addPayMethod']
    }),

    getPmsPaymentMethod: builder.query({
      query: () => `getAllPay`,
      providesTags: ['addPayMethod']
    }),

    updatePmsPaymentMethod: builder.mutation({
      query: (data) => ({
        url: `updatePay/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['addPayMethod']
    }),
    addPmsPayCycle: builder.mutation({
      query: (data) => ({
        url: `addPayCycle`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['addPaycycle']
    }),
    getPmsPayCycle: builder.query({
      query: () => `getAllPayCycle`,
      providesTags: ['addPaycycle']
    }),
    updatePmsPayCycle: builder.mutation({
      query: (data) => ({
        url: `updatePayCycle/${data._id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['addPaycycle']
    }),
  }),
});

export const {
  useGetnotAssignedVendorsQuery,
  useAddPmsVendorTypeMutation,
  useGetAllVendorQuery,
  useUpdateVendorTypeMutation,
  useAddPmsPlatformMutation,
  useGetPmsPlatformQuery,
  useUpdatePmsPlatformMutation,
  useAddPmsPaymentMethodMutation,
  useGetPmsPaymentMethodQuery,
  useUpdatePmsPaymentMethodMutation,
  useAddPmsPayCycleMutation,
  useGetPmsPayCycleQuery,
  useUpdatePmsPayCycleMutation
} = reduxBaseURL;
