import React from 'react'
import { Outlet } from 'react-router-dom'

const DashboardLayoutWraper = () => {
    return (
        <>
            <div>Dashboard Header</div>
            
            <Outlet />
            
            <div>Dashboard Footer</div>
        </>
    )
}

export default DashboardLayoutWraper