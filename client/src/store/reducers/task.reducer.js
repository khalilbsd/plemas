import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectTasks: [],
  taskPotentielIntervenants: [],
  // userDailyTasks:[],
  userDailyTasks: [],
  userPotentialTasks: [],
  userGeneralTasks: []
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
      state.userDailyTasks = action.payload.todaysTasks;
      state.userPotentialTasks = action.payload.joinableTasks;
    },
    updateUserDailyTasksHours: (state, action) => {
      state.userDailyTasks = state.userDailyTasks.map(task=>{
          if (task.id === action.payload.id) {
            task.nbHours = action.payload.hours
          }
        return task
      })

    },
    // setUserPotentialTasks: (state, action) => {
    // }
  }
});

export const {
  setProjectTask,
  setTaskCreationPotentielIntervenants,
  updateProjectTask,
  clearProjectTasks,
  setUserDailyTasks,
  updateUserDailyTasksHours
  // setUserGeneralTasks,
  // setUserPotentialTasks

} = taskSlice.actions;

export default taskSlice.reducer;
