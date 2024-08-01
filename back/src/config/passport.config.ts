import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '@_config/env.config';
import { UserService } from '@_services/authService';

passport.use(new GoogleStrategy({
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  callbackURL: config.REDIRECT_URI,
  scope: ['profile'],
}, async (accessToken, refreshToken, profile, done) => {
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
  console.log('Profile:', profile);
  const userService = new UserService();
  try {
    const googleId = profile.id;
    const name = profile.displayName || '';

    const user = await userService.findOrCreateUser({
      googleId,
      name,
    });

    done(null, user);
  } catch (error) {
    done(error);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await new UserService().findUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
