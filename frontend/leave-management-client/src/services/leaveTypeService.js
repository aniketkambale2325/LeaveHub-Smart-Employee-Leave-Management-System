import api from '../api/axiosInstance';
export const getLeaveTypes   = ()         => api.get('/leavetypes');
export const createLeaveType = (data)     => api.post('/leavetypes', data);
export const updateLeaveType = (id, data) => api.put(`/leavetypes/${id}`, data);
export const deleteLeaveType = (id)       => api.delete(`/leavetypes/${id}`);