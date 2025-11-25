import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getSettings = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "The result contains 0 rows"
      return res.status(400).json({ error: error.message });
    }

    // Return default settings if none exist
    if (!data) {
      return res.status(200).json({
        notification_order: true,
        notification_promocode: true,
        notification_product: true,
        notification_push: true,
        notification_email: true,
        notification_sms: false,
        language: 'vi',
        currency: 'VND'
      });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const updates = req.body;

  try {
    const { data, error } = await supabase
      .from('user_settings')
      .upsert({ user_id: userId, ...updates })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
