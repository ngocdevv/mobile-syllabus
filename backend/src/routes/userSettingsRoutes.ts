import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/userSettingsController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getSettings);
router.put('/', updateSettings);

export default router;
