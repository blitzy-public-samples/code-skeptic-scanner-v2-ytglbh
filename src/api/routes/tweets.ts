import express from 'express';
import { TweetController } from '../controllers/tweetController';
import { authMiddleware } from '../middleware/auth';
import { rateLimiterMiddleware } from '../middleware/rateLimiter';
import { logger } from '../../utils/logger';

export function createTweetRoutes(tweetController: TweetController): express.Router {
  // Create a new Express router
  const router = express.Router();

  // Apply authentication middleware to all routes
  router.use(authMiddleware);

  // Apply rate limiter middleware to all routes
  router.use(rateLimiterMiddleware);

  // Define GET /tweets route
  router.get('/tweets', tweetController.getAllTweets);

  // Define GET /tweets/:id route
  router.get('/tweets/:id', tweetController.getTweetById);

  // Define POST /tweets route
  router.post('/tweets', tweetController.createTweet);

  // Define PUT /tweets/:id route
  router.put('/tweets/:id', tweetController.updateTweet);

  // Define DELETE /tweets/:id route
  router.delete('/tweets/:id', tweetController.deleteTweet);

  // Log the creation of tweet routes
  logger.info('Tweet routes created');

  // Return the configured router
  return router;
}

// Human tasks:
// - Regularly review and update API documentation for tweet routes
// - Implement comprehensive input validation for all route parameters and request bodies
// - Develop integration tests to ensure proper functionality of tweet routes
// - Monitor API usage patterns and adjust rate limiting rules as necessary
// - Implement versioning strategy for the API to allow for future updates without breaking existing clients