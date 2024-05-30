import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const AccountDocumentApi = createApi({
  reducerPath: "accountDocumentApi",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getSingleDocument: builder.query({
      query: (id) => `/accounts/get_document_master/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getAllDocuments: builder.query({
      query: () => "/accounts/get_document_master_list",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    addDocuments: builder.mutation({
      query: (Documentsdata) => ({
        url: "/accounts/add_document_master",
        method: "POST",
        body: Documentsdata,
      }),
      onQueryStarted: async (Documentsdata, { dispatch, queryFulfilled }) => {
        try {
          const { data: addedDocumnet } = await queryFulfilled;

          dispatch(
            AccountDocumentApi.util.updateQueryData(
              "getAllDocuments",
              undefined,
              (draft) => {
                draft.unshift(addedDocumnet.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add account type:", error);
        }
      },
    }),

    editDocument: builder.mutation({
      query: ({ id, ...updatedDocument }) => ({
        url: `/accounts/update_document_master/${id}`,
        method: "PUT",
        body: updatedDocument,
      }),
      onQueryStarted: async (
        { id, ...updatedDocument },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: returnedDocument } = await queryFulfilled;

          dispatch(
            AccountDocumentApi.util.updateQueryData(
              "getAllDocuments",
              undefined,
              (draft) => {
                const DocumentIndex = draft.findIndex((Doc) => Doc.id === id);
                if (DocumentIndex !== -1) {
                  draft[DocumentIndex] = returnedDocument.data; // Update the object in its current position
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to edit account type:", error);
        }
      },
    }),

    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `/accounts/delete_document_master/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(
            AccountDocumentApi.util.updateQueryData(
              "getAllDocuments",
              undefined,
              (draft) => {
                return draft.filter((account) => account.id !== id);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete account type:", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllDocumentsQuery,
  useGetSingleDocumentQuery,
  useAddDocumentsMutation,
  useEditDocumentMutation,
  useDeleteDocumentMutation,
} = AccountDocumentApi;

export default AccountDocumentApi;
