import { api } from "../apiBase";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        data: data
      })
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change/password/v/1.0",
        method: "POST",
        data: data
      })
    }),
    checkCurrentPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/password/reset/check-current",
        method: "POST",
        data: data
      })
    }),
    resetUserPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/password/reset/v/1.0",
        method: "POST",
        data: data
      })
    })
  })
});

export const {
  useLoginUserMutation,
  useChangePasswordMutation,
  useCheckCurrentPasswordMutation,
  useResetUserPasswordMutation
} = authApi;
