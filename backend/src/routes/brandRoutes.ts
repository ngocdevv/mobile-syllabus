import { Router } from 'express';
import { getBrands, getBrandById, createBrand, updateBrand, deleteBrand } from '../controllers/brandController';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getBrands);
router.get('/:id', getBrandById);
router.post('/', authenticateToken, authorizeAdmin, createBrand);
router.put('/:id', authenticateToken, authorizeAdmin, updateBrand);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteBrand);

export default router;
