import express from 'express';
import { ResponseController } from '../controllers/responseController';
import { authMiddleware } from '../middleware/auth';
import { rateLimiterMiddleware } from '../middleware/rateLimiter';
import { logger } from '../../utils/logger';

export function createResponseRoutes(responseController: ResponseController): express.Router {
  // Create a new Express router
  const router = express.Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // Apply rate limiter middleware to all routes
  router.use(rateLimiterMiddleware);

  // Define GET /responses route to retrieve all responses
  router.get('/responses', responseController.getAllResponses);

  // Define GET /responses/:id route to retrieve a specific response
  router.get('/responses/:id', responseController.getResponseById);

  // Define POST /responses route to create a new response
  router.post('/responses', responseController.createResponse);

  // Define PUT /responses/:id route to update an existing response
  router.put('/responses/:id', responseController.updateResponse);

  // Define DELETE /responses/:id route to delete a response
  router.delete('/responses/:id', responseController.deleteResponse);

  // Define POST /responses/:id/approve route to approve a response
  router.post('/responses/:id/approve', responseController.approveResponse);

  // Define POST /responses/:id/reject route to reject a response
  router.post('/responses/:id/reject', responseController.rejectResponse);

  // Define POST /responses/:id/revise route to request revision for a response
  router.post('/responses/:id/revise', responseController.requestRevision);

  // Log the creation of response routes
  logger.info('Response routes created');

  // Return the configured router
  return router;
}

// Human tasks:
// TODO: Regularly review and update API documentation for response routes
// TODO: Implement comprehensive input validation for all route parameters and request bodies
// TODO: Develop integration tests to ensure proper functionality of response routes
// TODO: Monitor API usage patterns and adjust rate limiting rules as necessary
// TODO: Implement versioning strategy for the API to allow for future updates without breaking existing clients
// TODO: Consider implementing pagination for routes that return multiple responses
// TODO: Develop a mechanism for handling bulk operations on responses, if needed