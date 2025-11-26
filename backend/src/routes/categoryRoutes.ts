import { Router } from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', authenticateToken, authorizeAdmin, createCategory);
router.put('/:id', authenticateToken, authorizeAdmin, updateCategory);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteCategory);

export default router;
