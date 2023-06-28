import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const insuranceApi = createApi({
  reducerPath: "insuranceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:8000/api`,
  }),
  tagTypes: ["nsurance"],
  endpoints: (builder) => ({
    insuranceList: builder.query({
      query: () => {
        return {
          url: `/v1/insurance`,
          method: "GET",
        };
      },
      providesTags : ["Insurance"]
    }),
    insuranceCreation:builder.mutation({
      query: (params) => {
        return {
          url: `/v1/insurance`,
          method: "POST",
          body:params,
        };
      },
      invalidatedTags : ["Insurance"]
    }),
    insuranceById:builder.query({
      query: (params) => {
        return {
          url: `/v1/insurance/${params.id}`,
          method: "GET",
        };
      },
      invalidatedTags : ["Insurance"]
    }),
    insuranceEdit:builder.mutation({
      query: (params) => {
        return {
          url: `/v1/insurance/${params.id}`,
          method: "PUT",
          body:params.values
        };
      },
      invalidatedTags : ["Insurance"]
    }),
    validateInsurance:builder.mutation({
      query: (params) => {
        return {
          url: `/v1/insurance/validate/${params.id}`,
          method: "POST",
        };
      },
      invalidatedTags : ["Insurance"]
    })
  }),
});

export const { 
  useInsuranceListQuery,
  useInsuranceCreationMutation,
  useInsuranceByIdQuery,
  useInsuranceEditMutation,
  useValidateInsuranceMutation
} = insuranceApi;