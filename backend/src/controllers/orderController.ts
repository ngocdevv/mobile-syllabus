import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const createOrder = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    // 1. Get cart items
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select('*, product_variants(*, products(*))')
      .eq('user_id', user.id);

    if (cartError || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or error fetching cart' });
    }

    // 2. Calculate total
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.product_variants.products.price * item.quantity);
    }, 0);

    // 3. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) {
      return res.status(400).json({ error: orderError.message });
    }

    // 4. Create Order Items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
      price: item.product_variants.products.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      return res.status(400).json({ error: itemsError.message });
    }

    // 5. Clear Cart
    await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, product_variants(*, products(*)))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
