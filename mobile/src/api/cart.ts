import client from './client';

export const getCart = async () => {
  const response = await client.get('/cart');
  return response.data;
};

export const addToCart = async (productId, variantId, quantity) => {
  const response = await client.post('/cart', { product_id: productId, variant_id: variantId, quantity });
  return response.data;
};

export const updateCartItem = async (id, quantity) => {
  const response = await client.put(`/cart/${id}`, { quantity });
  return response.data;
};

export const removeCartItem = async (id) => {
  const response = await client.delete(`/cart/${id}`);
  return response.data;
};
