import { api } from "./apiBase";

export const projectApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjectList: builder.mutation({
      query: () => ({
        url: "projects/all",
        method: "GET"
      })
    }),
    generateProjectCode: builder.mutation({
      query: () => ({
        url: "projects/generate/code",
        method: "GET"
      })
    }),
    verifyProjectCode: builder.mutation({
      query: (data) => ({
        url: "projects/verify/code",
        method: "POST",
        data: data
      })
    }),
    getPhases: builder.mutation({
      query: () => ({
        url: "phases/all",
        method: "GET"
      })
    }),
    getLots: builder.mutation({
      query: () => ({
        url: "lots/all",
        method: "GET"
      })
    }),
    getPotentielManagers: builder.mutation({
      query: () => ({
        url: "users/potentiel/manger/list",
        method: "GET"
      })
    }),
    createProject: builder.mutation({
      query: (data) => ({
        url: "projects/add",
        method: "POST",
        data:data
      })
    }),
  })
});

export const {
  useGetProjectListMutation,
  useGenerateProjectCodeMutation,
  useVerifyProjectCodeMutation,
  useGetPhasesMutation,
  useGetLotsMutation,
  useGetPotentielManagersMutation,
  useCreateProjectMutation
} = projectApi;
