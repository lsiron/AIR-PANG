import express from 'express';
import session from 'express-session';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use(session({
  secret: 'secret_key', // 실제 환경에서는 안전한 비밀 키를 사용하세요
  resave: false,
  saveUninitialized: true
}));

// 라우팅 설정
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
