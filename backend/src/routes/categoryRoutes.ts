import { Router } from 'express';
import { getCategories, getCategoryById } from '../controllers/categoryController';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);

export default router;
