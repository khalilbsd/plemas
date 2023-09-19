import {configureStore} from '@reduxjs/toolkit'
import authReducer from './reducers/auth'
import { api } from './api/apiBase'
export const store = configureStore({
    reducer:{
        [api.reducerPath]:api.reducer,
        auth:authReducer
    },
    // middleware:(getDefaultMiddleware) => getDefaultMiddleware(),
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
    devTools:true
})

