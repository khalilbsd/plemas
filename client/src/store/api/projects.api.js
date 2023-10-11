import { api } from "./apiBase";


export const projectApi = api.injectEndpoints({
    endpoints:(builder)=>({
        getProjectList :builder.mutation({
            query:()=>({
                url:'projects/all',
                method:'GET'
            })
        })
    })
})



export const {useGetProjectListMutation} = projectApi