import api from './api';

export async function fetchStudentDashboard() {
  const { data } = await api.get('/students/dashboard');
  return data.data;
}
