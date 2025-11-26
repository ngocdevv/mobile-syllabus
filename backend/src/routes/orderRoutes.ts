import { Router } from 'express';
import { createOrder, getOrders, getOrderById, getAllOrders, updateOrderStatus, deleteOrder, getAdminOrderById } from '../controllers/orderController';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/admin/all', authorizeAdmin, getAllOrders);
router.get('/admin/:id', authorizeAdmin, getAdminOrderById);
router.put('/admin/:id/status', authorizeAdmin, updateOrderStatus);
router.delete('/admin/:id', authorizeAdmin, deleteOrder);
router.get('/:id', getOrderById);

export default router;
