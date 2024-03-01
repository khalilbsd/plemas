import { createSlice } from "@reduxjs/toolkit";
import { DAILY_HOURS_VALUE } from "../../constants/constants";

const initialState = {
  projectTasks: [],
  taskPotentielIntervenants: [],
  // userDailyTasks:[],
  userPotentialTasks: [],
  userGeneralTasks: [],
  dailyLogDevisions: {
    tasks: {},
    projects: {},
  },
  dailyProjectManager: [],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setProjectTask: (state, action) => {
      state.projectTasks = action.payload;
    },
    clearProjectTasks: (state, action) => {
      state.projectTasks = [];
      state.taskPotentielIntervenants = [];
    },
    updateProjectTask: (state, action) => {
      state.projectTasks.push(action.payload);
    },
    setTaskCreationPotentielIntervenants: (state, action) => {
      state.taskPotentielIntervenants = action.payload;
    },
    setUserDailyTasks: (state, action) => {
      state.userGeneralTasks = action.payload.allTasks;
      state.userPotentialTasks = action.payload.joinableTasks;
      // set the initial value of the dailyLog devision
      state.dailyProjectManager = action.payload.dailyProjectManager;
      // state.dailyLogDevisions.projects = action.payload.managedProjectHours;

      // we need to check if the user has submitted somehours today or not

      const nbOfEntries =
        action.payload.allTasks.length +
        action.payload.dailyProjectManager.length;

      //sum of total hours between tasks and projects
      const sumTasksHours = action.payload.allTasks.reduce(
        (accumulator, currentValue) => {
          return accumulator + currentValue.nbHours;
        },
        0
      );
      const sumProjectHours = Object.values(
        action.payload.managedProjectHours
      ).reduce((hours, projectHours) => {
        return hours + projectHours;
      }, 0);

      const hours = sumTasksHours + sumProjectHours;

      let empty = true;
      if (hours > 0) {
        empty = false;
      }
      action.payload.allTasks.forEach((task) => {
        let objTVal = {
          value: !empty ? task.nbHours * 60 : DAILY_HOURS_VALUE / nbOfEntries,
          changed: !empty ? true : false,
          projectID: task.projectID,
          taskID: task.taskID,
        };
        state.dailyLogDevisions.tasks[task.id] = objTVal;
      });
      Object.keys(action.payload.managedProjectHours).forEach((key) => {
        let objTVal = {
          value: !empty
            ? action.payload.managedProjectHours[key] * 60
            : DAILY_HOURS_VALUE / nbOfEntries,
          changed: !empty ? true : false,
          projectID: key,
        };

        state.dailyLogDevisions.projects[key] = objTVal;
      });
    },
    updateDailyHours: (state, action) => {
      //extraction of data from payload
      const { id, type, percent } = action.payload;

      const hours = Math.round((percent * DAILY_HOURS_VALUE) / 100);
      //  first i need to calcule the rest
      //first i need to  mark out one i changed
      // return
      let taskKeys = [];
      let projectKeys = [];
      if (type === "tasks") {
        taskKeys = Object.keys(state.dailyLogDevisions.tasks).filter(
          (key) => parseInt(key) !== id
        );
      } else {
        taskKeys = Object.keys(state.dailyLogDevisions.tasks);
      }
      if (type === "projects") {
        projectKeys = Object.keys(state.dailyLogDevisions.projects).filter(
          (key) => parseInt(key) !== id
        );
      } else {
        projectKeys = Object.keys(state.dailyLogDevisions.projects);
      }

      // total of changed values meaining that i'm searching for the list of projects or tasks that have been changed to be  bale to calcule the rest
      let projectsTotalChangedValues = 0;
      let tasksTotalChangedValues = 0;

      projectKeys.forEach((key) => {
        if (state.dailyLogDevisions.projects[key].changed) {
          projectsTotalChangedValues +=
            state.dailyLogDevisions.projects[key].value;
        }
      });
      taskKeys.forEach((key) => {
        if (state.dailyLogDevisions.tasks[key].changed) {
          tasksTotalChangedValues += state.dailyLogDevisions.tasks[key].value;
        }
      });
      // calculating rest
      let rest =
        DAILY_HOURS_VALUE -
        (hours + projectsTotalChangedValues + tasksTotalChangedValues);
      //console.log(rest ,"my hours ",hours," prject chanegd ",projectsTotalChangedValues," tasksTotalChangedValues ",tasksTotalChangedValues);
      let flagZero = false
      if (rest <= 0) {
      //   state.dailyLogDevisions[type][id].changed = hours > 0 ? true : false;
      // state.dailyLogDevisions[type][id].value = hours;
      flagZero = true
      }else{
        flagZero = false
      }

      const nbOfEntries = projectKeys.length + taskKeys.length; // one them doens't contain the selected line
      // let negativeRest = 0;
      taskKeys
        .filter((key) => !state.dailyLogDevisions.tasks[key].changed)
        .forEach((key) => {

          state.dailyLogDevisions.tasks[key].value =flagZero ? 0 : Math.round(
            rest / nbOfEntries
          );
        });
      projectKeys
        .filter((key) => !state.dailyLogDevisions.projects[key].changed)
        .forEach((key) => {
          state.dailyLogDevisions.projects[key].value = flagZero ? 0  :Math.round(
            rest / nbOfEntries
          );
        });
      state.dailyLogDevisions[type][id].changed = hours > 0 ? true : false;
      state.dailyLogDevisions[type][id].value = flagZero ?  hours + rest : hours;
    },

    hideDailyTask: (state, action) => {
      const task = state.userGeneralTasks.filter(
        (task) => task.id === action.payload.id
      )[0];

      state.userGeneralTasks = state.userGeneralTasks.filter(
        (task) => task.id !== action.payload.id
      );
      state.userPotentialTasks.push(task);

      const taskLength = Object.keys(state.dailyLogDevisions.tasks).length;
      // const projectLength = Object.keys(
      //   state.dailyLogDevisions.projects
      // ).length;
      const projectLength = state.dailyProjectManager.length;
      const nbOfEntries = projectLength + taskLength;
      // const portion =
      //   DAILY_HOURS_VALUE / (nbOfEntries - 1) - DAILY_HOURS_VALUE / nbOfEntries;
      const portion = DAILY_HOURS_VALUE / nbOfEntries;
      delete state.dailyLogDevisions.tasks[action.payload.id];
      Object.keys(state.dailyLogDevisions.tasks).map(
        (key) =>
          (state.dailyLogDevisions.tasks[key].value = Math.floor(portion))
      );
      Object.keys(state.dailyLogDevisions.projects).map(
        (key) =>
          (state.dailyLogDevisions.projects[key].value = Math.floor(portion))
      );
    },

    hideDailyProject: (state, action) => {
      state.dailyProjectManager = state.dailyProjectManager.filter(
        (p) => p.id !== action.payload.id
      );

      const taskLength = Object.keys(state.dailyLogDevisions.tasks).length;
      // const projectLength = Object.keys(
      //   state.dailyLogDevisions.projects
      // ).length;
      const projectLength = state.dailyProjectManager.length;

      const nbOfEntries = projectLength + taskLength;
      // const portion =
      //   DAILY_HOURS_VALUE / nbOfEntries - DAILY_HOURS_VALUE / nbOfEntries;
      const portion = DAILY_HOURS_VALUE / nbOfEntries;

      delete state.dailyLogDevisions.projects[action.payload.id];

      Object.keys(state.dailyLogDevisions.tasks).map(
        (key) =>
          (state.dailyLogDevisions.tasks[key].value = Math.floor(portion))
      );
      Object.keys(state.dailyLogDevisions.projects).map(
        (key) =>
          (state.dailyLogDevisions.projects[key].value = Math.floor(portion))
      );
    },

    updateUserPotentialTasks: (state, action) => {
      const task = state.userPotentialTasks.filter(
        (t) => t.taskID === action.payload
      );

      state.userGeneralTasks.push(task[0]);
      state.userPotentialTasks = state.userPotentialTasks.filter(
        (t) => t.taskID !== action.payload
      );
    },
    updateUserGeneralTasksHours: (state, action) => {
      state.userGeneralTasks = state.userGeneralTasks.map((task) => {
        if (task.id === action.payload.id) {
          task.nbHours = action.payload.hours;
        }
        return task;
      });
    },
    updateSpecificTaskAttribute: (state, action) => {
      const taskIdx = state.projectTasks
        .map((task) => task.id)
        .indexOf(parseInt(action.payload.taskID));

      state.projectTasks[taskIdx][action.payload.attribute] =
        action.payload.value;
    },
    updateInterventionUploadedFile: (state, action) => {
      const taskIdx = state.projectTasks
        .map((task) => task.id)
        .indexOf(parseInt(action.payload.taskID));

      const intervIdx = state.projectTasks[taskIdx].intervenants
        .map((interv) => interv.id)
        .indexOf(action.payload.intervenantID);

      let obj = JSON.parse(
        state.projectTasks[taskIdx].intervenants[intervIdx].file
      );
      if (action.payload.upload) {
        obj.push(action.payload.file);
      } else {
        obj = obj.filter((file) => file !== action.payload.file);
      }
      state.projectTasks[taskIdx].intervenants[intervIdx].file =
        JSON.stringify(obj);
    },
    // setUserPotentialTasks: (state, action) => {
    // }
  },
});

export const {
  setProjectTask,
  setTaskCreationPotentielIntervenants,
  updateProjectTask,
  clearProjectTasks,
  setUserDailyTasks,
  updateUserGeneralTasksHours,
  updateUserPotentialTasks,
  updateSpecificTaskAttribute,
  updateInterventionUploadedFile,
  updateDailyHours,
  hideDailyTask,
  hideDailyProject,

  // setUserGeneralTasks,
  // setUserPotentialTasks
} = taskSlice.actions;

export default taskSlice.reducer;
