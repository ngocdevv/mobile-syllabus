import client from './client';

export const getAddresses = async () => {
  const response = await client.get('/addresses');
  return response.data;
};

export const addAddress = async (addressData) => {
  const response = await client.post('/addresses', addressData);
  return response.data;
};

export const updateAddress = async (id, addressData) => {
  const response = await client.put(`/addresses/${id}`, addressData);
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await client.delete(`/addresses/${id}`);
  return response.data;
};
