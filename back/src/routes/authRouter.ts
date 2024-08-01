import { Router } from 'express';
import { googleAuth, googleAuthCallback, logout, deleteUser } from '@_controllers/authController';
import { authenticateJWT } from '@_middlewares/authMiddleware';
import passport from 'passport';

const router = Router();

router.get('/', googleAuth);

router.get('/callback',passport.authenticate('google', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});

router.post('/logout', logout);

router.delete('/delete', authenticateJWT, deleteUser);

export default router;
