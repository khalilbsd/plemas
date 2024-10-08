import {configureStore} from '@reduxjs/toolkit'
import authReducer from './reducers/auth'
import userReducer from './reducers/user.reducer'
import { api } from './api/apiBase'
import manageReducer from './reducers/manage.reducer'
import projectReducer from './reducers/project.reducer'
import taskReducer from './reducers/task.reducer'
import sideBarReducer from './reducers/sidebar.reducer'
import thirdPartyProviderReducer from './reducers/thirdPartyProviders.reducer'
export const store = configureStore({
    reducer:{
        [api.reducerPath]:api.reducer,
        auth:authReducer,
        userInfo:userReducer,
        manage:manageReducer,
        project:projectReducer,
        task:taskReducer,
        sidebar:sideBarReducer,
        thirdPartyProviders:thirdPartyProviderReducer
    },
    // middleware:(getDefaultMiddleware) => getDefaultMiddleware(),
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
    devTools:true
})

