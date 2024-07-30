import express from 'express';
import cors from 'cors';  // CORS 추가 프론트와의 연결을 위함

const app = express();

app.use(cors());  // CORS 미들웨어 추가
app.use(express.json());

app.get('/', (req, res) => {
  res.send('헬로월드!!');
});

export { app };
