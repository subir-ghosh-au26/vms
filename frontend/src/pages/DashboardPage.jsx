import React, { useState, useEffect } from 'react';
import { getStats } from '../services/api';
import StatCard from '../components/StatCard';
import './DashboardPage.css';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        vehiclesInside: 0,
        todaysEntries: 0,
        todaysExits: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await getStats();
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <p>Loading stats...</p>;

    return (
        <div>
            <h2>Dashboard</h2>
            <div className="stats-container">
                <StatCard title="Vehicles Currently Inside" value={stats.vehiclesInside} />
                <StatCard title="Today's Entries" value={stats.todaysEntries} />
                <StatCard title="Today's Exits" value={stats.todaysExits} />
            </div>
        </div>
    );
};

export default DashboardPage;