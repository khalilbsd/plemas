import {createSlice} from '@reduxjs/toolkit'


const initialState ={
    hide:false
}



const sideBarSlice = createSlice({
    name:'sidebar',
    initialState,
    reducers:{
        toggleSideBar :(state,action)=>{
            state.hide = action.payload
        }
    }
})


export const {toggleSideBar} = sideBarSlice.actions

export default sideBarSlice.reducer