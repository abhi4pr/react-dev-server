import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const SaleBookingApi = createApi({
  reducerPath: "saleBookingApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllSaleBooking: builder.query({
      query: () => "sales/get_all_sales_booking",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getSingleSaleBooking: builder.query({
      query: (id) => `sales/get_single_sales_booking/${id}`,
      keepUnusedDataFor: 60 * 60,
    }),
    getIndividualSaleBooking: builder.query({
      query: (id) => `sales/sales_booking/${id}`,
      keepUnusedDataFor: 60 * 60,
    }),

    addSaleBooking: builder.mutation({
      query: (newSaleBooking) => ({
        url: "sales/add_sales_booking",
        method: "POST",
        body: newSaleBooking,
      }),
      onQueryStarted: async ({ dispatch, queryFulfilled }) => {
        try {
          const { data: addedSaleBooking } = await queryFulfilled;

          dispatch(
            SaleBookingApi.util.updateQueryData(
              "getAllSaleBooking",
              undefined,
              (draft) => {
                draft.unshift(addedSaleBooking);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add Sale Booking:", error);
        }
      },
    }),

    editSaleBooking: builder.mutation({
      query: ({ id, ...updatedSaleBooking }) => ({
        url: `sales/edit_sales_booking/${id}`,
        method: "PUT",
        body: updatedSaleBooking,
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        try {
          const { data: returnedSaleBooking } = await queryFulfilled;

          dispatch(
            SaleBookingApi.util.updateQueryData(
              "getAllSaleBooking",
              undefined,
              (draft) => {
                const saleBookingIndex = draft.findIndex(
                  (saleBooking) => saleBooking.id === id
                );
                if (saleBookingIndex !== -1) {
                  draft[saleBookingIndex] = returnedSaleBooking;
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to edit Sale Booking:", error);
        }
      },
    }),

    deleteSaleBooking: builder.mutation({
      query: (id) => ({
        url: `sales/delete_sales_booking/${id}`,
        method: "DELETE",
      }),
    }),

    getAllNewDeletedSale: builder.query({
      query: () => "sales/get_all_new_deleted_data",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),
  }),
});

export const {
  useGetAllSaleBookingQuery,
  useGetSingleSaleBookingQuery,
  useGetIndividualSaleBookingQuery,
  useAddSaleBookingMutation,
  useEditSaleBookingMutation,
  useDeleteSaleBookingMutation,
  useGetAllNewDeletedSaleQuery,
} = SaleBookingApi;

export default SaleBookingApi;
