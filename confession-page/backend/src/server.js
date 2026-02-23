import app from './app.js';
import config from './config/index.js';
import connectDB from './config/db.js';
import { startExpiryJob } from './jobs/expiryJob.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start cron jobs
    startExpiryJob();

    // Start Express server
    app.listen(config.port, () => {
      console.log(`\n🚀 Server running on http://localhost:${config.port}`);
      console.log(`📦 Environment: ${config.nodeEnv}`);
      console.log(`🔗 Client URL: ${config.clientUrl}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
