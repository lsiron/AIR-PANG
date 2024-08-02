import { Router } from 'express';
import { authenticateJWT } from '@_middlewares/authMiddleware';
import { googleAuth, googleAuthCallback, logout, deleteUser } from '@_controllers/authController';

const router = Router();

// Google 로그인 라우트
router.get('/auth/google', googleAuth);

// Google 로그인 콜백 라우트
router.get('/auth/google/callback', googleAuthCallback);

// 로그아웃
router.post('/logout', logout);

// 계정 삭제
router.delete('/delete', authenticateJWT, deleteUser);

// 다른 API 라우트
router.use('/', authenticateJWT, (req, res) => {
  res.send('Protected route');
});

export default router;
