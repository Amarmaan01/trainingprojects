
const authMiddleware = (req, res, next) => {
  console.log('[Auth Middleware] Auth checked');
  
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Authorization header missing'
    });
  }
  if (authHeader !== 'Bearer valid-token') {
    return res.status(403).json({
      success: false,
      message: 'Invalid authorization token'
    });
  }
  next();
};
export default authMiddleware;
