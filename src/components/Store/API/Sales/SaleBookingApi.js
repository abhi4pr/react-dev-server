import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const SaleBookingApi = createApi({
  reducerPath: "saleBookingApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllSaleBooking: builder.query({
      query: () => "sales/sales_booking",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getAllDeletedSaleBooking: builder.query({
      query: () => `sales/deleted_sale_booking_list`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60,
    }),

    getIndividualSaleBooking: builder.query({
      query: (id) => `sales/sales_booking/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    getListOfIndividualSaleBooking: builder.query({
      query: (id) => `sales/account_sale_booking/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60,
    }),

    addSaleBooking: builder.mutation({
      query: (newSaleBooking) => ({
        url: "sales/sales_booking",
        method: "POST",
        body: newSaleBooking,
      }),
      onQueryStarted: async (newSaleBooking, { dispatch, queryFulfilled }) => {
        try {
          const { data: addedSaleBooking } = await queryFulfilled;

          dispatch(
            SaleBookingApi.util.updateQueryData(
              "getAllSaleBooking",
              undefined,
              (draft) => {
                draft.unshift(addedSaleBooking.data);
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
        url: `sales/sales_booking/${id}`,
        method: "PUT",
        body: updatedSaleBooking,
      }),
      onQueryStarted: async (
        { id, ...updatedSaleBooking },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: returnedSaleBooking } = await queryFulfilled;

          dispatch(
            SaleBookingApi.util.updateQueryData(
              "getAllSaleBooking",
              undefined,
              (draft) => {
                const saleBookingIndex = draft.findIndex(
                  (saleBooking) => saleBooking._id === id
                );
                if (saleBookingIndex !== -1) {
                  draft[saleBookingIndex] = returnedSaleBooking.data;
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
        url: `sales/sales_booking/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        dispatch(
          SaleBookingApi.util.updateQueryData(
            "getAllSaleBooking",
            undefined,
            (draft) => {
              const saleBookingIndex = draft.findIndex(
                (saleBooking) => saleBooking._id == id
              );
              console.log(
                draft.findIndex((saleBooking) => saleBooking._id == id)
              );
              if (saleBookingIndex !== -1) {
                draft.splice(saleBookingIndex, 1); // Remove the deleted item
              }
            }
          )
        );
      },
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
  useGetAllDeletedSaleBookingQuery,
  useGetIndividualSaleBookingQuery,
  useGetListOfIndividualSaleBookingQuery,
  useAddSaleBookingMutation,
  useEditSaleBookingMutation,
  useDeleteSaleBookingMutation,
  useGetAllNewDeletedSaleQuery,
} = SaleBookingApi;

export default SaleBookingApi;
