import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectDetails: {},
  projectRequest: [],
  edit: false,
  twoWeeksList: []
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
    setTwoWeeksDatesList: (state, action) => {
      state.twoWeeksList = action.payload;
    },
    setProjectRequests: (state, action) => {
      state.projectRequest = action.payload;
    },
    updateRequestList: (state, action) => {
      state.projectRequest.push(action.payload);
    },
    removeRequestFromList:(state,action)=>{
      state.projectRequest = state.projectRequest.filter(request => request.id !== action.payload)
    }
  }
});

export const {
  setProject,
  setEditProject,
  setProjectPriority,
  setTwoWeeksDatesList,
  setProjectRequests,
  updateRequestList,
  removeRequestFromList
} = projectSlice.actions;

export default projectSlice.reducer;
