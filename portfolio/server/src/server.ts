import { createApp } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  try {
    // 1. Connect to Database (with automatic fallback to in-memory MongoDB if local daemon is not running)
    await connectDB();

    // 2. Initialize Express application
    const app = createApp();

    // 3. Listen on configured PORT
    const server = app.listen(ENV.PORT, () => {
      logger.info(`Server running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
      logger.info(`Public API Health: http://localhost:${ENV.PORT}/api/health`);
      logger.info(`Swagger API Documentation: http://localhost:${ENV.PORT}/api-docs`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed.');
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
