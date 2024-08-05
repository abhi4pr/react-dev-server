import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery"; // Ensure this is the correct import path

const InvoiceParticularApi = createApi({
  reducerPath: "invoiceParticularApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    // Fetch all invoice particulars
    getInvoiceParticularList: builder.query({
      query: () => "sales/invoice_particular",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24, // Keep the data for 24 hours
    }),

    // Fetch details of a single invoice particular
    getInvoiceParticularDetails: builder.query({
      query: (id) => `sales/invoice_particular/${id}`,
      transformResponse: (response) => response.data,
    }),

    // Add new invoice particular
    createInvoiceParticular: builder.mutation({
      query: (newInvoiceParticular) => ({
        url: "sales/invoice_particular",
        method: "POST",
        body: newInvoiceParticular,
      }),
      onQueryStarted: async (
        newInvoiceParticular,
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: addedInvoiceParticular } = await queryFulfilled;
          dispatch(
            InvoiceParticularApi.util.updateQueryData(
              "getInvoiceParticularList",
              undefined,
              (draft) => {
                draft.unshift(addedInvoiceParticular);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add invoice particular:", error);
        }
      },
    }),

    // Update existing invoice particular
    updateInvoiceParticular: builder.mutation({
      query: ({ id, ...updatedInvoiceParticular }) => ({
        url: `sales/invoice_particular/${id}`,
        method: "PUT",
        body: updatedInvoiceParticular,
      }),
      onQueryStarted: async (
        { id, ...updatedInvoiceParticular },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: returnedInvoiceParticular } = await queryFulfilled;
          dispatch(
            InvoiceParticularApi.util.updateQueryData(
              "getInvoiceParticularList",
              undefined,
              (draft) => {
                const particularIndex = draft.findIndex(
                  (particular) => particular.id === id
                );
                if (particularIndex !== -1) {
                  draft[particularIndex] = returnedInvoiceParticular;
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to update invoice particular:", error);
        }
      },
    }),

    // Delete invoice particular
    deleteInvoiceParticular: builder.mutation({
      query: (id) => ({
        url: `sales/invoice_particular/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            InvoiceParticularApi.util.updateQueryData(
              "getInvoiceParticularList",
              undefined,
              (draft) => {
                return draft.filter((particular) => particular.id !== id);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete invoice particular:", error);
        }
      },
    }),
  }),
});

// Export the hooks generated by createApi
export const {
  useGetInvoiceParticularListQuery,
  useGetInvoiceParticularDetailsQuery,
  useCreateInvoiceParticularMutation,
  useUpdateInvoiceParticularMutation,
  useDeleteInvoiceParticularMutation,
} = InvoiceParticularApi;

export default InvoiceParticularApi;