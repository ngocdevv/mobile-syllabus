import { Router } from 'express';
import { getFavorites, toggleFavorite, checkFavoriteStatus } from '../controllers/favoriteController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getFavorites);
router.post('/toggle', toggleFavorite);
router.get('/check/:productId', checkFavoriteStatus);

export default router;
