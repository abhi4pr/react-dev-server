import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const DocumentTypeOverviewApi = createApi({
    reducerPath: "documentTypeOverviewApi",
    baseQuery: authBaseQuery,
    endpoints: (builder) => ({
        getSingleDocumentOverviewType: builder.query({
            query: (id) => `/accounts/get_document_overview/${id}`,

            keepUnusedDataFor: 60 * 60 * 24,
        }),




    }),
});

export const {

    useGetSingleDocumentOverviewTypeQuery,

} = DocumentTypeOverviewApi;

export default DocumentTypeOverviewApi;
