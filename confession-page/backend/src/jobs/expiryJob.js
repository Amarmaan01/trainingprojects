import cron from 'node-cron';
import { deleteExpiredConfessions } from '../services/confessionService.js';

/**
 * Runs every hour to clean up expired confessions
 * Cron expression: '0 * * * *' → at minute 0 of every hour
 */
export const startExpiryJob = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const result = await deleteExpiredConfessions();
      if (result.deletedCount > 0) {
        console.log(
          `[CRON] Deleted ${result.deletedCount} expired confession(s) at ${new Date().toISOString()}`
        );
      }
    } catch (error) {
      console.error('[CRON] Error deleting expired confessions:', error.message);
    }
  });

  console.log('[CRON] Expiry job scheduled - runs every hour');
};
