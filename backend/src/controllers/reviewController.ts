import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const addReview = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { product_id, rating, comment, order_item_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        user_id: userId,
        product_id,
        rating,
        comment,
        order_item_id,
        status: 'pending' // Default to pending approval
      }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getProductReviews = async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;
  
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, users(full_name, avatar_url)')
      .eq('product_id', productId)
      .eq('status', 'approved') // Only show approved reviews
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
