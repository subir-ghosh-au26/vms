import React, { useState, useEffect, useCallback } from 'react';
import { getActivityLog } from '../services/api';
import Pagination from '../components/Pagination';
import './Table.css';
import './Filters.css';

const ActivityLogPage = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        startDate: '',
        endDate: '',
    });
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            const params = { ...filters, page: pagination.page };
            const res = await getActivityLog(params);
            setLogs(res.data.data);
            setPagination({
                page: res.data.page,
                totalPages: res.data.totalPages
            });
        } catch (error) {
            console.error("Failed to fetch activity log", error);
        } finally {
            setLoading(false);
        }
    }, [filters, pagination.page]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Helper to format date and time nicely
    const formatDateTime = (isoString) => {
        if (!isoString) return '---';
        const date = new Date(isoString);
        return date.toLocaleString(); // Adjust formatting as needed
    };

    if (loading) return <p>Loading activity log...</p>;

    return (
        <div>
            <h2>Activity Log</h2>
            <div className="filter-container">
                <input
                    type="text"
                    name="search"
                    placeholder="Search by Vehicle Number..."
                    value={filters.search}
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                />
            </div>

            {loading ? <p>Loading activity log...</p> : (
                <>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Vehicle Number</th>
                                <th>Owner</th>
                                <th>Entry Time</th>
                                <th>Exit Time</th>
                                <th>Entry Gate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map(log => (
                                <tr key={log.id}>
                                    <td>{log.vehicle_number}</td>
                                    <td>{log.owner_name || 'N/A'}</td>
                                    <td>{formatDateTime(log.entry_time)}</td>
                                    <td>{formatDateTime(log.exit_time)}</td>
                                    <td>{log.entry_gate || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default ActivityLogPage;