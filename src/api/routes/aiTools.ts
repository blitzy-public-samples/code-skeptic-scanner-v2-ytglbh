import express from 'express';
import { AiToolController } from '../controllers/aiToolController';
import { authMiddleware } from '../middleware/auth';
import { rateLimiterMiddleware } from '../middleware/rateLimiter';
import { logger } from '../../utils/logger';

export function createAiToolRoutes(aiToolController: AiToolController): express.Router {
  // Create a new Express router
  const router = express.Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // Apply rate limiter middleware to all routes
  router.use(rateLimiterMiddleware);

  // Define GET /ai-tools route to retrieve all AI tools
  router.get('/ai-tools', aiToolController.getAllAiTools);

  // Define GET /ai-tools/:id route to retrieve a specific AI tool
  router.get('/ai-tools/:id', aiToolController.getAiToolById);

  // Define POST /ai-tools route to create a new AI tool
  router.post('/ai-tools', aiToolController.createAiTool);

  // Define PUT /ai-tools/:id route to update an existing AI tool
  router.put('/ai-tools/:id', aiToolController.updateAiTool);

  // Define DELETE /ai-tools/:id route to delete an AI tool
  router.delete('/ai-tools/:id', aiToolController.deleteAiTool);

  // Define GET /ai-tools/:id/mentions route to retrieve mentions of a specific AI tool
  router.get('/ai-tools/:id/mentions', aiToolController.getAiToolMentions);

  // Define GET /ai-tools/:id/sentiment route to retrieve sentiment analysis for a specific AI tool
  router.get('/ai-tools/:id/sentiment', aiToolController.getAiToolSentiment);

  // Log the creation of AI tool routes
  logger.info('AI tool routes created');

  // Return the configured router
  return router;
}

// Human tasks:
// TODO: Regularly review and update API documentation for AI tool routes
// TODO: Implement comprehensive input validation for all route parameters and request bodies
// TODO: Develop integration tests to ensure proper functionality of AI tool routes
// TODO: Monitor API usage patterns and adjust rate limiting rules as necessary
// TODO: Implement versioning strategy for the API to allow for future updates without breaking existing clients
// TODO: Consider implementing pagination for routes that return multiple AI tools or mentions
// TODO: Develop a mechanism for bulk import/export of AI tool data, if needed