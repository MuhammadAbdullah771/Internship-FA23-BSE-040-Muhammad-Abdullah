import api from './api';

function extractError(error) {
  const data = error.response?.data;
  if (data?.message) return data.message;
  if (data?.errors?.[0]?.message) return data.errors[0].message;
  if (!error.response) return 'Unable to reach the server. Is the API running?';
  return 'Something went wrong. Please try again.';
}

export async function fetchInterns(params = {}) {
  const { data } = await api.get('/interns', { params });
  return data.data;
}

export async function fetchInternStats() {
  const { data } = await api.get('/interns/stats');
  return data.data;
}

export async function fetchInternFilters() {
  const { data } = await api.get('/interns/filters');
  return data.data;
}

export async function createIntern(payload) {
  try {
    const { data } = await api.post('/interns', payload);
    return { success: true, intern: data.data.intern };
  } catch (error) {
    return { success: false, error: extractError(error) };
  }
}

export async function updateIntern(id, payload) {
  try {
    const { data } = await api.patch(`/interns/${id}`, payload);
    return { success: true, intern: data.data.intern };
  } catch (error) {
    return { success: false, error: extractError(error) };
  }
}

export async function deleteIntern(id) {
  try {
    await api.delete(`/interns/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: extractError(error) };
  }
}
