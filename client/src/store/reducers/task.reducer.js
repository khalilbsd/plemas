import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projectTasks: [],
  taskPotentielIntervenants: []
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setProjectTask: (state, action) => {
      state.projectTasks = action.payload;
    },
    clearProjectTasks:(state,action)=>{
      state.projectTasks = []
      state.taskPotentielIntervenants = []
    },
    updateProjectTask: (state, action) => {
      state.projectTasks.push(action.payload);
    },
    setTaskCreationPotentielIntervenants: (state, action) => {
      state.taskPotentielIntervenants = action.payload;
    }
  }
});

export const { setProjectTask, setTaskCreationPotentielIntervenants ,updateProjectTask,clearProjectTasks} =
  taskSlice.actions;

export default taskSlice.reducer;
