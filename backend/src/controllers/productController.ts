import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { 
      category_id, 
      brand_id, 
      min_price, 
      max_price, 
      sort_by, 
      search,
      page = 1,
      limit = 10 
    } = req.query;

    let query = supabase
      .from('products')
      .select('*, categories(name), brands(name), product_images(image_url)', { count: 'exact' })
      .eq('is_active', true);

    if (category_id) query = query.eq('category_id', category_id);
    if (brand_id) query = query.eq('brand_id', brand_id);
    if (min_price) query = query.gte('price', min_price);
    if (max_price) query = query.lte('price', max_price);
    if (search) query = query.ilike('name', `%${search}%`);

    if (sort_by === 'price_asc') query = query.order('price', { ascending: true });
    else if (sort_by === 'price_desc') query = query.order('price', { ascending: false });
    else if (sort_by === 'newest') query = query.order('created_at', { ascending: false });
    else if (sort_by === 'rating') query = query.order('rating_average', { ascending: false });
    else query = query.order('created_at', { ascending: false }); // Default

    // Pagination
    const from = (Number(page) - 1) * Number(limit);
    const to = from + Number(limit) - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Process images to return only the primary one or first one
    let products = data.map((product: any) => {
      const primaryImage = product.product_images?.[0]?.image_url || null;
      return {
        ...product,
        image_url: primaryImage,
        product_images: undefined // Clean up
      };
    });

    // Check favorites if user is logged in
    if (req.user) {
        const productIds = products.map((p: any) => p.id);
        if (productIds.length > 0) {
            const { data: favorites } = await supabase
                .from('favorites')
                .select('product_id')
                .eq('user_id', req.user.id)
                .in('product_id', productIds);
            
            const favoriteIds = new Set(favorites?.map((f: any) => f.product_id));
            products = products.map((p: any) => ({
                ...p,
                is_favorite: favoriteIds.has(p.id)
            }));
        }
    } else {
        products = products.map((p: any) => ({ ...p, is_favorite: false }));
    }

    res.status(200).json({
      data: products,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        total_pages: Math.ceil((count || 0) / Number(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getProductById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(id, name),
        brands(id, name, logo_url),
        product_variants(*),
        product_images(*),
        product_attribute_values(
          *,
          product_attributes(name, display_name, type)
        ),
        reviews(
          id, rating, comment, created_at,
          users(full_name, avatar_url)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Product not found' });
    }

    let product = data;

    if (req.user) {
        const { data: favorite } = await supabase
            .from('favorites')
            .select('id')
            .eq('user_id', req.user.id)
            .eq('product_id', id)
            .single();
        
        product = { ...product, is_favorite: !!favorite };
    } else {
        product = { ...product, is_favorite: false };
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
