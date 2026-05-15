import api from '../api/axios.js';

export const register = async (payload) => {
  const { data } = await api.post('/register', payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await api.post('/login', payload);
  return data;
};
