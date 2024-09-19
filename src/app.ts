import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import { config } from './config/apiConfig';
import { logger } from './utils/logger';
import { errorHandler } from './utils/errorHandler';
import { configureSecurity } from './config/securityConfig';
import { createTweetRoutes } from './api/routes/tweets';
import { createResponseRoutes } from './api/routes/responses';
import { createAiToolRoutes } from './api/routes/aiTools';
import { createAnalyticsRoutes } from './api/routes/analytics';
import { createConfigRoutes } from './api/routes/config';
import { TweetController } from './api/controllers/tweetController';
import { ResponseController } from './api/controllers/responseController';
import { AiToolController } from './api/controllers/aiToolController';
import { AnalyticsController } from './api/controllers/analyticsController';
import { ConfigController } from './api/controllers/configController';

/**
 * Creates and configures the Express application.
 * @returns {express.Application} The configured Express application.
 */
export function createApp(): express.Application {
  // Create a new Express application
  const app = express();

  // Apply security configurations
  configureSecurity(app);

  // Configure middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());

  // Set up request logging with morgan
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

  // Initialize controllers
  const tweetController = new TweetController();
  const responseController = new ResponseController();
  const aiToolController = new AiToolController();
  const analyticsController = new AnalyticsController();
  const configController = new ConfigController();

  // Set up API routes
  app.use('/api/tweets', createTweetRoutes(tweetController));
  app.use('/api/responses', createResponseRoutes(responseController));
  app.use('/api/ai-tools', createAiToolRoutes(aiToolController));
  app.use('/api/analytics', createAnalyticsRoutes(analyticsController));
  app.use('/api/config', createConfigRoutes(configController));

  // Apply error handling middleware
  app.use(errorHandler);

  return app;
}

// Human tasks:
// TODO: Regularly review and update middleware configurations to ensure optimal performance and security
// TODO: Implement API versioning strategy for future updates
// TODO: Develop a system for API documentation generation (e.g., using Swagger)
// TODO: Implement a health check endpoint for monitoring system status
// TODO: Consider implementing request validation middleware for all routes
// TODO: Develop a strategy for handling and logging unhandled promise rejections and uncaught exceptions