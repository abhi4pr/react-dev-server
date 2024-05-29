import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BrandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://35.200.154.203:8080/api/insta_brand",
  }),
  endpoints: (builder) => ({
    getAllBrand: builder.query({
      query: () => "",
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getSingleBrand: builder.query({
      query: (id) => `/${id}`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 60 * 60,
    }),

    addBrand: builder.mutation({
      query: (newBrand) => ({
        url: ``,
        method: "POST",
        body: newBrand,
      }),
      onQueryStarted: async (newBrand, { dispatch, queryFulfilled }) => {
        try {
          const { data: addedBrand } = await queryFulfilled;
          dispatch(
            BrandApi.util.updateQueryData("getAllBrand", undefined, (draft) => {
              draft.unshift(addedBrand.data);
            })
          );
        } catch (error) {
          console.error("Failed to add Insta Brand: ", error);
        }
      },
    }),

    editBrand: builder.mutation({
      query: ({ id, ...updatedBrand }) => ({
        url: `/${id}`,
        method: "PUT",
        body: updatedBrand,
      }),
      onQueryStarted: async (
        { id, ...updatedBrand },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: returnedBrand } = await queryFulfilled;
          dispatch(
            BrandApi.util.updateQueryData("getAllBrand", undefined, (draft) => {
              const brandIndex = draft.findIndex((brand) => brand.id === id);
              if (brandIndex !== -1) {
                draft[brandIndex] = returnedBrand.data;
              }
            })
          );
        } catch (error) {
          console.error("Failed to edit Insta Brand: ", error);
        }
      },
    }),

    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(
            BrandApi.util.updateQueryData("getAllBrand", undefined, (draft) => {
              return draft.filter((brand) => brand.id !== arg);
            })
          );
        } catch (error) {
          console.error("Failed to delete Insta Brand: ", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllBrandQuery,
  useGetSingleBrandQuery,
  useAddBrandMutation,
  useEditBrandMutation,
  useDeleteBrandMutation,
} = BrandApi;

export default BrandApi;
