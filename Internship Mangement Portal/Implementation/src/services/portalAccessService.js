import api from './api';

function extractError(error) {
  const data = error.response?.data;
  if (data?.message) return data.message;
  if (!error.response) return 'Unable to reach the server.';
  return 'Something went wrong.';
}

export async function fetchMyPortalAccess() {
  const { data } = await api.get('/portal-access/me');
  return data.data.application;
}

export async function submitPortalAccess(payload) {
  try {
    const { data } = await api.post('/portal-access/submit', payload);
    return { success: true, application: data.data.application };
  } catch (error) {
    return { success: false, error: extractError(error) };
  }
}

export async function fetchPendingPortalApplications() {
  const { data } = await api.get('/portal-access/pending');
  return data.data.applications;
}

export async function reviewPortalApplication(studentId, payload) {
  try {
    const { data } = await api.patch(`/portal-access/${studentId}/review`, payload);
    return { success: true, application: data.data.application };
  } catch (error) {
    return { success: false, error: extractError(error) };
  }
}
