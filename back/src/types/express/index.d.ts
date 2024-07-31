import { User } from '@_types/user'; // @ 경로를 사용하여 import

declare global {
  namespace Express {
    interface Request {
      user?: User; // 사용자 정의 User 타입 추가
    }
  }
}
