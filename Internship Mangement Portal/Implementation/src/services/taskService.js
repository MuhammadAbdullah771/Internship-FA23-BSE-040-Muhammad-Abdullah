import api from './api';

function extractError(error) {
  const data = error.response?.data;
  if (data?.message) return data.message;
  if (!error.response) return 'Unable to reach the server.';
  return 'Something went wrong.';
}

export async function fetchTaskBoard() {
  const { data } = await api.get('/tasks');
  return data.data.board;
}

export async function fetchTask(id) {
  const { data } = await api.get(`/tasks/${id}`);
  return data.data.task;
}

export async function createTask(payload) {
  try {
    const { data } = await api.post('/tasks', payload);
    return { success: true, task: data.data.task };
  } catch (error) {
    return { success: false, error: extractError(error) };
  }
}

export async function deleteTask(id) {
  try {
    await api.delete(`/tasks/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: extractError(error) };
  }
}

export async function updateTaskStatus(id, status) {
  try {
    const { data } = await api.patch(`/tasks/${id}`, { status });
    return { success: true, task: data.data.task };
  } catch (error) {
    return { success: false, error: extractError(error) };
  }
}

export async function submitTask(id, { githubLink, liveUrl, comments, submit = false }) {
  try {
    const { data } = await api.patch(`/tasks/${id}`, {
      submission: { githubLink, liveUrl, comments, submit },
    });
    return { success: true, task: data.data.task };
  } catch (error) {
    return { success: false, error: extractError(error) };
  }
}
