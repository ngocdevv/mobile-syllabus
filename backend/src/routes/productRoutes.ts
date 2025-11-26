import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/productController';
import { optionalAuth } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', optionalAuth, getProducts);
router.get('/:id', optionalAuth, getProductById);

export default router;
