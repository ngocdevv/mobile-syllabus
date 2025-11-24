import { Router } from 'express';
import { createOrder, getOrders } from '../controllers/orderController';
import { requireAuth } from '../middlewares/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/', createOrder);
router.get('/', getOrders);

export default router;
