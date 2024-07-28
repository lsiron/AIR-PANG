import { Router } from 'express';
import { googleCallback } from '../controllers/authController';

const router = Router();

// 구글 로그인 콜백 라우터
router.post('/google/callback', googleCallback);

export default router;
