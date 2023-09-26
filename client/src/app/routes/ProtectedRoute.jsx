


import React from 'react'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoute = ({user,redirectPath='/login',children}) => {

    if (!user?.isAuthenticated)
        return <Navigate to={redirectPath} replace />
    return children?children:<Outlet/>
}

export default ProtectedRoute