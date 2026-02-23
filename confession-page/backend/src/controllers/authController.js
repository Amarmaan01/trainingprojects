import config from '../config/index.js';

/**
 * GET /auth/google - Initiate Google OAuth
 * Handled by passport middleware in routes
 */

/**
 * GET /auth/google/callback - Google OAuth callback
 * Handled by passport middleware in routes
 */

/**
 * GET /auth/logout - Logout user
 */
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error during logout',
      });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
      }
      res.clearCookie('connect.sid');
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });
};

/**
 * GET /auth/me - Get current user
 */
export const getCurrentUser = (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return res.status(200).json({
      success: true,
      data: {
        googleId: req.user.googleId,
        displayName: req.user.displayName,
        email: req.user.email,
        avatar: req.user.avatar,
      },
    });
  }
  res.status(200).json({
    success: true,
    data: null,
  });
};
