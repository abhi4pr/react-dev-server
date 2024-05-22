import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../utils/authBaseQuery";

const CompanyTypeApi = createApi({
  reducerPath: "companyTypeApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getAllCompanyType: builder.query({
      query: () => "accounts/get_all_account_company_type",
      transformResponse: (returnValue, args) => returnValue.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getSingleCompanyType: builder.query({
      query: (id) => `accounts/get_single_account_company_type/${id}`,
    }),

    addCompanyType: builder.mutation({
      query: (newCompanyType) => ({
        url: "accounts/add_account_company_type",
        method: "POST",
        body: newCompanyType,
      }),
    }),

    editCompanyType: builder.mutation({
      query: ({ id, ...updatedCompanyType }) => ({
        url: `accounts/edit_account_company_type/${id}`,
        method: "PUT",
        body: updatedCompanyType,
      }),
    }),

    deleteCompanyType: builder.mutation({
      query: (id) => ({
        url: `accounts/delete_account_company_type/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllCompanyTypeQuery,
  useGetSingleCompanyTypeQuery,
  useAddCompanyTypeMutation,
  useEditCompanyTypeMutation,
  useDeleteCompanyTypeMutation,
} = CompanyTypeApi;

export default CompanyTypeApi;
