import client from './client';

export const createOrder = async (orderData) => {
  const response = await client.post('/orders', orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await client.get('/orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await client.get(`/orders/${id}`);
  return response.data;
};
