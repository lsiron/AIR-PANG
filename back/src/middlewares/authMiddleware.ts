import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@_config/env.config';
import { UserService } from '@_services/authService';

const userService = new UserService();
const jwtSecret = config.JWT_SECRET;

interface JwtPayload {
  id: number;
}

const verifyToken = (token: string, secret: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      if (decoded && typeof decoded === 'object' && 'id' in decoded) {
        resolve(decoded as JwtPayload);
      } else {
        reject(new Error('잘못된 토큰입니다.'));
      }
    });
  });
};

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = await verifyToken(token, jwtSecret);

      if (decoded) {
        try {
          const user = await userService.findUserById(decoded.id);
          if (user) {
            req.user = user; 
            next();
          } else {
            res.sendStatus(403); 
          }
        } catch (error) {
          console.error('사용자 검색 에러', error);
          res.sendStatus(403);
        }
      } else {
        res.sendStatus(403);
      }
    } catch (err) {
      console.error('JWT 검증 오류:', err);
      res.sendStatus(403); 
    }
  } else {
    res.sendStatus(401); 
  }
};
