import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;

  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
