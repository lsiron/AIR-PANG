import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@_config/env.config';
import { UserService } from '@_services/authService';
import passport from 'passport';
import { User } from '@_types/user';

const userService = new UserService();

export const googleAuth = passport.authenticate('google', { scope: ['profile'] });

export const googleAuthCallback = (req: Request, res: Response) => {
  passport.authenticate('google', { session: false }, async (err, user, info) => {
    console.log(user);
    if (err) {
      console.error('인증 오류:', err);
      return res.status(500).json({ message: '내부 서버 오류' });
    }

    if (!user) {
      console.error('사용자가 인증되지 않음');
      return res.status(401).json({ message: '인증 실패' });
    }

    console.log('사용자 인증:', user);
    const userObj = user as User;
    try {
      const token = jwt.sign({ id: userObj.id }, config.JWT_SECRET, { expiresIn: '1h' });
      console.log('JWT created:', token);

      res.cookie('jwt', token, { httpOnly: true, secure: false });
      console.log('JWT cookie set');

      res.redirect(process.env.CLIENT_URL || '/'); 
    } catch (tokenError) {
      console.error('Error creating JWT:', tokenError);
      res.status(500).json({ message: '토큰 생성 실패' });
    }
  })(req, res);
};

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
