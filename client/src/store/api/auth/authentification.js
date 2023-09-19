import { api } from "../apiBase";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => (
        {
        url: "/auth/login",
        method: "POST",
        data: data
      })
    })
  })
});



export const { useLoginUserMutation } = authApi;
