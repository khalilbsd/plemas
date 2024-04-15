import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    providersList:[]
}

const thirdPartyProvidersSlice = createSlice({
  name: "thirdPartyProviders",
  initialState,
  reducers: {
    setTPPList: (state, action) => {

      state.providersList = action?.payload;

    },

  }
});

export const {setTPPList} = thirdPartyProvidersSlice.actions;

export default thirdPartyProvidersSlice.reducer;
