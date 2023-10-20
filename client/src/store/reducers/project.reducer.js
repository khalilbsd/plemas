import { createSlice } from "@reduxjs/toolkit";

const  initialState ={
    projectDetails:{}
}


const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers:{
    setProject:(state,action) =>{

        state.projectDetails= action.payload
    }
  }
});


export const {
    setProject
}=projectSlice.actions

export default projectSlice.reducer;