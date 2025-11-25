import { Router } from 'express';
import { addReview, getProductReviews } from '../controllers/reviewController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/product/:productId', getProductReviews);
router.post('/', authenticateToken, addReview);

export default router;
