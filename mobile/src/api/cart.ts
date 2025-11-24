import client from './client';

export const getCart = async () => {
  const response = await client.get('/cart');
  return response.data;
};

export const addToCart = async (productVariantId: string, quantity: number) => {
  const response = await client.post('/cart', { product_variant_id: productVariantId, quantity });
  return response.data;
};

export const updateCartItem = async (itemId: string, quantity: number) => {
  const response = await client.put(`/cart/${itemId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (itemId: string) => {
  await client.delete(`/cart/${itemId}`);
};
