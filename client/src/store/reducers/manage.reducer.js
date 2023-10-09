import { createSlice } from "@reduxjs/toolkit";

const initialState = {

  userList:[],
};

const manageSlice = createSlice({
  name: "manage",
  initialState,
  reducers: {

    setUsersList:(state,action) =>{
      state.userList=action.payload
    },
    addNewUSerToList:(state,action)=>{

      state.userList.push(action.payload)
    }
  }
});

export const { setUsersList,addNewUSerToList } = manageSlice.actions;

export default manageSlice.reducer;
