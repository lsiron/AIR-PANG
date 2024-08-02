import { Router } from 'express';
import { authenticateJWT } from '@_middlewares/authMiddleware';
import { googleAuth, googleAuthCallback, refreshToken, logout, deleteUser } from '@_controllers/authController';

const router = Router();

// Google 로그인 라우트
router.get('/auth/google', googleAuth);

// Google 로그인 콜백 라우트
router.get('/auth/google/callback', googleAuthCallback);

// 리프레시 토큰을 이용한 엑세스 토큰 갱신
router.post('/auth/refresh-token', refreshToken);

// 로그아웃
router.post('/logout', logout);

// 계정 삭제
router.delete('/delete', authenticateJWT, deleteUser);

export default router;
