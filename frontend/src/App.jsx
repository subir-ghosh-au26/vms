import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DepartmentsPage from './pages/DepartmentsPage';
import EmployeesPage from './pages/EmployeesPage';
import VehiclesPage from './pages/VehiclesPage';
import ActivityLogPage from './pages/ActivityLogPage';



function App() {
  return (
    <Routes>
      {/* Public Route: Login Page */}
      <Route path="/login" element={<LoginPage />} />
      {/* Protected Routes: All dashboard pages */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/departments" element={<DepartmentsPage />} />
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/activity-log" element={<ActivityLogPage />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;