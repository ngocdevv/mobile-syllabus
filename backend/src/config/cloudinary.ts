import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary sẽ tự động parse CLOUDINARY_URL
// Format: cloudinary://api_key:api_secret@cloud_name
if (process.env.CLOUDINARY_URL) {
  cloudinary.config(process.env.CLOUDINARY_URL);
} else {
  throw new Error('CLOUDINARY_URL is not defined in environment variables');
}

export default cloudinary;
