import api from '../api/axiosInstance';
export const getMyBalance          = ()         => api.get('/leavebalances/my');
export const getBalanceByEmployee  = (empId)    => api.get(`/leavebalances/${empId}`);
export const updateBalance         = (id, data) => api.put(`/leavebalances/${id}`, data);