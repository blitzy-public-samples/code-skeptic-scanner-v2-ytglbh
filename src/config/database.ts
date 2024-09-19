import mongoose from 'mongoose';
import { config } from './apiConfig';
import { logger } from '../utils/logger';

// Global database connection object
export const dbConnection: mongoose.Connection = mongoose.connection;

/**
 * Establishes a connection to the MongoDB database.
 * @returns A promise that resolves when the connection is established.
 */
export async function connectToDatabase(): Promise<void> {
  try {
    // Retrieve database connection string from configuration
    const dbConnectionString = config.database.connectionString;

    // Set mongoose connection options
    const connectionOptions: mongoose.ConnectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    // Attempt to connect to the database
    await mongoose.connect(dbConnectionString, connectionOptions);

    // Log successful connection
    logger.info('Successfully connected to the database');

    // Set up error event listener for the connection
    dbConnection.on('error', (error) => {
      logger.error('Database connection error:', error);
    });

    // Set up disconnected event listener for the connection
    dbConnection.on('disconnected', () => {
      logger.warn('Database connection lost');
    });

    // Set up reconnected event listener for the connection
    dbConnection.on('reconnected', () => {
      logger.info('Reconnected to the database');
    });
  } catch (error) {
    logger.error('Failed to connect to the database:', error);
    throw error;
  }
}

/**
 * Closes the connection to the MongoDB database.
 * @returns A promise that resolves when the connection is closed.
 */
export async function disconnectFromDatabase(): Promise<void> {
  try {
    // Attempt to close the database connection
    await mongoose.disconnect();

    // Log successful disconnection
    logger.info('Successfully disconnected from the database');
  } catch (error) {
    // Log any errors that occur during disconnection
    logger.error('Error disconnecting from the database:', error);
    throw error;
  }
}

// Human tasks (commented):
// TODO: Implement connection pooling for improved performance in high-load scenarios
// TODO: Develop a mechanism for handling database migration and schema updates
// TODO: Implement a retry mechanism for database connection failures
// TODO: Create utility functions for common database operations
// TODO: Implement a system for monitoring and logging database performance metrics
// TODO: Develop a strategy for database backups and disaster recovery