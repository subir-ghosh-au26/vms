import React, { useState, useEffect } from 'react';
import './Modal.css';

const VehicleModal = ({ isOpen, onClose, onSubmit, initialData, employees, departments }) => {
    // Form state
    const [type, setType] = useState('CAR');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [model, setModel] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [status, setStatus] = useState('ACTIVE');

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // Populate form for editing
                setType(initialData.type || 'CAR');
                setVehicleNumber(initialData.vehicle_number || '');
                setModel(initialData.model || '');
                setOwnerId(initialData.owner_id || '');
                setDepartmentId(initialData.department_id || '');
                setStatus(initialData.status || 'ACTIVE');
            } else {
                // Reset form for new entry
                setType('CAR');
                setVehicleNumber('');
                setModel('');
                setOwnerId('');
                setDepartmentId('');
                setStatus('ACTIVE');
            }
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const vehicleData = {
            vehicle_number: vehicleNumber,
            model,
            type,
            status,
            // Only include owner/department if they are relevant for the selected type
            owner_id: type === 'DEPT_CAR' ? null : parseInt(ownerId) || null,
            department_id: type === 'DEPT_CAR' ? parseInt(departmentId) || null : null,
        };
        onSubmit(vehicleData);
    };

    const vehicleTypes = ['CAR', 'BIKE', 'DEPT_CAR'];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialData ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Vehicle Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} required>
                            {vehicleTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Vehicle Number</label>
                        <input type="text" value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Model</label>
                        <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
                    </div>

                    {/* Conditional Fields based on Type */}
                    {type !== 'DEPT_CAR' && (
                        <div className="form-group">
                            <label>Owner (Employee)</label>
                            <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)} required>
                                <option value="" disabled>Select an employee</option>
                                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.employee_id_str})</option>)}
                            </select>
                        </div>
                    )}

                    {type === 'DEPT_CAR' && (
                        <div className="form-group">
                            <label>Assigned Department</label>
                            <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} required>
                                <option value="" disabled>Select a department</option>
                                {departments.map(dept => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
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

export default VehicleModal;