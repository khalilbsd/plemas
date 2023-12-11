import { createSlice } from "@reduxjs/toolkit";

const filtersInit = [
  { type: "manager.fullName", active: false },
  { type: "lots", active: false },
  { type: "phase", active: false },
  { type: "state", active: false },
  { type: "taskState", active: false }
];

const initialState = {
  userList: [],
  projectsList: [],
  projectsTaskList: [],
  projectsTaskListFiltered: [],

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
  },
  filters: filtersInit,
  projectsTaskFilters: [],
  projectsTaskFiltersDates: {
    start:"",
    end:"",
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
    setProjectTaskListFiltered: (state, action) => {

      state.projectsTaskListFiltered = action?.payload;
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

    // to do the filter
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
          if (
            state.addProject.filterType[indxOfFilter]?.value !==
            action.payload.value
          )
            state.addProject.filterType[indxOfFilter].value =
              action.payload.value;
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
      if (!state.addProject.isFiltering) {
        state.addProject.filterType = [];
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

    // remove filter from  list
    undoFilterType: (state, action) => {
      state.addProject.filterType = state.addProject.filterType.filter(
        (ft) => ft.type !== action.payload
      );
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
    // to disable the filtering
    setIsFiltering: (state, action) => {
      state.addProject.isFiltering = action.payload;
    },

    // to enable the filtering just display
    showFilterForType: (state, action) => {
      state.filters = state.filters.map((ft) => {
        if (ft.type === action.payload) {
          ft.active = true;
        } else {
          ft.active = false;
        }
        return ft;
      });
    },
    hideFilterForType: (state, action) => {
      state.filters = state.filters.map((ft) => {
        ft.active = false;
        return ft;
      });
    },
    filterByTaskStatus: (state, action) => {
      if (!state.projectsTaskFilters.includes(action.payload)) {
        state.projectsTaskFilters.push(action.payload);
      }
    },
    popTaskStateFromFilter: (state, action) => {
      state.projectsTaskFilters = state.projectsTaskFilters.filter(
        (filter) => filter !== action.payload
      );
    },
    setProjectTasksDateFilter:(state,action)=>{

      state.projectsTaskFiltersDates.start = action.payload.start
      state.projectsTaskFiltersDates.end = action.payload.end
    },
    clearProjectTasksDateFilter:(state,action)=>{
      state.projectsTaskFiltersDates.start = null
      state.projectsTaskFiltersDates.end = null
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
  updateUserInList,
  showFilterForType,
  hideFilterForType,
  undoFilterType,
  filterByTaskStatus,
  popTaskStateFromFilter,
  setProjectTaskListFiltered,
  setProjectTasksDateFilter,
clearProjectTasksDateFilter
} = manageSlice.actions;

export default manageSlice.reducer;
