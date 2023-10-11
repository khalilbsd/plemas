import {configureStore} from '@reduxjs/toolkit'
import authReducer from './reducers/auth'
import userReducer from './reducers/user.reducer'
import { api } from './api/apiBase'
import manageReducer from './reducers/manage.reducer'
export const store = configureStore({
    reducer:{
        [api.reducerPath]:api.reducer,
        auth:authReducer,
        userInfo:userReducer,
        manage:manageReducer,
    },
    // middleware:(getDefaultMiddleware) => getDefaultMiddleware(),
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
    devTools:true
})

