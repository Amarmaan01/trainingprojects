import { Router } from 'express';
import passport from 'passport';
import { logout, getCurrentUser } from '../controllers/authController.js';
import config from '../config/index.js';

const router = Router();

// GET /auth/google - Initiate Google OAuth
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// GET /auth/google/callback - Handle Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${config.clientUrl}/`,
  }),
  (req, res) => {
    res.redirect(`${config.clientUrl}/`);
  }
);

// GET /auth/logout - Logout
router.get('/logout', logout);

// GET /auth/me - Current user
router.get('/me', getCurrentUser);

export default router;
