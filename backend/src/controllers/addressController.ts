import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getAddresses = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addAddress = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { 
    recipient_name, phone, address_line1, address_line2, 
    ward, district, city, province, postal_code, country, is_default 
  } = req.body;

  try {
    // If setting as default, unset other defaults
    if (is_default) {
      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('shipping_addresses')
      .insert([{
        user_id: userId,
        recipient_name, phone, address_line1, address_line2,
        ward, district, city, province, postal_code, country, is_default
      }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateAddress = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;
  const updates = req.body;

  try {
    if (updates.is_default) {
      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('shipping_addresses')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteAddress = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('shipping_addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
