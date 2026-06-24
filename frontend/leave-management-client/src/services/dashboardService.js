import api from '../api/axiosInstance';
export const getAdminDashboard    = () => api.get('/dashboard/admin');
export const getManagerDashboard  = () => api.get('/dashboard/manager');
export const getEmployeeDashboard = () => api.get('/dashboard/employee');