import { Router } from 'express';
import { getBrands, getBrandById } from '../controllers/brandController';

const router = Router();

router.get('/', getBrands);
router.get('/:id', getBrandById);

export default router;
