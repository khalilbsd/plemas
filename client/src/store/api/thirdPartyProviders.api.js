

import { api } from "./apiBase";

export const thirdPartyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllProviders: builder.mutation({
      query: () => ({
        url: `/third_party_providers/list`,
        method: "GET",

      })
    }),


  })
});

export const {
useGetAllProvidersMutation
} = thirdPartyApi;
