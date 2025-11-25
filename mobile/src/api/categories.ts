import client from './client';

export const getCategories = async () => {
  const response = await client.get('/categories');
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await client.get(`/categories/${id}`);
  return response.data;
};
