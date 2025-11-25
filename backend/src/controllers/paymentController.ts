import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getPaymentMethods = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addPaymentMethod = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { 
    type, card_brand, card_last4, card_holder_name, 
    expiry_month, expiry_year, is_default 
  } = req.body;

  try {
    if (is_default) {
      await supabase
        .from('payment_methods')
        .update({ is_default: false })
        .eq('user_id', userId);
    }

    const { data, error } = await supabase
      .from('payment_methods')
      .insert([{
        user_id: userId,
        type, card_brand, card_last4, card_holder_name,
        expiry_month, expiry_year, is_default
      }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deletePaymentMethod = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Payment method deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
