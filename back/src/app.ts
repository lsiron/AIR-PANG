import cors from 'cors';  // CORS 추가 프론트와의 연결을 위함
import express from 'express';
import routes from './routes'; // 라우터 가져오기
import startCronJob from './scripts/updateData'; // Cron job 스크립트 가져오기

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.get('/', (req, res) => {
  res.send('헬로월드!!');
});

// 서버 시작 시 데이터 업데이트 및 크론 작업 시작
startCronJob();

export default app;
