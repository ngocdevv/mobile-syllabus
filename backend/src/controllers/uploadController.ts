import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import fs from 'fs';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'fashion-ecommerce',
    });

    // Remove file from local storage
    fs.unlinkSync(req.file.path);

    res.status(200).json({ url: result.secure_url });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
};
