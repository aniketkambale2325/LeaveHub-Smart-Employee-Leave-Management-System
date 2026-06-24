import api from '../api/axiosInstance';
export const applyLeave    = (data)       => api.post('/leaverequests/apply', data);
export const getMyLeaves   = ()           => api.get('/leaverequests/my');
export const getPending    = ()           => api.get('/leaverequests/pending');
export const getAllLeaves  = ()           => api.get('/leaverequests/all');
export const getTeamLeaves = ()           => api.get('/leaverequests/team');
export const approveLeave  = (id, data)  => api.put(`/leaverequests/${id}/approve`, data);
export const rejectLeave   = (id, data)  => api.put(`/leaverequests/${id}/reject`, data);
export const cancelLeave   = (id)        => api.put(`/leaverequests/${id}/cancel`);