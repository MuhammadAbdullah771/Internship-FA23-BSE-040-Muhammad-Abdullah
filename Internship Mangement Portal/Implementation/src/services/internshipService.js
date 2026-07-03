import api from './api';

function extractError(error) {
  const data = error.response?.data;
  if (data?.message) return data.message;
  if (!error.response) return 'Unable to reach the server.';
  return 'Something went wrong.';
}

export async function fetchInternshipPostings(params = {}) {
  const { data } = await api.get('/internships', { params });
  return data.data.postings;
}

export async function applyToInternship(postingId) {
  try {
    const { data } = await api.post(`/internships/${postingId}/apply`);
    return { success: true, message: data.data.message };
  } catch (error) {
    return { success: false, error: extractError(error) };
  }
}

export async function fetchMyApplications() {
  const { data } = await api.get('/internships/my-applications');
  return data.data.applications;
}
