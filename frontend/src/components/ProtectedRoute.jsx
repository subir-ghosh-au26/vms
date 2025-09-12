import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('vms_token');
    const user = JSON.parse(localStorage.getItem('vms_user'));

    // Check for token AND if user has ADMIN role
    if (!token || user?.role !== 'ADMIN') {
        // User not logged in or not an admin, redirect to login page
        return <Navigate to="/login" />;
    }

    // User is logged in and is an admin, render the child component
    return children;
};

export default ProtectedRoute;