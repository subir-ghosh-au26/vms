import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import DepartmentsPage from './pages/DepartmentsPage';
import EmployeesPage from './pages/EmployeesPage';
import VehiclesPage from './pages/VehiclesPage';
import ActivityLogPage from './pages/ActivityLogPage';


function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/activity-log" element={<ActivityLogPage />} />

      </Routes>
    </Layout>
  );
}

export default App;