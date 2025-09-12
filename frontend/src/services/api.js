import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

//Department
export const getDepartments = () => api.get('/departments');
export const createDepartment = (departmentData) => api.post('/departments', departmentData);
export const updateDepartment = (id, departmentData) => api.put(`/departments/${id}`, departmentData);
export const deleteDepartment = (id) => api.delete(`/departments/${id}`);

//Employee
export const getEmployees = (filters) => api.get('/employees', { params: filters });
export const createEmployee = (employeeData) => api.post('/employees', employeeData);
export const updateEmployee = (id, employeeData) => api.put(`/employees/${id}`, employeeData);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

//Vehicle
export const getVehicles = (filters) => api.get('/vehicles', { params: filters });
export const createVehicle = (vehicleData) => api.post('/vehicles', vehicleData);
export const updateVehicle = (id, vehicleData) => api.put(`/vehicles/${id}`, vehicleData);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);

// --- Dashboard & Log Functions ---
export const getStats = () => api.get('/dashboard/stats');
export const getActivityLog = (filters) => api.get('/dashboard/logs', { params: filters });


export default api;