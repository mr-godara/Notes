import api from '../api/axios.js';

export const getNotes = async ({ page = 1, limit = 20 }) => {
  const { data } = await api.get('/notes', {
    params: { page, limit }
  });
  return data;
};

export const getNote = async (id) => {
  const { data } = await api.get(`/notes/${id}`);
  return data;
};

export const createNote = async (payload) => {
  const { data } = await api.post('/notes', payload);
  return data;
};

export const updateNote = async ({ id, payload }) => {
  const { data } = await api.put(`/notes/${id}`, payload);
  return data;
};

export const deleteNote = async (id) => {
  await api.delete(`/notes/${id}`);
};

export const shareNote = async ({ id, email }) => {
  const { data } = await api.post(`/notes/${id}/share`, {
    share_with_email: email
  });
  return data;
};

export const togglePin = async (id) => {
  const { data } = await api.patch(`/notes/${id}/pin`);
  return data;
};

export const searchNotes = async (query) => {
  const { data } = await api.get('/search', {
    params: { q: query }
  });
  return data.notes;
};

export const getAbout = async () => {
  const { data } = await api.get('/about');
  return data;
};
