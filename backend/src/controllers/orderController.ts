import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createOrder = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { 
    shipping_address_id, 
    payment_method_id, 
    shipping_fee = 0,
    notes,
    items // Array of { product_id, variant_id, quantity }
  } = req.body;

  try {
    // 1. Calculate totals and validate items
    let subtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      // Fetch product/variant price
      let price = 0;
      let productData: any;
      let variantData: any;

      if (item.variant_id) {
        const { data } = await supabase
          .from('product_variants')
          .select('price, product_id, size, color, products(name, sku)')
          .eq('id', item.variant_id)
          .single();
        
        if (!data) throw new Error(`Variant not found: ${item.variant_id}`);
        variantData = data;
        price = data.price;
        productData = data.products;
      } else {
        const { data } = await supabase
          .from('products')
          .select('price, name, sku')
          .eq('id', item.product_id)
          .single();
        
        if (!data) throw new Error(`Product not found: ${item.product_id}`);
        productData = data;
        price = data.price;
      }

      const total = price * item.quantity;
      subtotal += total;

      orderItemsData.push({
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: productData.name,
        product_sku: productData.sku, // or variant sku
        size: variantData?.size,
        color: variantData?.color,
        quantity: item.quantity,
        price: price,
        total_amount: total
      });
    }

    const total_amount = subtotal + shipping_fee;
    const order_number = `ORD-${Date.now()}`;

    // 2. Create Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        order_number,
        subtotal,
        shipping_fee,
        total_amount,
        shipping_address_id,
        payment_method_id,
        status: 'pending',
        notes
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 3. Create Order Items
    const itemsToInsert = orderItemsData.map(item => ({
      ...item,
      order_id: order.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;

    // 4. Clear Cart (optional, if items came from cart)
    // await supabase.from('cart_items').delete().eq('user_id', userId);

    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*, products(product_images(image_url))),
        shipping_addresses (*),
        payment_methods (*)
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, users(full_name, email)')
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAdminOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*, products(product_images(image_url))),
        shipping_addresses (*),
        payment_methods (*)
      `)
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
