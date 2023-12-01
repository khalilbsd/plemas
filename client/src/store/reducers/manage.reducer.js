import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userList: [],
  projectsList: [],
  projectsTaskList: [],

  addProject: {
    existantProjects: [],
    code: "",
    customCode: "",
    phases: [],
    lots: [],
    managers: [],
    linkingProject: false,
    linkedProject: {},
    linkedProjectID: "",
    projectsListFiltered: [],
    isFiltering: false,
    filterType: []
  }
};

const manageSlice = createSlice({
  name: "manage",
  initialState,
  reducers: {
    setUsersList: (state, action) => {
      state.userList = action.payload;
    },
    updateUserInList: (state, action) => {
      const idx = state.userList.findIndex(
        (user) => user.email === action.payload.email
      );
      if (Object.keys(action.payload).includes("ban")) {
        state.userList[idx].isBanned = action.payload.ban;
      }

      if (action.payload.role) {
        state.userList[idx].role = action.payload.role;
      }
    },
    addNewUSerToList: (state, action) => {
      state.userList.push(action.payload);
    },
    setProjectList: (state, action) => {
      state.projectsList = action?.payload.projects;
      state.projectsTaskList = action?.payload.tasks;
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
      state.addProject.linkedProjectID = action.payload;
      if (action.payload) {
        state.addProject.linkedProject = state.projectsList.filter(
          (projet) => projet.id === parseInt(action.payload)
        )[0].projectCustomId;
      }
    },
    filterProjectsList: (state, action) => {
      // const regex = new RegExp(action.payload.value, "i"); // 'i' for case-insensitive search

      // let filterItem  ={
      //   type:action.payload.attribute ,
      //   value :  regex,
      // }
      const isFilteredBy = state.addProject.filterType.filter(
        ({ type }) => type === action.payload.attribute
      )[0];

      if (!isFilteredBy) {
        state.addProject.filterType.push({
          type: action.payload.attribute,
          value: action.payload.value
        });
      } else {
        let indxOfFilter = state.addProject.filterType
          .map(({ type }) => type)
          .indexOf(action.payload.attribute);

        if (indxOfFilter > -1)

          if (state.addProject.filterType[indxOfFilter]?.value !== action.payload.value)
          state.addProject.filterType[indxOfFilter].value = action.payload.value;
      }

      if (!action.payload.value && isFilteredBy) {
        state.addProject.filterType = state.addProject.filterType.filter(
          (elem) => elem.type !== action.payload.attribute
        );
      }

      if (!state.addProject.filterType.length) {
        state.addProject.isFiltering = false;
      } else {
        state.addProject.isFiltering = action.payload.flag;
      }
      if (!state.addProject.isFiltering){
        state.addProject.filterType =[]
      }
      // Now, filter the projects based on the filterType array
      state.addProject.projectsListFiltered = state.projectsList.filter(
        (project) => {
          return state.addProject.filterType.every((filterAttribute) => {
            const nestedProperty = filterAttribute.type.split(".");
            const nestedValue = nestedProperty.reduce(
              (obj, key) => (obj && obj[key] ? obj[key] : null),
              project
            );
            const regex = new RegExp(filterAttribute.value, "i"); // 'i' for case-insensitive search

            return regex.test(nestedValue);
          });
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
  filterProjectsList,
  updateUserInList
} = manageSlice.actions;

export default manageSlice.reducer;
