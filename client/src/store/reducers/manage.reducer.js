import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userList: [],
  projectsList: [],
  addProject: {
    code: undefined,
    customCode: undefined,
    phases: [],
    lots: [],
    managers: []
  }
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
    },
    clearAddProjectState: (state, action) => {
      state.addProject = initialState.addProject;
    },
    setAddProjectCode: (state, action) => {
      state.addProject.code = action.payload;
    },
    setAddProjectCodeOriginal: (state, action) => {
      state.addProject.customCode = action.payload;
    },
    setPhases: (state, action) => {
      state.addProject.phases = action.payload;
    },
    setLot: (state, action) => {
      action.payload.forEach((element) => {
        state.addProject.lots.push(element.name);
      });
      // state.addProject.lots = action.payload
    },
    setPotentielManagers: (state, action) => {
      state.addProject.managers = action.payload;
    }
  }
});

export const {
  setUsersList,
  addNewUSerToList,
  clearManageList,
  setProjectList,
  updateProjectList,
  setAddProjectCode,
  setAddProjectCodeOriginal,
  setPhases,
  setLot,
  clearAddProjectState,
  setPotentielManagers
} = manageSlice.actions;

export default manageSlice.reducer;
