


import React from 'react'
import { Navigate, Outlet } from 'react-router'

const ProtectedRoute = ({user,redirectPath='/login'}) => {
    if (!user?.isAuthenticated)
        return <Navigate to={redirectPath} replace />
    return <Outlet/>
}

export default ProtectedRoute