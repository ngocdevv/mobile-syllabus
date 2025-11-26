import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { optionalAuth, authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', optionalAuth, getProducts);
router.get('/:id', optionalAuth, getProductById);
router.post('/', authenticateToken, authorizeAdmin, createProduct);
router.put('/:id', authenticateToken, authorizeAdmin, updateProduct);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteProduct);

export default router;
