import React, { useState, useEffect, useCallback } from 'react';
import { getEmployees, getDepartments, createEmployee, updateEmployee, deleteEmployee } from '../services/api';
import EmployeeModal from '../components/EmployeeModal';
import Pagination from '../components/Pagination';
import './Table.css';
import './Filters.css';

const EmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const params = { search: searchTerm, page: pagination.page };
            const [employeesRes, departmentsRes] = await Promise.all([
                getEmployees(params),
                getDepartments() // Assuming departments list is small and not paginated
            ]);
            setEmployees(employeesRes.data.data);
            setPagination({
                page: employeesRes.data.page,
                totalPages: employeesRes.data.totalPages,
            });
            setDepartments(departmentsRes.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, pagination.page]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchData();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchData]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleAddNew = () => {
        setCurrentEmployee(null);
        setIsModalOpen(true);
    };

    const handleEdit = (employee) => {
        setCurrentEmployee(employee);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await deleteEmployee(id);
                fetchData(); // Refresh data
            } catch (err) {
                alert('Failed to delete employee.');
            }
        }
    };

    const handleModalSubmit = async (formData) => {
        try {
            if (currentEmployee) {
                await updateEmployee(currentEmployee.id, formData);
            } else {
                await createEmployee(formData);
            }
            setIsModalOpen(false);
            fetchData(); // Refresh data
        } catch (err) {
            alert('Failed to save employee.');
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div className="page-header">
                <h2>Employees</h2>
                <button className="btn btn-primary" onClick={handleAddNew}>Add New Employee</button>
            </div>
            <div className="filter-container">
                <input
                    type="text"
                    placeholder="Search by Name or Employee ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? <p>Loading...</p> : (
                <>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Employee ID</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map(emp => (
                                <tr key={emp.id}>
                                    <td>{emp.name}</td>
                                    <td>{emp.employee_id_str}</td>
                                    <td>{emp.department_name}</td>
                                    <td>
                                        <button className="btn" onClick={() => handleEdit(emp)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(emp.id)}>Delete</button>
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
            <EmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={currentEmployee}
                departments={departments}
            />
        </div>
    );
};

export default EmployeesPage;