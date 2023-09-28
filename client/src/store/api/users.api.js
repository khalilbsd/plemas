import { api } from "./apiBase";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAuthenticatedUserInfo: builder.mutation({
      query: (data) => ({
        url: "/users/user_info",
        method: "POST",
        data: data
      })
    }),
    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `/users/profile/change`,
        method: "PATCH",
        data: data
      })
    }),
    updateUserProfilePicture: builder.mutation({
      query: (data) => ({
        url: `/users/profile/image/change`,
        method: "PATCH",
        data: data
      })
    }),
    getUserList: builder.mutation({
      query: () => ({
        url: "/users/list",
        method: "GET"
      })
    }),
    addNewUser:builder.mutation({
      query:(data)=>({
        url: `/users/add`,
        method: "POST",
        data: data
      })
    })
  })
});

export const {
  useGetAuthenticatedUserInfoMutation,
  useUpdateUserProfileMutation,
  useUpdateUserProfilePictureMutation,
  useGetUserListMutation,
  useAddNewUserMutation
} = userApi;
