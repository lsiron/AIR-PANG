// src/controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.config';
import { UserService } from '../services/authService';
import passport from 'passport';
import { User } from '../types/user';

const userService = new UserService();

// Google 인증 시작
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google 인증 콜백
export const googleAuthCallback = async (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as User; 
    // JWT 생성
    const token = jwt.sign({ id: user.id }, config.JWT_SECRET, { expiresIn: '1h' });
    // JWT를 쿠키에 저장
    res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.redirect('/'); // 성공 시 리디렉션할 URL
  } else {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// 로그아웃
export const logout = (req: Request, res: Response) => {
  res.clearCookie('jwt');
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.status(200).json({ message: 'Successfully logged out' });
  });
};

// 계정 삭제
export const deleteUser = async (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as User;
    await userService.deleteUser(user.id);
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Account successfully deleted' });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};
