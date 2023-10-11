import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userList: [],
  projectsList: []
};

const manageSlice = createSlice({
  name: "manage",
  initialState,
  reducers: {
    setUsersList: (state, action) => {
      state.userList = action.payload;
    },
    addNewUSerToList: (state, action) => {
      state.userList.push(action.payload);
    },
    setProjectList: (state, action) => {
      state.projectsList = action?.payload;
    },
    updateProjectList: (state, action) => {
      state.projectsList.push(action.payload);
    },
    clearManageList: (state, action) => {
      state = initialState;
    }
  }
});

export const {
  setUsersList,
  addNewUSerToList,
  clearManageList,
  setProjectList,
  updateProjectList
} = manageSlice.actions;

export default manageSlice.reducer;
