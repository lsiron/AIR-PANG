import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

export const googleCallback = async (req: Request, res: Response) => {
  const { id_token } = req.body;

  if (!id_token) {
    return res.status(400).json({ message: 'ID token is required' });
  }

  try {
    // 구글 토큰 검증
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ message: 'Invalid ID token' });
    }

    const { sub, name, email, picture } = payload;

    // 사용자 정보를 데이터베이스에 저장
    //await saveUserToDatabase({ sub, name, email, picture });

    // 세션에 사용자 정보를 저장
    //req.session.user = { sub, name, email, picture };

    // 성공 응답
    return res.status(200).json({
      message: 'Login successful',
      user: { sub, name, email, picture }
    });

  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
