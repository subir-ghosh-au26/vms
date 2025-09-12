import React, { useState, useEffect } from 'react';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../services/api';
import DepartmentModal from '../components/DepartmentModal';
import './Table.css';

const DepartmentsPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDepartment, setCurrentDepartment] = useState(null);

    // Function to fetch data, which we can call again after any change
    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await getDepartments();
            setDepartments(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch departments.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleAddNew = () => {
        setCurrentDepartment(null); // Clear any existing data
        setIsModalOpen(true);
    };

    const handleEdit = (department) => {
        setCurrentDepartment(department);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await deleteDepartment(id);
                fetchDepartments(); // Refresh the list
            } catch (err) {
                alert('Failed to delete department.');
                console.error(err);
            }
        }
    };

    const handleModalSubmit = async (formData) => {
        try {
            if (currentDepartment) {
                // This is an update
                await updateDepartment(currentDepartment.id, formData);
            } else {
                // This is a create
                await createDepartment(formData);
            }
            setIsModalOpen(false);
            fetchDepartments(); // Refresh the list
        } catch (err) {
            alert('Failed to save department.');
            console.error(err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="page-header">
                <h2>Departments</h2>
                <button className="btn btn-primary" onClick={handleAddNew}>Add New Department</button>
            </div>

            <table className="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.map(dept => (
                        <tr key={dept.id}>
                            <td>{dept.name}</td>
                            <td>
                                <button className="btn" onClick={() => handleEdit(dept)}>Edit</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(dept.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <DepartmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={currentDepartment}
            />
        </div>
    );
};

export default DepartmentsPage;