import client from './client';

export const getFavorites = async () => {
  const response = await client.get('/favorites');
  return response.data;
};

export const toggleFavorite = async (productId) => {
  const response = await client.post('/favorites/toggle', { product_id: productId });
  return response.data;
};

export const checkFavoriteStatus = async (productId) => {
  const response = await client.get(`/favorites/check/${productId}`);
  return response.data;
};
