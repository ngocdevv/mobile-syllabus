import client from './client';

export const getProducts = async (params = {}) => {
  const response = await client.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await client.get(`/products/${id}`);
  return response.data;
};

export const getProductReviews = async (id) => {
  const response = await client.get(`/reviews/product/${id}`);
  return response.data;
};
