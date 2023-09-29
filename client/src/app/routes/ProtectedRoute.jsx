


import React from 'react'
import { Navigate, Outlet } from 'react-router'
import Loading from '../Components/loading/Loading'
import useGetAuthenticatedUser from '../../hooks/authenticated';

const ProtectedRoute = ({redirectPath='/login',children}) => {

    const user = useGetAuthenticatedUser()
    console.log("user loading",user);

    if (user.loading) return <Loading/>

    if (!user?.isAuthenticated){
        console.log("gettinnggg out because user is not  auth",user.isAuthenticated);
        return <Navigate to={redirectPath} replace />
    }

    return children?children:<Outlet/>
}

export default ProtectedRoute