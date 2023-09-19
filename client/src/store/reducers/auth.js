import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null
};

 const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{
    setCredentials:(state,action)=>{

        state.user = action.payload?.user;
        localStorage.setItem('user',JSON.stringify(action.payload?.user))
        localStorage.setItem('session_token',(action.payload?.token)?.split('Bearer')[1])

    },
    logout:(state,action)=>{
        state.user = null
        localStorage.removeItem('user')
        localStorage.removeItem('session_token')
    },
  }
});


export const {setCredentials,logout,userLogin} = authSlice.actions

export default authSlice.reducer
