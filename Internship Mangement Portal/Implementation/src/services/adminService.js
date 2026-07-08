import api from './api';

export async function fetchAdminDashboard() {
  const { data } = await api.get('/admin/dashboard');
  return data.data;
}

export async function fetchAdminStudents(params = {}) {
  const { data } = await api.get('/admin/students', { params });
  return data.data;
}

export async function fetchAdminReports() {
  const { data } = await api.get('/admin/reports');
  return data.data;
}
