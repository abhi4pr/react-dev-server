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
    }),

    editAccount: builder.mutation({
      query: ({ id, ...updatedAccount }) => ({
        url: `accounts/edit_account/${id}`,
        method: "PUT",
        body: updatedAccount,
      }),
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
