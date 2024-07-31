// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.config';
import { UserService } from '../services/authService';
import { User } from '../types/user';

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
        reject(new Error('Invalid token'));
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
            req.user = user; // 사용자 정보를 req.user에 설정
            next(); // 요청을 다음 미들웨어로 전달
          } else {
            res.sendStatus(403);
          }
        } catch (error) {
          console.error('User Retrieval Error:', error);
          res.sendStatus(403);
        }
      } else {
        res.sendStatus(403);
      }
    } catch (err) {
      console.error('JWT Verification Error:', err);
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
};
