import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getBrands = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getBrandById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createBrand = async (req: Request, res: Response) => {
  const { name, logo_url } = req.body;
  try {
    const { data, error } = await supabase
      .from('brands')
      .insert([{ name, logo_url }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, logo_url, is_active } = req.body;
  try {
    const { data, error } = await supabase
      .from('brands')
      .update({ name, logo_url, is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteBrand = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: 'Brand deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
