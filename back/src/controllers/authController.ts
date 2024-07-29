import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import axios from 'axios';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID as string);

async function saveUserToDatabase(user: { sub: string, name: string, email: string, picture: string, refreshToken: string }) {
  // 여기에 실제 데이터베이스 저장 로직을 추가합니다.
  console.log('User saved to database:', user);
}

async function getTokens(code: string) {
  const { data } = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI as string,
    grant_type: 'authorization_code',
  });
  return data;
}

export const googleCallback = async (req: Request, res: Response) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Authorization code is required' });
  }

  try {
    // 구글 토큰 검증 및 리프레시 토큰 획득
    const tokens = await getTokens(code);

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ message: 'Invalid ID token' });
    }

    const { sub, name, email, picture } = payload;

    // 속성들이 모두 유효한지 확인합니다.
    if (!sub || !name || !email || !picture) {
      return res.status(400).json({ message: 'Missing required user information' });
    }

// 사용자 정보를 데이터베이스에 저장
await saveUserToDatabase({ sub, name, email, picture, refreshToken: tokens.refresh_token });

// 세션에 사용자 정보를 저장
req.session.user = { sub, name, email, picture };

// 유저 아이디와 이름을 쿠키에 저장
res.cookie('userId', sub, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
});

res.cookie('userName', name, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
});

// 리프레시 토큰을 HttpOnly 쿠키에 저장
res.cookie('refreshToken', tokens.refresh_token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
});


    // 성공 응답
    return res.status(200).json({
      message: 'Login successful',
      user: { sub, name, email, picture },
      accessToken: tokens.access_token,
    });

  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { data } = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID as string,
      client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    });

    return res.status(200).json({
      accessToken: data.access_token,
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
