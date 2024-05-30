import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const AccountDocumentApi = createApi({
  reducerPath: "accountDocumentApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getDocumentById: builder.query({
      query: (id) => `accounts/get_document_overview/${id}`,
    }),

    editDocument: builder.mutation({
      query: ({ id, ...updatedDocument }) => ({
        url: `accounts/update_multiple_account_documents/${id}`,
        method: "PUT",
        body: updatedDocument,
      }),
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const { useGetDocumentByIdQuery, useEditDocumentMutation } =
  AccountDocumentApi;

export default AccountDocumentApi;
