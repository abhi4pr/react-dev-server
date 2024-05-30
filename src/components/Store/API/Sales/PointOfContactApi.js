import { createApi } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../../utils/authBaseQuery";

const PointOfContactApi = createApi({
  reducerPath: "pointOfContact",
  baseQuery: authBaseQuery,
  endpoints: (builder) => ({
    getSinglePOC: builder.query({
      query: (id) => `accounts/get_account_poc/${id}`,
      keepUnusedDataFor: 3600,
    }),

    editPOC: builder.mutation({
      query: ({ id, ...updatedPOC }) => ({
        url: `accounts/update_multiple_account_poc/${id}`,
        method: "PUT",
        body: updatedPOC,
      }),
      keepUnusedDataFor: 3600,
    }),
  }),
});

export const { useGetSinglePOCQuery, useEditPOCMutation } = PointOfContactApi;

export default PointOfContactApi;
