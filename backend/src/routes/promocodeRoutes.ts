import { Router } from 'express';
import { getPromocodes, validatePromocode } from '../controllers/promocodeController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getPromocodes);
router.post('/validate', authenticateToken, validatePromocode);

export default router;
