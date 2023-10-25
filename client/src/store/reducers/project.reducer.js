import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectDetails: {},
  edit: false
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
    }
  }
});

export const { setProject, setEditProject, setProjectPriority } =
  projectSlice.actions;

export default projectSlice.reducer;
