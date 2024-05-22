import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../utils/authBaseQuery";

const SalesAccountTypeApi = createApi({
  reducerPath: "salesAccountTypeApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllAccountType: builder.query({
      query: () => "accounts/get_account_type_list",
      transformResponse: (returnValue, args) => returnValue.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getSingleAccountType: builder.query({
      query: (id) => `accounts/get_account_type/${id}`,
      transformResponse: (returnValue, args) => returnValue.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    addAccountType: builder.mutation({
      query: (newAccountType) => ({
        url: "accounts/add_account_type",
        method: "POST",
        body: newAccountType,
      }),

      onSuccess: (resopnse, variables, context) => console.log(resopnse),
    }),

    editAccountType: builder.mutation({
      query: ({ id, ...updatedAccountType }) => ({
        url: `accounts/update_account_type/${id}`,
        method: "PUT",
        body: updatedAccountType,
      }),
    }),

    deleteAccountType: builder.mutation({
      query: (id) => ({
        url: `accounts/delete_account_type/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllAccountTypeQuery,
  useGetSingleAccountTypeQuery,
  useAddAccountTypeMutation,
  useEditAccountTypeMutation,
  useDeleteAccountTypeMutation,
} = SalesAccountTypeApi;

export default SalesAccountTypeApi;
