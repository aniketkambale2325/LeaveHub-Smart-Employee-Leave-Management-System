import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import MainLayout from '../layouts/MainLayout';

import LoginPage from '../pages/auth/LoginPage';
import LandingPage from '../pages/public/LandingPage';

import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageEmployees from '../pages/admin/ManageEmployees';
import AddEmployee from '../pages/admin/AddEmployee';
import EditEmployee from '../pages/admin/EditEmployee';
import ManageDepartments from '../pages/admin/ManageDepartments';
import ManageLeaveTypes from '../pages/admin/ManageLeaveTypes';
import AllLeaveRequests from '../pages/admin/AllLeaveRequests';

import ManagerDashboard from '../pages/manager/ManagerDashboard';
import PendingRequests from '../pages/manager/PendingRequests';
import TeamLeaveHistory from '../pages/manager/TeamLeaveHistory';

import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import ApplyLeave from '../pages/employee/ApplyLeave';
import MyLeaveRequests from '../pages/employee/MyLeaveRequests';
import LeaveBalance from '../pages/employee/LeaveBalance';

import ProfilePage from '../pages/shared/ProfilePage';
import SettingsPage from '../pages/shared/SettingsPage';
import ReportsPage from '../pages/shared/ReportsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute allowedRoles={['Admin']}><MainLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<ManageEmployees />} />
        <Route path="/admin/employees/add" element={<AddEmployee />} />
        <Route path="/admin/employees/edit/:id" element={<EditEmployee />} />
        <Route path="/admin/departments" element={<ManageDepartments />} />
        <Route path="/admin/leave-types" element={<ManageLeaveTypes />} />
        <Route path="/admin/leave-requests" element={<AllLeaveRequests />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/profile" element={<ProfilePage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['Manager']}><MainLayout /></ProtectedRoute>}>
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/pending" element={<PendingRequests />} />
        <Route path="/manager/history" element={<TeamLeaveHistory />} />
        <Route path="/manager/reports" element={<ReportsPage />} />
        <Route path="/manager/profile" element={<ProfilePage />} />
        <Route path="/manager/settings" element={<SettingsPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['Employee']}><MainLayout /></ProtectedRoute>}>
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/apply-leave" element={<ApplyLeave />} />
        <Route path="/employee/my-leaves" element={<MyLeaveRequests />} />
        <Route path="/employee/balance" element={<LeaveBalance />} />
        <Route path="/employee/profile" element={<ProfilePage />} />
        <Route path="/employee/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
