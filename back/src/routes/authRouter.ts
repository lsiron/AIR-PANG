import { Router } from 'express';
import { googleAuth, googleAuthCallback, logout, deleteUser } from '@_controllers/authController';
import { authenticateJWT } from '@_middlewares/authMiddleware';

const router = Router();

router.get('/', googleAuth);

router.get('/callback', googleAuthCallback);

router.post('/logout', logout);

router.delete('/delete', authenticateJWT, deleteUser);

export default router;
