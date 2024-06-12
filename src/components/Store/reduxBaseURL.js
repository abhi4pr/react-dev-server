import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../utils/authBaseQuery";

export const reduxBaseURL = createApi({
baseQuery: authBaseQuery,
  tagTypes: [
    "addVendor",
    "addPaycycle",
    "addPlatform",
    "addPayMethod",
    "whatsappLinkType",
    "addBankName",
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
    getAllVendorType: builder.query({
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
    getSingleBankDetail: builder.query({
      query: (data) => `v1/bank_details_by_vendor_id/${data}`,
    }),

    //venodr whatsapp group link
    getVendorWhatsappLink: builder.query({
      query: (id) => `v1/vendor_group_link_vendor_id/${id}`,
    }),

    //Country Code
    getCountryCode: builder.query({
      query: () => `v1/country_code`,
    }),
    addCountryCode: builder.mutation({
      query: (data) => ({
        url: `v1/country_code`,
        method: "POST",
        body: data,
      }),
    }),
    updateCountryCode: builder.mutation({
      query: (data) => ({
        url: `v1/country_code`,
        method: "PUT",
        body: data,
      }),
    }),

    //Vendor
    getAllVendor: builder.query({
      query: () => `v1/vendor`,
    }),

    // Bank Detail Api's:-
    getBankNameDetail: builder.query({
      query: () => `v1/bank_name`,
      providesTags: ["addBankName"],
    }),

    addBankNameDetail: builder.mutation({
      query: (data) => ({
        // url: `addPayCycle`,
        url: `v1/bank_name`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["addBankName"],
    }),

    updateBankNameDetail: builder.mutation({
      query: (data) => ({
        // url: `updatePayCycle/${data._id}`,
        url: `v1/bank_name`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["addBankName"],
    }),
  }),
});

export const {
  useGetnotAssignedVendorsQuery,
  useAddPmsVendorTypeMutation,
  useGetAllVendorTypeQuery,
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
  useGetSingleBankDetailQuery,
  useGetVendorWhatsappLinkQuery,
  useGetCountryCodeQuery,
  useAddCountryCodeMutation,
  useUpdateCountryCodeMutation,
  useGetAllVendorQuery,
  useGetBankNameDetailQuery,
  useAddBankNameDetailMutation,
  useUpdateBankNameDetailMutation,
} = reduxBaseURL;
