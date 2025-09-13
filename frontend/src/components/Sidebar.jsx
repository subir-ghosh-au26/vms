import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('vms_token');
        localStorage.removeItem('vms_user');
        navigate('/login');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>VMS Admin</h2>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li><Link to="/">Dashboard</Link></li>
                    <li><Link to="/departments">Departments</Link></li>
                    <li><Link to="/employees">Employees</Link></li>
                    <li><Link to="/vehicles">Vehicles</Link></li>
                    <li><Link to="/activity-log">Activity Log</Link></li>
                </ul>
            </nav>
            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
        </div>
    );
};

export default Sidebar;