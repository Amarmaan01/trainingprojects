import express from 'express';
import logger from './middleware/logger.middleware.js';
import complaintRoutes from './routes/complaint.routes.js';

const app = express();
console.log('=== Middleware Setup ===');
console.log('1. App-level: Logger Middleware');
console.log('2. Built-in: express.json()');
console.log('3. Router-level: Auth Middleware (on protected routes)');
console.log('========================\n');
app.use(logger);
app.use(express.json());
app.use('/', complaintRoutes);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

export default app;
