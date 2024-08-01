// // src/routes/authRoutes.ts
// import { Router } from 'express';
// import { googleAuth, googleAuthCallback, logout, deleteUser } from '../controllers/authController';
// import { authenticateJWT } from '../middlewares/authMiddleware';

// const router = Router();

// router.get('/auth/google', googleAuth); // Google 인증 시작
// router.get('/auth/google/callback', googleAuthCallback); // Google 인증 콜백 처리
// router.post('/logout', logout); // 로그아웃
// router.delete('/delete', authenticateJWT, deleteUser); // 사용자 삭제 (JWT 인증 필요)

// export default router;
