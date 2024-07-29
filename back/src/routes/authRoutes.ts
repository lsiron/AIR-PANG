import { Router } from 'express';
import { googleCallback, refreshAccessToken } from '../controllers/authController';

const router = Router();

router.post('/google/callback', googleCallback);
router.post('/refresh', refreshAccessToken);

export default router;
