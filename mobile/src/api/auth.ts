import client from './client';

export const login = async (email, password) => {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (fullName, email, password) => {
  const response = await client.post('/auth/register', { full_name: fullName, email, password });
  return response.data;
};

export const getProfile = async () => {
  const response = await client.get('/auth/profile');
  return response.data;
};
