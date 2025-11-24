import client from './client';

export const getCategories = async () => {
  const response = await client.get('/categories');
  return response.data;
};
