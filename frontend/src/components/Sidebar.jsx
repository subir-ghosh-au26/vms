import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>VMS Admin</h2>
            <nav>
                <ul>
                    <li><Link to="/">Dashboard</Link></li>
                    <li><Link to="/departments">Departments</Link></li>
                    <li><Link to="/employees">Employees</Link></li>
                    <li><Link to="/vehicles">Vehicles</Link></li>
                    <li><Link to="/activity-log">Activity Log</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;