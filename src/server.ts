import http from 'http';
import { createApp } from './app';
import { config } from './config/apiConfig';
import { logger } from './utils/logger';
import { connectToDatabase, disconnectFromDatabase } from './config/database';

// Function to initialize and start the HTTP server
async function startServer(): Promise<http.Server> {
  try {
    // Connect to the database
    await connectToDatabase();
    logger.info('Database connection established');

    // Create the Express application
    const app = createApp();

    // Create an HTTP server with the Express app
    const server = http.createServer(app);

    // Start listening on the configured port
    server.listen(config.port);

    // Log server start information
    logger.info(`Server started on port ${config.port}`);

    // Set up error handling for the server
    server.on('error', (error) => {
      logger.error('Server error:', error);
    });

    // Return the server instance
    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Function to handle graceful shutdown of the server and database connection
async function gracefulShutdown(server: http.Server): Promise<void> {
  logger.info('Initiating graceful shutdown');

  // Close the HTTP server
  server.close(() => {
    logger.info('HTTP server closed');
  });

  try {
    // Disconnect from the database
    await disconnectFromDatabase();
    logger.info('Database connection closed');

    // Log successful shutdown
    logger.info('Graceful shutdown completed');

    // Exit the process
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
}

// Main execution block
(async () => {
  try {
    // Call startServer function
    const server = await startServer();

    // Set up process event listeners for graceful shutdown
    process.on('SIGTERM', () => gracefulShutdown(server));
    process.on('SIGINT', () => gracefulShutdown(server));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown(server);
    });
  } catch (error) {
    logger.error('Error in main execution block:', error);
    process.exit(1);
  }
})();

// Human tasks:
// TODO: Implement a mechanism for zero-downtime deployments (e.g., using PM2 or Kubernetes)
// TODO: Develop a system for monitoring server health and performance
// TODO: Implement automated server restarts in case of critical errors
// TODO: Create a mechanism for dynamically updating server configuration without restarts
// TODO: Develop a strategy for scaling the server horizontally (e.g., load balancing)
// TODO: Implement proper logging and alerting for server-related issues