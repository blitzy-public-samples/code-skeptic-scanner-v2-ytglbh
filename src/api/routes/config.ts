import express from 'express';
import { ConfigController } from '../controllers/configController';
import { authMiddleware } from '../middleware/auth';
import { rateLimiterMiddleware } from '../middleware/rateLimiter';
import { logger } from '../../utils/logger';

export function createConfigRoutes(configController: ConfigController): express.Router {
  // Create a new Express router
  const router = express.Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // Apply rate limiter middleware to all routes
  router.use(rateLimiterMiddleware);

  // Define GET /config route to retrieve current system configuration
  router.get('/config', configController.getSystemConfig);

  // Define PUT /config route to update system configuration
  router.put('/config', configController.updateSystemConfig);

  // Define GET /config/popularity-threshold route to get current popularity threshold
  router.get('/config/popularity-threshold', configController.getPopularityThreshold);

  // Define PUT /config/popularity-threshold route to update popularity threshold
  router.put('/config/popularity-threshold', configController.updatePopularityThreshold);

  // Define GET /config/sentiment-threshold route to get current sentiment threshold
  router.get('/config/sentiment-threshold', configController.getSentimentThreshold);

  // Define PUT /config/sentiment-threshold route to update sentiment threshold
  router.put('/config/sentiment-threshold', configController.updateSentimentThreshold);

  // Define GET /config/custom-prompts route to retrieve custom prompts
  router.get('/config/custom-prompts', configController.getCustomPrompts);

  // Define POST /config/custom-prompts route to add a new custom prompt
  router.post('/config/custom-prompts', configController.addCustomPrompt);

  // Define PUT /config/custom-prompts/:id route to update an existing custom prompt
  router.put('/config/custom-prompts/:id', configController.updateCustomPrompt);

  // Define DELETE /config/custom-prompts/:id route to delete a custom prompt
  router.delete('/config/custom-prompts/:id', configController.deleteCustomPrompt);

  // Log the creation of configuration routes
  logger.info('Configuration routes created');

  // Return the configured router
  return router;
}

// Human tasks:
// - Regularly review and update API documentation for configuration routes
// - Implement comprehensive input validation for all route parameters and request bodies
// - Develop integration tests to ensure proper functionality of configuration routes
// - Monitor API usage patterns and adjust rate limiting rules as necessary
// - Implement versioning strategy for the API to allow for future updates without breaking existing clients
// - Develop a mechanism for backing up and restoring system configuration
// - Implement an audit log for tracking changes to system configuration
// - Consider implementing role-based access control for configuration management