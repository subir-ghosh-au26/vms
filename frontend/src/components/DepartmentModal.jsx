import React, { useState, useEffect } from 'react';
import './Modal.css';

const DepartmentModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [name, setName] = useState('');

    // This effect runs when the modal opens or the initial data changes.
    // It populates the form for editing.
    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
        } else {
            setName(''); // Reset for a new entry
        }
    }, [initialData, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{initialData ? 'Edit Department' : 'Add New Department'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="departmentName">Department Name</label>
                        <input
                            id="departmentName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
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

export default DepartmentModal;