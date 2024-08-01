import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.config';
import { UserService } from '../services/authservice';

passport.use(new GoogleStrategy({
  clientID: env.GOOGLE_CLIENT_ID,
  clientSecret: env.GOOGLE_CLIENT_SECRET,
  callbackURL: env.GOOGLE_REDIRECT_URI
}, async (token, tokenSecret, profile, done) => {
  const userService = new UserService();
  let user = await userService.findOrCreate(profile);
  done(null, user);
}));
