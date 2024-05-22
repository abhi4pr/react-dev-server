import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BrandCategoryTypeApi = createApi({
  reducerPath: "brandCategoryTypeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://35.200.154.203:8080/api/brandCategory",
  }),
  endpoints: (builder) => ({
    getAllBrandCategoryType: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      transformResponse: (returnValue, args) => returnValue.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getSingleBrandCategoryType: builder.query({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
    }),

    addBrandCategoryType: builder.mutation({
      query: (newBrandCategoryType) => ({
        url: "",
        method: "POST",
        body: newBrandCategoryType,
      }),
      async onQueryStarted({ body }, { dispatch, queryFulfilled }) {
        try {
          console.log(body, "harshal");
          const createdBrandCategoryType = body; // Access the new brand category type data directly from the body parameter
          const patchResult = dispatch(
            BrandCategoryTypeApi.util.upsertQueryData(
              "getAllBrandCategoryType",
              null,
              createdBrandCategoryType
            )
          );
        } catch (error) {
          console.error("Error while updating cache:", error);
        }
      },
    }),

    editBrandCategoryType: builder.mutation({
      query: ({ id, ...updatedBrandCatType }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updatedBrandCatType,
      }),
    }),

    deleteBrandCategoryType: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllBrandCategoryTypeQuery,
  useGetSingleBrandCategoryTypeQuery,
  useAddBrandCategoryTypeMutation,
  useEditBrandCategoryTypeMutation,
  useDeleteBrandCategoryTypeMutation,
} = BrandCategoryTypeApi;

export default BrandCategoryTypeApi;
