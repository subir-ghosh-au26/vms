import React, { useState, useEffect } from 'react';
import './Modal.css';

const EmployeeModal = ({ isOpen, onClose, onSubmit, initialData, departments }) => {
    const [name, setName] = useState('');
    const [employeeIdStr, setEmployeeIdStr] = useState('');
    const [departmentId, setDepartmentId] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.name || '');
                setEmployeeIdStr(initialData.employee_id_str || '');
                // Find the corresponding department ID for the initial data
                const dept = departments.find(d => d.name === initialData.department_name);
                setDepartmentId(dept ? dept.id : '');
            } else {
                // Reset form for new entry
                setName('');
                setEmployeeIdStr('');
                setDepartmentId(departments.length > 0 ? departments[0].id : ''); // Default to the first department
            }
        }
    }, [initialData, isOpen, departments]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, employee_id_str: employeeIdStr, department_id: parseInt(departmentId) });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialData ? 'Edit Employee' : 'Add New Employee'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="employeeName">Full Name</label>
                        <input id="employeeName" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="employeeId">Employee ID</label>
                        <input id="employeeId" type="text" value={employeeIdStr} onChange={(e) => setEmployeeIdStr(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="department">Department</label>
                        <select id="department" value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} required>
                            <option value="" disabled>Select a department</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">Save</button>
                        <button type="button" className="btn" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModal;