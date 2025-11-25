import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getCart = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;

  try {
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantity,
        product_id,
        variant_id,
        products (
          id, name, price, slug,
          product_images (image_url)
        ),
        product_variants (
          id, size, color, price, image_url
        )
      `)
      .eq('user_id', userId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Format data for easier consumption
    const cartItems = data.map((item: any) => {
      const productPrice = item.product_variants?.price || item.products?.price;
      const image = item.product_variants?.image_url || item.products?.product_images?.[0]?.image_url;
      
      return {
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        name: item.products.name,
        price: productPrice,
        quantity: item.quantity,
        image_url: image,
        size: item.product_variants?.size,
        color: item.product_variants?.color
      };
    });

    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { product_id, variant_id, quantity } = req.body;

  try {
    // Check if item exists
    let query = supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', product_id);
    
    if (variant_id) {
      query = query.eq('variant_id', variant_id);
    } else {
      query = query.is('variant_id', null);
    }

    const { data: existingItem } = await query.single();

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;
      const { data, error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', existingItem.id)
        .select()
        .single();
        
      if (error) throw error;
      return res.status(200).json(data);
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('cart_items')
        .insert([{ user_id: userId, product_id, variant_id, quantity }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', id)
      .eq('user_id', userId) // Ensure ownership
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const removeCartItem = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
