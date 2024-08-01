import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@_config/env.config';
import { UserService } from '@_services/authService';
import passport from 'passport';
import { User } from '@_types/user';

const userService = new UserService();

// Google 인증 시작
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Google 인증 콜백
export const googleAuthCallback = (req: Request, res: Response) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    if (err) {
      console.error('Authentication error:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!user) {
      console.error('User not authenticated');
      return res.status(401).json({ message: 'Authentication failed' });
    }

    console.log('User authenticated:', user);
    const userObj = user as User; 
    try {
      // JWT 생성
      const token = jwt.sign({ id: userObj.id }, config.JWT_SECRET, { expiresIn: '1h' });
      console.log('JWT created:', token);

      // JWT를 쿠키에 저장
      res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'strict' });
      console.log('JWT cookie set');

      res.redirect('/'); // 성공 시 리디렉션할 URL
    } catch (tokenError) {
      console.error('Error creating JWT:', tokenError);
      res.status(500).json({ message: 'Token creation failed' });
    }
  })(req, res);
};

// 로그아웃
export const logout = (req: Request, res: Response) => {
  res.clearCookie('jwt');
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: '로그아웃 실패' });
    }
    console.log('User logged out');
    res.status(200).json({ message: '로그아웃 성공' });
  });
};

// 계정 삭제
export const deleteUser = async (req: Request, res: Response) => {
  if (req.user) {
    const user = req.user as User;
    try {
      await userService.deleteUser(user.id);
      res.clearCookie('jwt');
      console.log('User account deleted:', user.id);
      res.status(200).json({ message: '계정 탈퇴 완료' });
    } catch (deleteError) {
      console.error('Error deleting user:', deleteError);
      res.status(500).json({ message: '계정 탈퇴 실패' });
    }
  } else {
    console.error('Unauthorized delete attempt');
    res.status(401).json({ message: 'Unauthorized' });
  }
};
