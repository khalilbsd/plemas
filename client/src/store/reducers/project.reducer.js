import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectDetails: {},
  edit: false,
  twoWeeksList :[]
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setProject: (state, action) => {
      state.projectDetails = action.payload;
    },
    setEditProject: (state, action) => {
      state.edit = action.payload;
    },
    setProjectPriority: (state, action) => {
      state.projectDetails.priority = action.payload;
    },
    setTwoWeeksDatesList:(state,action)=>{
      state.twoWeeksList = action.payload
    }
  }
});

export const { setProject, setEditProject, setProjectPriority,setTwoWeeksDatesList } =
  projectSlice.actions;

export default projectSlice.reducer;
