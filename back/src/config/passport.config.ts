import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '@_config/env.config';
import { UserService } from '@_services/authService';
import { User } from '@_types/user'; 

passport.use(new GoogleStrategy({
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  callbackURL: config.REDIRECT_URI,
  scope: ['email', 'profile'], 
}, async (accessToken, refreshToken, profile, done) => {
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
  console.log('Profile:', profile);

  const userService = new UserService();

  try {
    const googleId = profile.id; 
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : ''; // 이메일 주소 (undefined 체크)
    const name = profile.displayName || ''; 

    // 데이터베이스에서 사용자 찾기 또는 생성
    const user: User = await userService.findOrCreateUser({
      googleId,
      email,
      name,
    });

    done(null, user);
  } catch (error) {
    done(error);
  }
}));
