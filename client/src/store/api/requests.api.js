import { api } from "./apiBase";

export const requestApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjectRequest: builder.mutation({
      query: (projectID) => ({
        url: `/requests/get/project/${projectID}/requests`,
        method: "GET",

      })
    }),
    createProjectRequest: builder.mutation({
      query: (data) => ({
        url: `/requests/project/request/create`,
        method: "POST",
        data: data

      })
    }),
    updateProjectRequest: builder.mutation({
      query: ({body,projectID,requestID}) => ({
        url: `/requests/project/${projectID}/request/${requestID}/change`,
        method: "PATCH",
        data: body

      })
    }),
    deleteProjectRequest: builder.mutation({
      query: ({projectID,requestID}) => ({
        url: `/requests/project/${projectID}/request/${requestID}/delete`,
        method: "DELETE",
        // data: body

      })
    }),

  })
});

export const {
 useGetProjectRequestMutation,
 useCreateProjectRequestMutation,
 useUpdateProjectRequestMutation,
 useDeleteProjectRequestMutation
} = requestApi;
