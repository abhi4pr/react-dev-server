import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import authBaseQuery from "../../../utils/authBaseQuery";

const BrandCategoryTypeApi = createApi({
  reducerPath: "brandCategoryTypeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://35.200.154.203:8080/api/" }),
  endpoints: (builder) => ({
    getAllBrandCategoryType: builder.query({
      query: () => "brandCategory",
      transformResponse: (returnValue) => returnValue.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    getSingleBrandCategoryType: builder.query({
      query: (id) => `brandCategory/${id}`,
      transformResponse: (returnValue) => returnValue.data,
      keepUnusedDataFor: 60 * 60 * 24,
    }),

    addBrandCategoryType: builder.mutation({
      query: (newBrandCategoryType) => ({
        url: "brandCategory",
        method: "POST",
        body: newBrandCategoryType,
      }),
      onQueryStarted: async (
        newBrandCategoryType,
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: addedBrandCategoryType } = await queryFulfilled;

          dispatch(
            BrandCategoryTypeApi.util.updateQueryData(
              "getAllBrandCategoryType",
              undefined,
              (draft) => {
                draft.unshift(addedBrandCategoryType.data);
              }
            )
          );
        } catch (error) {
          console.error("Failed to add brand category type:", error);
        }

        /*
        // Optimistic update (commented out)
        const patchResult = dispatch(
          BrandCategoryTypeApi.util.updateQueryData('getAllBrandCategoryType', undefined, (draft) => {
            draft.unshift(newBrandCategoryType);
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error('Failed to add brand category type:', error);
        }
        */
      },
    }),

    editBrandCategoryType: builder.mutation({
      query: ({ id, ...updatedBrandCategoryType }) => ({
        url: `brandCategory/${id}`,
        method: "PUT",
        body: updatedBrandCategoryType,
      }),
      onQueryStarted: async (
        { id, ...updatedBrandCategoryType },
        { dispatch, queryFulfilled }
      ) => {
        try {
          const { data: returnedBrandCategoryType } = await queryFulfilled;

          dispatch(
            BrandCategoryTypeApi.util.updateQueryData(
              "getAllBrandCategoryType",
              undefined,
              (draft) => {
                const brandCategoryIndex = draft.findIndex(
                  (brandCategory) => brandCategory.id === id
                );
                if (brandCategoryIndex !== -1) {
                  draft[brandCategoryIndex] = returnedBrandCategoryType.data; // Update the object in its current position
                }
              }
            )
          );
        } catch (error) {
          console.error("Failed to edit brand category type:", error);
        }

        /*
        // Optimistic update (commented out)
        const patchResult = dispatch(
          BrandCategoryTypeApi.util.updateQueryData('getAllBrandCategoryType', undefined, (draft) => {
            const brandCategoryIndex = draft.findIndex(brandCategory => brandCategory.id === id);
            if (brandCategoryIndex !== -1) {
              draft[brandCategoryIndex] = { ...draft[brandCategoryIndex], ...updatedBrandCategoryType };
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error('Failed to edit brand category type:', error);
        }
        */
      },
    }),

    deleteBrandCategoryType: builder.mutation({
      query: (id) => ({
        url: `brandCategory/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          dispatch(
            BrandCategoryTypeApi.util.updateQueryData(
              "getAllBrandCategoryType",
              undefined,
              (draft) => {
                return draft.filter((brandCategory) => brandCategory.id !== id);
              }
            )
          );
        } catch (error) {
          console.error("Failed to delete brand category type:", error);
        }

        /*
        // Optimistic update (commented out)
        const patchResult = dispatch(
          BrandCategoryTypeApi.util.updateQueryData('getAllBrandCategoryType', undefined, (draft) => {
            return draft.filter(brandCategory => brandCategory.id !== id);
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error('Failed to delete brand category type:', error);
        }
        */
      },
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
