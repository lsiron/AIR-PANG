import './config/env.config'
import { app } from './app';

const port = process.env.PORT

app.listen(port, () => {
  console.log(`서버가 실행되었습니다!`);
});