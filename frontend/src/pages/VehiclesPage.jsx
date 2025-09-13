import React, { useState, useEffect, useCallback } from 'react';
import { getVehicles, getEmployees, getDepartments, createVehicle, updateVehicle, deleteVehicle } from '../services/api';
import VehicleModal from '../components/VehicleModal';
import QRCodeModal from '../components/QRCodeModal';
import Pagination from '../components/Pagination';
import './Table.css';
import './Filters.css';

const VehiclesPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState(null);

    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [selectedVehicleForQr, setSelectedVehicleForQr] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const params = { search: searchTerm, page: pagination.page };
            // Only fetch vehicles when pagination or search changes
            const vehiclesRes = await getVehicles(params);
            setVehicles(vehiclesRes.data.data);
            setPagination({
                page: vehiclesRes.data.page,
                totalPages: vehiclesRes.data.totalPages,
            });

            // Fetch employees and departments only once
            if (employees.length === 0) {
                const [employeesRes, departmentsRes] = await Promise.all([getEmployees(), getDepartments()]);
                setEmployees(employeesRes.data.data); // Assuming these are paginated too now
                setDepartments(departmentsRes.data);
            }
            setError(null);
        } catch (err) {
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    }, [searchTerm, pagination.page]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchData();
        }, 500); // Wait 500ms after user stops typing

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchData]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleAddNew = () => {
        setCurrentVehicle(null);
        setIsModalOpen(true);
    };

    const handleEdit = (vehicle) => {
        setCurrentVehicle(vehicle);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure? This will also delete related activity logs.')) {
            try {
                await deleteVehicle(id);
                fetchData();
            } catch (err) {
                alert('Failed to delete vehicle.');
            }
        }
    };

    const handleModalSubmit = async (formData) => {
        try {
            if (currentVehicle) {
                await updateVehicle(currentVehicle.id, formData);
            } else {
                await createVehicle(formData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert(`Failed to save vehicle: ${err.response?.data?.error || err.message}`);
        }
    };

    const handleViewQr = (vehicle) => {
        setSelectedVehicleForQr(vehicle);
        setIsQrModalOpen(true);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="page-header">
                <h2>Vehicles</h2>
                <button className="btn btn-primary" onClick={handleAddNew}>Add New Vehicle</button>
            </div>
            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Search by Vehicle No. or Model..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? <p>Loading...</p> : (
                <>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Vehicle Number</th>
                                <th>Model</th>
                                <th>Type</th>
                                <th>Assigned To</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map(v => (
                                <tr key={v.id}>
                                    <td>{v.vehicle_number}</td>
                                    <td>{v.model}</td>
                                    <td>{v.type}</td>
                                    <td>{v.owner_name || v.department_name || 'N/A'}</td>
                                    <td>{v.status}</td>
                                    <td>
                                        <button className="btn" onClick={() => handleViewQr(v)}>View QR</button>
                                        <button className="btn" onClick={() => handleEdit(v)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(v.id)}>Delete</button>
                                    </td>
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
            <VehicleModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={currentVehicle}
                employees={employees}
                departments={departments}
            />
            <QRCodeModal
                isOpen={isQrModalOpen}
                onClose={() => setIsQrModalOpen(false)}
                vehicle={selectedVehicleForQr}
            />
        </div>
    );
};

export default VehiclesPage;