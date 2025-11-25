import { Router } from 'express';
import { getPaymentMethods, addPaymentMethod, deletePaymentMethod } from '../controllers/paymentController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getPaymentMethods);
router.post('/', addPaymentMethod);
router.delete('/:id', deletePaymentMethod);

export default router;
