import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../utils/config";
import { get } from "jquery";

export const reduxBaseURL = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: baseUrl }),
  tagTypes: [
    "addVendor",
    "addPaycycle",
    "addPlatform",
    "addPayMethod",
    "whatsappLinkType",
  ],
  endpoints: (builder) => ({
    getnotAssignedVendors: builder.query({
      query: () => `notAssignedToPageVendors`,
    }),
    AddPmsVendorType: builder.mutation({
      query: (data) => ({
        // url: `addVendor`,
        url: `/v1/vendor_type`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["addVendor"],
    }),
    getAllVendor: builder.query({
      // query: () => `getAllVendor`,
      query: () => `v1/vendor_type`,
      providesTags: ["addVendor"],
    }),
    updateVendorType: builder.mutation({
      query: (data) => ({
        // url: `updateVendor/${data._id}`,
        url: `/v1/vendor_type`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["addVendor"],
    }),
    addPmsPlatform: builder.mutation({
      query: (data) => ({
        url: `v1/vendor_platform`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["addPlatform"],
    }),

    getPmsPlatform: builder.query({
      query: () => `v1/vendor_platform`,
      providesTags: ["addPlatform"],
    }),
    updatePmsPlatform: builder.mutation({
      query: (data) => ({
        // url: `updatePlatform/${data._id}`,
        url: `v1/vendor_platform`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["addPlatform"],
    }),
    addPmsPaymentMethod: builder.mutation({
      query: (data) => ({
        // url: `addpayMethod`,
        url: `v1/payment_method`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["addPayMethod"],
    }),

    getPmsPaymentMethod: builder.query({
      query: () => `v1/payment_method`,
      providesTags: ["addPayMethod"],
    }),

    updatePmsPaymentMethod: builder.mutation({
      query: (data) => ({
        // url: `updatePay/${data._id}`,
        url: `v1/payment_method`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["addPayMethod"],
    }),
    addPmsPayCycle: builder.mutation({
      query: (data) => ({
        // url: `addPayCycle`,
        url: `v1/paycycle`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["addPaycycle"],
    }),
    getPmsPayCycle: builder.query({
      query: () => `v1/paycycle`,
      providesTags: ["addPaycycle"],
    }),
    updatePmsPayCycle: builder.mutation({
      query: (data) => ({
        // url: `updatePayCycle/${data._id}`,
        url: `v1/paycycle`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["addPaycycle"],
    }),

    //Vendor Whatsapp group
    addVendorWhatsappLinkType: builder.mutation({
      query: (data) => ({
        url: `v1/group_link_type`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["whatsappLinkType"],
    }),
    getVendorWhatsappLinkType: builder.query({
      query: () => `v1/group_link_type`,
      providesTags: ["whatsappLinkType"],
    }),
    updateVendorWhatsappLinkType: builder.mutation({
      query: (data) => ({
        url: `v1/group_link_type`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["whatsappLinkType"],
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
  useUpdatePmsPayCycleMutation,
  useAddVendorWhatsappLinkTypeMutation,
  useGetVendorWhatsappLinkTypeQuery,
  useUpdateVendorWhatsappLinkTypeMutation,
} = reduxBaseURL;
