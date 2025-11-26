import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', authenticateToken, authorizeAdmin, upload.single('image'), uploadImage);

export default router;
