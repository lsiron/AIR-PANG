import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from '@routes/authRoutes'; 
import 'tsconfig-paths/register';
import '@_config/env.config';

// 환경 변수 로드
dotenv.config();

const app = express();
const port = process.env.PORT || 8080; // 기본값 설정

// 미들웨어 설정
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: true,
}));

// 라우트 설정
app.use('/auth', authRoutes);

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
