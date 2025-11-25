import { Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getFavorites = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        products (
          id, name, price, slug, rating_average,
          product_images (image_url)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    // Format data
    const favorites = data.map((item: any) => ({
      id: item.id,
      product_id: item.products.id,
      name: item.products.name,
      price: item.products.price,
      rating: item.products.rating_average,
      image_url: item.products.product_images?.[0]?.image_url,
      created_at: item.created_at
    }));

    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const toggleFavorite = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { product_id } = req.body;

  try {
    // Check if exists
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', product_id)
      .single();

    if (existing) {
      // Remove
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id);
      
      if (error) throw error;
      return res.status(200).json({ message: 'Removed from favorites', is_favorite: false });
    } else {
      // Add
      const { error } = await supabase
        .from('favorites')
        .insert([{ user_id: userId, product_id }]);
      
      if (error) throw error;
      return res.status(201).json({ message: 'Added to favorites', is_favorite: true });
    }
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const checkFavoriteStatus = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { productId } = req.params;

  try {
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    res.status(200).json({ is_favorite: !!data });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
