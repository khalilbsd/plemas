import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const initialState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
     try {
      console.log(state);
      state.user = action.payload?.user;
      localStorage.setItem("user", JSON.stringify(action.payload?.user));
      //setting the token in the cookies
      cookies.set("session_token",(action.payload?.token)?.split('Bearer ')[1],{
        path: "/",
        domain: process.env.REACT_APP_DOMAIN,
        maxAge:172800,

      });
      console.log(cookies);
      console.log("cookie is set for domain",process.env.REACT_APP_DOMAIN);
     } catch (error) {
      console.log(error);
     }

    },
    logout: (state, action) => {
      state.user = null;
      localStorage.removeItem("user");
      cookies.remove("session_token");
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
