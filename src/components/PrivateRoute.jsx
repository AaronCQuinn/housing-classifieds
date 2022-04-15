import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UseAuthStatus } from '../hooks/UseAuthStatus'
import Spinner from '../components/Spinner'

const PrivateRoute = () => {
    const { loading, loggedIn } = UseAuthStatus();

    if (loading) {
        return <Spinner />
    }

    return (
        loggedIn ? <Outlet /> : <Navigate to='/sign-in' />
    )
}

export default PrivateRoute