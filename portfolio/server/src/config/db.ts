import mongoose from 'mongoose';
import { ENV } from './env.js';
import { logger } from '../utils/logger.js';

let isMemoryServer = false;
let memoryServerInstance: any = null;

export const connectDB = async (): Promise<void> => {
  try {
    logger.info(`Attempting to connect to MongoDB at: ${ENV.MONGODB_URI}`);
    await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    logger.info('MongoDB connected successfully via MONGODB_URI.');
  } catch (primaryError: any) {
    logger.warn(
      `Could not connect to external MongoDB instance (${primaryError.message}). Starting in-memory MongoDB for local development...`
    );

    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
      const memoryUri = memoryServerInstance.getUri();
      isMemoryServer = true;

      await mongoose.connect(memoryUri);
      logger.info(`Connected to In-Memory MongoDB at ${memoryUri}`);
      logger.info('Development database is ready. Auto-seeding sample portfolio data...');

      // Dynamic import to avoid circular dependency
      const { seedDatabase } = await import('../services/seedService.js');
      await seedDatabase(false);
    } catch (fallbackError: any) {
      logger.error('Failed to initialize in-memory MongoDB fallback:', fallbackError);
      throw fallbackError;
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
  logger.info('MongoDB disconnected.');
};

export const getDBStatus = () => ({
  connected: mongoose.connection.readyState === 1,
  isMemoryServer,
  host: mongoose.connection.host,
  dbName: mongoose.connection.name,
});
