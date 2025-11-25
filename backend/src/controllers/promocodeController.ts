import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getPromocodes = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('promocodes')
      .select('*')
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString());

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const validatePromocode = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { code, order_amount } = req.body;

  try {
    const { data: promo, error } = await supabase
      .from('promocodes')
      .select('*')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (error || !promo) {
      return res.status(404).json({ error: 'Invalid promocode' });
    }

    // Check expiration
    if (new Date(promo.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Promocode expired' });
    }

    // Check usage limit
    if (promo.usage_limit && promo.used_count >= promo.usage_limit) {
      return res.status(400).json({ error: 'Promocode usage limit reached' });
    }

    // Check minimum order value
    if (promo.minimum_order_value && order_amount < promo.minimum_order_value) {
      return res.status(400).json({ 
        error: `Minimum order value is ${promo.minimum_order_value}` 
      });
    }

    // Check if user already used it
    const { data: used } = await supabase
      .from('user_promocodes')
      .select('id')
      .eq('user_id', userId)
      .eq('promocode_id', promo.id)
      .single();

    if (used) {
      return res.status(400).json({ error: 'You have already used this promocode' });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promo.discount_type === 'percentage') {
      discountAmount = (order_amount * promo.discount_value) / 100;
      if (promo.maximum_discount_amount && discountAmount > promo.maximum_discount_amount) {
        discountAmount = promo.maximum_discount_amount;
      }
    } else {
      discountAmount = promo.discount_value;
    }

    res.status(200).json({
      valid: true,
      promocode: promo,
      discount_amount: discountAmount
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
