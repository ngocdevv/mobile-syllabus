import client from './client';

export const getProducts = async (categoryId?: string) => {
  const params = categoryId ? { category_id: categoryId } : {};
  const response = await client.get('/products', { params });
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await client.get(`/products/${id}`);
  return response.data;
};
