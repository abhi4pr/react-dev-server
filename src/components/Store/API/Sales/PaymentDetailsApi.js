import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const PaymentDetailsApi = createApi({
  reducerPath: "paymentDetailsApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllPaymentDetails: builder.query({
      query: () => "sales/getlist_payment_details",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getSinglePaymentDetails: builder.query({
      query: (id) => `sales/get_payment_details/${id}`,
      transformResponse: (response) => response.data,
    }),

    addPaymentDetails: builder.mutation({
      query: (paymentDetails) => ({
        url: "sales/add_payment_details",
        method: "POST",
        body: paymentDetails,
      }),
      onQueryStarted: async (
        newPaymentDetails,
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: addedPaymentDetails } = await queryFulfilled;

          dispatch(
            PaymentDetailsApi.util.updateQueryData(
              "getAllPaymentDetails",
              undefined,
              (draft) => {
                draft.unshift(addedPaymentDetails.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add payment details:", error);
        }
      },
    }),

    updatePaymentDetails: builder.mutation({
      query: ({ id, ...updatedPaymentDetails }) => ({
        url: `sales/update_payment_details/${id}`,
        method: "PUT",
        body: updatedPaymentDetails,
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        try {
          const { data: returnedPaymentDetails } = await queryFulfilled;

          dispatch(
            PaymentDetailsApi.util.updateQueryData(
              "getAllPaymentDetails",
              undefined,
              (draft) => {
                const paymentDetailsIndex = draft.findIndex(
                  (paymentDetails) => paymentDetails.id === id
                );
                if (paymentDetailsIndex !== -1) {
                  draft[paymentDetailsIndex] = returnedPaymentDetails.data;
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to update payment details:", error);
        }
      },
    }),

    deletePaymentDetails: builder.mutation({
      query: (id) => ({
        url: `sales/delete_payment_details/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllPaymentDetailsQuery,
  useGetSinglePaymentDetailsQuery,
  useAddPaymentDetailsMutation,
  useUpdatePaymentDetailsMutation,
  useDeletePaymentDetailsMutation,
} = PaymentDetailsApi;

export default PaymentDetailsApi;
