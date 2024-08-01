import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import '@_config/passport.config'; 
import { authenticateJWT } from '@_middlewares/authMiddleware'; 
import routes from '@_routes/index'; 
import startCronJob from '@_scripts/updateData'; 
import { googleAuth, googleAuthCallback, logout, deleteUser } from '@_controllers/authController'; 

dotenv.config();

const app = express();

// CORS 설정
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

// 세션 설정
app.use(session({
  secret: process.env.SESSION_SECRET || '',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// 인증 라우트
app.get('/auth/google', googleAuth);
app.get('/auth/google/callback', googleAuthCallback);

app.post('/logout', logout);

app.delete('/delete', authenticateJWT, deleteUser);

// 인증된 API 라우트
app.use('/', routes);

startCronJob();

// 에러 핸들러 미들웨어 (필요에 따라 추가)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
