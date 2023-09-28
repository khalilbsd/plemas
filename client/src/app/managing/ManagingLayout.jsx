import React from 'react'
import { Outlet } from 'react-router'

const ManagingLayout = () => {
  return (
    <div className='managing Layout'>
        <h1>title will be here </h1>
        <div className='app-container'>
            <Outlet/>
        </div>
    </div>
  )
}

export default ManagingLayout