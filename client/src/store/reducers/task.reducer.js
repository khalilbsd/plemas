import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectTasks: [],
  taskPotentielIntervenants: [],
  // userDailyTasks:[],
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

      state.userPotentialTasks = action.payload.joinableTasks;
    },
    updateUserPotentialTasks:(state,action)=>{

      const task = state.userPotentialTasks.filter(t=>t.taskID === action.payload)


      state.userGeneralTasks.push(task[0])
      state.userPotentialTasks= state.userPotentialTasks.filter(t=>t.taskID !== action.payload)
    },
    updateUserGeneralTasksHours: (state, action) => {
      state.userGeneralTasks = state.userGeneralTasks.map(task=>{
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
  updateUserGeneralTasksHours,
  updateUserPotentialTasks
  // setUserGeneralTasks,
  // setUserPotentialTasks

} = taskSlice.actions;

export default taskSlice.reducer;
