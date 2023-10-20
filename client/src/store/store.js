import {configureStore} from '@reduxjs/toolkit'
import authReducer from './reducers/auth'
import userReducer from './reducers/user.reducer'
import { api } from './api/apiBase'
import manageReducer from './reducers/manage.reducer'
import projectReducer from './reducers/project.reducer'
export const store = configureStore({
    reducer:{
        [api.reducerPath]:api.reducer,
        auth:authReducer,
        userInfo:userReducer,
        manage:manageReducer,
        project:projectReducer
    },
    // middleware:(getDefaultMiddleware) => getDefaultMiddleware(),
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
    devTools:true
})

