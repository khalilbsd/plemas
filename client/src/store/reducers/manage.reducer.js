import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userList: [],
  projectsList: [],

  addProject: {
    existantProjects: [],
    code: "",
    customCode: "",
    phases: [],
    lots: [],
    managers: [],
    linkingProject: false,
    linkedProject: {},
    linkedProjectID:"",
    projectsListFiltered: [],
    isFiltering: false
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
      if (action.payload.validCode) {
        state.addProject.code = action.payload.validCode;
        state.addProject.customCode = action.payload.validCode;
      }
      if (action.payload.existantProjects) {
        state.addProject.existantProjects = action.payload.existantProjects;
      }
    },

    setPhases: (state, action) => {
      state.addProject.phases = action.payload;
    },
    setLot: (state, action) => {
      state.addProject.lots = action.payload.filter((elem) => elem.name);

      // state.addProject.lots = action.payload
    },
    setPotentielManagers: (state, action) => {
      state.addProject.managers = action.payload;
    },
    setLinkingProject: (state, action) => {
      state.addProject.linkingProject = action.payload;
    },
    setLinkedProject: (state, action) => {

      state.addProject.linkedProjectID =action.payload
      state.addProject.linkedProject = state.projectsList.filter(projet=>projet.id == action.payload)[0].projectCustomId

    },
    filterProjectsList: (state, action) => {
      if (action.payload.flag) {
        state.addProject.isFiltering = action.payload.flag;
      }
      const regex = new RegExp(action.payload.value, 'i'); // 'i' for case-insensitive search

      state.addProject.projectsListFiltered = state.projectsList.filter(
        (project) => {
          return regex.test(project.projectCustomId);
        }
      );
    },
    setIsFiltering: (state, action) => {
      state.addProject.isFiltering = action.payload;
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
  setPhases,
  setLot,
  clearAddProjectState,
  setPotentielManagers,
  setLinkingProject,
  setLinkedProject,
  filterProjectsList
} = manageSlice.actions;

export default manageSlice.reducer;
