import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import '@_config/passport.config'; 
import { authenticateJWT } from '@_middlewares/authMiddleware'; 
import routes from '@_routes/index'; 
import startCronJob from '@_scripts/updateData'; 
import { googleAuth, googleAuthCallback, logout, deleteUser } from '@_controllers/authController'; 

// 환경 변수 설정
dotenv.config();

const app = express();

// CORS 설정
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true 
}));

// JSON 바디 파서와 쿠키 파서 설정
app.use(express.json());
app.use(cookieParser());

// Passport 초기화
app.use(passport.initialize());

// Google OAuth 2.0 라우트 설정
app.get('/auth/google', googleAuth);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/', session: false }),
  googleAuthCallback
);

// 로그아웃
app.post('/logout', logout);

// 탈퇴
app.delete('/delete', authenticateJWT, deleteUser);

// 인증된 API 라우트
app.use('/', authenticateJWT, routes);

startCronJob();

// 에러 핸들러 미들웨어 (필요에 따라 추가)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
