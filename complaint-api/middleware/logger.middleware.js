const logger = (req, res, next) => {
  console.log(`[Logger Middleware] ${req.method} ${req.url}`);
  next();
};

export default logger;
