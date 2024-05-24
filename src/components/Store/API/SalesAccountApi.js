import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../utils/authBaseQuery";

const SalesAccountApi = createApi({
  reducerPath: "salesAccountApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllAccount: builder.query({
      query: () => "accounts/get_all_account",
      transformResponse: (returnValue, args) => returnValue.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getSingleAccount: builder.query({
      query: (id) => `accounts/get_single_account/${id}`,
    }),

    addAccount: builder.mutation({
      query: (newAccount) => ({
        url: "accounts/add_account",
        method: "POST",
        body: newAccount,
      }),
      onQueryStarted: async (newAccount, { dispatch, queryFulfilled }) => {
        try {
          const { data: addedAccount } = await queryFulfilled;

          dispatch(
            SalesAccountApi.util.updateQueryData(
              "getAllAccount",
              undefined,
              (draft) => {
                draft.unshift(addedAccount.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add account:", error);
        }
      },
    }),

    editAccount: builder.mutation({
      query: ({ id, ...updatedAccount }) => ({
        url: `accounts/edit_account/${id}`,
        method: "PUT",
        body: updatedAccount,
      }),
      onQueryStarted: async (
        { id, ...updatedAccount },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: returnedAccount } = await queryFulfilled;

          dispatch(
            SalesAccountApi.util.updateQueryData(
              "getAllAccount",
              undefined,
              (draft) => {
                const accountIndex = draft.findIndex(
                  (account) => account.id === id
                );
                if (accountIndex !== -1) {
                  draft[accountIndex] = returnedAccount.data; // Update the object in its current position
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to edit account:", error);
        }
      },
    }),

    deleteAccount: builder.mutation({
      query: (id) => ({
        url: `accounts/delete_account/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllAccountQuery,
  useGetSingleAccountQuery,
  useAddAccountMutation,
  useEditAccountMutation,
  useDeleteAccountMutation,
} = SalesAccountApi;

export default SalesAccountApi;
