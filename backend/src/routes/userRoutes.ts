import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController';
import { authenticateToken, authorizeAdmin } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken, authorizeAdmin);

router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
