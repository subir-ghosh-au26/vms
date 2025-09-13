import React, { useState, useEffect } from 'react';
import { getStats, getDepartmentEntryStats } from '../services/api';
import StatCard from '../components/StatCard';
import DepartmentBarChart from '../components/DepartmentBarChart';
import '../components/Chart.css';
import './DashboardPage.css';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        vehiclesInside: 0,
        todaysEntries: 0,
        todaysExits: 0,
    });
    const [departmentData, setDepartmentData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                // Fetch both sets of data in parallel
                const [statsRes, departmentRes] = await Promise.all([
                    getStats(),
                    getDepartmentEntryStats()
                ]);
                setStats(statsRes.data);
                setDepartmentData(departmentRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, []);

    if (loading) return <p>Loading stats...</p>;

    return (
        <div>
            <h2>Dashboard</h2>

            {loading ? <p>Loading dashboard...</p> : (
                <>
                    <div className="stats-container">
                        <StatCard title="Vehicles Currently Inside" value={stats.vehiclesInside} />
                        <StatCard title="Today's Entries" value={stats.todaysEntries} />
                        <StatCard title="Today's Exits" value={stats.todaysExits} />
                    </div>

                    {/* Add the bar chart component below the stat cards */}
                    <div className="chart-wrapper">
                        <DepartmentBarChart chartData={departmentData} />
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardPage;