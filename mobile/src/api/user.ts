import client from './client';

export const getSettings = async () => {
  const response = await client.get('/settings');
  return response.data;
};

export const updateSettings = async (settings) => {
  const response = await client.put('/settings', settings);
  return response.data;
};

export const getPaymentMethods = async () => {
  const response = await client.get('/payments');
  return response.data;
};

export const addPaymentMethod = async (data) => {
  const response = await client.post('/payments', data);
  return response.data;
};

export const deletePaymentMethod = async (id) => {
  const response = await client.delete(`/payments/${id}`);
  return response.data;
};
