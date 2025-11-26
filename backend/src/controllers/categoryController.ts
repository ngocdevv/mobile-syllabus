import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name, image_url, display_order } = req.body;
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, image_url, display_order }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, image_url, display_order, is_active } = req.body;
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({ name, image_url, display_order, is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
